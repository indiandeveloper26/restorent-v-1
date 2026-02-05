"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Zap, Truck, ShieldCheck, Star } from "lucide-react";
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

        console.log('iddd', userdataaa.userId)
        setAdding(true);
        try {
            await fetch("/backend/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userdataaa.userId, productId: product._id }),
            });
            toast.success("Added to cart");
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

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!product) return <div className="text-center py-20">Product not found</div>;

    return (
        <section className="bg-white min-h-screen pb-20">
            {/* HEADER */}
            <div className="border-b bg-yellow-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm font-bold text-yellow-600 hover:text-black"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <span className="text-[11px] font-black tracking-widest text-gray-400 uppercase">
                        {product.category} / {product.name}
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* LEFT IMAGE */}
                <div className="lg:col-span-7 grid md:grid-cols-12 gap-4">
                    <div className="md:col-span-2 flex md:flex-col gap-3">
                        {product.images?.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`w-20 h-20 rounded-xl overflow-hidden border-2
                                ${activeImage === i ? "border-yellow-400 scale-105" : "border-gray-100 opacity-60"}`}
                            >
                                <Image src={img} alt="" fill className="object-cover" />
                            </button>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-10 relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-yellow-50"
                    >
                        <Image
                            src={product.images?.[activeImage]}
                            alt={product.name}
                            fill
                            className="object-cover hover:scale-110 transition duration-700"
                        />
                        <span className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full text-xs font-black flex items-center gap-2">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" /> 4.9
                        </span>
                    </motion.div>
                </div>

                {/* RIGHT INFO */}
                <div className="lg:col-span-5 space-y-8 sticky top-24">
                    <div>
                        <span className="text-yellow-500 font-black text-xs uppercase tracking-[0.3em]">
                            {product.category}
                        </span>
                        <h1 className="text-4xl font-black mt-2">
                            {product.name}
                        </h1>
                        <p className="text-gray-600 mt-4">{product.description}</p>
                    </div>

                    <div className="flex items-end gap-4">
                        <span className="text-4xl font-black text-yellow-500">
                            ₹{product.price}
                        </span>
                        {product.discountPrice && (
                            <span className="line-through text-gray-400">
                                ₹{product.discountPrice}
                            </span>
                        )}
                    </div>

                    {/* TRUST */}
                    <div className="grid grid-cols-3 gap-4 py-6 border-y">
                        {[
                            { Icon: Truck, label: "Fast Delivery" },
                            { Icon: ShieldCheck, label: "Original" },
                            { Icon: Zap, label: "Hot Deal" },
                        ].map((t, i) => (
                            <div key={i} className="text-center">
                                <div className="w-10 h-10 mx-auto rounded-full bg-yellow-100 flex items-center justify-center">
                                    <t.Icon size={18} className="text-yellow-500" />
                                </div>
                                <p className="text-[10px] mt-2 font-bold uppercase">{t.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* BUTTONS */}
                    <div className="space-y-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={adding}
                            className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-black text-yellow-400 font-black uppercase tracking-widest hover:bg-gray-900"
                        >
                            <ShoppingBag size={18} /> {adding ? "ADDING..." : "ADD TO CART"}
                        </button>

                        <button
                            onClick={handleOrderNow}
                            className="w-full py-5 rounded-2xl bg-yellow-400 text-black font-black uppercase tracking-widest hover:bg-yellow-500"
                        >
                            BUY NOW
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
