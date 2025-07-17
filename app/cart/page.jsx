"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function CartPage() {
  const { data: session } = useSession();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    const res = await fetch("/api/cart");
    if (res.ok) {
      const data = await res.json();
      setCart(data.cart || []);
      calculateTotal(data.cart || []);
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
    console.log("🛒 Checking out cart:", cart);
    console.log("🛒 Total:", total);

    const res = await fetch("/api/orders/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
        total,
      }),
    });

    const data = await res.json();
    console.log("✅ Payment Order Created:", data);

    if (res.ok) {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        handler: async function (response) {
          alert("✅ Payment successful!");
          setCart([]);
          setTotal(0);
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } else {
      console.error("❌ Payment order creation failed:", data);
      alert("❌ Payment order creation failed!");
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
      <main className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">🛒 Your Cart</h1>
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gradient bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        🛍️ Your Shopping Cart
      </h1>

      <div className="space-y-6">
        {cart.map((item, index) => (
          <div
            key={item.productId?._id || index}
            className="flex flex-col md:flex-row items-center justify-between bg-white border rounded-2xl shadow-md p-5 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-6">
              <img
                src={item.productId?.image || "/placeholder.jpg"}
                alt={item.productId?.name || "Product"}
                className="w-28 h-28 object-cover rounded-lg border"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {item.productId?.name}
                </h2>
                <p className="text-gray-600">
                  ₹ {item.productId?.price} × {item.quantity}
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-4 md:mt-0">
              <button
                onClick={() => handleDecrease(item.productId._id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full shadow"
              >
                -1
              </button>
              <button
                onClick={() => handleRemove(item.productId._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">
          Total: ₹ {total.toFixed(2)}
        </h2>
        <button
          onClick={handleCheckout}
          className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full shadow-md transition transform hover:scale-105"
        >
          ✅ Proceed to Checkout
        </button>
      </div>
    </main>
  );
}