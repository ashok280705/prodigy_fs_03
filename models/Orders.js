import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Placed",
  },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);