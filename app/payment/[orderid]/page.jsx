"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTheme } from "../../context/contextthem";
import axios from "axios";
import { useRazorpay } from "react-razorpay";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Package, ChevronRight, Lock } from "lucide-react";

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
        console.log(order, userid)

        if (!order) {
            console.log('error')
            console.log('now go', userid)
            toast.error("Session expired or order not found.");
            return;
        }
        // if (!order || !userid) {
        //     console.log('error')
        //     toast.error("Session expired or order not found.");
        //     return;
        // }
        console.log('now go', order)

        try {
            const paymentRes = await axios.post("/backend/payment/crate", {
                orderId: order._id,
                amount: order.totalPrice * 100,
            });

            const paymentData = paymentRes.data;

            const options = {
                key: "rzp_test_RqlfH5s7HXQ2nY", // Replace with your live key in production
                amount: paymentData.amount,
                currency: "INR",
                name: "My Shop",
                description: `Payment for Order #${order._id.slice(-6)}`,
                order_id: paymentData.id,
                handler: async function (response) {
                    try {
                        let data = await axios.post(`/backend/order/${order._id}/pay`, {
                            userid,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        console.log('data', data)
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
                theme: { color: "#EAB308" }, // Yellow-500
            };

            const razorpayInstance = new Razorpay(options);
            razorpayInstance.open();
        } catch (err) {
            toast.error("Could not initiate payment");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold tracking-widest text-gray-400 uppercase">Processing Order...</p>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-red-500 font-black italic tracking-widest uppercase">Order Not Found</p>
        </div>
    );

    return (
        <section className={`min-h-screen py-12 px-4 ${isDark ? "bg-[#0f1115] text-white" : "bg-gray-50 text-gray-900"}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
            >
                {/* Status Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full mb-4">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Order Ready for Payment</span>
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">Finalize Payment</h1>
                    <p className="opacity-50 text-sm mt-2">Order Ref: #{order._id}</p>
                </div>

                {/* Main Payment Card */}
                <div className={`rounded-[2.5rem] overflow-hidden shadow-2xl ${isDark ? "bg-gray-800 shadow-black/50" : "bg-white border border-gray-100"}`}>

                    {/* Items Breakdown */}
                    <div className="p-8 border-b border-dashed border-gray-200/20">
                        <div className="flex items-center gap-2 mb-6 opacity-40">
                            <Package size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Your Items</span>
                        </div>
                        <div className="space-y-4">
                            {order.products.map((item) => (
                                <div key={item._id} className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="font-black text-sm uppercase italic">{item.product.name}</span>
                                        <span className="text-xs opacity-50 font-bold">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="font-bold">₹{item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary & Actions */}
                    <div className={`p-8 ${isDark ? "bg-gray-900/30" : "bg-gray-50/50"}`}>
                        <div className="flex justify-between items-end mb-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Payable Amount</span>
                                <span className="text-4xl font-black italic text-yellow-500">₹{order.totalPrice}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] block mb-1">Method</span>
                                <span className="text-xs font-bold bg-yellow-500/20 text-yellow-600 px-3 py-1 rounded-full border border-yellow-500/30">
                                    {order.paymentMethod === "Online" ? "Digital Gateway" : "Cash on Delivery"}
                                </span>
                            </div>
                        </div>

                        {order.paymentMethod === "Online" ? (
                            <button
                                onClick={handlePayment}
                                className="w-full py-6 rounded-3xl bg-yellow-500 text-white hover:bg-yellow-600 font-black text-lg uppercase tracking-widest shadow-xl shadow-yellow-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                            >
                                <CreditCard size={20} className="group-hover:animate-bounce" />
                                PAY WITH RAZORPAY
                                <ChevronRight size={20} />
                            </button>
                        ) : (
                            <div className="p-6 rounded-3xl bg-green-500/10 border-2 border-green-500/20 text-center">
                                <p className="text-green-500 font-black italic uppercase text-sm">
                                    Success! Pay ₹{order.totalPrice} at the time of delivery.
                                </p>
                            </div>
                        )}

                        <div className="mt-8 flex items-center justify-center gap-2 opacity-30 text-[10px] font-bold uppercase tracking-[0.1em]">
                            <Lock size={12} />
                            Secure End-to-End Encrypted Payment
                        </div>
                    </div>
                </div>

                {/* Shipping Address Footer */}
                <div className={`mt-6 p-6 rounded-3xl border ${isDark ? "border-gray-800 bg-gray-900/40" : "border-gray-100 bg-white"} flex items-start gap-4 shadow-sm`}>
                    <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-600 flex-shrink-0">
                        <Package size={20} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black opacity-40 uppercase block mb-1">Deliver To</span>
                        <p className="text-xs font-medium leading-relaxed opacity-70">{order.address}</p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}