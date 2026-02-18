"use client";

import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ChevronRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { removeFromCart, updateQuantity, clearCart } from "@/store/features/cartSlice";
import Navbar from "@/components/Navbar";

export default function CartPage() {
    const { items, totalAmount, totalQuantity } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleUpdateQuantity = (id, quantity) => {
        if (quantity >= 1) {
            dispatch(updateQuantity({ id, quantity }));
        }
    };

    const handleRemoveItem = (id) => {
        dispatch(removeFromCart(id));
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="pt-40 pb-20 px-6 flex flex-col items-center justify-center min-h-[70vh]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="w-24 h-24 bg-zinc-900 border border-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                            <ShoppingBag size={40} className="text-zinc-700" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter mb-6">Your Vault is Empty</h1>
                        <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] mb-12">Discover our latest masterpieces to fill your collection.</p>
                        <Link href="/shop" className="px-12 py-5 bg-accent text-background font-black tracking-[0.3em] text-[10px] uppercase rounded-full hover:scale-105 transition-all shadow-[0_20px_40px_rgba(212,255,63,0.2)]">
                            Explore Collection
                        </Link>
                    </motion.div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-zinc-100">
            <Navbar />

            <main className="pt-40 pb-32 px-6">
                <div className="max-w-[1400px] mx-auto">
                    <header className="mb-20">
                        <Link href="/shop" className="inline-flex items-center gap-3 text-[9px] font-black tracking-[0.4em] text-zinc-500 hover:text-white transition-all mb-8 uppercase group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Continue Browsing
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter uppercase text-white">Your <span className="text-accent italic">Selection.</span></h1>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        {/* Cart Items List */}
                        <div className="lg:col-span-8 space-y-8">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-center group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        {/* Image */}
                                        <div className="w-full sm:w-40 aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden bg-zinc-800 border border-white/5 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-grow flex flex-col justify-between py-2 truncate text-center sm:text-left">
                                            <div>
                                                <span className="text-accent text-[9px] font-black tracking-[0.3em] uppercase mb-2 block">{item.category}</span>
                                                <h3 className="text-2xl font-heading font-black uppercase text-white mb-2 truncate">{item.name}</h3>
                                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Art. No {item.id}821</p>
                                            </div>
                                            <div className="mt-6 flex items-center justify-center sm:justify-start gap-8">
                                                <div className="text-xl font-heading font-medium text-accent">₹{Number(item.price).toLocaleString('en-IN')}</div>
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex flex-col items-center sm:items-end justify-between gap-6 sm:gap-0 h-full py-2">
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="p-3 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-all text-zinc-600 border border-white/5"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl p-2 gap-4">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-zinc-800 transition-all"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-black w-6 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-zinc-800 transition-all"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary Summary */}
                        <div className="lg:col-span-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-10 sticky top-32"
                            >
                                <h2 className="text-2xl font-heading font-black uppercase tracking-tighter text-white mb-10">Order Summary</h2>

                                <div className="space-y-6 mb-10 pb-10 border-b border-white/5">
                                    <SummaryItem label="Subtotal" value={`₹${totalAmount.toLocaleString('en-IN')}`} />
                                    <SummaryItem label="White Glove Delivery" value="COMPLIMENTARY" highlight />
                                    <SummaryItem label="VAT & Duties" value="INCLUSIVE" />
                                </div>

                                <div className="flex items-end justify-between mb-12">
                                    <p className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">Total Investment</p>
                                    <p className="text-4xl font-heading font-black text-accent tracking-tighter">₹{totalAmount.toLocaleString('en-IN')}</p>
                                </div>

                                <button
                                    onClick={() => router.push("/checkout")}
                                    className="w-full py-6 bg-accent text-background rounded-2xl font-black text-xs tracking-[0.4em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(212,255,63,0.2)] flex items-center justify-center gap-3 mb-6"
                                >
                                    Proceed to Checkout <ChevronRight size={20} />
                                </button>

                                <div className="grid grid-cols-1 gap-6 pt-10 border-t border-white/5">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center text-accent">
                                            <ShieldCheck size={18} />
                                        </div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-300 transition-colors">Secured Master Transaction</p>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center text-accent">
                                            <Truck size={18} />
                                        </div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-300 transition-colors">Insured Global Logistics</p>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center text-accent">
                                            <RotateCcw size={18} />
                                        </div>
                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-300 transition-colors">30-Day Bespoke Returns</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SummaryItem({ label, value, highlight }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[9px] font-black tracking-[0.3em] uppercase text-zinc-500">{label}</span>
            <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${highlight ? 'text-accent' : 'text-zinc-200'}`}>{value}</span>
        </div>
    );
}
