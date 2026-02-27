"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, User } from "lucide-react";
import { useTheme } from "../context/contextthem";

export default function SignupPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { setuserdata, setloging } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/backend/api/singup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok && data.login === "true") {
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("id", data.user._id);
                localStorage.setItem("token", "true");

                setuserdata(data.user);
                setloging(true);

                toast.success("Welcome aboard!");
                router.push("/pizza");
            } else {
                setMessage(data.error || "Signup failed");
                toast.error(data.error || "Signup failed");
            }
        } catch (err) {
            setMessage("Connection error. Try again.");
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10 selection:bg-yellow-200">
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
                                alt="Signup"
                                width={420}
                                height={420}
                                className="rounded-[2.5rem] shadow-2xl -rotate-3 hover:rotate-0 transition-all duration-700 border-[6px] border-white object-cover"
                            />
                        </div>
                        <h3 className="mt-12 text-black text-5xl font-black italic uppercase tracking-tighter leading-[0.9]">
                            Get The <br /> Best Slice
                        </h3>
                    </div>

                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
                </div>

                {/* RIGHT FORM SECTION */}
                <div className="p-8 md:p-20 flex flex-col justify-center bg-white">
                    <div className="mb-12">
                        <h1 className="text-6xl font-black italic tracking-tighter uppercase text-black leading-none">Sign Up<span className="text-yellow-400">.</span></h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-4">Join the elite pizza squad</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div className="relative group">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="YOUR FULL NAME"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full pl-16 pr-8 py-6 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:border-black outline-none font-black text-black placeholder:text-gray-300 placeholder:font-black placeholder:text-[10px] placeholder:tracking-[0.2em] transition-all"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                            <input
                                type="email"
                                placeholder="EMAIL ADDRESS"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full pl-16 pr-8 py-6 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:border-black outline-none font-black text-black placeholder:text-gray-300 placeholder:font-black placeholder:text-[10px] placeholder:tracking-[0.2em] transition-all"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                            <input
                                type="password"
                                placeholder="CREATE PASSWORD"
                                required
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full pl-16 pr-8 py-6 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:border-black outline-none font-black text-black placeholder:text-gray-300 placeholder:font-black placeholder:text-[10px] placeholder:tracking-[0.2em] transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-7 rounded-[2rem] font-black text-black tracking-[0.3em] uppercase text-xs flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl ${loading
                                ? "bg-gray-100 text-gray-400"
                                : "bg-yellow-400 hover:bg-black hover:text-white shadow-yellow-200/50"
                                }`}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Start Journey <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] mt-10 text-gray-400">
                        Member already?{" "}
                        <Link href="/login" className="text-black font-black border-b-2 border-yellow-400 pb-1 hover:bg-yellow-50 transition-colors">Login Now</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}