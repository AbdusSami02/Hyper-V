import { Router } from "express";
import { Product } from "../db/models/Product.js";
import { toProductJSON } from "../db/index.js";
import { requireAdmin } from "../middleware/adminAuth.js";

export const adminProductsRouter = Router();

adminProductsRouter.use(requireAdmin);

// GET /api/admin/products
adminProductsRouter.get("/", async (req, res) => {
  const products = await Product.find({});
  res.json(products.map(toProductJSON));
});

// PATCH /api/admin/products/:id
// body: { stock?, price? }
adminProductsRouter.patch("/:id", async (req, res) => {
  const { stock, price } = req.body ?? {};

  if (stock === undefined && price === undefined) {
    return res
      .status(400)
      .json({ error: "Provide stock and/or price to update" });
  }

  if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) {
    return res
      .status(400)
      .json({ error: "stock must be a non-negative integer" });
  }

  if (price !== undefined && (typeof price !== "number" || price < 0)) {
    return res.status(400).json({ error: "price must be a non-negative number" });
  }

  const update = {};
  if (stock !== undefined) update.stock = stock;
  if (price !== undefined) update.price = price;

  const product = await Product.findByIdAndUpdate(req.params.id, update, {
    new: true,
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(toProductJSON(product));
});
