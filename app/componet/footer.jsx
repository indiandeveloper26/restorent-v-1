"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="mt-24 bg-yellow-400 text-black relative overflow-hidden">

            {/* Top Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500" />

            <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">

                    {/* BRAND */}
                    <div className="lg:col-span-4 space-y-5">
                        <h2 className="text-3xl font-black uppercase tracking-tight">
                            My<span className="text-black/60">Pizza</span>
                        </h2>
                        <p className="text-sm opacity-80 leading-relaxed max-w-sm">
                            Delicious pizzas, fast delivery, and best service in town.
                        </p>

                        {/* Social */}
                        <div className="flex gap-3 pt-4">
                            {[
                                { Icon: FaFacebookF },
                                { Icon: FaInstagram },
                                { Icon: FaTwitter },
                                { Icon: FaWhatsapp },
                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-white text-yellow-500 flex items-center justify-center hover:bg-black hover:text-yellow-400 transition-all hover:-translate-y-1 shadow-md"
                                >
                                    <item.Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* QUICK LINKS */}
                    <div className="lg:col-span-2">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8">
                            Quick Links
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { name: "Home", path: "/" },
                                { name: "Menu", path: "/menu" },
                                { name: "Order", path: "/order" },
                                { name: "Booking", path: "/booking" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.path}
                                        className="text-xs font-bold uppercase tracking-widest opacity-70 hover:opacity-100 hover:underline transition"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* SUPPORT */}
                    <div className="lg:col-span-2">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8">
                            Support
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { name: "About Us", path: "/about" },
                                { name: "Contact Us", path: "/contact" },
                                { name: "Privacy Policy", path: "/privacy" },
                                { name: "Terms & Conditions", path: "/terms" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.path}
                                        className="text-xs font-bold uppercase tracking-widest opacity-70 hover:opacity-100 hover:underline transition"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div className="lg:col-span-4">
                        <div className="p-8 rounded-3xl bg-white shadow-xl border border-yellow-500/30">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6">
                                Customer Support
                            </h3>

                            <p className="text-xs font-bold tracking-widest uppercase">
                                📞 +91 98765 43210
                            </p>
                            <p className="text-xs font-bold tracking-widest uppercase mt-2">
                                ✉ support@mypizza.com
                            </p>
                        </div>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="mt-20 pt-8 border-t border-black/20 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-70">
                        © {new Date().getFullYear()} My Pizza. All Rights Reserved.
                    </p>

                    <div className="flex gap-6">
                        {["Visa", "Mastercard", "UPI"].map((item) => (
                            <span
                                key={item}
                                className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
