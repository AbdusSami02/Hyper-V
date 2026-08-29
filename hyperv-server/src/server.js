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

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://hyper-v.vercel.app",
  "https://hyper-v-git-main-abdussamijawed1-4992s-projects.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin
    // (Postman, server-to-server requests, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],

  credentials: true,
};

// CORS MUST come before routes
app.use(cors(corsOptions));

// Handle browser preflight requests
app.options("*", cors(corsOptions));

app.use(express.json());

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Hyper V API is running",
  });
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.use("/api/products", productsRouter);

app.use("/api/checkout", checkoutRouter);

app.use("/api/contact", contactRouter);

app.use("/api/admin", adminAuthRouter);

app.use("/api/admin/orders", adminOrdersRouter);

app.use("/api/admin/products", adminProductsRouter);

// ---------------------------------------------------------------------------
// 404
// ---------------------------------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
  });
});

// ---------------------------------------------------------------------------
// Error handler
// ---------------------------------------------------------------------------

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error",
  });
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

async function start() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Hyper V server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
}

start();