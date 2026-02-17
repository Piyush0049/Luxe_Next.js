"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, User, Sparkles, Loader2 } from "lucide-react";
import api from "@/lib/axios";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/users/signup", formData);
            console.log("Signup success:", response.data);
            router.push("/login");
        } catch (err) {
            console.error("Signup error:", err);
            setError(err.response?.data?.error || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-20 px-6 sm:px-8 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[100px] animate-float" />
            <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-md w-full mx-auto relative z-10"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block mb-8 group">
                        <span className="text-2xl font-extrabold tracking-[-0.05em] uppercase font-heading">
                            LUX<span className="text-accent">E.</span>
                        </span>
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tighter uppercase font-heading mb-3">
                        Join the <span className="text-accent italic">Elite.</span>
                    </h1>
                    <p className="text-muted text-sm font-medium">
                        Create your account to start your premium journey.
                    </p>
                </div>

                <div className="bg-[#0a0a0c] border border-white/5 p-8 rounded-3xl shadow-2xl">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-wider text-center">
                                {error}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold tracking-[0.2em] text-muted uppercase px-1">Full Name</label>
                            <div className="relative group">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full bg-background border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all placeholder:text-muted/40 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold tracking-[0.2em] text-muted uppercase px-1">Email Address</label>
                            <div className="relative group">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    className="w-full bg-background border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all placeholder:text-muted/40 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold tracking-[0.2em] text-muted uppercase px-1">Password</label>
                            <div className="relative group">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-background border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all placeholder:text-muted/40 font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 px-1 py-2">
                            <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-white/10 bg-background text-accent focus:ring-accent/20" />
                            <p className="text-[10px] text-muted leading-relaxed uppercase tracking-wider font-medium">
                                I agree to the <span className="text-white">Terms of Service</span> and <span className="text-white">Privacy Policy</span>.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-accent text-background rounded-full font-bold text-xs tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(212,255,63,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <>Get Started <ArrowRight size={16} /></>}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-xs text-muted font-medium">
                    Already have an account?{" "}
                    <Link href="/login" className="text-accent font-bold hover:underline">SIGN IN</Link>
                </p>

                <div className="mt-12 flex items-center justify-center gap-2 text-[9px] font-bold tracking-[0.3em] text-muted/40 uppercase">
                    <Sparkles size={10} />
                    Join 50k+ Members Worldwide
                </div>
            </motion.div>
        </div>
    );
}

