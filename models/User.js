import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
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
    unique: true, // optional, but usually phone numbers are unique
    sparse: true, // allow multiple docs with `phone: null`
  },
  password: {
    type: String,
    // ✅ Make NOT required: Google sign-in will not have this
  },
  image: {
    type: String,
  },
});

// Prevent overwrite in dev
export default mongoose.models.User || mongoose.model("User", userSchema);