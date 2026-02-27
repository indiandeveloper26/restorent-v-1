"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, Phone, LogOut, ClipboardList } from "lucide-react"; // ClipboardList for Orders
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/contextthem";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Context se data nikaalein
    let { userdataaa, logout, loging, cart } = useTheme();

    const handleLogout = () => {
        logout();
    };

    // Base navigation items
    const baseNavItems = [
        { name: "Home", href: "/pizza" },
        { name: "Menulist", href: "/menulist" },

        { name: "Booking", href: "/booking" },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-[100] transition-all duration-300 ${scrolled ? "py-3 bg-yellow-500 shadow-lg" : "py-5 bg-yellow-500"}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2">
                    <motion.div whileHover={{ rotate: 15 }} className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg bg-white text-yellow-500">
                        🍕
                    </motion.div>
                    <div className="flex flex-col leading-none text-white">
                        <span className="text-2xl font-black italic tracking-tighter uppercase">PIZZA<span className="">GO.</span></span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Premium Taste</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-10">
                    {baseNavItems.map((item) => (
                        <Link key={item.name} href={item.href} className={`text-[12px] font-black uppercase tracking-widest text-white relative group`}>
                            {item.name}
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full ${pathname === item.href ? "w-full" : ""}`}></span>
                        </Link>
                    ))}

                    {/* Login / Logout Toggle */}
                    {loging ? (
                        <button onClick={handleLogout} className="text-[12px] font-black uppercase tracking-widest text-yellow-500 flex items-center gap-2   bg-white px-4 py-2 rounded-xl transition-transform active:scale-95">
                            <LogOut size={14} /> Logout
                        </button>
                    ) : (
                        <Link href="/login" className="text-[12px] font-black uppercase tracking-widest text-yellow-500 bg-white px-4 py-2 rounded-xl transition-transform active:scale-95">
                            Login
                        </Link>
                    )}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">

                    {/* MY ORDERS ICON (Hats off to DarkMode) */}
                    {loging && (
                        <Link href="/order" title="My Orders">
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/20 text-white hover:bg-white/30 transition-colors">
                                <ClipboardList size={20} />
                            </div>
                        </Link>
                    )}

                    {/* Cart Icon */}
                    <Link href="/cart" className="relative">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/20 text-white hover:bg-white/30 transition-colors">
                            <ShoppingCart size={20} />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-yellow-500 text-[10px] font-black rounded-full flex items-center justify-center">
                                {Array.isArray(cart) ? cart.length : (cart || 0)}
                            </span>
                        </div>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden ml-2 p-2 rounded-xl bg-white/20 text-white">
                        {isOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]" />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-yellow-500 z-[120] p-8 flex flex-col text-white">
                            <div className="flex justify-between items-center mb-12">
                                <span className="text-3xl font-black italic">MENU.</span>
                                <button onClick={() => setIsOpen(false)} className="p-3 bg-white/20 rounded-2xl text-white"><X size={24} /></button>
                            </div>

                            <div className="flex flex-col gap-6">
                                {baseNavItems.map((item) => (
                                    <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)} className="text-2xl font-black italic tracking-tighter uppercase">{item.name}</Link>
                                ))}

                                {loging && (
                                    <Link href="/my-orders" onClick={() => setIsOpen(false)} className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-2">
                                        My Orders 📋
                                    </Link>
                                )}

                                <div className="h-px bg-white/20 my-2" />

                                {loging ? (
                                    <button onClick={handleLogout} className="text-2xl font-black italic uppercase text-left text-red-200">Logout</button>
                                ) : (
                                    <Link href="/login" onClick={() => setIsOpen(false)} className="text-2xl font-black italic uppercase text-green-200">Login</Link>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}