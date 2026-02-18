"use client";

import { useEffect, useState, use } from "react";
import Link from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
    ArrowLeft, ShoppingBag, Star, Shield, Truck, RotateCcw,
    Loader2, Heart, Share2, Plus, Minus, Check, ChevronRight,
    Sparkles, Info, Eye, MessageSquare
} from "lucide-react";
import api from "@/lib/axios";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/features/cartSlice";

export default function ProductDetails({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();
    const dispatch = useDispatch();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [activeTab, setActiveTab] = useState("description");

    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const { scrollYProgress } = useScroll();
    const backgroundOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

    const fallbackImage = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop';

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/products/${id}`);
            const data = response.data;
            setProduct(data);

            const user = JSON.parse(localStorage.getItem("user"));
            if (user) {
                const existingReview = data.reviews?.find(r => r.userId === user.id);
                if (existingReview) setUserRating(existingReview.rating);
            }

            if (data.category) {
                const relatedResponse = await api.get(`/products?category=${data.category}`);
                setRelatedProducts(relatedResponse.data.filter(p => p.id !== data.id).slice(0, 4));
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRating = async (rating) => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        setUserRating(rating);
        setIsSubmittingRating(true);
        try {
            await api.post("/reviews", {
                productId: id,
                rating: rating,
                comment: ""
            });
            fetchProduct();
        } catch (error) {
            console.error("Error submitting rating:", error);
        } finally {
            setIsSubmittingRating(false);
        }
    };

    const handleAddToCart = () => {
        dispatch(addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: quantity
        }));
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-2 border-accent/20 rounded-full"></div>
                        <div className="absolute top-0 w-16 h-16 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-accent ml-2">Unlocking the vault</span>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-6xl font-heading font-black mb-6 uppercase tracking-tighter text-white">404</h1>
                    <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] mb-12">Piece not found in collection</p>
                    <button onClick={() => router.push("/shop")} className="px-12 py-5 bg-accent text-background font-black tracking-[0.3em] text-[10px] uppercase rounded-full hover:scale-105 transition-all">
                        Return to Shop
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-zinc-100">
            <Navbar />

            <main className="pt-32 pb-32">
                <section className="px-6 mb-32">
                    <div className="max-w-[1400px] mx-auto">
                        <button onClick={() => router.push("/shop")} className="inline-flex items-center gap-3 text-[9px] font-black tracking-[0.4em] text-zinc-500 hover:text-white transition-all mb-16 uppercase group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Back to Collection
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
                            <div className="lg:col-span-7 space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 group"
                                >
                                    <img
                                        src={product.image || fallbackImage}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                                        onError={(e) => { e.target.src = fallbackImage; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent opacity-60"></div>

                                    <div className="absolute bottom-10 left-10 flex gap-4">
                                        <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                                            <span className="text-[8px] font-black tracking-[0.3em] uppercase">Limited Reserve</span>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="absolute top-8 right-8 w-14 h-14 bg-background/50 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white hover:text-accent transition-colors"
                                    >
                                        <Heart size={20} />
                                    </motion.button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar"
                                >
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className={`flex-shrink-0 w-32 h-32 rounded-3xl overflow-hidden border ${i === 1 ? 'border-accent shadow-[0_0_20px_rgba(212,255,63,0.1)]' : 'border-white/5'} bg-zinc-900 cursor-pointer group`}>
                                            <img
                                                src={product.image || fallbackImage}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                                                alt=""
                                                onError={(e) => { e.target.src = fallbackImage; }}
                                            />
                                        </div>
                                    ))}
                                </motion.div>
                            </div>

                            <div className="lg:col-span-5 pt-8 overflow-hidden">
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <div className="flex items-center gap-3 mb-8">
                                        <span className="px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-[9px] font-black tracking-[0.3em] text-accent uppercase">{product.category}</span>
                                        <div className="h-[1px] w-12 bg-white/10"></div>
                                        <span className="text-[9px] font-black tracking-[0.3em] text-zinc-500 uppercase">Art. No {product.id}821</span>
                                    </div>

                                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-black tracking-tighter leading-[0.9] mb-10 uppercase text-white break-words">
                                        {product.name}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-8 mb-12">
                                        <div className="text-4xl lg:text-5xl font-heading font-medium tracking-tight text-accent">₹{Number(product.price).toLocaleString('en-IN')}</div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <motion.div
                                                        key={star}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        onClick={() => handleRating(star)}
                                                        className="cursor-pointer"
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Star
                                                            size={16}
                                                            className={`${(hoverRating || userRating || product.avgRating) >= star
                                                                ? "fill-accent text-accent"
                                                                : "text-zinc-700"
                                                                } transition-colors`}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                                                {product.avgRating?.toFixed(1) || "0.0"} / 5.0 Rating ({product.totalReviews || 0} reviews)
                                            </span>
                                            {!isAuthenticated && (
                                                <span className="text-[7px] text-accent/50 uppercase tracking-widest">Login to rate this piece</span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-xl text-zinc-400 font-medium leading-relaxed mb-16 max-w-xl italic">
                                        "{product.description || `Exquisitely crafted to transcend temporal boundaries, the ${product.name} serves as a definitive statement of luxury and artisanal heritage.`}"
                                    </p>

                                    <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 mb-16 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] rounded-full"></div>

                                        <div className="flex items-center justify-between mb-8">
                                            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400">Availability</span>
                                            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-accent">
                                                {product.stock > 0 ? `${product.stock} pieces in vault` : "Exhausted from vault"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="flex items-center bg-black border border-white/10 rounded-2xl p-2 gap-4">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-accent hover:text-background transition-all"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-black w-6 text-center">{quantity}</span>
                                                <button
                                                    onClick={() => setQuantity(quantity + 1)}
                                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-accent hover:text-background transition-all"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] leading-tight flex-1">
                                                Bespoke shipping included <br /> across the continent
                                            </div>
                                        </div>

                                        <AnimatePresence mode="wait">
                                            {!addedToCart ? (
                                                <motion.button
                                                    key="reserve"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    onClick={handleAddToCart}
                                                    disabled={product.stock === 0}
                                                    className="w-full py-6 bg-accent text-background rounded-2xl font-black text-xs tracking-[0.4em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(212,255,63,0.2)] flex items-center justify-center gap-3 group/btn"
                                                >
                                                    <ShoppingBag size={20} className="group-hover/btn:rotate-12 transition-transform" /> {product.stock > 0 ? 'Reserve Piece' : 'Join Waitlist'}
                                                </motion.button>
                                            ) : (
                                                <motion.button
                                                    key="success"
                                                    initial={{ backgroundColor: "#d4ff3f", color: "#000" }}
                                                    animate={{ backgroundColor: "#10b981", color: "#fff" }}
                                                    className="w-full py-6 rounded-2xl font-black text-xs tracking-[0.4em] uppercase flex items-center justify-center gap-3"
                                                >
                                                    <Check size={20} /> Piece Reserved
                                                </motion.button>
                                            )}
                                        </AnimatePresence>

                                        <button className="w-full mt-4 py-6 border border-white/5 bg-white/[0.02] text-white rounded-2xl font-black text-xs tracking-[0.4em] uppercase hover:bg-white/10 transition-all premium-blur">
                                            Direct Inquiry
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 px-2">
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 bg-zinc-900 rounded-2xl border border-white/5 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                                                <Shield size={20} />
                                            </div>
                                            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-500 group-hover:text-zinc-300 transition-colors">Authenticity Certified</span>
                                        </div>
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 bg-zinc-900 rounded-2xl border border-white/5 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                                                <Truck size={20} />
                                            </div>
                                            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-500 group-hover:text-zinc-300 transition-colors">Priority Logistics</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-6 mb-32 relative">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="flex gap-12 border-b border-white/5 mb-16 overflow-x-auto no-scrollbar">
                            <TabButton
                                active={activeTab === "description"}
                                onClick={() => setActiveTab("description")}
                                label="Description"
                            />
                            <TabButton
                                active={activeTab === "specifications"}
                                onClick={() => setActiveTab("specifications")}
                                label="Specifications"
                            />
                            <TabButton
                                active={activeTab === "reviews"}
                                onClick={() => setActiveTab("reviews")}
                                label="Reviews"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                            <AnimatePresence mode="wait">
                                {activeTab === "description" && (
                                    <motion.div
                                        key="description"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-8"
                                    >
                                        <h3 className="text-3xl font-heading font-black uppercase tracking-tighter text-white">The Genesis of Design</h3>
                                        <p className="text-lg text-zinc-400 leading-relaxed font-medium">
                                            Deep within our artisans' atelier, the {product.name} was envisioned not as mere inventory, but as a legacy. Using centuries-old techniques refined for the modern age, every line and curve is the result of obsessive attention to detail.
                                        </p>
                                        <div className="flex gap-4">
                                            <div className="p-1 bg-accent/20 rounded-full"><Plus size={10} className="text-accent" /></div>
                                            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest leading-loose">
                                                Individually numbered for exclusivity <br />
                                                Ethically sourced materials from global partners <br />
                                                Certified by the Luxe Guild of Craftsmen
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "specifications" && (
                                    <motion.div
                                        key="specifications"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="grid grid-cols-1 gap-6"
                                    >
                                        <SpecItem label="Collection" value={product.category} />
                                        <SpecItem label="Weight" value="124 grams (Solid Structure)" />
                                        <SpecItem label="Origin" value="Atelier Northern Alps" />
                                        <SpecItem label="Material" value="Premium Grade & Artisanal Polish" />
                                        <SpecItem label="Maintenance" value="Exclusive yearly service included" />
                                    </motion.div>
                                )}

                                {activeTab === "reviews" && (
                                    <motion.div
                                        key="reviews"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-8"
                                    >
                                        <h3 className="text-3xl font-heading font-black uppercase tracking-tighter text-white">Client Testimonials</h3>
                                        {product.reviews?.length > 0 ? (
                                            <div className="space-y-6">
                                                {product.reviews.map((review, i) => (
                                                    <div key={i} className="p-6 bg-zinc-900/40 rounded-3xl border border-white/5">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden">
                                                                    {review.user?.profileImage ? (
                                                                        <img src={review.user.profileImage} className="w-full h-full object-cover" alt="" />
                                                                    ) : (
                                                                        <span className="text-[10px] font-black text-accent">{review.user?.name?.charAt(0)}</span>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-black uppercase tracking-widest text-white">{review.user?.name}</p>
                                                                    <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                                                                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3, 4, 5].map(s => (
                                                                    <Star key={s} size={10} className={`${s <= review.rating ? "fill-accent text-accent" : "text-zinc-700"}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                                                            {review.comment || "An absolute masterpiece. The quality exceeds all expectations."}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-12 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center px-12">
                                                <MessageSquare className="text-zinc-700 mb-4" size={40} />
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">The guestbook is empty</p>
                                                <p className="text-xs text-zinc-600 mt-4 max-w-xs font-bold uppercase tracking-widest leading-loose">Be the first to leave a testimonial for this exceptional piece.</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="bg-zinc-900/30 rounded-[2.5rem] p-12 relative overflow-hidden group h-fit">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                                    <Info size={120} />
                                </div>
                                <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-accent mb-6">Expert Assistance</h4>
                                <h3 className="text-2xl font-heading font-black uppercase tracking-tight text-white mb-8">Personal Client Advisor</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed mb-10 font-bold uppercase tracking-widest">
                                    Our concierge is available for private consultation regarding the heritage and sourcing of this piece.
                                </p>
                                <button className="flex items-center gap-3 text-white font-black text-[9px] tracking-[0.5em] uppercase hover:text-accent transition-all">
                                    Request Callback <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {relatedProducts.length > 0 && (
                    <section className="px-6 border-t border-white/5 pt-32">
                        <div className="max-w-[1400px] mx-auto">
                            <div className="flex items-end justify-between mb-20">
                                <div>
                                    <span className="text-accent text-[11px] font-black tracking-[0.5em] uppercase mb-4 block">Recommended</span>
                                    <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter uppercase text-white">Related <br /><span className="italic">Masterpieces.</span></h2>
                                </div>
                                <button onClick={() => router.push("/shop")} className="text-[10px] font-black tracking-[0.4em] text-zinc-500 hover:text-white transition-all uppercase mb-2">View Full Vault</button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20">
                                {relatedProducts.map((p, i) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1, duration: 0.8 }}
                                    >
                                        <ProductCard product={p} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

function TabButton({ active, onClick, label }) {
    return (
        <button
            onClick={onClick}
            className={`pb-6 text-[11px] font-black tracking-[0.5em] uppercase transition-all relative whitespace-nowrap ${active ? "text-white" : "text-zinc-600 hover:text-zinc-400"
                }`}
        >
            {label}
            {active && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-accent"
                />
            )}
        </button>
    );
}

function SpecItem({ label, value }) {
    return (
        <div className="flex items-center justify-between pb-6 border-b border-white/5">
            <span className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">{label}</span>
            <span className="text-xs md:text-sm font-bold text-white text-right">{value}</span>
        </div>
    );
}
