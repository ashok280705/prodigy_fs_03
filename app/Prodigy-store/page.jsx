'use client';

import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Page() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minStock, setMinStock] = useState(0);
  const [categorySort, setCategorySort] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") redirect("/login");
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchProducts = async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products);
      };
      fetchProducts();
    }
  }, [status]);

  if (status === "loading") {
    return <p className="text-center mt-10">Loading...</p>;
  }

  let displayedProducts = products
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      p.price >= minPrice &&
      p.price <= maxPrice &&
      p.stock >= minStock &&
      (categorySort ? p.category === categorySort : true)
    );

  const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
  displayedProducts = displayedProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

 const handleAddToCart = async (product) => {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId: product._id, // or product.id depending on your schema
      quantity: 1,            // default to 1, or pass your desired quantity
    }),
  });

  if (res.ok) {
    alert("✅ Added to cart!");
  } else {
    alert("❌ Failed to add to cart.");
  }
};
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-700">
        🛍️ Prodigy Store
      </h1>

     {/* Filters */}
<div className="flex flex-wrap gap-6 justify-center mb-10">
  <div className="flex flex-col">
    <label className="text-sm mb-1 text-gray-700">Search</label>
    <input
      type="text"
      placeholder="🔍 Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border border-gray-300 p-2 rounded w-60"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm mb-1 text-gray-700">Min Price</label>
    <input
      type="number"
      placeholder="Min Price"
      value={minPrice}
      onChange={(e) => setMinPrice(+e.target.value)}
      className="border border-gray-300 p-2 rounded w-32"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm mb-1 text-gray-700">Max Price</label>
    <input
      type="number"
      placeholder="Max Price"
      value={maxPrice}
      onChange={(e) => setMaxPrice(+e.target.value)}
      className="border border-gray-300 p-2 rounded w-32"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm mb-1 text-gray-700">Min Stock</label>
    <input
      type="number"
      placeholder="Min Stock"
      value={minStock}
      onChange={(e) => setMinStock(+e.target.value)}
      className="border border-gray-300 p-2 rounded w-32"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm mb-1 text-gray-700">Category</label>
    <select
      value={categorySort}
      onChange={(e) => setCategorySort(e.target.value)}
      className="border border-gray-300 p-2 rounded w-40"
    >
      <option value="">All Categories</option>
      <option value="Grocery">Grocery</option>
      <option value="Stationery">Stationery</option>
      <option value="Others">Others</option>
    </select>
  </div>
</div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayedProducts.map((p) => (
          <div key={p._id} className="border rounded-lg shadow hover:shadow-md transition p-4 flex flex-col">
            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}
            <h2 className="text-xl font-semibold mb-1">{p.name}</h2>
            <p className="text-gray-700 mb-1">₹{p.price}</p>
            <p className="text-gray-500 text-sm mb-1">Stock: {p.stock}</p>
            <p className="text-gray-500 text-sm mb-3">Category: {p.category}</p>
            <button
              onClick={() => handleAddToCart(p)}
              className="mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-10">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </main>
  );
}