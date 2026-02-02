"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";


export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userId, setUserId] = useState(null);

    // Load userId from localStorage
    useEffect(() => {
        const storedId = localStorage.getItem("id");
        if (storedId) {
            setUserId(storedId);
        } else {
            setError("Please login first");
            setLoading(false);
        }
    }, []);

    // Fetch orders when userId is available
    useEffect(() => {
        if (!userId) return;

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/backend/order/orderdata/${userId}`);
                if (res.data.success) {
                    setOrders(res.data.data.orders || []);
                } else {
                    setError("Failed to fetch orders");
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Something went wrong");
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    if (loading) return <h1>loading....</h1>

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-red-500 font-semibold">{error}</p>
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-slate-600">No orders found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-yellow-50 p-6">
            <h1 className="text-3xl font-bold mb-6 text-yellow-800">My Orders</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-yellow-100 rounded-xl shadow p-5 hover:shadow-lg transition"
                    >
                        {/* Order Header */}
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-yellow-700">#{order._id.slice(-6)}</span>
                            <span
                                className={`text-xs px-3 py-1 rounded-full ${order.status === "Paid"
                                    ? "bg-yellow-300 text-yellow-800"
                                    : order.status === "Pending"
                                        ? "bg-yellow-200 text-yellow-900"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {order.status}
                            </span>
                        </div>

                        {/* Products */}
                        <div className="flex flex-col gap-3 mb-2">
                            {order.products.map(({ product, quantity }, idx) => (
                                <div key={idx} className="flex gap-3 items-center">
                                    <div className="relative w-16 h-16 flex-shrink-0">
                                        <Image
                                            src={product?.images?.[0] || "/placeholder.png"}
                                            alt={product?.name || "Product"}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-yellow-900">{product?.name || "Product"}</p>
                                        <p className="text-sm text-yellow-800">
                                            Qty: {quantity} | ₹{product?.price || "-"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <p className="text-lg font-semibold mb-1 text-yellow-900">
                            Total: ₹{order.totalPrice}
                        </p>

                        {/* Order Time */}
                        <p className="text-xs text-yellow-700 mb-3">
                            Ordered at: {new Date(order.createdAt).toLocaleString()}
                        </p>

                        {/* Button */}
                        <button
                            className="mt-2 w-full py-2 rounded-lg text-white shadow hover:brightness-90 transition"
                            style={{ backgroundColor: "#FCD34D" }} // Yellow button
                            onClick={() => alert(`Order ${order._id} details clicked!`)}
                        >
                            View Order
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
