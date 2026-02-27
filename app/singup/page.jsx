"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, User, Phone } from "lucide-react";
import { useTheme } from "../context/contextthem";

export default function SignupPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "", phoneNumber: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { setuserdata, setloging } = useTheme(); // Context se functions nikale

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/backend/api/singup", { // Typos ka dhyan rakhein (singup)
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok && data.login === "true") {
                // LocalStorage update
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("id", data.user._id);
                localStorage.setItem("token", "true");

                // Context update taaki Navbar turant badal jaye
                setuserdata(data.user);
                setloging(true);

                toast.success("Account created successfully!");
                router.push("/pizza"); // Redirect to home/pizza
            } else {
                setMessage(data.error || "Signup failed");
                toast.error(data.error || "Signup failed");
            }
        } catch (err) {
            setMessage("Something went wrong. Please try again.");
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] px-4 py-10">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] overflow-hidden"
            >
                {/* LEFT BRAND (Signup specific image/text) */}
                <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-yellow-400 to-yellow-500 relative">
                    <h2 className="text-white text-3xl font-black tracking-tight">
                        PIZZA<span className="opacity-70">GO.</span>
                    </h2>

                    <div>
                        <Image
                            src="/img/login.jpg" // Aap yahan dusri image bhi laga sakte hain
                            alt="Signup"
                            width={420}
                            height={420}
                            className="rounded-3xl shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                        <h3 className="mt-8 text-white text-2xl font-bold">
                            Join the Pizza Family
                        </h3>
                        <p className="text-white/80 text-sm mt-2">
                            Create an account and get exclusive deals on every order.
                        </p>
                    </div>

                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
                </div>

                {/* RIGHT FORM */}
                <div className="p-8 md:p-16 flex flex-col justify-center">
                    <h1 className="text-4xl font-black mb-2 text-gray-900">Create Account</h1>
                    <p className="text-sm text-gray-400 mb-8">Sign up to get started</p>

                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-4 rounded-xl bg-red-100 text-red-600 text-sm font-semibold"
                            >
                                {message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-yellow-400 outline-none font-semibold"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email address"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-yellow-400 outline-none font-semibold"
                            />
                        </div>

                        {/* Phone Field */}
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={form.phoneNumber}
                                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-yellow-400 outline-none font-semibold"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-yellow-400 outline-none font-semibold"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-black text-white tracking-widest flex items-center justify-center gap-2 transition ${loading ? "bg-yellow-300" : "bg-yellow-400 hover:bg-yellow-500 shadow-xl shadow-yellow-400/30"
                                }`}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>SIGN UP <ArrowRight /></>}
                        </button>
                    </form>

                    <p className="text-center text-sm mt-6 text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-yellow-500 font-bold">Log In</Link>
                    </p>

                    <div className="mt-10 flex justify-center items-center gap-2 text-xs text-gray-400">
                        <ShieldCheck className="text-green-500 w-4 h-4" />
                        Secure Registration • © 2026 PIZZAGO
                    </div>
                </div>
            </motion.div>
        </div>
    );
}