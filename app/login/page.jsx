"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "../redux/authslice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { useTheme } from "../context/contextthem";


export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    const router = useRouter();

    let { loginuser } = useTheme()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("backend/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (data.login === "true") {
                localStorage.setItem("id", data.user._id);
                localStorage.setItem("user", JSON.stringify(data.user));
                // dispatch(login({ userdata: data.user }));
                loginuser({ userdata: data.user })
                console.log(data)
                toast.success("Login successful!");
            } else {
                setMessage("Invalid credentials");
            }
        } catch {
            setMessage("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] overflow-hidden"
            >

                {/* LEFT BRAND */}
                <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-yellow-400 to-yellow-500 relative">
                    <h2 className="text-white text-3xl font-black tracking-tight">
                        Your<span className="opacity-70">Shop</span>
                    </h2>

                    <div>
                        <Image
                            src="/img/login.jpg"
                            alt="Login"
                            width={420}
                            height={420}
                            className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                        <h3 className="mt-8 text-white text-2xl font-bold">
                            Secure & Fast Login
                        </h3>
                        <p className="text-white/80 text-sm mt-2">
                            Access your account with confidence.
                        </p>
                    </div>

                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
                </div>

                {/* RIGHT FORM */}
                <div className="p-8 md:p-16 flex flex-col justify-center">
                    <h1 className="text-4xl font-black mb-2 text-gray-900">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-gray-400 mb-8">
                        Login to continue
                    </p>

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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email address"
                                required
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-yellow-400 outline-none font-semibold"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-yellow-400 outline-none font-semibold"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-black text-white tracking-widest flex items-center justify-center gap-2 transition ${loading
                                ? "bg-yellow-300"
                                : "bg-yellow-400 hover:bg-yellow-500 shadow-xl shadow-yellow-400/30"
                                }`}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    LOGIN
                                    <ArrowRight />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm mt-6 text-gray-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/singup" className="text-yellow-500 font-bold">
                            Sign Up
                        </Link>
                    </p>

                    <div className="mt-10 flex justify-center items-center gap-2 text-xs text-gray-400">
                        <ShieldCheck className="text-green-500 w-4 h-4" />
                        Secure Login • © 2026 YourShopp
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
