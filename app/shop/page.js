"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal, Loader2, Sparkles, Search, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/axios";
import Navbar from "@/components/Navbar";

export default function ShopPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [sortBy, setSortBy] = useState("newest");
    useEffect(() => {
        fetchProducts();
    }, [activeCategory, currentPage, searchQuery, sortBy]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: 8,
                limit: 8,
                search: searchQuery,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                sort: sortBy
            };

            if (activeCategory !== "ALL") {
                params.category = activeCategory;
            }

            const response = await api.get("/products", { params });

            // Handle both array (legacy) and object (paginated) responses
            if (Array.isArray(response.data)) {
                setProducts(response.data);
                setTotalPages(1);
            } else {
                setProducts(response.data.products);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to page 1 on search
    };

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        setCurrentPage(1); // Reset to page 1 on category change
        setCurrentPage(1); // Reset to page 1 on category change
    };

    const handleApplyFilters = () => {
        setShowFilters(false);
        fetchProducts();
    };

    const categories = ["ALL", "WATCHES", "JEWELRY", "FRAGRANCE", "BAGS", "ACCESSORIES"];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-40 pb-20 px-6">
                <div className="max-w-[1400px] mx-auto">
                    <header className="flex flex-col md:flex-row justify-between sm:items-end gap-10 mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="max-w-2xl"
                        >
                            <span className="text-accent text-[9px] sm:text-[11px] font-bold tracking-[0.4em] uppercase mb-4 block flex items-center gap-2">
                                <Sparkles size={12} /> Curated Luxury
                            </span>
                            <h1 className="text-3xl sm:text-5xl md:text-8xl font-bold tracking-tighter font-heading uppercase leading-[0.85]">
                                The <br /><span className="text-accent italic">Collection.</span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col md:items-end gap-8 w-full md:w-auto"
                        >
                            <div className="relative group w-full md:w-64">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-10 text-[10px] uppercase font-bold tracking-[0.2em] focus:outline-none focus:border-accent transition-all text-white placeholder:text-zinc-600"
                                />
                                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                            </div>


                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-8 py-3 border bg-white/[0.02] premium-blur rounded-full hover:border-accent/40 transition-all group w-full md:w-auto justify-center ${showFilters ? 'border-accent text-accent' : 'border-white/5'}`}
                            >
                                <SlidersHorizontal size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                                <span className="text-[10px] font-bold tracking-widest uppercase px-2">Filter</span>
                            </button>
                        </motion.div>
                    </header>

                    {/* Filter Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mb-12"
                            >
                                <div className="bg-[#0a0a0c] border border-white/5 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-12">
                                    <div className="space-y-6">
                                        <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500">Categories</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => handleCategoryChange(cat)}
                                                    className={`px-4 py-2 rounded-full border text-[9px] font-bold tracking-widest transition-all ${activeCategory === cat ? 'bg-accent text-black border-accent' : 'bg-transparent text-zinc-400 border-white/10 hover:border-white/30'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500">Price Range</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 bg-zinc-900 rounded-xl px-4 py-3 border border-white/5">
                                                <span className="text-[9px] text-zinc-500 block mb-1">MIN</span>
                                                <input
                                                    type="number"
                                                    value={priceRange[0]}
                                                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                                    className="bg-transparent w-full text-sm font-bold text-white focus:outline-none"
                                                />
                                            </div>
                                            <div className="w-4 h-[1px] bg-white/10"></div>
                                            <div className="flex-1 bg-zinc-900 rounded-xl px-4 py-3 border border-white/5">
                                                <span className="text-[9px] text-zinc-500 block mb-1">MAX</span>
                                                <input
                                                    type="number"
                                                    value={priceRange[1]}
                                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
                                                    className="bg-transparent w-full text-sm font-bold text-white focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500">Sort By</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {[
                                                { label: "Newest", value: "newest" },
                                                { label: "Price: Low to High", value: "price_asc" },
                                                { label: "Price: High to Low", value: "price_desc" }
                                            ].map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setSortBy(opt.value)}
                                                    className={`px-4 py-2 rounded-full border text-[9px] font-bold tracking-widest transition-all ${sortBy === opt.value ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-400 border-white/10 hover:border-white/30'}`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleApplyFilters}
                                            className="w-full mt-4 py-3 bg-accent text-background rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white transition-all"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-[400px] flex items-center justify-center"
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted">Loading Masterpieces</span>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
                            >
                                {products.length > 0 ? (
                                    products.map((p, i) => (
                                        <motion.div
                                            key={p.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            <ProductCard product={p} />
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center">
                                        <p className="text-muted font-bold tracking-widest uppercase">No products found in this category.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Pagination Controls */}
                    {!loading && totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-20">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-4 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${currentPage === page
                                            ? "bg-accent text-black scale-110"
                                            : "bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-4 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
