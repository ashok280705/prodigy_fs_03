import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Orders";

export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { cart, total } = await req.json();

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const newOrder = await Order.create({
      userId,   // ✅ must be valid Mongo ID string
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      total,
      status: "Placed"
    });

    // Optional: attach order ref to user
    await User.findByIdAndUpdate(userId, {
      $push: { orders: newOrder._id }
    });

    return NextResponse.json({ order: newOrder });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
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