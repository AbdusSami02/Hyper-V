import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: Number, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    // Custom string _id (e.g. "neon-rush") instead of an ObjectId, so API
    // responses and frontend cart logic don't need to change at all.
    _id: { type: String },
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    imageKey: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    color: { type: String, required: true },
    colorSoft: { type: String, required: true },
    stats: { type: [statSchema], default: [] },
    notes: { type: [String], default: [] },
  },
  { versionKey: false }
);

export const Product = mongoose.model("Product", productSchema);
