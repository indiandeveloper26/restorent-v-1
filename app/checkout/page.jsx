"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTheme } from "../context/contextthem";
import { motion } from "framer-motion";
import { MapPin, CreditCard, ShieldCheck, Truck, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
    const router = useRouter();
    const { theme, userdataaa } = useTheme();
    const isDark = theme === "dark";

    const [product, setProduct] = useState(null);
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Online");
    const [loading, setLoading] = useState(true);

    const userId = userdataaa?.userId || userdataaa._id;

    console.log('userid', userId)

    useEffect(() => {
        const buyProduct = JSON.parse(localStorage.getItem("buyNowProduct") || "null");
        if (!buyProduct) {
            toast.error("No product selected!");
            router.push("/products");
            return;
        }
        setProduct(buyProduct);
        setLoading(false);
    }, [router]);

    const handlePlaceOrder = async () => {
        if (!userId) return toast.error("Please login first");
        if (!address) return toast.error("Please enter shipping address!");
        if (!product) return;

        try {
            const res = await fetch("/backend/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userId,
                    product,
                    quantity: 1,
                    totalPrice: product.price,
                    address: address,
                    paymentMethod: paymentMethod
                })
            });

            const data = await res.json();
            if (!res.ok) return toast.error(data.message || "Failed to place order");

            toast.success("Order placed successfully!");

            if (paymentMethod === "Online") {
                router.push(`/payment/${data.order._id}`);
            } else {
                toast.info("Payment will be collected on delivery");
                router.push("/orders");
            }
        } catch (err) {
            toast.error("Something went wrong!");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold tracking-widest text-gray-400 uppercase">Securing Connection...</p>
        </div>
    );

    return (
        <section className={`min-h-screen font-sans transition-colors duration-500 ${isDark ? "bg-[#0f1115] text-white" : "bg-gray-50 text-gray-900"}`}>

            {/* Header */}
            <div className={`border-b ${isDark ? "border-gray-800 bg-gray-900/50" : "border-gray-200 bg-white"}`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <button onClick={() => router.back()} className="flex items-center gap-2 font-bold text-sm hover:text-yellow-500 transition-colors">
                        <ArrowLeft size={18} /> BACK
                    </button>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-green-500" size={20} />
                        <span className="text-[10px] font-black tracking-widest opacity-60 uppercase">Secure Transaction</span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* LEFT SIDE: SUMMARY */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5 space-y-6">
                        <div className={`p-8 rounded-[2.5rem] shadow-sm ${isDark ? "bg-gray-800" : "bg-white border border-gray-100"}`}>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-yellow-500 mb-6">Item Selection</h2>
                            <div className="flex gap-6 items-center mb-8">
                                <div className="relative w-28 h-28 rounded-3xl overflow-hidden bg-gray-100 flex-shrink-0">
                                    <img src={product.images?.[0] || "/placeholder.png"} alt="" className="object-cover w-full h-full" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black italic tracking-tighter uppercase">{product.name}</h3>
                                    <p className="text-sm opacity-50 mt-1 line-clamp-1 font-medium">{product.description}</p>
                                    <div className="mt-2 text-lg font-black tracking-tight text-yellow-500">₹{product.price}</div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-dashed border-gray-200/50">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="opacity-50">Subtotal</span>
                                    <span>₹{product.price}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="opacity-50">Logistics</span>
                                    <span className="text-green-500 uppercase text-[10px] font-black">Free Shipping</span>
                                </div>
                                <div className="flex justify-between text-2xl font-black pt-4">
                                    <span>Total</span>
                                    <span className="text-yellow-500">₹{product.price}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-8 opacity-40">
                            <Truck size={24} /> <CreditCard size={24} /> <ShieldCheck size={24} />
                        </div>
                    </motion.div>

                    {/* RIGHT SIDE: CHECKOUT FORM */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7 space-y-6">
                        <div className={`p-8 md:p-12 rounded-[2.5rem] shadow-2xl ${isDark ? "bg-gray-800 shadow-black/50" : "bg-white border border-gray-100"}`}>

                            {/* Address */}
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white shadow-lg shadow-yellow-500/30">
                                        <MapPin size={20} />
                                    </div>
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Shipping Path</h2>
                                </div>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter full shipping address..."
                                    className={`w-full p-5 rounded-2xl border-2 transition-all outline-none min-h-[120px] font-medium
                                        ${isDark ? "bg-gray-900 border-gray-700 focus:border-yellow-500" : "bg-gray-50 border-gray-100 focus:border-yellow-500 focus:bg-white"}`}
                                />
                            </div>

                            {/* Payment */}
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                                        <CreditCard size={20} />
                                    </div>
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Billing Logic</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {["Online", "COD"].map((method) => (
                                        <label key={method} className={`relative flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all
                                            ${paymentMethod === method ? "border-yellow-500 bg-yellow-500/5" : isDark ? "border-gray-700 bg-gray-900" : "border-gray-100 bg-gray-50"}`}>
                                            <input type="radio" className="hidden" name="payment" value={method} onChange={() => setPaymentMethod(method)} />
                                            <span className="font-black text-sm uppercase tracking-widest">{method === "Online" ? "Digital Pay" : "COD"}</span>
                                            <span className="text-[10px] mt-1 opacity-50 font-bold">{method === "Online" ? "UPI / Card" : "Cash on delivery"}</span>
                                            {paymentMethod === method && <div className="absolute top-3 right-3 w-3 h-3 bg-yellow-500 rounded-full" />}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Button */}
                            <button
                                onClick={handlePlaceOrder}
                                className="w-full py-6 rounded-3xl bg-yellow-500 hover:bg-yellow-600 text-white font-black text-lg uppercase tracking-[0.1em] shadow-2xl shadow-yellow-500/40 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                <ShoppingBag size={20} />
                                {paymentMethod === "Online" ? "PAY NOW & SECURE" : "CONFIRM ORDER"}
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}