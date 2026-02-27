"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { useTheme } from "../context/contextthem";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { loginuser } = useTheme();

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
                loginuser({ userdata: data.user });
                toast.success("Welcome back!");
                router.push("/pizza");
            } else {
                setMessage("Invalid credentials");
                toast.error("Invalid credentials");
            }
        } catch {
            setMessage("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 selection:bg-yellow-200">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden"
            >
                {/* LEFT BRAND SECTION */}
                <div className="hidden md:flex flex-col justify-between p-12 bg-yellow-400 relative">
                    <h2 className="text-black text-3xl font-black italic tracking-tighter">
                        PIZZA<span className="opacity-40">GO.</span>
                    </h2>

                    <div className="relative z-10">
                        <div className="relative">
                            <Image
                                src="/img/login.jpg"
                                alt="Login"
                                width={420}
                                height={420}
                                className="rounded-[2.5rem] shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700 border-[6px] border-white object-cover"
                            />
                        </div>
                        <h3 className="mt-12 text-black text-5xl font-black italic uppercase tracking-tighter leading-[0.9]">
                            Ready For <br /> More Slices?
                        </h3>
                    </div>

                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
                </div>

                {/* RIGHT FORM SECTION */}
                <div className="p-8 md:p-20 flex flex-col justify-center bg-white">
                    <div className="mb-12">
                        <h1 className="text-6xl font-black italic tracking-tighter uppercase text-black leading-none">
                            Login<span className="text-yellow-400">.</span>
                        </h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-4">
                            Welcome back, explorer
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="mb-8 p-4 rounded-2xl bg-red-50 border-l-4 border-red-500 text-red-600 text-[10px] font-black uppercase tracking-widest"
                            >
                                {message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                            <input
                                type="email"
                                placeholder="EMAIL ADDRESS"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full pl-16 pr-8 py-6 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:border-black outline-none font-black text-black placeholder:text-gray-300 placeholder:font-black placeholder:text-[10px] placeholder:tracking-[0.2em] transition-all shadow-sm"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                            <input
                                type="password"
                                placeholder="YOUR PASSWORD"
                                required
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full pl-16 pr-8 py-6 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:border-black outline-none font-black text-black placeholder:text-gray-300 placeholder:font-black placeholder:text-[10px] placeholder:tracking-[0.2em] transition-all shadow-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-7 rounded-[2rem] font-black text-black tracking-[0.3em] uppercase text-xs flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl shadow-yellow-200/50 ${loading
                                ? "bg-gray-100 text-gray-400"
                                : "bg-yellow-400 hover:bg-black hover:text-white"
                                }`}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Access Account <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] mt-10 text-gray-400">
                        New to the shop?{" "}
                        <Link href="/singup" className="text-black font-black border-b-2 border-yellow-400 pb-1 hover:bg-yellow-50 transition-colors">
                            Create Account
                        </Link>
                    </p>

                    <div className="mt-12 flex justify-center items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-gray-200">
                        <ShieldCheck size={14} />
                        Secure Session • PIZZAGO
                    </div>
                </div>
            </motion.div>
        </div>
    );
}