import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Order from "@/models/Orders";
import User from "@/models/User";
import Razorpay from "razorpay";

export async function POST(req) {
  await connectDB();

  const session = await getServerSession(authOptions);
  console.log("🔍 Session:", session);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items, total } = await req.json();
  console.log("🔍 items:", items);
  console.log("🔍 total:", total);

  if (!items || !items.length) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }

  const dbUser = await User.findOne({ email: session.user.email });
  console.log("🔍 dbUser:", dbUser);

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const order = await Order.create({
    userId: dbUser._id, // 🗝️ Use real ObjectId from DB
    items: items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
    })),
    total,
  });

  // ✅ Also add Order to user's array
  dbUser.orders.push(order._id);
  await dbUser.save();

  // ✅ Create Razorpay order
  const razorpay = new Razorpay({
    key_id: process.env. NEXT_PUBLIC_RAZORPAY_KEY_ID ,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const paymentOrder = await razorpay.orders.create({
    amount: total * 100, // ₹ → paise
    currency: "INR",
    receipt: order._id.toString(),
  });

  return NextResponse.json({
    orderId: paymentOrder.id,
    amount: paymentOrder.amount,
    currency: paymentOrder.currency,
  });
}