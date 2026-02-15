import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PropertyCard } from '@/components/properties/property-card';
import { SearchInput } from '@/components/search/search-input';
import { ArrowRight, ShieldCheck, Clock, MessageCircle, MapPin, Eye, Zap } from 'lucide-react';
import * as motion from "framer-motion/client";
import { AIPrestigeTrigger } from '@/components/discovery/ai-prestige-trigger';

export const revalidate = 0;

export default async function Home() {
    const supabase = await createClient();

    const { data: properties } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .limit(6)
        .order('created_at', { ascending: false });

    return (
        <main className="min-h-screen bg-[#FDFDFD] dark:bg-black overflow-hidden">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0%,transparent_70%)] blur-[120px]" />
                    <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-600/5 blur-[120px] rounded-full" />
                    <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-600/5 blur-[120px] rounded-full" />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto space-y-16">
                    <div className="space-y-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 backdrop-blur-xl shadow-sm"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Exclusively for Elite Assets</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            className="text-6xl md:text-[8rem] font-black tracking-tighter leading-[0.85] uppercase italic dark:text-white"
                        >
                            Arca <span className="text-blue-600">Estate</span><br />
                            <span className="text-gray-400/20">Platinum Edition</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                            className="max-w-2xl mx-auto text-sm md:text-base font-medium text-gray-500 uppercase tracking-widest leading-relaxed"
                        >
                            Experience the future of real estate with self-guided secure viewing, identity-verified agents, and verified asset acquisition.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                        className="mx-auto"
                    >
                        <SearchInput />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 1 }}
                        className="flex flex-wrap items-center justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700"
                    >
                        {['TrustVyne', 'ShieldCore', 'MetaKey', 'SecureLocker'].map((p) => (
                            <span key={p} className="text-xs font-black uppercase tracking-[0.4em] dark:text-white italic">{p}</span>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Prestige Collections */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic dark:text-white leading-[0.9]">
                                Prestige <br />
                                <span className="text-blue-600">Collections</span>
                            </h2>
                            <p className="mt-4 text-gray-500 font-medium">Curated listings featuring instant self-guided access.</p>
                        </div>
                        <Link
                            href="/search"
                            className="btn-primary bg-secondary text-gray-500 hover:bg-blue-600 hover:text-white px-10 border-none shadow-none"
                        >
                            Explore All Listings
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {properties?.map((property, i) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>

                    {!properties?.length && (
                        <div className="mt-10 glass-card p-20 text-center">
                            <p className="text-gray-500 font-bold italic uppercase tracking-widest">Awaiting New Acquisitions...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Trust Infrastructure */}
            <section className="py-32 bg-gray-50 dark:bg-white/5 border-y border-gray-100 dark:border-white/5 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="space-y-6">
                        <div className="h-16 w-16 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter uppercase italic dark:text-white">Elite Verification</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">Every agent and property on Arca Estate undergoes a rigorous multi-step security audit.</p>
                    </div>
                    <div className="space-y-6">
                        <div className="h-16 w-16 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Eye size={32} />
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter uppercase italic dark:text-white">Instant Vision</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">Book a viewing and access properties via smart-lock in seconds. No waiting, no sales pressure.</p>
                    </div>
                    <AIPrestigeTrigger className="text-left space-y-6 group">
                        <div className="h-16 w-16 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <MessageCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter uppercase italic dark:text-white group-hover:text-blue-600 transition-colors">Direct Command</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">Chat directly with the decision markers. Our verified agents respond in an average of 12 minutes.</p>
                    </AIPrestigeTrigger>
                </div>
            </section>
        </main>
    );
}
