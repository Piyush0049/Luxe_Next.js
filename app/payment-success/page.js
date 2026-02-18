"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, ArrowRight, Share2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push(`/profile?tab=orders&orderId=${orderId}`);
        }, 2000);
        return () => clearTimeout(timer);
    }, [router, orderId]);

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="w-32 h-32 bg-accent/20 rounded-full flex items-center justify-center mb-12 relative"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute inset-0 bg-accent/40 rounded-full blur-2xl"
                />
                <CheckCircle2 size={64} className="text-accent relative z-10" />
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter text-white mb-6"
            >
                Piece <span className="text-accent italic">Acquired.</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] mb-12 max-w-md mx-auto leading-loose"
            >
                Transaction successful. Your masterpiece has been reserved and is now being prepared for white-glove transit.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="bg-zinc-900 border border-white/5 rounded-3xl p-8 mb-16 w-full max-w-sm"
            >
                <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase text-zinc-500 mb-2">
                    <span>Order Reference</span>
                    <span className="text-white">#{orderId || "PENDING"}</span>
                </div>
                <div className="h-[1px] bg-white/5 my-4"></div>
                <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase text-zinc-500">
                    <span>Status</span>
                    <span className="text-accent">Authenticity Guaranteed</span>
                </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/shop" className="px-10 py-5 bg-accent text-background font-black tracking-[0.3em] text-[10px] uppercase rounded-full hover:scale-105 transition-all flex items-center gap-3">
                    Back to Gallery <ShoppingBag size={16} />
                </Link>
                <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black tracking-[0.3em] text-[10px] uppercase rounded-full hover:bg-white/10 transition-all flex items-center gap-3">
                    Share Acquisition <Share2 size={16} />
                </button>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-40 pb-20 px-6 max-w-[1400px] mx-auto min-h-[80vh] flex items-center justify-center">
                <Suspense fallback={<div className="text-accent font-black tracking-widest uppercase text-[10px]">Verifying Transaction...</div>}>
                    <SuccessContent />
                </Suspense>
            </main>
        </div>
    );
}
