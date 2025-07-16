"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      // Not logged in — redirect to login
      router.push("/login");
    } else if (session.user.email !== "Admin@prodigystore.com") {
      // Logged in but not admin — redirect home
      router.push("/");
    }
  }, [session, status, router]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
      }),
    });

    if (res.ok) {
      alert("✅ Product added!");
      setProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: "",
      });
    } else {
      alert("❌ Something went wrong!");
    }
  };

  if (status === "loading") {
    return <p className="text-center mt-10">Checking admin access...</p>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Admin Panel: Add Product</h1>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            value={product.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={product.stock}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="Grocery">Grocery</option>
            <option value="Stationery">Stationery</option>
            <option value="Others">Others</option>
          </select>
          <input
            name="image"
            placeholder="Image URL"
            value={product.image}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Add Product
          </button>
        </form>
      </div>
    </main>
  );
}