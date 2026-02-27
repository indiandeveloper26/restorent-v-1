"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/contextthem";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Filter, Star, Pizza, Zap } from "lucide-react";
import ProductSkeletonCard from "../componet/skeleten"; // Ensure path is correct
import FastAutoSlider from "../componet/slider";
import axios from "axios";

export default function ProductsClient() {
    const router = useRouter();
    const { products = [], fetchProducts, userdataaa, loading, error, theme } = useTheme();

    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const isDark = theme === "dark";

    // 🔥 Initial Fetch
    useEffect(() => {
        fetchProducts();
    }, []);

























    // 🔍 Filter Products
    useEffect(() => {
        const results = products.filter((p) =>
            p?.name?.toLowerCase().includes(search.toLowerCase()) ||
            p?.category?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(results);
    }, [search, products]);

    if (loading) return <ProductSkeletonCard />;

    if (error)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">⚠️</span>
                </div>
                <p className="text-red-500 font-black tracking-widest uppercase">
                    Oops! {error}
                </p>
            </div>
        );

    return (
        <section
            className={`min-h-screen font-sans selection:bg-yellow-400/30 transition-colors duration-500 ${isDark ? "bg-[#0f1115] text-white" : "bg-white text-gray-900"
                }`}
        >
            {/* Hero Header */}
            <div
                className={`${isDark ? "bg-zinc-900/50" : "bg-gray-50"
                    } pt-24 pb-16 border-b ${isDark ? "border-zinc-800" : "border-gray-100"
                    }`}
            >
                <div className="container mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6 uppercase">
                            Our <span className="text-yellow-500 underline decoration-4 underline-offset-8">Legendary</span> Menu
                        </h1>
                        <p className="text-sm font-bold opacity-50 max-w-lg mx-auto uppercase tracking-[0.2em]">
                            Freshly baked dough, premium toppings, and 100% pure cheese.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <div className="mt-12 flex justify-center">
                        <div className="relative w-full max-w-2xl group">
                            <Search
                                className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? "text-zinc-600 group-focus-within:text-yellow-500" : "text-gray-400 group-focus-within:text-yellow-500"
                                    }`}
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Find your favorite pizza..."
                                className={`w-full pl-16 pr-8 py-6 rounded-[2.5rem] text-sm font-bold uppercase tracking-widest transition-all duration-300 outline-none border-2 shadow-2xl shadow-black/5 ${isDark
                                    ? "bg-zinc-800/50 border-zinc-700 focus:border-yellow-500 focus:bg-zinc-800"
                                    : "bg-white border-gray-100 focus:border-yellow-400 focus:ring-8 focus:ring-yellow-400/5"
                                    }`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Auto Slider */}
            <FastAutoSlider products={products} />

            {/* Product Grid */}
            <div className="container mx-auto px-6 py-16">
                {/* Grid Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-1 bg-yellow-500 rounded-full" />
                        <h3 className="text-xl font-black uppercase tracking-widest">
                            Available Now ({filtered.length})
                        </h3>
                    </div>
                    <button
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? "bg-zinc-800 hover:bg-zinc-700" : "bg-gray-100 hover:bg-gray-200"
                            }`}
                    >
                        <Filter size={14} /> Filter
                    </button>
                </div>

                {/* Responsive Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((product, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                key={product._id}
                                onClick={() => router.push(`/pizza/${product.slug}`)}
                                className="group relative flex flex-col cursor-pointer"
                            >
                                {/* Product Image */}
                                <div
                                    className={`aspect-square w-full overflow-hidden rounded-[2.5rem] relative transition-all duration-500 ${isDark ? "bg-zinc-900 shadow-2xl" : "bg-gray-50 shadow-lg shadow-gray-200/50"
                                        }`}
                                >
                                    <img
                                        src={product.images?.[0] || "/placeholder.png"}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Price Badge */}
                                    <div className="absolute bottom-6 left-6">
                                        <div className="bg-white/90 backdrop-blur-md text-black px-4 py-2 rounded-2xl font-black text-lg italic shadow-xl">
                                            ₹{product.discountPrice || product.price}
                                        </div>
                                    </div>

                                    {/* Category Tag */}
                                    <div className="absolute top-6 right-6">
                                        <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                                </div>

                                {/* Product Info */}
                                <div className="pt-6 px-2">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-black uppercase tracking-tighter truncate group-hover:text-yellow-500 transition-colors">
                                            {product.name}
                                        </h2>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star size={14} fill="currentColor" />
                                            <span className="text-xs font-black italic">4.9</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/pizza/${product.slug}`);
                                            }}
                                            className="flex-grow bg-yellow-400 text-white dark:bg-zinc-800 dark:hover:bg-yellow-500 dark:hover:text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                                        >
                                            View Details
                                        </button>
                                        <button className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-400/20">
                                            <ShoppingBag size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {filtered.length === 0 && (
                    <div className="py-32 text-center">
                        <Pizza className="mx-auto w-16 h-16 text-gray-200 mb-6" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-xl">No Pizza Found</p>
                    </div>
                )}
            </div>
        </section>
    );
}
