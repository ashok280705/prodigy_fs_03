"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
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
      <main className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-4">📦 Your Orders</h1>
        <p>You have not placed any orders yet.</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">📦 Your Orders</h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 shadow"
          >
            <h2 className="text-xl font-bold mb-2">Order #{order._id.slice(-6).toUpperCase()}</h2>
            <p className="text-gray-600 mb-2">
              Placed on: {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-600 mb-2">
              Status: <span className="font-semibold">{order.status}</span>
            </p>

            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{item.productId.name}</h3>
                      <p className="text-gray-600">
                        ₹ {item.productId.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold">
                    ₹ {(item.productId.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-right mt-4 font-bold text-lg">
              Total: ₹ {order.total.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}