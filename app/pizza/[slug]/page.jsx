"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { fetchProducts } from "../../redux/producttahnk";
import Image from "next/image";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const { products, loading, error } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.app); // Redux user
    const [product, setProduct] = useState(null);
    const [adding, setAdding] = useState(false);
    const [id, setId] = useState("");

    // Get userId from localStorage
    useEffect(() => {
        const storedId = localStorage.getItem("id");
        if (storedId) setId(storedId);
    }, []);

    // Fetch products if not present
    useEffect(() => {
        if (!products.length) dispatch(fetchProducts());
    }, [products.length, dispatch]);

    // Find product by slug
    useEffect(() => {
        if (products.length > 0) {
            const found = products.find((p) => p.slug === params.slug);
            if (found) setProduct(found);
        }
    }, [products, params.slug]);

    // Add to Cart
    const handleAddToCart = async () => {
        if (!user) {
            toast.error("Please login first");
            return;
        }
        setAdding(true);
        try {
            const res = await fetch("/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: id, productId: product._id }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to add to cart");
            toast.success("Added to cart");
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setAdding(false);
        }
    };

    // Order Now / Direct Checkout
    const handleOrderNow = () => {
        if (!user) {
            toast.error("Please login first");
            return;
        }
        localStorage.setItem("buyNowProduct", JSON.stringify(product));
        router.push("/checkout");
    };

    if (loading) return <p className="text-center py-8 text-gray-500">Loading product...</p>;
    if (error) return <p className="text-center py-8 text-red-500">Error: {error}</p>;
    if (!product) return <p className="text-center py-8 text-gray-500">Product not found</p>;

    return (
        <section className="container mx-auto px-4 py-8">
            {/* Back button */}
            <button className="mb-4 text-[#F54D27] hover:underline" onClick={() => router.back()}>
                ← Back
            </button>

            {/* User info */}


            {/* Product detail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Images */}
                <div className="space-y-4">
                    {product.images?.length ? (
                        product.images.map((img, idx) => (
                            <div key={idx} className="relative w-full h-64 md:h-80 rounded overflow-hidden shadow">
                                <Image
                                    src={img}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        ))
                    ) : (
                        <div className="relative w-full h-64 md:h-80 rounded overflow-hidden shadow">
                            <Image
                                src="/placeholder.png"
                                alt="placeholder"
                                fill
                                className="object-cover"
                                sizes="100vw"
                            />
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                        <p className="text-gray-500 mb-2">{product.category}</p>
                        <p className="text-gray-700 mb-4">{product.description}</p>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-2xl font-bold text-[#F54D27]">₹{product.price}</span>
                            {product.discountPrice && (
                                <span className="line-through text-gray-400">₹{product.discountPrice}</span>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        {/* Order Now button */}
                        <button
                            onClick={handleOrderNow}
                            className="flex-1 bg-yellow-400 text-white py-3 px-4 rounded hover:bg-green-700 transition font-semibold"
                        >
                            Order Now
                        </button>

                        {/* Add to Cart button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={adding}
                            className={`flex-1 py-3 px-4 rounded font-semibold transition border-2 border-yellow-400 ${adding

                                }`}
                        >
                            {adding ? "Adding...." : "Add to Cart"}
                        </button>


                    </div>
                </div>
            </div>
        </section>
    );
}
