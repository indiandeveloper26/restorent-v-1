"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/contextthem";
import Image from "next/image";
import { toast } from "react-toastify";

export default function CartPage() {
    const router = useRouter();
    const { theme, userdataaa } = useTheme();
    const isDark = theme === "dark";

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userId = userdataaa?._id;

    // Fetch cart items
    useEffect(() => {
        if (!userId) return;

        const fetchCart = async () => {
            try {
                const res = await fetch("/backend/api/cart/get", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: userId }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to fetch cart");

                setCart(data.cart || []);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [userId]);

    const handleDelete = async (itemId) => {
        if (!confirm("Are you sure you want to remove this item?")) return;

        try {
            const res = await fetch(`/backend/api/cart/delete/${itemId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");

            setCart(cart.filter((item) => item._id !== itemId));
            toast.success("Item removed from cart");
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        }
    };

    const totalItems = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);
    const totalPrice = cart.reduce(
        (sum, i) => sum + ((i.product?.price || 0) * (i.quantity || 0)),
        0
    );

    if (loading) return <h1 className="text-center py-20">Loading...</h1>;
    if (error)
        return (
            <p className="text-center py-20 text-red-500 font-semibold">{error}</p>
        );

    return (
        <section
            className={`min-h-screen py-10 ${isDark ? "bg-gray-900 text-white" : "bg-yellow-50 text-gray-900"
                }`}
        >
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <h1 className="text-3xl font-bold mb-6">
                        Shopping Cart
                        <span
                            className={`text-sm font-medium ml-2 ${isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                        >
                            ({totalItems} items)
                        </span>
                    </h1>

                    {cart.length === 0 ? (
                        <div
                            className={`p-10 rounded-xl shadow text-center ${isDark ? "bg-gray-800 text-gray-400" : "bg-white text-gray-600"
                                }`}
                        >
                            Your cart is empty
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item._id}
                                    className={`rounded-xl p-4 flex gap-5 items-center transition ${isDark
                                        ? "bg-gray-800 hover:bg-gray-700"
                                        : "bg-white hover:shadow-md"
                                        }`}
                                >
                                    <div
                                        className="relative w-28 h-28 flex-shrink-0 cursor-pointer"
                                        onClick={() =>
                                            router.push(`/products/${item.product?.slug || ""}`)
                                        }
                                    >
                                        <Image
                                            src={item.product?.images?.[0] || "/placeholder.png"}
                                            alt={item.product?.name || "Product"}
                                            fill
                                            className="object-cover rounded-lg border border-gray-300 dark:border-gray-700"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h2 className="font-semibold text-lg">
                                                {item.product?.name || "Unknown Product"}
                                            </h2>
                                            <p className="text-sm text-yellow-700">
                                                ₹{item.product?.price || 0} × {item.quantity || 0}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <div className="text-lg font-bold text-yellow-700">
                                            ₹{(item.product?.price || 0) * (item.quantity || 0)}
                                        </div>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="mt-2 px-3 py-1 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div
                    className={`rounded-xl p-6 h-fit sticky top-24 ${isDark ? "bg-gray-800" : "bg-white shadow-md"
                        }`}
                >
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                    <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-400">
                        <span>Total Items</span>
                        <span>{totalItems}</span>
                    </div>

                    <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span className="text-yellow-700 font-bold">₹{totalPrice}</span>
                    </div>

                    <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-400">
                        <span>Shipping</span>
                        <span className="text-green-500 font-medium">Free</span>
                    </div>

                    <div className="border-t border-gray-300 dark:border-gray-700 my-4"></div>

                    <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span className="text-yellow-700">₹{totalPrice}</span>
                    </div>

                    <button
                        onClick={() => router.push("/checkout")}
                        className="mt-6 w-full py-3 rounded-xl font-semibold text-white shadow-lg hover:brightness-90 transition"
                        style={{ backgroundColor: "#F5A623" }} // brighter yellow-orange
                    >
                        Proceed to Checkout →
                    </button>
                </div>
            </div>
        </section>
    );
}
