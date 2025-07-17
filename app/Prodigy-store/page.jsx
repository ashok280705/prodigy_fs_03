"use client";

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product._id,
        quantity: 1,
      }),
    });

    if (res.ok) {
      alert("✅ Added to cart!");
    } else {
      alert("❌ Failed to add to cart.");
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 bg-green-50 min-h-screen">

      {/* ✅ HERO BANNER */}
     {/* ✅ IMPROVED HERO BANNER */}
<section className="relative flex flex-col md:flex-row items-center justify-between rounded-3xl p-10 mb-16 overflow-hidden bg-gradient-to-r from-green-100 via-green-50 to-green-100 shadow-lg min-h-[400px] md:min-h-[500px]">
  <div className="flex-1 z-10">
    <p className="text-green-700 font-semibold mb-3">Welcome to Prodigy Store</p>
    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-green-900 leading-tight drop-shadow">
      Fresh Products, Delivered Daily
    </h1>
    <p className="text-green-800 mb-8 max-w-lg text-lg">
      We bring you the freshest groceries, daily essentials and more — all at your doorstep with love & care.
    </p>
    <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow transition">
      🛒 Shop Now
    </button>
  </div>

  <div className="flex-1 mt-12 md:mt-0 flex justify-center z-10">
    <img
      src="/basket.png"
      alt="Fresh Basket"
      className="w-[320px] md:w-[420px] rounded-3xl shadow-xl transform hover:scale-105 transition-transform duration-500"
    />
  </div>

  {/* ✅ Decorative background shapes */}
  <div className="absolute top-0 left-0 w-40 h-40 bg-green-200 rounded-full blur-3xl opacity-30 -z-0"></div>
  <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-30 -z-0"></div>
</section>
      {/* ✅ EXISTING FILTERS */}
      <div className="flex flex-wrap gap-6 justify-center mb-12">
        {/* Filters unchanged */}
        <div className="flex flex-col">
          <label className="text-sm mb-1 text-green-800">Search</label>
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-green-200 p-3 rounded-full w-60 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        {/* Rest same... */}
        <div className="flex flex-col">
          <label className="text-sm mb-1 text-green-800">Min Price</label>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(+e.target.value)}
            className="border border-green-200 p-3 rounded-full w-32 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-1 text-green-800">Max Price</label>
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(+e.target.value)}
            className="border border-green-200 p-3 rounded-full w-32 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-1 text-green-800">Min Stock</label>
          <input
            type="number"
            placeholder="Min Stock"
            value={minStock}
            onChange={(e) => setMinStock(+e.target.value)}
            className="border border-green-200 p-3 rounded-full w-32 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-1 text-green-800">Category</label>
          <select
            value={categorySort}
            onChange={(e) => setCategorySort(e.target.value)}
            className="border border-green-200 p-3 rounded-full w-40 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">All Categories</option>
            <option value="Grocery">Grocery</option>
            <option value="Stationery">Stationery</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>

      {/* ✅ EXISTING PRODUCTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {displayedProducts.map((p) => (
          <div
            key={p._id}
            className="bg-white border border-green-100 rounded-3xl shadow hover:shadow-lg transition p-6 flex flex-col"
          >
            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover rounded-2xl mb-4"
              />
            )}
            <h2 className="text-xl font-semibold text-green-800 mb-1">{p.name}</h2>
            <p className="text-green-700 mb-1">₹{p.price}</p>
            <p className="text-gray-500 text-sm mb-1">Stock: {p.stock}</p>
            <p className="text-gray-400 text-sm mb-4">Category: {p.category}</p>
            <button
              onClick={() => handleAddToCart(p)}
              className="mt-auto bg-green-600 hover:bg-green-700 text-white py-2 rounded-full transition-colors"
            >
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* ✅ EXISTING PAGINATION */}
      <div className="flex justify-center gap-3 mt-12">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-full ${
              page === i + 1
                ? "bg-green-600 text-white"
                : "bg-green-200 text-green-800 hover:bg-green-300"
            } transition`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </main>
  );
}