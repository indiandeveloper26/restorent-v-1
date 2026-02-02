"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: "Home", href: "/pizza" },
        { name: "Menu", href: "/menu" },
        { name: "Order", href: "/order" },
        { name: "Booking", href: "/booking" },
        { name: "Cart", href: "/cart" },
    ];

    return (
        <nav className="bg-yellow-400 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="text-2xl font-bold">
                        <Link href="/">🍕 My Pizza</Link>
                    </div>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex space-x-6 font-semibold">
                        {navItems.map((item) => (
                            <li key={item.name} className="hover:text-gray-800">
                                <Link href={item.href}>{item.name}</Link>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="focus:outline-none text-black text-xl"
                        >
                            {isOpen ? "✖️" : "☰"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <ul className="md:hidden bg-yellow-300 px-4 py-2 space-y-2 font-semibold">
                    {navItems.map((item) => (
                        <li key={item.name} className="hover:text-gray-800">
                            <Link href={item.href} onClick={() => setIsOpen(false)}>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
}
