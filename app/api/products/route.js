import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

// GET: Fetch products (all or by category)
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let products;
    if (category) {
      products = await Product.find({ category });
    } else {
      products = await Product.find();
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET products error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST: Add new product
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const newProduct = new Product({
      name: body.name,
      description: body.description,
      price: body.price,
      stock: body.stock,
      category: body.category,
      image: body.image,
    });

    await newProduct.save();

    return NextResponse.json({ message: "✅ Product added successfully!" }, { status: 201 });
  } catch (error) {
    console.error("POST products error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}