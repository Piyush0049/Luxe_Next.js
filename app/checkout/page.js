"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, CreditCard, Truck, MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import { clearCart } from "@/store/features/cartSlice";
import Navbar from "@/components/Navbar";

export default function CheckoutPage() {
    const { items, totalAmount } = useSelector((state) => state.cart);
    const router = useRouter();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({
        address: "",
        city: "",
        zipCode: "",
        phone: ""
    });

    useEffect(() => {
        if (items.length === 0) {
            router.push("/shop");
        }
    }, [items, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const resScript = await loadRazorpay();
            if (!resScript) {
                alert("Razorpay SDK failed to load. Are you online?");
                setLoading(false);
                return;
            }

            // 1. Create order on backend
            const { data: orderData } = await api.post("/payments/create-order", {
                amount: totalAmount,
                items: items
            });

            // 2. Open Razorpay Modal
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "", // Will be provided by user
                amount: orderData.amount,
                currency: orderData.currency,
                name: "LUXE.",
                description: "Masterpiece Purchase",
                order_id: orderData.orderId,
                handler: async function (response) {
                    try {
                        // 3. Verify payment on backend
                        const { data: verifyData } = await api.post("/payments/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyData.success) {
                            dispatch(clearCart());
                            router.push(`/payment-success?id=${verifyData.orderId}`);
                        }
                    } catch (err) {
                        console.error("Verification failed", err);
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: "User Name",
                    email: "user@example.com",
                    contact: shippingDetails.phone
                },
                theme: {
                    color: "#d4ff3f"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Checkout error:", error);
            if (error.response && error.response.status === 400) {
                alert(error.response.data.error || "Some items are unavailable.");
                dispatch(clearCart());
                router.push("/shop");
            } else {
                alert("Failed to initiate checkout. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-zinc-100">
            <Navbar />
            <main className="pt-40 pb-32 px-6">
                <div className="max-w-[1200px] mx-auto">
                    <Link href="/cart" className="inline-flex items-center gap-3 text-[9px] font-black tracking-[0.4em] text-zinc-500 hover:text-white transition-all mb-12 uppercase group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Back to Selection
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        {/* Shipping Form */}
                        <div className="lg:col-span-7">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-10"
                            >
                                <h2 className="text-3xl font-heading font-black uppercase tracking-tighter text-white mb-10 flex items-center gap-4">
                                    <MapPin size={28} className="text-accent" /> Shipping Details
                                </h2>

                                <form onSubmit={handleCheckout} className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 ml-4">Delivery Address</label>
                                        <textarea
                                            name="address"
                                            required
                                            value={shippingDetails.address}
                                            onChange={handleInputChange}
                                            placeholder="Enter your residence address"
                                            className="w-full bg-black border border-white/10 rounded-2xl p-6 text-sm focus:border-accent outline-none min-h-[120px] transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 ml-4">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                value={shippingDetails.city}
                                                onChange={handleInputChange}
                                                placeholder="City"
                                                className="w-full bg-black border border-white/10 rounded-2xl p-6 text-sm focus:border-accent outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 ml-4">Zip Code</label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                required
                                                value={shippingDetails.zipCode}
                                                onChange={handleInputChange}
                                                placeholder="Zip Code"
                                                className="w-full bg-black border border-white/10 rounded-2xl p-6 text-sm focus:border-accent outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 ml-4">Contact Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={shippingDetails.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 00000 00000"
                                            className="w-full bg-black border border-white/10 rounded-2xl p-6 text-sm focus:border-accent outline-none transition-all"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-6 bg-accent text-background rounded-2xl font-black text-xs tracking-[0.4em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(212,255,63,0.2)] flex items-center justify-center gap-3"
                                    >
                                        {loading ? <Loader2 size={20} className="animate-spin" /> : <><CreditCard size={20} /> Secure Final Payment</>}
                                    </button>
                                </form>
                            </motion.div>
                        </div>

                        {/* Order Recap */}
                        <div className="lg:col-span-5">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-10 sticky top-32"
                            >
                                <h2 className="text-2xl font-heading font-black uppercase tracking-tighter text-white mb-8">Investment Audit</h2>

                                <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-6 items-center border-b border-white/5 pb-6">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0">
                                                <img src={item.image} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">{item.name}</h4>
                                                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-xs font-black text-accent">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 mb-10">
                                    <div className="flex justify-between text-[10px] font-black tracking-widest uppercase text-zinc-500">
                                        <span>Subtotal</span>
                                        <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black tracking-widest uppercase text-accent">
                                        <span>Delivery</span>
                                        <span>COMPLIMENTARY</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-heading font-black uppercase text-white pt-4 border-t border-white/5">
                                        <span className="tracking-tighter">Total</span>
                                        <span className="text-accent">₹{totalAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <TrustBadge icon={<ShieldCheck size={18} />} label="Encrypted Infrastructure" />
                                    <TrustBadge icon={<Truck size={18} />} label="Insured White Glove Delivery" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function TrustBadge({ icon, label }) {
    return (
        <div className="flex items-center gap-4 group px-4 py-3 bg-black/40 rounded-2xl border border-white/5">
            <div className="text-accent">{icon}</div>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-300 transition-colors">{label}</span>
        </div>
    );
}

function Loader2({ size, className }) {
    return (
        <span className={`animate-spin ${className}`}>
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.1" />
                <path d="M12 4C7.58172 4 4 7.58172 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </span>
    );
}
