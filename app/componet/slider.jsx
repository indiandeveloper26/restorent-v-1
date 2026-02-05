"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function FastAutoSlider({ products = [] }) {
    const router = useRouter();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const ITEMS_PER_VIEW = 3; // 🔥 ONLY 3 CARDS

    // AUTO SLIDE LOGIC
    const maxIndex =
        products.length > ITEMS_PER_VIEW
            ? products.length - ITEMS_PER_VIEW
            : 0;

    useEffect(() => {
        if (isHovered || maxIndex === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) =>
                prev >= maxIndex ? 0 : prev + 1
            );
        }, 1000); // ⚡ 1 second auto slide

        return () => clearInterval(interval);
    }, [isHovered, maxIndex]);

    if (!products.length) return null;

    return (
        <div
            className="w-full py-8"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="max-w-6xl mx-auto px-4">
                {/* HEADER */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-2 bg-orange-500/10 px-3 py-1 rounded-full">
                        <Zap size={14} className="text-orange-500 fill-orange-500" />
                        <span className="text-orange-500 font-black text-[10px] uppercase tracking-widest">
                            Live Feed
                        </span>
                    </div>
                    <div className="flex-1 h-[1px] bg-gray-100" />
                </div>

                {/* SLIDER */}
                <div className="overflow-hidden rounded-3xl">
                    <motion.div
                        className="flex"
                        animate={{
                            x: `-${currentIndex * (100 / ITEMS_PER_VIEW)}%`,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 50,
                            mass: 0.9,
                        }}
                    >
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="flex-none px-2"
                                style={{
                                    width: `${100 / ITEMS_PER_VIEW}%`,
                                }}
                            >
                                <div
                                    onClick={() =>
                                        router.push(`/products/${product.slug}`)
                                    }
                                    className="cursor-pointer bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-orange-500 transition"
                                >
                                    {/* IMAGE */}
                                    <div className="aspect-[4/3] bg-gray-50">
                                        <img
                                            src={product.images?.[0] || "/placeholder.png"}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* INFO */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-sm truncate uppercase">
                                            {product.name}
                                        </h3>
                                        <p className="text-orange-500 font-black mt-1">
                                            ₹{product.price}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
