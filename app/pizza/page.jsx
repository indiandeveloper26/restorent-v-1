"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/contextthem";

export default function ProductsClient() {
    const router = useRouter();

    const {
        products = [],
        fetchProducts,
        loading,
        error,
        theme,
    } = useTheme();

    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);

    // 🔥 Fetch products (context)
    useEffect(() => {
        fetchProducts(); // assuming context handles restaurant internally
    }, []);

    // 🔍 Search filter
    useEffect(() => {
        if (!search) {
            setFiltered(products);
        } else {
            setFiltered(
                products.filter(
                    (p) =>
                        p?.name?.toLowerCase().includes(search.toLowerCase()) ||
                        p?.category
                            ?.toLowerCase()
                            .includes(search.toLowerCase())
                )
            );
        }
    }, [search, products]);

    // 🌀 Loading
    if (loading) {
        return (
            <h1 className="text-center py-16 text-lg">
                Loading products...
            </h1>
        );
    }

    // ❌ Error
    if (error) {
        return (
            <p className="text-center py-16 text-red-500">
                {error}
            </p>
        );
    }

    // 🚫 No products
    if (!loading && products.length === 0) {
        return (
            <p className="text-center py-16 text-gray-500">
                No products available
            </p>
        );
    }

    return (
        <section
            className={`min-h-screen py-12 ${theme === "dark"
                ? "bg-gray-900 text-white"
                : "bg-gray-50"
                }`}
        >
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-6 text-center text-yellow-500">
                    Our Products
                </h1>

                {/* 🔍 Search */}
                <div className="flex justify-center mb-8">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full max-w-md px-4 py-2 border border-yellow-400 rounded-lg text-black"
                    />
                </div>

                {/* 🧱 Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filtered.map((product) => (
                        <div
                            key={product._id}
                            onClick={() =>
                                router.push(`/pizza/${product.slug}`)
                            }
                            className="bg-white border border-yellow-400 rounded-lg shadow-md
                                       cursor-pointer hover:shadow-lg transition"
                        >
                            {/* 🖼 Image */}
                            <img
                                src={
                                    product.images?.[0] ||
                                    "/placeholder.png"
                                }
                                alt={product.name}
                                className="h-48 w-full object-cover"
                            />

                            {/* 📦 Content */}
                            <div className="p-4 flex flex-col gap-2">
                                <h2 className="font-semibold truncate">
                                    {product.name}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {product.category}
                                </p>

                                <p className="text-yellow-500 font-bold">
                                    ₹{product.discountPrice || product.price}
                                </p>

                                {/* 🟡 ORDER BUTTON */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent card click
                                        router.push(`/pizza/${product.slug}`);
                                    }}
                                    className="mt-2 w-full bg-yellow-500 text-white
                                               py-2 rounded-lg font-medium
                                               hover:bg-yellow-600 transition"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
