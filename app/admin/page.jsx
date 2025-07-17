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

  const [updateData, setUpdateData] = useState({
    id: "",
    name: "",
    updateField: "",
    updateValue: "",
  });

  const [deleteData, setDeleteData] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    } else if (session.user.email !== "Admin@prodigystore.com") {
      router.push("/");
    }
  }, [session, status, router]);

  const handleChange = (e, setter) => {
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      alert("❌ Failed to add product");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const { id, name, updateField, updateValue } = updateData;

    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id || undefined,
        name: name || undefined,
        update: {
          [updateField]: isNaN(updateValue) ? updateValue : Number(updateValue),
        },
      }),
    });

    if (res.ok) {
      alert("✅ Product updated!");
      setUpdateData({
        id: "",
        name: "",
        updateField: "",
        updateValue: "",
      });
    } else {
      alert("❌ Failed to update product");
    }
  };

  const handleDeleteProduct = async (e) => {
    e.preventDefault();
    const query = deleteData.id
      ? `?id=${deleteData.id}`
      : `?name=${encodeURIComponent(deleteData.name)}`;
    const res = await fetch(`/api/products${query}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("✅ Product deleted!");
      setDeleteData({ id: "", name: "" });
    } else {
      alert("❌ Failed to delete product");
    }
  };

  if (status === "loading") {
    return <p className="text-center mt-10">Checking admin access...</p>;
  }

  return (
    <main className="flex flex-col gap-12 min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
      {/* Add Product */}
      <div className="w-full max-w-lg p-8 bg-white rounded-3xl shadow-xl border border-green-200">
        <h1 className="text-3xl font-bold mb-6 text-green-700">Add Product</h1>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            value={product.name}
            onChange={(e) => handleChange(e, setProduct)}
            className="w-full border border-green-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={(e) => handleChange(e, setProduct)}
            className="w-full border border-green-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={product.price}
            onChange={(e) => handleChange(e, setProduct)}
            className="w-full border border-green-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={product.stock}
            onChange={(e) => handleChange(e, setProduct)}
            className="w-full border border-green-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <select
            name="category"
            value={product.category}
            onChange={(e) => handleChange(e, setProduct)}
            className="w-full border border-green-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
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
            onChange={(e) => handleChange(e, setProduct)}
            className="w-full border border-green-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Update Product */}
      <div className="w-full max-w-lg p-8 bg-white rounded-3xl shadow-xl border border-yellow-200">
        <h1 className="text-3xl font-bold mb-6 text-yellow-700">Update Product</h1>
        <form onSubmit={handleUpdateProduct} className="space-y-4">
          <input
            name="id"
            placeholder="Product ID"
            value={updateData.id}
            onChange={(e) => handleChange(e, setUpdateData)}
            className="w-full border border-yellow-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <p className="text-center text-gray-500">OR</p>
          <input
            name="name"
            placeholder="Product Name"
            value={updateData.name}
            onChange={(e) => handleChange(e, setUpdateData)}
            className="w-full border border-yellow-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            name="updateField"
            placeholder="Field to Update (e.g. stock, price)"
            value={updateData.updateField}
            onChange={(e) => handleChange(e, setUpdateData)}
            className="w-full border border-yellow-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            name="updateValue"
            placeholder="New Value"
            value={updateData.updateValue}
            onChange={(e) => handleChange(e, setUpdateData)}
            className="w-full border border-yellow-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white p-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            Update Product
          </button>
        </form>
      </div>

      {/* Delete Product */}
      <div className="w-full max-w-lg p-8 bg-white rounded-3xl shadow-xl border border-red-200">
        <h1 className="text-3xl font-bold mb-6 text-red-700">Delete Product</h1>
        <form onSubmit={handleDeleteProduct} className="space-y-4">
          <input
            name="id"
            placeholder="Product ID"
            value={deleteData.id}
            onChange={(e) => handleChange(e, setDeleteData)}
            className="w-full border border-red-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <p className="text-center text-gray-500">OR</p>
          <input
            name="name"
            placeholder="Product Name"
            value={deleteData.name}
            onChange={(e) => handleChange(e, setDeleteData)}
            className="w-full border border-red-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Delete Product
          </button>
        </form>
      </div>
    </main>
  );
}