"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/50 premium-blur border-b border-white/5 py-6">
            <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
                <div className="flex gap-8 items-center">
                    <button className="lg:hidden text-foreground">
                        <Menu size={20} />
                    </button>
                    <div className="hidden lg:flex gap-8">
                        <Link href="/shop" className="text-[10px] font-bold tracking-[0.3em] hover:text-accent transition-colors">SHOP</Link>
                        <Link href="/" className="text-[10px] font-bold tracking-[0.3em] hover:text-accent transition-colors">COLLECTIONS</Link>
                        <Link href="/login" className="text-[10px] font-bold tracking-[0.3em] hover:text-accent transition-colors">LOGIN</Link>
                        <Link href="/signup" className="text-[10px] font-bold tracking-[0.3em] hover:text-accent transition-colors">SIGN UP</Link>
                    </div>
                </div>

                <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                    <span className="text-xl font-bold tracking-tight font-heading">LUX<span className="text-accent">E.</span></span>
                </Link>

                <div className="flex gap-6 items-center">
                    <button className="text-foreground/70 hover:text-accent transition-colors">
                        <Search size={18} />
                    </button>
                    <button className="text-foreground/70 hover:text-accent transition-colors relative">
                        <ShoppingBag size={18} />
                        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-accent text-[8px] font-bold text-background rounded-full flex items-center justify-center">
                            0
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
