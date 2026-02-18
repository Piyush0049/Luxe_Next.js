"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Check, Heart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/features/cartSlice";
import { useState } from "react";
import api from "@/lib/axios";

export default function ProductCard({ product }) {
    const dispatch = useDispatch();
    const [added, setAdded] = useState(false);

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();

        dispatch(addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: 1
        }));

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="group relative">
            <Link href={`/product/${product.id}`} className="aspect-[3/4] overflow-hidden bg-[#111] mb-5 relative block rounded-2xl border border-white/5">
                <img
                    src={product.image || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop'}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop';
                    }}
                />
                {product.tag && (
                    <span className="absolute top-4 left-4 bg-background border border-white/10 px-3 py-1 text-[8px] font-bold tracking-[0.2em]">
                        {product.tag}
                    </span>
                )}

                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <button
                        onClick={handleQuickAdd}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 transform ${added ? 'bg-green-500 scale-110' : 'bg-white text-black hover:bg-accent hover:scale-110'
                            } scale-90 group-hover:scale-100`}
                    >
                        {added ? <Check size={24} className="text-white" /> : <Plus size={24} />}
                    </button>

                    <div className="absolute bottom-6 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                        <span className="text-[8px] font-black tracking-[0.4em] uppercase text-white premium-blur px-4 py-2 rounded-full border border-white/10">
                            Quick Reserve
                        </span>
                    </div>
                </div>

            </Link>

            <div className="px-1">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black text-zinc-500 tracking-[0.3em] uppercase">{product.category}</span>
                    <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">In Stock</span>
                </div>
                <h3 className="text-lg font-heading font-black tracking-tight mb-2 truncate text-white uppercase">{product.name}</h3>
                <div className="flex items-center gap-4">
                    <span className="text-xl font-heading font-medium text-accent">₹{Number(product.price).toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>
    );
}
