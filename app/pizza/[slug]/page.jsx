"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Zap, Truck, ShieldCheck, Star, Pizza } from "lucide-react";
import { fetchProducts } from "../../redux/producttahnk";
import { useTheme } from "../../context/contextthem";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const { products, loading } = useSelector((state) => state.products);
    const { userdataaa } = useTheme();

    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (!products.length) dispatch(fetchProducts());
    }, [products.length, dispatch]);

    useEffect(() => {
        if (products.length) {
            const found = products.find((p) => p.slug === params.slug);
            if (found) setProduct(found);
        }
    }, [products, params.slug]);

    const handleAddToCart = async () => {
        if (!userdataaa) return toast.error("Please login first");

        setAdding(true);
        try {
            let res = await fetch("/backend/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userdataaa._id, productId: product._id }),
            });

            if (res.ok) {
                toast.success("Added to cart");
            } else {
                toast.error("Failed to add");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setAdding(false);
        }
    };

    const handleOrderNow = () => {
        if (!userdataaa) return toast.error("Please login first");
        localStorage.setItem("buyNowProduct", JSON.stringify(product));
        router.push("/checkout");
    };

    // 🔥 Premium Loading State
    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Pizza size={40} className="text-yellow-400" />
            </motion.div>
            <p className="mt-4 font-black uppercase tracking-[0.3em] text-[10px] text-gray-400">Preparing Details...</p>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Pizza Not Found</h2>
            <button onClick={() => router.push("/pizza")} className="mt-6 text-yellow-500 font-black border-b-2 border-yellow-400">Go Back Menu</button>
        </div>
    );

    return (
        <section className="bg-white min-h-screen pb-20 selection:bg-yellow-200">
            {/* HEADER / BREADCRUMB */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black"
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                            <ArrowLeft size={14} />
                        </div>
                        Back to Menu
                    </button>
                    <span className="hidden md:block text-[9px] font-black tracking-[0.3em] text-gray-300 uppercase">
                        {product.category} <span className="mx-2">/</span> {product.name}
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT: IMAGE GALLERY */}
                <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
                    {/* Thumbnails */}
                    <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
                        {product.images?.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`relative flex-shrink-0 w-20 h-20 rounded-3xl overflow-hidden border-2 transition-all duration-300
                                ${activeImage === i ? "border-black scale-105 shadow-xl shadow-black/5" : "border-gray-100 opacity-50 hover:opacity-100"}`}
                            >
                                <Image src={img} alt="" fill className="object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Main Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative flex-grow aspect-square md:aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-gray-50 shadow-2xl shadow-gray-200/50 group"
                    >
                        <Image
                            src={product.images?.[activeImage]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            priority
                        />
                        <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl text-[11px] font-black flex items-center gap-2 shadow-xl">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" /> 4.9 RATING
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT: PRODUCT INFO */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                    <div className="mb-10">
                        <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-yellow-200">
                            {product.category}
                        </span>
                        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-black mt-6 leading-none">
                            {product.name}<span className="text-yellow-400">.</span>
                        </h1>
                        <p className="text-gray-400 mt-6 text-sm font-medium leading-relaxed max-w-md">
                            {product.description}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 mb-12">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Price tag</span>
                            <span className="text-5xl font-black text-black italic">
                                ₹{product.price}
                            </span>
                        </div>
                        {product.discountPrice && (
                            <div className="flex flex-col mt-4">
                                <span className="line-through text-gray-300 font-bold text-xl">
                                    ₹{product.discountPrice}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* FEATURES GRID */}
                    <div className="grid grid-cols-3 gap-6 py-10 border-y border-gray-100 mb-12">
                        {[
                            { Icon: Truck, label: "Express", sub: "Delivery" },
                            { Icon: ShieldCheck, label: "Authentic", sub: "Recipe" },
                            { Icon: Zap, label: "Fresh", sub: "Baking" },
                        ].map((t, i) => (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-yellow-400 transition-colors">
                                    <t.Icon size={20} className="text-black" />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-tighter text-black">{t.label}</p>
                                <p className="text-[8px] font-bold uppercase tracking-widest text-gray-300">{t.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={adding}
                            className={`group w-full flex items-center justify-center gap-4 py-7 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all active:scale-95 shadow-2xl ${adding
                                ? "bg-gray-100 text-gray-400"
                                : "bg-black text-white hover:bg-yellow-400 hover:text-black shadow-black/10"
                                }`}
                        >
                            <ShoppingBag size={20} className={adding ? "animate-bounce" : "group-hover:rotate-12 transition-transform"} />
                            {adding ? "Adding to Box..." : "Add to Cart"}
                        </button>

                        <button
                            onClick={handleOrderNow}
                            className="w-full py-7 rounded-[2rem] bg-yellow-400 text-black font-black uppercase tracking-[0.2em] text-[11px] hover:bg-black hover:text-white transition-all active:scale-95 shadow-2xl shadow-yellow-200/50"
                        >
                            Order Now
                        </button>
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                        <ShieldCheck size={14} className="text-green-500" />
                        100% Secure Checkout
                    </div>
                </div>
            </div>
        </section>
    );
}