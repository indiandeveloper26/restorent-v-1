"use client";

import { useTheme } from "../Redux/contextapi";

export default function ProductSkeletonCard() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Reusable Shimmer Component for consistency
    const Shimmer = ({ className }) => (
        <div className={`relative overflow-hidden rounded-2xl ${isDark ? "bg-gray-800" : "bg-gray-200"} ${className}`}>
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );

    return (
        <div className={`
            rounded-[2.5rem] p-5 border transition-all duration-500
            ${isDark ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-100 shadow-sm"}
        `}>
            {/* Image Placeholder - Large Radius */}
            <div className={`relative h-64 w-full rounded-[2rem] overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Content Details */}
            <div className="mt-6 space-y-4 px-2">
                {/* Brand/Category Tag */}
                <Shimmer className="h-3 w-20" />

                {/* Title - Double Line */}
                <div className="space-y-2">
                    <Shimmer className="h-6 w-full" />
                    <Shimmer className="h-6 w-2/3" />
                </div>

                {/* Pricing Area */}
                <div className="flex justify-between items-center pt-2">
                    <Shimmer className="h-8 w-24" />
                    <Shimmer className="h-10 w-10 rounded-xl" />
                </div>

                {/* Bottom Button */}
                <div className={`mt-4 h-14 w-full rounded-2xl border-2 border-dashed ${isDark ? "border-gray-800" : "border-gray-200"}`} />
            </div>
        </div>
    );
}

// To use this as a grid loader:
export function SkeletonGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
                <ProductSkeletonCard key={i} />
            ))}
        </div>
    );
}