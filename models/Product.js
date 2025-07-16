import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: Number,
  category: { type: String, required: true },
  image: String,
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);