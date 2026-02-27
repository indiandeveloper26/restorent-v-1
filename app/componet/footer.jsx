"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="mt-24 bg-yellow-400 text-black relative overflow-hidden">

            {/* Top Accent Line - Light White/Yellow mix */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />

            <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">

                    {/* BRAND SECTION */}
                    <div className="lg:col-span-4 space-y-5">
                        <h2 className="text-3xl font-black uppercase tracking-tight text-white drop-shadow-sm">
                            MyPizza
                        </h2>
                        <p className="text-sm font-bold leading-relaxed max-w-sm text-black/80">
                            Delicious pizzas, fast delivery, and best service in town. Freshly baked just for you.
                        </p>

                        {/* Social Icons - Ab poore White hain */}
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
                                    className="w-10 h-10 rounded-full bg-white text-yellow-500 flex items-center justify-center hover:bg-white/90 transition-all hover:-translate-y-1 shadow-md border border-white"
                                >
                                    <item.Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* QUICK LINKS */}
                    <div className="lg:col-span-2">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 border-b border-white/40 pb-2 inline-block text-white">
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
                                        className="text-xs font-black uppercase tracking-widest text-black/70 hover:text-white transition-all"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* SUPPORT SECTION */}
                    <div className="lg:col-span-2">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 border-b border-white/40 pb-2 inline-block text-white">
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
                                        className="text-xs font-black uppercase tracking-widest text-black/70 hover:text-white transition-all"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CONTACT CARD - White Background, No Black */}
                    <div className="lg:col-span-4">
                        <div className="p-8 rounded-[2rem] bg-white shadow-lg border border-white/50">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-yellow-500">
                                Customer Support
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                        📞
                                    </div>
                                    <p className="text-xs font-black tracking-widest uppercase text-black">
                                        +91 98765 43210
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                        ✉
                                    </div>
                                    <p className="text-xs font-black tracking-widest uppercase text-black">
                                        support@mypizza.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM BAR - Light dividers */}
                <div className="mt-20 pt-8 border-t border-white/30 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-black/60">
                        © {new Date().getFullYear()} My Pizza. All Rights Reserved.
                    </p>

                    <div className="flex gap-6">
                        {["Visa", "Mastercard", "UPI"].map((item) => (
                            <span
                                key={item}
                                className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/40 px-3 py-1 rounded-full text-black/70"
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