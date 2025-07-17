import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Orders";

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email }).populate("cart.productId");

  if (!user.cart.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const total = user.cart.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  const newOrder = await Order.create({
    userId: user._id,
    items: user.cart.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    })),
    total,
  });

  // Optional: save order ID in user for easy lookup
  user.orders.push(newOrder._id);

  // Empty the cart
  user.cart = [];
  await user.save();

  return NextResponse.json({ message: "Order placed", order: newOrder });
}
export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });

  const orders = await Order.find({ userId: user._id }).populate("items.productId");

  return NextResponse.json({ orders });
}