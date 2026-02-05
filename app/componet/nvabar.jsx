"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Moon, Sun, Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/pizza" },
        { name: "Menu", href: "/menu" },
        { name: "Order", href: "/order" },
        { name: "Booking", href: "/booking" },
        { name: "login", href: "/login" },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-[100] transition-all duration-300 ${scrolled ? "py-3 bg-yellow-500 shadow-lg" : "py-5 bg-yellow-500"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <motion.div
                        whileHover={{ rotate: 15 }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg bg-white text-yellow-500"
                    >
                        🍕
                    </motion.div>
                    <div className="flex flex-col leading-none">
                        <span className="text-2xl font-black italic tracking-tighter uppercase text-white">
                            PIZZA<span className="text-white">GO.</span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                            Premium Taste
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-10">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`text-[12px] font-black uppercase tracking-widest text-white relative group ${pathname === item.href ? "text-white" : ""
                                }`}
                        >
                            {item.name}
                            <span
                                className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full ${pathname === item.href ? "w-full" : ""
                                    }`}
                            ></span>
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/20 text-white"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Cart */}
                    <Link href="/cart" className="relative">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/20 text-white">
                            <ShoppingCart size={20} />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-yellow-500 text-[10px] font-black rounded-full flex items-center justify-center">
                                3
                            </span>
                        </div>
                    </Link>

                    {/* Mobile Menu */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden ml-2 p-2 rounded-xl bg-white/20 text-white"
                    >
                        {isOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-yellow-500 z-[120] p-8 flex flex-col text-white"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <span className="text-3xl font-black italic">MENU<span className="text-white">.</span></span>
                                <button onClick={() => setIsOpen(false)} className="p-3 bg-white/20 rounded-2xl text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-6">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-2xl font-black italic tracking-tighter uppercase hover:text-white/80 transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-auto pt-10 flex flex-col gap-4">
                                <div className="flex items-center gap-4 text-white font-bold uppercase tracking-widest text-xs">
                                    <Phone size={16} /> +91 98765 43210
                                </div>
                                <Link
                                    href="/order"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-5 bg-white/20 text-white text-center rounded-3xl font-black uppercase tracking-widest shadow-lg"
                                >
                                    Order Now 🍕
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
