"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/producttahnk";
import { useTheme } from "../context/contextthem";
import { Upload, X, ChevronLeft, Save, Sparkles, Image as ImageIcon, UtensilsCrossed, Leaf } from "lucide-react";
import Image from "next/image";

export default function AddProductPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [restaurantId, setRestaurantId] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    isVeg: true,
  });

  // Get User Data & Fetch Products
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const id = parsed.userdata._id;
        setRestaurantId(id);
        dispatch(fetchProducts(id));
      } catch (err) {
        console.error("Failed to parse user data", err);
      }
    }
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!restaurantId) {
      toast.error("Restaurant ID missing!");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        data.append(key, val);
      });
      data.append("restaurant", restaurantId);
      images.forEach((img) => data.append("images", img));

      const res = await fetch("/backend/menu/add", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add item");
      }

      toast.success("New delicacy added! 🍽️");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Error adding item");
    } finally {
      setLoading(false);
    }
  };

  const sectionClass = `p-8 rounded-[2.5rem] border ${isDark ? "bg-gray-800/40 border-gray-700" : "bg-white border-yellow-100 shadow-sm"}`;
  const labelClass = "text-[10px] font-black uppercase tracking-widest opacity-40 mb-2 block text-yellow-800";
  const inputClass = `w-full p-4 rounded-2xl text-sm font-bold border outline-none transition-all ${isDark ? "bg-gray-900 border-gray-700 focus:border-yellow-500" : "bg-yellow-50/30 border-yellow-100 focus:border-yellow-500"
    }`;

  return (
    <section className={`min-h-screen py-12 ${isDark ? "bg-[#0f1115] text-white" : "bg-yellow-50/20 text-gray-900"}`}>
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity uppercase text-[10px] font-black tracking-widest">
            <ChevronLeft size={16} /> Back to Kitchen
          </button>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Add New Item<span className="text-yellow-500">.</span>
          </h1>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-yellow-400 text-yellow-950 rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-yellow-500/20 hover:scale-105 transition-all disabled:opacity-50"
          >
            {loading ? "Syncing..." : <><Save size={16} /> Publish Item</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className={sectionClass}>
              <h3 className="text-lg font-black italic uppercase mb-6 flex items-center gap-2 text-yellow-600">
                <UtensilsCrossed size={20} /> Dish Details
              </h3>
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Item Name</label>
                  <input type="text" name="name" placeholder="e.g. Truffle Mushroom Pasta" onChange={handleChange} className={inputClass} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>URL Slug</label>
                    <input type="text" name="slug" placeholder="truffle-pasta" onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Category</label>
                    <input type="text" name="category" placeholder="Main Course / Drinks" onChange={handleChange} className={inputClass} required />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Dish Story / Description</label>
                  <textarea name="description" placeholder="Describe the flavors and ingredients..." onChange={handleChange} className={inputClass} rows={4} />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className={sectionClass}>
              <h3 className="text-lg font-black italic uppercase mb-6 flex items-center gap-2 text-yellow-600">
                <ImageIcon size={20} /> Visual Gallery
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-yellow-200">
                    <Image src={src} alt="" fill className="object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <label className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${isDark ? "border-gray-700 hover:border-yellow-500 bg-gray-900" : "border-yellow-200 hover:border-yellow-500 bg-yellow-50/50"
                  }`}>
                  <Upload size={20} className="text-yellow-600 opacity-40 mb-2" />
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Add Photo</span>
                  <input type="file" multiple onChange={handleFiles} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: Pricing & Toggle */}
          <div className="lg:col-span-4 space-y-8">
            <div className={sectionClass}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-600 mb-6">Price & Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Base Price (₹)</label>
                  <input type="number" name="price" placeholder="0.00" onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Offer Price (₹)</label>
                  <input type="number" name="discountPrice" placeholder="0.00" onChange={handleChange} className={inputClass} />
                </div>

                <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${form.isVeg ? "border-green-500/30 bg-green-500/5" : "border-yellow-100"
                  }`}>
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                    <Leaf size={14} className={form.isVeg ? "text-green-500" : "text-gray-400"} />
                    Veg Only
                  </span>
                  <input
                    type="checkbox"
                    name="isVeg"
                    checked={form.isVeg}
                    onChange={handleChange}
                    className="w-5 h-5 accent-green-600 rounded-full"
                  />
                </label>
              </div>
            </div>

            {/* Tip Box */}
            <div className="p-6 rounded-[2rem] bg-yellow-400 text-yellow-950">
              <Sparkles size={24} className="mb-4 opacity-50" />
              <p className="text-xs font-black uppercase leading-tight tracking-wider">
                Pro Tip: Use high-quality photos to increase sales by up to 40%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}