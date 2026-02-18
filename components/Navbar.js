"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Search, Menu, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();
    const cartItems = useSelector((state) => state.cart.totalQuantity);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            const userData = localStorage.getItem("user");
            setIsLoggedIn(!!token);
            if (userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (e) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkAuth();

        // Listen for storage events (multi-tab support)
        window.addEventListener("storage", checkAuth);

        // Listen for custom "auth-change" event for same-tab updates
        window.addEventListener("auth-change", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
            window.removeEventListener("auth-change", checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
        window.dispatchEvent(new Event("auth-change"));
        router.push("/login");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/50 premium-blur border-b border-white/5 py-6">
            <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
                <div className="flex gap-8 items-center">
                    <button className="lg:hidden text-foreground">
                        <Menu size={20} />
                    </button>
                    <div className="hidden lg:flex gap-8 items-center">
                        <Link href="/shop" className="text-[10px] font-bold tracking-[0.3em] hover:text-accent transition-colors">SHOP</Link>
                        <Link href="/" className="text-[10px] font-bold tracking-[0.3em] hover:text-accent transition-colors">COLLECTIONS</Link>

                        {!isLoggedIn ? (
                            <>
                                <Link href="/login" className="text-[10px] font-bold tracking-[0.3em] hover:text-accent transition-colors">LOGIN</Link>
                                <Link href="/signup" className="text-[10px] font-bold tracking-[0.3em] hover:text-accent transition-colors">SIGN UP</Link>
                            </>
                        ) : null}
                    </div>
                </div>

                <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                    <span className="text-xl font-bold tracking-tight font-heading">LUX<span className="text-accent">E.</span></span>
                </Link>

                <div className="flex gap-6 items-center">
                    {isLoggedIn && (
                        <div className="flex items-center gap-4">
                            <Link href="/profile" className="text-foreground/70 hover:text-accent transition-colors flex items-center gap-2">
                                <User size={18} />
                                <span className="text-[8px] font-bold tracking-widest uppercase hidden sm:inline">
                                    {user?.name || "PROFILE"}
                                </span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-foreground/70 hover:text-red-400 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    )}

                    <Link href="/cart" className="text-foreground/70 hover:text-accent transition-colors relative">
                        <ShoppingBag size={18} />
                        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-accent text-[8px] font-bold text-background rounded-full flex items-center justify-center">
                            {cartItems}
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
