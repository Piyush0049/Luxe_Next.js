"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function ProductCard({ product }) {
    return (
        <div className="group relative">
            <Link href={`/product/${product.id}`} className="aspect-[3/4] overflow-hidden bg-[#111] mb-5 relative block">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                />
                {product.tag && (
                    <span className="absolute top-4 left-4 bg-background border border-white/10 px-3 py-1 text-[8px] font-bold tracking-[0.2em]">
                        {product.tag}
                    </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-accent transition-colors scale-90 group-hover:scale-100 duration-500">
                        <Plus size={20} />
                    </div>
                </div>
            </Link>
            <div>
                <span className="text-[9px] font-bold text-muted tracking-[0.2em] mb-2 block uppercase">{product.category}</span>
                <h3 className="text-sm font-bold tracking-tight mb-2 truncate font-heading">{product.name}</h3>
                <span className="text-base font-bold font-heading">${product.price}</span>
            </div>
        </div>
    );
}
