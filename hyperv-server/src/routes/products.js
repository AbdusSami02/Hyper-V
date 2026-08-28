import { Router } from "express";
import { Product } from "../db/models/Product.js";
import { toProductJSON } from "../db/index.js";

export const productsRouter = Router();

// GET /api/products
productsRouter.get("/", async (req, res) => {
  const products = await Product.find({});
  res.json(products.map(toProductJSON));
});

// GET /api/products/:id
productsRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(toProductJSON(product));
});
