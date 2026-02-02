"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTheme } from "../context/contextthem";
import Link from "next/link";

export default function CheckoutPage() {
    const router = useRouter();
    const { theme, userid, userdataaa, setuserid } = useTheme();

    const isDark = theme === "dark";

    const userId = userdataaa._id


    console.log('usesdtacheack', userId)



    const [product, setProduct] = useState(null);
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Online");
    const [loading, setLoading] = useState(true);


    // Set user id from localStorage


    // Get product from localStorage (buyNowProduct)
    useEffect(() => {
        const buyProduct = JSON.parse(
            localStorage.getItem("buyNowProduct") || "null"
        );

        console.log('proyd dta', buyProduct)
        if (!buyProduct) {
            toast.error("No product selected!");
            router.push("/products");
            return;
        }
        setProduct(buyProduct);
        setLoading(false);
    }, [router]);

    // 🔥 Place Order Function
    const handlePlaceOrder = async () => {
        if (!userdataaa._id) return toast.error("Please login first");
        if (!address) return toast.error("Please enter shipping address!");
        if (!product) return;

        try {
            const res = await fetch("/backend/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userId,  // ya from auth context
                    product,                             // tumhara poora product object
                    quantity: 1,
                    totalPrice: product.price,
                    address: address,
                    paymentMethod: paymentMethod
                })
            });




            const data = await res.json();

            console.log('data', data)
            if (!res.ok) return toast.error(data.message || "Failed to place order");

            toast.success("Order placed successfully!");

            if (paymentMethod === "Online") {
                router.push(`/payment/${data.order._id}`);


            } else {
                toast.info("Payment will be collected on delivery");
                router.push("/orders");
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong!");
        }
    };

    // Loading state
    if (loading)
        return (
            <p className={`text-center py-20 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Loading...
            </p>
        );

    return (
        <section className={`min-h-screen py-10 ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>

            <button className="mb-4 text-[#F54D27] hover:underline" onClick={() => router.back()}>
                ← Back
            </button>
            <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">




                {/* Product Info */}
                <div className={`p-6 rounded-xl shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
                    <h1 className="text-2xl font-bold mb-4">Checkout Product</h1>
                    <img
                        src={product.images?.[0] || "/placeholder.png"}
                        alt={product.name}
                        className="w-full h-64 object-cover rounded mb-4"
                    />
                    <p className={`mb-2 ${isDark ? "text-gray-300" : "text-gray-500"}`}>
                        {product.description}
                    </p>
                    <p className="text-lg font-bold text-yellow-500">
                        Price: ₹{product.price}
                    </p>
                </div>

                {/* Order & Address */}
                <div className={`p-6 rounded-xl shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
                    <h2 className="text-xl font-semibold mb-4">Shipping & Order Summary</h2>

                    {/* Address Input */}
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Shipping Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your address"
                            className={`w-full p-3 rounded-lg border focus:outline-none ${isDark ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 border-gray-300"}`}
                            rows={4}
                        />
                    </div>

                    {/* Payment Method */}
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Payment Method</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className={`w-full p-3 rounded-lg border focus:outline-none ${isDark ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 border-gray-300"}`}
                        >
                            <option value="Online">Online Payment</option>
                            <option value="COD">Cash on Delivery (COD)</option>
                        </select>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t my-4"></div>
                    <div className="flex justify-between mb-2">
                        <span>{product.name}</span>
                        <span>₹{product.price}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-yellow-500">₹{product.price}</span>
                    </div>

                    {/* Place Order Button (Yellow) */}
                    <button
                        onClick={handlePlaceOrder}
                        className="mt-6 w-full py-3 rounded-xl font-semibold text-white shadow-lg
                                   bg-yellow-500 hover:bg-yellow-600 transition-colors"
                    >
                        Place Order & {paymentMethod === "Online" ? "Pay" : "Confirm"} →
                    </button>
                </div>

            </div>
        </section>
    );
}
