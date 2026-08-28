import { Router } from "express";
import { Order } from "../db/models/Order.js";
import { requireAdmin } from "../middleware/adminAuth.js";

export const adminOrdersRouter = Router();

const VALID_STATUSES = ["pending", "paid", "shipped", "cancelled"];

adminOrdersRouter.use(requireAdmin);

// GET /api/admin/orders
adminOrdersRouter.get("/", async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });

  res.json(
    orders.map((order) => ({
      orderNumber: order.orderNumber,
      status: order.status,
      subtotal: order.subtotal,
      createdAt: order.createdAt,
      customer: order.customer,
      items: order.items.map((i) => ({
        id: i.productId,
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
    }))
  );
});

// PATCH /api/admin/orders/:orderNumber
// body: { status }
adminOrdersRouter.patch("/:orderNumber", async (req, res) => {
  const { status } = req.body ?? {};

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `status must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  const order = await Order.findOneAndUpdate(
    { orderNumber: req.params.orderNumber },
    { status },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json({ orderNumber: order.orderNumber, status: order.status });
});
