"use client";

import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    const res = await fetch("/api/cart");
    if (res.ok) {
      const data = await res.json();
      setCart(data.cart);
      calculateTotal(data.cart);
    }
  };

  const calculateTotal = (cartData) => {
    const totalPrice = cartData.reduce(
      (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
      0
    );
    setTotal(totalPrice);
  };

  useEffect(() => {
    fetchCart();
  }, []);


    const handleCheckout = async () => {
      const res = await fetch("/api/orders", {
        method: "POST",
      });

      if (res.ok) {
        alert("✅ Order placed!");
        // Optionally reload or redirect
        window.location.reload();
      } else {
        const data = await res.json();
        alert("❌ " + data.error);
      }
    };
  

  const handleRemove = async (productId) => {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    if (res.ok) {
      await fetchCart();
    }
  };

  const handleDecrease = async (productId) => {
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: -1 }),
    });

    if (res.ok) {
      await fetchCart();
    }
  };

  if (!cart.length) {
    return (
      <main className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>
        <p>Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      <div className="space-y-4">
        {cart.map((item, index) => (
          <div
            key={item.productId?._id || index}
            className="flex items-center justify-between border rounded-lg p-4 shadow"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.productId?.image || "/placeholder.jpg"}
                alt={item.productId?.name || "Product"}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">
                  {item.productId?.name}
                </h2>
                <p className="text-gray-600">
                  ₹ {item.productId?.price} × {item.quantity}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleDecrease(item.productId._id)}
                className="bg-yellow-500 px-3 py-1 text-white rounded hover:bg-yellow-600"
              >
                -1
              </button>
              <button
                onClick={() => handleRemove(item.productId._id)}
                className="bg-red-600 px-3 py-1 text-white rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <h2 className="text-xl font-bold">Total: ₹ {total.toFixed(2)}</h2>
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Checkout
        </button>
      </div>
    </main>
  );
}
