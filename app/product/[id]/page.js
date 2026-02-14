"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Star, Shield, Truck, RotateCcw } from "lucide-react";
import { products } from "@/data/products";

export default function ProductDetails({ params }) {
    const resolvedParams = use(params);
    const id = parseInt(resolvedParams.id);
    const product = products.find((p) => p.id === id);

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4 font-heading uppercase">Product Not Found</h1>
                    <Link href="/" className="text-accent font-bold tracking-widest hover:underline">RETURN TO SHOP</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6">
            <div className="max-w-[1400px] mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-muted hover:text-accent transition-colors mb-12 group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK TO COLLECTION
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="aspect-[3/4] relative bg-[#111] overflow-hidden rounded-sm"
                    >
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        {product.tag && (
                            <span className="absolute top-6 left-6 bg-background border border-white/10 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase">
                                {product.tag}
                            </span>
                        )}
                    </motion.div>

                    {/* Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col justify-center"
                    >
                        <span className="text-[11px] font-bold text-accent tracking-[0.4em] mb-6 uppercase block">{product.category}</span>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-[0.9] mb-8 font-heading uppercase">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-10">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={14} className="fill-accent text-accent" />
                                ))}
                            </div>
                            <span className="text-xs font-bold text-muted uppercase tracking-widest">4.9 (124 reviews)</span>
                        </div>

                        <p className="text-lg text-muted/80 leading-relaxed mb-12 max-w-lg font-medium">
                            The {product.name} embodies the zenith of contemporary luxury. Meticulously engineered with rare materials, it offers an unparalleled tactile experience and aesthetic presence for the discerning collector.
                        </p>

                        <div className="text-4xl font-bold font-heading mb-12">${product.price}</div>

                        <div className="flex flex-col sm:flex-row gap-6 mb-16">
                            <button className="flex-1 py-5 bg-accent text-background rounded-full font-bold text-xs tracking-[0.2em] uppercase hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(212,255,63,0.2)] flex items-center justify-center gap-3">
                                <ShoppingBag size={18} /> ADD TO CART
                            </button>
                            <button className="flex-1 py-5 border border-white/10 text-white rounded-full font-bold text-xs tracking-[0.2em] uppercase hover:bg-white/5 transition-all">
                                WISHLIST
                            </button>
                        </div>

                        {/* Guarantees */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-t border-white/5">
                            <div className="flex flex-col items-center sm:items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center text-accent">
                                    <Shield size={18} />
                                </div>
                                <p className="text-[9px] font-bold tracking-[0.2em] text-muted uppercase text-center sm:text-left">Life Authenticity Guarantee</p>
                            </div>
                            <div className="flex flex-col items-center sm:items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center text-accent">
                                    <Truck size={18} />
                                </div>
                                <p className="text-[9px] font-bold tracking-[0.2em] text-muted uppercase text-center sm:text-left">Priority Global Express</p>
                            </div>
                            <div className="flex flex-col items-center sm:items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center text-accent">
                                    <RotateCcw size={18} />
                                </div>
                                <p className="text-[9px] font-bold tracking-[0.2em] text-muted uppercase text-center sm:text-left">30-Day Bespoke Returns</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
