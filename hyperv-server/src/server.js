import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./db/index.js";
import { productsRouter } from "./routes/products.js";
import { checkoutRouter } from "./routes/checkout.js";
import { contactRouter } from "./routes/contact.js";
import { adminAuthRouter } from "./routes/adminAuth.js";
import { adminOrdersRouter } from "./routes/adminOrders.js";
import { adminProductsRouter } from "./routes/adminProducts.js";

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/products", productsRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminAuthRouter);
app.use("/api/admin/orders", adminOrdersRouter);
app.use("/api/admin/products", adminProductsRouter);

// --- 404 -------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// --- Error handler -----------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

async function start() {
  try {
    await connectDB();
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`hyperv-server listening on http://localhost:${PORT}`);
  });
}

start();
