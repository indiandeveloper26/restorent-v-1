"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../Redux/authslice";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [agree, setAgree] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!agree) {
            setMessage("Please accept Terms & Conditions");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/backend/api/singup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.status === 409) {
                setMessage("Email already exists");
                return;
            }

            const data = await res.json();

            if (data.userId) {
                localStorage.setItem("id", data.userId);
                dispatch(login({ userdata: data }));
                toast.success("Signup successful!");
                router.push("/");
            } else {
                setMessage("Signup failed");
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
                            alt="Signup"
                            width={420}
                            height={420}
                            className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                        <h3 className="mt-8 text-white text-2xl font-bold">
                            Create your account
                        </h3>
                        <p className="text-white/80 text-sm mt-2">
                            Start your journey with us today.
                        </p>
                    </div>

                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
                </div>

                {/* RIGHT FORM */}
                <div className="p-8 md:p-16 flex flex-col justify-center">
                    <h1 className="text-4xl font-black mb-2 text-gray-900">
                        Create Account
                    </h1>
                    <p className="text-sm text-gray-400 mb-8">
                        Sign up to get started
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

                        {/* NAME */}
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                placeholder="Full Name"
                                required
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-yellow-400 outline-none font-semibold"
                            />
                        </div>

                        {/* EMAIL */}
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

                        {/* PASSWORD */}
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                required
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                                className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 focus:border-yellow-400 outline-none font-semibold"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>

                        {/* TERMS */}
                        <div className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={agree}
                                onChange={() => setAgree(!agree)}
                                className="accent-yellow-400"
                            />
                            <span>
                                I agree to{" "}
                                <Link href="/terms" className="text-yellow-500 font-bold">
                                    Terms & Conditions
                                </Link>
                            </span>
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-black text-white tracking-widest transition flex justify-center items-center gap-2 ${loading
                                ? "bg-yellow-300"
                                : "bg-yellow-400 hover:bg-yellow-500 shadow-xl shadow-yellow-400/30"
                                }`}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "SIGN UP"}
                        </button>
                    </form>

                    <p className="text-center text-sm mt-6 text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-yellow-500 font-bold">
                            Login
                        </Link>
                    </p>

                    <div className="mt-10 flex justify-center items-center gap-2 text-xs text-gray-400">
                        <ShieldCheck className="text-green-500 w-4 h-4" />
                        Secure Signup • © 2026 YourShop
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
