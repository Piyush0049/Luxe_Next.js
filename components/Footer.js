import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-background border-t border-white/5 pt-32 pb-20">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
                    <div className="md:col-span-4">
                        <span className="text-2xl font-bold tracking-tight font-heading block mb-10">LUX<span className="text-accent">E.</span></span>
                        <p className="text-muted text-sm leading-relaxed max-w-xs font-medium">Defining the aesthetic of the modern world through curated design and exceptional quality.</p>
                    </div>

                    <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-3 gap-10">
                        <div>
                            <h4 className="text-[10px] font-bold tracking-[0.4em] text-accent mb-10 uppercase">Navigation</h4>
                            <ul className="space-y-6">
                                {["Collections", "Store", "About", "Studio"].map(item => (
                                    <li key={item}>
                                        <Link href="/" className="text-sm font-bold tracking-widest text-foreground/50 hover:text-foreground transition-colors uppercase">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <h4 className="text-[10px] font-bold tracking-[0.4em] text-accent mb-10 uppercase">Legal</h4>
                            <ul className="space-y-6">
                                {["Privacy", "Terms", "Sustainability"].map(item => (
                                    <li key={item}>
                                        <Link href="/" className="text-sm font-bold tracking-widest text-foreground/50 hover:text-foreground transition-colors uppercase">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-32 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 opacity-30">
                    <p className="text-[10px] font-bold tracking-[0.2em]">© 2026 LUXE GLOBAL</p>
                    <a href="#" className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em]">STUDIO DESIGN <ArrowUpRight size={12} /></a>
                </div>
            </div>
        </footer>
    );
}
