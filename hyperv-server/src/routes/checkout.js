import { Router } from "express";
import { nanoid } from "nanoid";
import { Product } from "../db/models/Product.js";
import { Order } from "../db/models/Order.js";

export const checkoutRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateOrderNumber() {
  // e.g. HV-7XQK3PLM
  return `HV-${nanoid(8).toUpperCase()}`;
}

// POST /api/checkout
// body: { items: [{ id, quantity }], customer: { name, email, address? } }
checkoutRouter.post("/", async (req, res) => {
  const { items, customer } = req.body ?? {};

  // --- Validate customer -----------------------------------------------
  if (!customer || typeof customer !== "object") {
    return res.status(400).json({ error: "customer is required" });
  }
  const { name, email, address } = customer;
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "customer.name is required" });
  }
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "A valid customer.email is required" });
  }

  // --- Validate cart items -----------------------------------------------
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items must be a non-empty array" });
  }

  for (const item of items) {
    if (!item || typeof item.id !== "string") {
      return res.status(400).json({ error: "Each item needs a string id" });
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return res
        .status(400)
        .json({ error: `Invalid quantity for item "${item.id}"` });
    }
  }

  // --- Re-price server-side and atomically check-and-decrement stock ----
  // findOneAndUpdate with a `stock >= quantity` filter is atomic at the
  // document level, so a single flavor can never be oversold even under
  // concurrent checkouts. There's no multi-document transaction wrapping
  // the whole cart (that needs MongoDB running as a replica set, which
  // isn't guaranteed everywhere) — instead, if a later item in the same
  // order fails, we manually roll back the stock we already decremented
  // for earlier items in this same request.
  const resolvedItems = [];
  const decremented = [];

  try {
    for (const item of items) {
      const product = await Product.findOneAndUpdate(
        { _id: item.id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );

      if (!product) {
        const exists = await Product.exists({ _id: item.id });
        if (!exists) {
          throw Object.assign(new Error(`Unknown product "${item.id}"`), {
            status: 400,
          });
        }
        const current = await Product.findById(item.id);
        throw Object.assign(
          new Error(
            `Not enough stock for "${current?.name ?? item.id}" (${current?.stock ?? 0} left)`
          ),
          { status: 409 }
        );
      }

      decremented.push({ id: item.id, quantity: item.quantity });
      resolvedItems.push({
        id: product._id,
        name: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: product.price * item.quantity,
      });
    }
  } catch (err) {
    // Compensate: give back whatever stock we already took for this order.
    for (const d of decremented) {
      await Product.updateOne({ _id: d.id }, { $inc: { stock: d.quantity } });
    }
    return res.status(err.status ?? 500).json({ error: err.message });
  }

  const subtotal = resolvedItems.reduce((sum, i) => sum + i.subtotal, 0);
  const orderNumber = generateOrderNumber();

  const order = await Order.create({
    orderNumber,
    customer: { name: name.trim(), email: email.trim() },
    address: address ?? null,
    items: resolvedItems.map((i) => ({
      productId: i.id,
      name: i.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
    subtotal,
    status: "pending",
  });

  res.status(201).json({
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: order.subtotal,
    items: resolvedItems,
    customer: { name: name.trim(), email: email.trim() },
  });
});

// GET /api/checkout/:orderNumber
checkoutRouter.get("/:orderNumber", async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  // imageKey isn't stored on the order itself — look it up from the
  // current product records.
  const productIds = order.items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const imageKeyById = Object.fromEntries(
    products.map((p) => [p._id, p.imageKey])
  );

  res.json({
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: order.subtotal,
    createdAt: order.createdAt,
    customer: order.customer,
    address: order.address,
    items: order.items.map((i) => ({
      id: i.productId,
      name: i.name,
      imageKey: imageKeyById[i.productId] ?? null,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      subtotal: i.unitPrice * i.quantity,
    })),
  });
});
