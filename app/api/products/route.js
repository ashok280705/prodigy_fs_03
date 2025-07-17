import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

// ✅ GET: Fetch products (all or by category)
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

// ✅ POST: Add new product
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

// ✅ PUT: Update product by ID or name
export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { id, name, update } = body;

    if (!id && !name) {
      return NextResponse.json(
        { error: "Please provide product `id` or `name` to update." },
        { status: 400 }
      );
    }

    const filter = id ? { _id: id } : { name };

    const updatedProduct = await Product.findOneAndUpdate(filter, update, {
      new: true,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "✅ Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("PUT products error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// ✅ DELETE: Delete product by ID or name
export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const name = searchParams.get("name");

    if (!id && !name) {
      return NextResponse.json(
        { error: "Please provide product `id` or `name` to delete." },
        { status: 400 }
      );
    }

    const filter = id ? { _id: id } : { name };

    const deletedProduct = await Product.findOneAndDelete(filter);

    if (!deletedProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "✅ Product deleted successfully!",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("DELETE products error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}