"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, ShoppingBag, ChevronRight, Pizza } from "lucide-react";
import ProductSkeletonCard from "../componet/skeleten";
import { useTheme } from "../context/contextthem";

export default function OrdersPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedId = localStorage.getItem("id");
        if (storedId) {
            setUserId(storedId);
        } else {
            setError("Please login to view history");
            setLoading(false);
        }
    }, []);

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
                setError("Something went wrong");
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userId]);

    // 🔥 PURE WHITE LOADING
    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Pizza size={40} className="text-yellow-400" />
            </motion.div>
            <p className="mt-4 font-black uppercase tracking-[0.3em] text-[10px] text-black">Fetching your history...</p>
        </div>
    );

    if (error || !orders.length) return (
        <div className={`h-screen flex flex-col items-center justify-center space-y-6 bg-white`}>
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-gray-100">
                <ShoppingBag size={40} className="text-gray-200" />
            </div>
            <div className="text-center">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-black">No Orders Yet</h2>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-2">{error || "Your pizza journey starts here."}</p>
            </div>
            <button onClick={() => window.location.href = '/pizza'} className="px-8 py-4 bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-yellow-400 hover:text-black transition-all">
                Go to Menu
            </button>
        </div>
    );

    return (
        <div className={`min-h-screen py-20 px-6 selection:bg-yellow-200 transition-colors duration-500 ${isDark ? "bg-[#0f1115] text-white" : "bg-white text-gray-900"}`}>
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-yellow-100">
                            Archive
                        </span>
                        <h1 className="text-6xl font-black italic tracking-tighter uppercase mt-6 leading-none">
                            My Orders<span className="text-yellow-500">.</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                        <div className="text-right">
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Lifetime Orders</p>
                            <p className="text-3xl font-black italic text-black leading-none mt-1">{orders.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">
                            <Package size={20} />
                        </div>
                    </div>
                </div>

                {/* Orders Grid */}
                <div className="grid gap-10 grid-cols-1 lg:grid-cols-2">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className={`group relative rounded-[3rem] overflow-hidden transition-all hover:shadow-2xl hover:shadow-gray-200/50 
                                ${isDark ? "bg-zinc-900 border border-zinc-800" : "bg-white border border-gray-100 shadow-sm"}`}
                        >
                            <div className="p-8 md:p-10">
                                {/* Top Bar: ID & Status */}
                                <div className="flex justify-between items-start mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isDark ? "bg-zinc-800 text-yellow-500" : "bg-black text-yellow-400 shadow-xl shadow-black/10"}`}>
                                            <Package size={24} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Order Ref</p>
                                            <p className="font-black text-lg tracking-tighter italic">#{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </div>

                                    <div className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-sm
                                        ${order.status === "Paid" ? "bg-green-50 text-green-600 border border-green-100" : "bg-yellow-50 text-yellow-600 border border-yellow-100"}`}>
                                        {order.status === "Paid" ? <CheckCircle2 size={12} strokeWidth={3} /> : <Clock size={12} strokeWidth={3} />}
                                        {order.status}
                                    </div>
                                </div>

                                {/* Items Breakdown */}
                                <div className="space-y-6 mb-10">
                                    {order.products.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-5 group/item">
                                            <div className="relative w-16 h-16 rounded-[1.5rem] overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 group-hover/item:scale-110 transition-transform">
                                                <Image
                                                    src={item.product?.images?.[0] || "/placeholder.png"}
                                                    alt="" fill className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-base font-black uppercase italic tracking-tighter text-black leading-tight">
                                                    {item.product?.name || "Legendary Pizza"}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-gray-300 uppercase">Qty: {item.quantity}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                                    <span className="text-[10px] font-black text-yellow-600 uppercase">₹{item.price || item.product?.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Billing Footer */}
                                <div className="flex items-center justify-between pt-8 border-t border-dashed border-gray-100">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Net Amount</p>
                                        <p className="text-4xl font-black italic text-black leading-none">
                                            <span className="text-lg mr-1 tracking-normal not-italic">₹</span>{order.totalPrice}
                                        </p>
                                    </div>
                                    <button
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-xl ${isDark ? "bg-yellow-500 text-black" : "bg-black text-white hover:bg-yellow-400 hover:text-black"}`}
                                        onClick={() => console.log(`Viewing: ${order._id}`)}
                                    >
                                        <ChevronRight size={24} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>

                            {/* Timestamp Bar */}
                            <div className={`${isDark ? "bg-zinc-950/50" : "bg-gray-50/50"} py-4 px-10 border-t border-gray-50 flex items-center justify-between`}>
                                <div className="flex items-center gap-2 opacity-40">
                                    <Clock size={12} className="text-black" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black">
                                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-300">Certified Transaction</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}