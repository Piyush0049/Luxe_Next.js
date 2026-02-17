"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, Sparkles, Loader2 } from "lucide-react";
import api from "@/lib/axios";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
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
            const response = await api.post("/users/login", formData);
            console.log("Login success:", response.data);

            // Store token and user data
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            router.push("/"); // Redirect to home
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.error || "Invalid credentials. Please try again.");
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
                        Welcome <span className="text-accent italic">Back.</span>
                    </h1>
                    <p className="text-muted text-sm font-medium">
                        Enter your credentials to access your luxury account.
                    </p>
                </div>

                <div className="bg-[#0a0a0c] border border-white/5 p-8 rounded-3xl shadow-2xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-wider text-center">
                                {error}
                            </div>
                        )}
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
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-bold tracking-[0.2em] text-muted uppercase">Password</label>
                                <Link href="#" className="text-[10px] font-bold tracking-[0.2em] text-accent hover:underline uppercase">Forgot?</Link>
                            </div>
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-accent text-background rounded-full font-bold text-xs tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(212,255,63,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-xs text-muted font-medium mb-4">Or continue with</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="py-3 px-4 bg-background border border-white/5 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-white/5 transition-colors">Google</button>
                            <button className="py-3 px-4 bg-background border border-white/5 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-white/5 transition-colors">Apple</button>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-muted font-medium">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-accent font-bold hover:underline">CREATE ACCOUNT</Link>
                </p>

                <div className="mt-12 flex items-center justify-center gap-2 text-[9px] font-bold tracking-[0.3em] text-muted/40 uppercase">
                    <Sparkles size={10} />
                    Encrypted & Secure Session
                </div>
            </motion.div>
        </div>
    );
}

