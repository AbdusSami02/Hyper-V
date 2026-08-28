import mongoose from "mongoose";
import { Product } from "./models/Product.js";
import { products as seedProducts } from "./seedData.js";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to hyperv-server/.env — see .env.example."
    );
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  await seedProducts_();
}

// Upsert the product catalog from seedData.js on every boot, so editing
// that file and restarting keeps names/prices/descriptions in sync.
// `stock` is deliberately left untouched on existing products — it's
// admin-managed from that point on and must survive restarts, otherwise
// every reboot would wipe inventory edits back to the seed default.
async function seedProducts_() {
  for (const item of seedProducts) {
    const existing = await Product.findById(item.id);

    if (existing) {
      existing.name = item.name;
      existing.tagline = item.tagline;
      existing.description = item.description;
      existing.imageKey = item.imageKey;
      existing.price = item.price;
      existing.color = item.color;
      existing.colorSoft = item.colorSoft;
      existing.stats = item.stats;
      existing.notes = item.notes;
      await existing.save();
    } else {
      await Product.create({
        _id: item.id,
        name: item.name,
        tagline: item.tagline,
        description: item.description,
        imageKey: item.imageKey,
        price: item.price,
        stock: item.stock,
        color: item.color,
        colorSoft: item.colorSoft,
        stats: item.stats,
        notes: item.notes,
      });
    }
  }
}

// Shape a Mongoose product document into the JSON shape the API has
// always returned (id instead of _id, no Mongoose internals).
export function toProductJSON(doc) {
  return {
    id: doc._id,
    name: doc.name,
    tagline: doc.tagline,
    description: doc.description,
    imageKey: doc.imageKey,
    price: doc.price,
    stock: doc.stock,
    color: doc.color,
    colorSoft: doc.colorSoft,
    stats: doc.stats,
    notes: doc.notes,
  };
}
