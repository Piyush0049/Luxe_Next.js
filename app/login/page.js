"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, Sparkles, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { useGoogleLogin } from '@react-oauth/google';

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

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            setError("");
            try {
                const response = await api.post("/users/google-login", {
                    access_token: tokenResponse.access_token
                });

                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                window.dispatchEvent(new Event("auth-change"));
                router.push("/");
            } catch (err) {
                console.error("Google login error:", err);
                setError("Google login failed. Please try again.");
            } finally {
                setLoading(false);
            }
        },
        onError: (error) => {
            console.log('Login Failed', error);
            setError("Google Login Failed");
        }
    });

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

            // Notify application of auth change
            window.dispatchEvent(new Event("auth-change"));

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

                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center">
                        <p className="text-[10px] font-bold tracking-[0.2em] text-muted/40 uppercase mb-4">Or continue with</p>
                        <button
                            type="button"
                            onClick={() => loginWithGoogle()}
                            disabled={loading}
                            className="w-full py-4 bg-white/5 border border-white/10 rounded-full font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span>Google Account</span>
                        </button>
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

