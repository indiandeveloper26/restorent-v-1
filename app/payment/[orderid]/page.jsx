"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTheme } from "../../context/contextthem";
import axios from "axios";
import { useRazorpay } from "react-razorpay";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Package, ChevronRight, Lock, Pizza } from "lucide-react";

export default function PaymentPage() {
    const router = useRouter();
    const { orderid } = useParams();
    const { theme, userdataaa } = useTheme();
    const isDark = theme === "dark";
    const { Razorpay } = useRazorpay();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const userid = userdataaa?._id;

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`/backend/order/${orderid}`);
                setOrder(data.order);
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to load order details");
            } finally {
                setLoading(false);
            }
        };
        if (orderid) fetchOrder();
    }, [orderid]);

    const handlePayment = async () => {
        if (!order) {
            toast.error("Session expired or order not found.");
            return;
        }

        try {
            const paymentRes = await axios.post("/backend/payment/crate", {
                orderId: order._id,
                amount: order.totalPrice * 100,
            });

            const paymentData = paymentRes.data;

            const options = {
                key: "rzp_test_RqlfH5s7HXQ2nY",
                amount: paymentData.amount,
                currency: "INR",
                name: "PIZZA LEGEND",
                description: `Payment for Order #${order._id.slice(-6)}`,
                order_id: paymentData.id,
                handler: async function (response) {
                    try {
                        await axios.post(`/backend/order/${order._id}/pay`, {
                            userid,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        toast.success("Payment Successful!");
                        router.push("/order");
                    } catch (err) {
                        toast.error("Verification failed. Contact support.");
                    }
                },
                prefill: {
                    name: order.userName || "",
                    email: order.userEmail || "",
                    contact: order.userPhone || "",
                },
                theme: { color: "#000000" },
            };

            const razorpayInstance = new Razorpay(options);
            razorpayInstance.open();
        } catch (err) {
            toast.error("Could not initiate payment");
        }
    };

    // 🔥 PURE WHITE LOADING
    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white space-y-4">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Pizza size={40} className="text-yellow-500" />
            </motion.div>
            <p className="font-black tracking-[0.3em] text-black text-[10px] uppercase italic">Initializing Secure Gateway...</p>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <p className="text-black font-black italic tracking-tighter uppercase text-2xl">Order Not Found</p>
        </div>
    );

    return (
        <section className={`min-h-screen py-20 px-6 selection:bg-yellow-200 transition-colors duration-500 ${isDark ? "bg-[#0f1115] text-white" : "bg-white text-gray-900"}`}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl mx-auto"
            >
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-1.5 rounded-full mb-6 shadow-lg shadow-yellow-200/50">
                        <ShieldCheck size={14} strokeWidth={3} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Secure Checkout</span>
                    </div>
                    <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">Complete <br />Your Order<span className="text-yellow-500">.</span></h1>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-4">Order ID: {order._id.slice(-10)}</p>
                </div>

                {/* Glassmorphism Card */}
                <div className={`rounded-[3rem] overflow-hidden shadow-2xl transition-all ${isDark ? "bg-zinc-900 shadow-black/40" : "bg-gray-50 shadow-gray-200/50"}`}>

                    {/* Items List */}
                    <div className="p-10 border-b border-dashed border-gray-200">
                        <div className="flex items-center gap-3 mb-8">
                            <Package size={18} className="text-yellow-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Review Summary</span>
                        </div>
                        <div className="space-y-6">
                            {order.products.map((item) => (
                                <div key={item._id} className="flex justify-between items-center group">
                                    <div className="flex flex-col">
                                        <span className="font-black text-lg uppercase italic group-hover:text-yellow-500 transition-colors">{item.product.name}</span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity: {item.quantity}</span>
                                    </div>
                                    <span className="font-black text-xl italic text-black">₹{item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className={`p-10 ${isDark ? "bg-black/20" : "bg-white"}`}>
                        <div className="flex justify-between items-end mb-10">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2">Total Payable</span>
                                <span className="text-6xl font-black italic text-black leading-none">
                                    <span className="text-2xl align-top mr-1">₹</span>{order.totalPrice}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] block mb-2">Via</span>
                                <span className="text-[10px] font-black bg-black text-white px-4 py-2 rounded-xl italic">
                                    {order.paymentMethod === "Online" ? "RAZORPAY GATEWAY" : "CASH ON DELIVERY"}
                                </span>
                            </div>
                        </div>

                        {order.paymentMethod === "Online" ? (
                            <button
                                onClick={handlePayment}
                                className="w-full py-7 rounded-[2rem] bg-yellow-400 text-black hover:bg-black hover:text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-yellow-200 transition-all active:scale-95 flex items-center justify-center gap-4 group"
                            >
                                <CreditCard size={20} />
                                CONFIRM & PAY NOW
                                <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        ) : (
                            <div className="p-8 rounded-[2rem] bg-green-50 border-2 border-green-100 text-center">
                                <p className="text-green-600 font-black italic uppercase text-xs tracking-widest">
                                    Order Confirmed! Please keep ₹{order.totalPrice} ready.
                                </p>
                            </div>
                        )}

                        <div className="mt-10 flex items-center justify-center gap-3 text-gray-300">
                            <Lock size={14} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">256-bit SSL Secure Payment</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Address Box */}
                <div className={`mt-8 p-8 rounded-[2.5rem] border flex items-start gap-6 transition-all ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-gray-100 bg-white shadow-lg shadow-gray-100"}`}>
                    <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center text-black flex-shrink-0 shadow-lg shadow-yellow-100">
                        <Package size={22} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] block mb-2">Delivery Destination</span>
                        <p className="text-sm font-black uppercase italic leading-relaxed text-black/70">{order.address}</p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}