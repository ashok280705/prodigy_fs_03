import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    required: true,
    type: String,
    unique: true, // prevent duplicate usernames
  },
  email: {
    type: String,
    required: true,
    unique: true, // prevent duplicate emails
  },
  phone: {
  type: String,
  unique: true,
  sparse: true, // ✅ This allows multiple `null` or `undefined` values!
  
},
  password: {
    type: String,
    required: false,
    // ✅ Make NOT required: Google sign-in will not have this
  },
  image: {
    type: String,
  },
  cart: [
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
  orders: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  }
],
});

// Prevent overwrite in dev
export default mongoose.models.User || mongoose.model("User", userSchema);