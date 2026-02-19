"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Settings, ShoppingBag, Heart, LogOut, ChevronRight, Camera, Phone, MapPin, Save, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/lib/axios";

function ProfileContent() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
    });
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("info");
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        fetchUserProfile();
        const tab = searchParams.get("tab");
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    useEffect(() => {
        const orderId = searchParams.get("orderId");
        if (orderId && orders.length > 0) {
            const foundOrder = orders.find(o => o.id === parseInt(orderId));
            if (foundOrder) setSelectedOrder(foundOrder);
        }
    }, [searchParams, orders]);

    const fetchUserProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const response = await api.get("/users/me");
            setUser(response.data);
            setFormData({
                name: response.data.name || "",
                email: response.data.email || "",
                phone: response.data.phone || "",
                location: response.data.location || "",
            });
            localStorage.setItem("user", JSON.stringify(response.data));

            // Fetch orders after user profile

            fetchOrders();
        } catch (e) {
            console.error("Failed to fetch user profile", e);
            if (e.response?.status === 401) {
                router.push("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
            const response = await api.get("/payments/my-orders");
            setOrders(response.data);
        } catch (e) {
            console.error("Failed to fetch orders", e);
        } finally {
            setOrdersLoading(false);
        }
    };



    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth-change"));
        router.push("/login");
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await api.put(`/users/${user.id}`, formData);
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
            window.dispatchEvent(new Event("auth-change"));
            setEditMode(false);
        } catch (e) {
            console.error("Failed to update profile", e);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"
                ></motion.div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-background">
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-[1200px] mx-auto"
                >
                    {/* Header Section */}
                    <motion.div variants={itemVariants} className="relative mb-12">
                        <div className="h-56 w-full bg-zinc-900 border border-white/5 rounded-[2.5rem] overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent group-hover:opacity-70 transition-opacity duration-500"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(212,255,63,0.1),transparent)]"></div>
                            <div className="absolute bottom-6 right-8 opacity-20 hidden md:block">
                                <span className="text-8xl font-heading font-black tracking-tighter text-white select-none italic uppercase">Luxe.</span>
                            </div>
                        </div>

                        <div className="absolute -bottom-10 left-10 flex flex-wrap items-end gap-6">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative"
                            >
                                <div className="w-36 h-36 rounded-3xl bg-[#0a0a0c] border-[6px] border-background flex items-center justify-center overflow-hidden shadow-2xl">
                                    {user?.profileImage ? (
                                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-accent text-5xl font-heading font-bold">
                                            {user?.name?.charAt(0).toUpperCase() || "M"}
                                        </div>
                                    )}
                                </div>
                                <button className="absolute bottom-2 right-2 p-2.5 bg-accent text-background rounded-xl hover:bg-white transition-colors shadow-lg group">
                                    <Camera size={18} className="group-hover:scale-110 transition-transform" />
                                </button>
                            </motion.div>

                            <div className="mb-4">
                                <h1 className="text-4xl font-heading uppercase tracking-tighter text-white">{user?.name || "Member"}</h1>
                                <p className="text-muted-foreground text-sm font-medium tracking-wide flex items-center gap-2 mt-1">
                                    <Mail size={14} className="text-accent/60" /> {user?.email}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24">
                        {/* Sidebar */}
                        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-4">
                            <div className="bg-[#0a0a0c] border border-white/5 rounded-[2rem] p-3 shadow-xl">
                                <nav className="space-y-1">
                                    <SidebarLink
                                        icon={<User size={18} />}
                                        label="Personal Info"
                                        active={activeTab === "info"}
                                        onClick={() => setActiveTab("info")}
                                    />
                                    <SidebarLink
                                        icon={<ShoppingBag size={18} />}
                                        label="My Orders"
                                        active={activeTab === "orders"}
                                        onClick={() => setActiveTab("orders")}
                                    />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-4 px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-red-400 hover:bg-red-400/5 transition-all rounded-2xl group"
                                    >
                                        <LogOut size={18} className="group-hover:animate-pulse" />
                                        <span>Logout</span>
                                        <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </button>
                                </nav>
                            </div>

                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-[2rem] p-8 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                                    <Sparkles size={60} />
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-accent text-background rounded-lg shadow-[0_0_20px_rgba(212,255,63,0.3)]">
                                        <Sparkles size={16} />
                                    </div>
                                    <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent">Luxe Gold Member</h3>
                                </div>
                                <p className="text-[10px] text-zinc-300 leading-relaxed font-bold uppercase tracking-widest">
                                    2,450 points earned. 550 points until Platinum.
                                </p>
                                <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "75%" }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-accent"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Content Area */}
                        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
                            <AnimatePresence mode="wait">
                                {activeTab === "info" && (
                                    <motion.div
                                        key="info"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-[#0a0a0c] border border-white/5 rounded-[2rem] p-10 shadow-xl relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] -z-10 rounded-full"></div>

                                        <div className="flex flex-wrap items-center justify-between mb-12 gap-4">
                                            <div>
                                                <h2 className="text-2xl font-heading uppercase tracking-tighter text-white">Profile Details</h2>
                                                <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-[0.2em]">Manage your private information</p>
                                            </div>
                                            <AnimatePresence mode="wait">
                                                {!editMode ? (
                                                    <motion.button
                                                        key="edit"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        onClick={() => setEditMode(true)}
                                                        className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex items-center gap-2 group shadow-lg"
                                                    >
                                                        <Settings size={14} className="group-hover:rotate-45 transition-transform duration-500" /> Edit Profile
                                                    </motion.button>
                                                ) : (
                                                    <motion.div
                                                        key="save"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        className="flex gap-2"
                                                    >
                                                        <button
                                                            onClick={handleSave}
                                                            disabled={saving}
                                                            className="px-8 py-3 bg-accent text-background rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex items-center gap-2 shadow-[0_10px_20px_rgba(212,255,63,0.2)]"
                                                        >
                                                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Changes
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditMode(false);
                                                                setFormData({
                                                                    name: user.name || "",
                                                                    email: user.email || "",
                                                                    phone: user.phone || "",
                                                                    location: user.location || "",
                                                                });
                                                            }}
                                                            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex items-center gap-2"
                                                        >
                                                            <X size={14} /> Cancel
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                                            <InfoField
                                                label="Full Name"
                                                icon={<User size={14} />}
                                                value={user?.name}
                                                editMode={editMode}
                                                onChange={(val) => setFormData({ ...formData, name: val })}
                                                currentVal={formData.name}
                                            />
                                            <InfoField
                                                label="Email Address"
                                                icon={<Mail size={14} />}
                                                value={user?.email}
                                                editMode={editMode}
                                                onChange={(val) => setFormData({ ...formData, email: val })}
                                                currentVal={formData.email}
                                                readOnly={true}
                                            />
                                            <InfoField
                                                label="Phone Number"
                                                icon={<Phone size={14} />}
                                                value={user?.phone || "Not set"}
                                                editMode={editMode}
                                                onChange={(val) => setFormData({ ...formData, phone: val })}
                                                currentVal={formData.phone}
                                                placeholder="+1 (555) 000-0000"
                                            />
                                            <InfoField
                                                label="Location"
                                                icon={<MapPin size={14} />}
                                                value={user?.location || "Not set"}
                                                editMode={editMode}
                                                onChange={(val) => setFormData({ ...formData, location: val })}
                                                currentVal={formData.location}
                                                placeholder="New York, USA"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "orders" && (
                                    <motion.div
                                        key="orders"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-[#0a0a0c] border border-white/5 rounded-[2rem] p-10 shadow-xl"
                                    >
                                        <div className="flex items-center justify-between mb-10">
                                            <div className="flex items-center gap-4">
                                                {selectedOrder && (
                                                    <button
                                                        onClick={() => setSelectedOrder(null)}
                                                        className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                                                    >
                                                        <ChevronRight size={20} className="rotate-180" />
                                                    </button>
                                                )}
                                                <h2 className="text-2xl font-heading uppercase tracking-tighter text-white">
                                                    {selectedOrder ? `Order #${selectedOrder.id}` : "Your Acquisitions"}
                                                </h2>
                                            </div>
                                            {!selectedOrder && (
                                                <button
                                                    onClick={fetchOrders}
                                                    className="text-[10px] font-bold tracking-[0.2em] text-accent hover:underline uppercase transition-all"
                                                >
                                                    {ordersLoading ? "Syncing..." : "Refresh"}
                                                </button>
                                            )}
                                        </div>

                                        <AnimatePresence mode="wait">
                                            {selectedOrder ? (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="space-y-8"
                                                >
                                                    <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 space-y-6">
                                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                                            <span>Date Placed</span>
                                                            <span className="text-white">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                                            <span>Payment Status</span>
                                                            <span className="text-accent">{selectedOrder.status}</span>
                                                        </div>
                                                        <div className="h-[1px] bg-white/5 w-full"></div>
                                                        <div className="space-y-4">
                                                            {selectedOrder.items?.map((item, idx) => (
                                                                <div key={idx} className="flex justify-between items-center group">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-12 h-12 bg-black rounded-xl overflow-hidden border border-white/5">
                                                                            <img src={item.product?.images?.[0] || "/placeholder.jpg"} alt={item.product?.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-bold text-white group-hover:text-accent transition-colors">{item.product?.name}</p>
                                                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Qty: {item.quantity}</p>
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-sm font-bold text-white">₹{Number(item.price).toLocaleString('en-IN')}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="h-[1px] bg-white/5 w-full"></div>
                                                        <div className="flex justify-between items-center text-lg font-heading tracking-tight text-white pt-2">
                                                            <span>Total Amount</span>
                                                            <span>₹{Number(selectedOrder.totalAmount).toLocaleString('en-IN')}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                orders.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {orders.map(order => (
                                                            <OrderCard
                                                                key={order.id}
                                                                id={`#LUX-${order.id}`}
                                                                date={new Date(order.createdAt).toLocaleDateString()}
                                                                total={`₹${Number(order.totalAmount).toLocaleString('en-IN')}`}
                                                                status={order.status}
                                                                onClick={() => setSelectedOrder(order)}
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                                        <ShoppingBag size={48} className="mx-auto mb-6 text-zinc-800" />
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-8">No collections acquired yet</p>
                                                        <Link href="/shop" className="px-10 py-4 bg-white/5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-accent hover:text-background transition-all">
                                                            Explore Catalog
                                                        </Link>
                                                    </div>
                                                )
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"
                ></motion.div>
            </div>
        }>
            <ProfileContent />
        </Suspense>
    );
}

function SidebarLink({ icon, label, active = false, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all rounded-2xl group ${active ? "bg-accent text-background shadow-lg shadow-accent/10" : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
        >
            <div className={`transition-colors ${active ? "text-background" : "text-accent/40 group-hover:text-accent"}`}>
                {icon}
            </div>
            <span>{label}</span>
            <ChevronRight size={14} className={`ml-auto transition-all ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"}`} />
        </button>
    );
}

function InfoField({ label, icon, value, editMode, onChange, currentVal, placeholder, readOnly = false }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase flex items-center gap-2">
                {icon} <span className="opacity-70">{label}</span>
            </label>
            <div className="relative group">
                <AnimatePresence mode="wait">
                    {editMode ? (
                        <motion.input
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            type="text"
                            value={currentVal}
                            onChange={(e) => onChange(e.target.value)}
                            readOnly={readOnly}
                            placeholder={placeholder}
                            className={`w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-4 px-5 text-sm font-medium focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all text-white placeholder:text-zinc-700 ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    ) : (
                        <motion.p
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-lg font-bold text-zinc-100 px-1"
                        >
                            {value || <span className="text-zinc-700 italic">Not provided</span>}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function OrderCard({ id, date, total, status, onClick }) {
    return (
        <motion.div
            whileHover={{ scale: 1.01, x: 5 }}
            onClick={onClick}
            className="flex items-center justify-between p-6 bg-zinc-900/40 border border-white/5 rounded-3xl hover:bg-[#0d0d0f] hover:border-white/10 transition-all cursor-pointer group shadow-lg"
        >
            <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-black border border-white/5 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background transition-all duration-300">
                    <ShoppingBag size={24} />
                </div>
                <div>
                    <h4 className="text-lg font-heading tracking-tight text-white group-hover:text-accent transition-colors">{id}</h4>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mt-1">{date}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-lg font-heading tracking-tight mb-1 text-white">{total}</p>
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border ${status === "Delivered" ? "bg-green-500/5 text-green-400 border-green-500/10" : "bg-accent/5 text-accent border-accent/10"
                    }`}>
                    {status}
                </span>
            </div>
        </motion.div>
    );
}

function Sparkles({ size, className }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    );
}
