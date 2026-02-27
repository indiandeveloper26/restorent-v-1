"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/contextthem";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Filter, Star, Pizza, Trash2, Loader2 } from "lucide-react"; // Trash2 add kiya
import ProductSkeletonCard from "../componet/skeleten";
import FastAutoSlider from "../componet/slider";

export default function ProductsClient() {
    const router = useRouter();
    const { products = [], fetchProducts, loading, error, theme } = useTheme();

    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [deletingId, setDeletingId] = useState(null); // Delete loading state ke liye
    const isDark = theme === "dark";

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const results = products.filter((p) =>
            p?.name?.toLowerCase().includes(search.toLowerCase()) ||
            p?.category?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(results);
    }, [search, products]);

    // 🔥 Delete Function
    const handleDelete = async (e, id) => {


        e.stopPropagation(); // Card click event ko rokne ke liye
        if (!confirm("Are you sure you want to delete this legendary pizza?")) return;

        setDeletingId(id);
        try {
            const res = await fetch(`backend/menu/delete/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchProducts(); // List refresh karne ke liye
                alert("Pizza removed from menu!");
            } else {
                alert("Failed to delete.");
            }
        } catch (err) {
            console.error("Delete error:", err);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <ProductSkeletonCard />;

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-red-500 font-black tracking-widest uppercase">Oops! {error}</p>
        </div>
    );

    return (
        <section className={`min-h-screen font-sans transition-colors duration-500 ${isDark ? "bg-[#0f1115] text-white" : "bg-white text-gray-900"}`}>

            {/* ... (Hero Header & Search remains same) ... */}
            <div className={`${isDark ? "bg-zinc-900/50" : "bg-gray-50"} pt-24 pb-16 border-b ${isDark ? "border-zinc-800" : "border-gray-100"}`}>
                <div className="container mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6 uppercase">
                            Our <span className="text-yellow-500 underline decoration-4 underline-offset-8">Legendary</span> Menu
                        </h1>
                    </motion.div>
                    <div className="mt-12 flex justify-center">
                        <div className="relative w-full max-w-2xl group">
                            <Search className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? "text-zinc-600" : "text-gray-400"}`} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Find your favorite pizza..."
                                className={`w-full pl-16 pr-8 py-6 rounded-[2.5rem] text-sm font-bold uppercase tracking-widest transition-all outline-none border-2 ${isDark ? "bg-zinc-800/50 border-zinc-700 focus:border-yellow-500" : "bg-white border-gray-100 focus:border-yellow-400"}`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <FastAutoSlider products={products} />

            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((product, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={product._id}
                                onClick={() => router.push(`/pizza/${product.slug}`)}
                                className="group relative flex flex-col cursor-pointer"
                            >
                                <div className={`aspect-square w-full overflow-hidden rounded-[2.5rem] relative transition-all duration-500 ${isDark ? "bg-zinc-900 shadow-2xl" : "bg-gray-50 shadow-lg shadow-gray-200/50"}`}>
                                    <img
                                        src={product.images?.[0] || "/placeholder.png"}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* 🔥 DELETE BUTTON (Top Left) */}
                                    <button
                                        onClick={(e) => handleDelete(e, product._id)}
                                        className="absolute top-4 left-4 z-10 w-10 h-10 bg-red-500/10 hover:bg-red-500 backdrop-blur-md text-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 border border-red-500/20"
                                    >
                                        {deletingId === product._id ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={18} />
                                        )}
                                    </button>

                                    {/* Category Tag */}
                                    <div className="absolute top-6 right-6">
                                        <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Price Badge */}
                                    <div className="absolute bottom-6 left-6">
                                        <div className="bg-white/90 backdrop-blur-md text-black px-4 py-2 rounded-2xl font-black text-lg italic shadow-xl">
                                            ₹{product.discountPrice || product.price}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 px-2">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-black uppercase truncate group-hover:text-yellow-500 transition-colors">
                                            {product.name}
                                        </h2>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star size={14} fill="currentColor" />
                                            <span className="text-xs font-black">4.9</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button className="flex-grow bg-yellow-400 text-black dark:bg-zinc-800 dark:text-white dark:hover:bg-yellow-500 dark:hover:text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                            Order Now
                                        </button>
                                        <button className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-yellow-500 transition-all shadow-lg">
                                            <ShoppingBag size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}