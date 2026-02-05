"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, ShoppingBag, ChevronRight } from "lucide-react";
import ProductSkeletonCard from "../componet/skeleten";
import { useTheme } from "../context/contextthem";

export default function OrdersPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
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
            setError("Please login to view order history.");
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

    if (loading) return <div className="p-10"><ProductSkeletonCard /></div>;

    if (error || !orders.length) return (
        <div className={`h-screen flex flex-col items-center justify-center space-y-4 ${isDark ? "bg-[#0f1115]" : "bg-yellow-50/30"}`}>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                <ShoppingBag size={40} className="text-yellow-600 opacity-40" />
            </div>
            <p className="text-xl font-black italic tracking-tighter uppercase opacity-40 text-yellow-800">
                {error || "No Orders Found"}
            </p>
        </div>
    );

    return (
        <div className={`min-h-screen py-12 px-4 sm:px-8 ${isDark ? "bg-[#0f1115] text-white" : "bg-yellow-50/30 text-gray-900"}`}>
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <span className="text-yellow-600 font-black text-xs uppercase tracking-[0.3em] mb-2 block">
                            Your Purchase History
                        </span>
                        <h1 className="text-5xl font-black italic tracking-tighter uppercase">
                            My Orders<span className="text-yellow-500">.</span>
                        </h1>
                    </div>
                    <div className="hidden md:block text-right">
                        <p className="text-xs font-bold opacity-40 uppercase tracking-widest">Total History</p>
                        <p className="text-2xl font-black italic text-yellow-600">{orders.length} Orders</p>
                    </div>
                </div>

                {/* Orders Grid */}
                <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`group relative rounded-[2.5rem] overflow-hidden transition-all hover:shadow-2xl hover:shadow-yellow-500/10 
                                ${isDark ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-yellow-100 shadow-sm"}`}
                        >
                            <div className="p-6 md:p-8">
                                {/* Order ID and Status */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-2xl transition-colors ${isDark ? "bg-gray-700 text-yellow-500" : "bg-yellow-50 text-yellow-600"}`}>
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Tracking ID</p>
                                            <p className="font-bold text-sm tracking-tighter">#{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </div>

                                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                                        ${order.status === "Paid" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-600"}`}>
                                        {order.status === "Paid" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                        {order.status}
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="space-y-4 mb-8">
                                    {order.products.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-yellow-100">
                                                <Image
                                                    src={item.product?.images?.[0] || "/placeholder.png"}
                                                    alt="" fill className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-sm font-black uppercase italic tracking-tighter line-clamp-1">
                                                    {item.product?.name || "Premium Item"}
                                                </p>
                                                <p className="text-[10px] font-bold opacity-40 uppercase">
                                                    Qty: {item.quantity} • ₹{item.price || item.product?.price}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Stats */}
                                <div className="flex items-center justify-between pt-6 border-t border-dashed border-yellow-200/50">
                                    <div>
                                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest text-yellow-700">Total Bill</p>
                                        <p className="text-3xl font-black italic text-yellow-600">₹{order.totalPrice}</p>
                                    </div>
                                    <button
                                        className={`p-4 rounded-2xl transition-all active:scale-90 shadow-lg ${isDark ? "bg-yellow-500 text-black hover:bg-yellow-400" : "bg-gray-900 text-white hover:bg-yellow-600"}`}
                                        onClick={() => alert(`Details for: ${order._id}`)}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Decorative Date Bar */}
                            <div className={`${isDark ? "bg-gray-900/50" : "bg-yellow-50/50"} py-3 px-8 text-center border-t border-yellow-100 flex items-center justify-center gap-2`}>
                                <Clock size={12} className="text-yellow-600 opacity-40" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 text-yellow-800">
                                    Purchased on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}