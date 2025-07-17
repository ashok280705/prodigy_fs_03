"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") redirect("/login");
  }, [status]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    };

    fetchOrders();
  }, [status]);

  if (!orders.length) {
    return (
      <main className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          📦 Your Orders
        </h1>
        <p className="text-gray-600 text-lg">You have not placed any orders yet.</p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
        📦 Your Orders
      </h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border rounded-2xl shadow-md p-6 hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Order #{order._id.slice(-6).toUpperCase()}
            </h2>
            <p className="text-gray-500 mb-1">
              Placed on:{" "}
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </p>
            <p className="text-gray-500 mb-4">
              Status:{" "}
              <span className="font-semibold text-green-600">
                {order.status}
              </span>
            </p>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.productId.name}
                      </h3>
                      <p className="text-gray-600">
                        ₹ {item.productId.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-800">
                    ₹ {(item.productId.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-right mt-6 text-xl font-bold text-green-600">
              Total: ₹ {order.total.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}