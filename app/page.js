"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MoveRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function Home() {
  return (
    <div className="bg-background">
      {/* ───── HERO ───── */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80"
            alt="Hero"
            fill
            className="object-cover opacity-40 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <span className="text-accent text-[11px] font-bold tracking-[0.4em] uppercase mb-8 block">New Season Drop</span>
            <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter leading-[0.85] mb-10 font-heading">
              PURE <br />
              <span className="gradient-text italic">AESTHETIC.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted/80 max-w-xl leading-relaxed mb-12 font-medium">
              Curated essentials for the modern pioneer. Experience a new standard of luxury where quality meets timeless design.
            </p>
            <div className="flex flex-wrap gap-8 items-center">
              <Link
                href="/"
                className="px-12 py-5 bg-accent text-background rounded-full font-bold text-xs tracking-[0.2em] hover:scale-105 transition-all shadow-[0_10px_40px_rgba(212,255,63,0.3)]"
              >
                DISCOVER MORE
              </Link>
              <Link href="/" className="group flex items-center gap-3 text-xs font-bold tracking-[0.2em] border-b border-white/20 pb-1">
                LATEST EDIT <MoveRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───── FEATURED ───── */}
      <section className="max-w-[1400px] mx-auto px-6 py-40">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter font-heading">
            CURATED <br />
            <span className="text-accent">HIGHLIGHTS.</span>
          </h2>
          <Link href="/" className="text-xs font-bold tracking-[0.3em] flex items-center gap-2 hover:text-accent transition-colors">
            VIEW ALL <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>


    </div>
  );
}
