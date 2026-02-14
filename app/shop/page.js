"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { SlidersHorizontal } from "lucide-react";

export default function ShopPage() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6">
            <div className="max-w-[1400px] mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-2xl"
                    >
                        <span className="text-accent text-[11px] font-bold tracking-[0.4em] uppercase mb-4 block">Store</span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter font-heading uppercase">
                            The <br /><span className="text-accent italic">Collection.</span>
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-6"
                    >
                        <div className="flex gap-4">
                            {["ALL", "FURNITURE", "FASHION", "ACCESSORIES"].map(cat => (
                                <button key={cat} className="text-[10px] font-bold tracking-[0.2em] text-muted hover:text-accent transition-colors uppercase py-2">
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <button className="flex items-center gap-2 p-4 border border-white/10 rounded-full hover:border-accent/40 transition-colors">
                            <SlidersHorizontal size={16} />
                            <span className="text-[10px] font-bold tracking-widest uppercase px-2">Filters</span>
                        </button>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {products.map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <ProductCard product={p} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
