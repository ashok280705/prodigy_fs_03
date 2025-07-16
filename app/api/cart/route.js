import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email }).populate("cart.productId");
  return NextResponse.json({ cart: user.cart });
}

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity } = await req.json();

  const user = await User.findOne({ email: session.user.email });

  if (!user.cart) {
    user.cart = [];
  }

  const existing = user.cart.find(
    (item) => item.productId.toString() === productId
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    user.cart.push({ productId, quantity });
  }

  // ✅ Tell Mongoose you changed the cart array
  user.markModified("cart");

  await user.save();

  return NextResponse.json({ cart: user.cart });
}

export async function DELETE(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();
  const user = await User.findOne({ email: session.user.email });

  user.cart = user.cart.filter(
    (item) => item.productId.toString() !== productId
  );

  await user.save();
  return NextResponse.json({ cart: user.cart });
}
export async function PATCH(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity } = await req.json();
  const user = await User.findOne({ email: session.user.email });

  const existing = user.cart.find(
    (item) => item.productId.toString() === productId
  );

  if (existing) {
    existing.quantity += quantity;

    if (existing.quantity <= 0) {
      user.cart = user.cart.filter(
        (item) => item.productId.toString() !== productId
      );
    }
  }

  await user.save();
  return NextResponse.json({ cart: user.cart });
}