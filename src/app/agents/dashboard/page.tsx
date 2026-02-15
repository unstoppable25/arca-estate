'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
    Plus,
    Home,
    TrendingUp,
    Users,
    Calendar,
    ChevronRight,
    Search,
    Bell,
    Settings,
    ShieldCheck,
    Clock,
    AlertCircle,
    MoreVertical,
    Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SubscriptionManager } from '@/components/agents/subscription-manager';
import { MapPin } from 'lucide-react';
import { LeadNotification } from '@/components/notifications/lead-notification';

export default function AgentDashboard() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [listings, setListings] = useState<any[]>([]);
    const [leads, setleads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const loadDashboard = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(profile);

            const { data: properties } = await supabase
                .from('properties')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });
            setListings(properties || []);

            // Fetch bookings for these properties
            const { data: bookings } = await supabase
                .from('bookings')
                .select(`
                    *,
                    properties!inner(*),
                    profiles:user_id(*)
                `)
                .eq('properties.owner_id', user.id)
                .order('start_time', { ascending: true });

            setleads(bookings || []);

            setLoading(false);
        };
        loadDashboard();
    }, [router, supabase]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"
            />
        </div>
    );

    const [activeTab, setActiveTab] = useState<'listings' | 'leads' | 'membership'>('listings');

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 pb-20">
            <LeadNotification agentId={user.id} />
            {/* Header Section */}
            <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-6 py-6 sticky top-16 z-30">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter uppercase italic dark:text-white">
                                Command Center
                            </h1>
                            <p className="text-gray-500 font-medium flex items-center gap-2">
                                Welcome back, <span className="text-blue-600 font-bold">{profile?.full_name?.split(' ')[0]}</span>
                                <span className="h-1 w-1 rounded-full bg-gray-300" />
                                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/agents/list" className="btn-primary flex items-center gap-2 px-8 py-4 shadow-blue-600/30">
                                <Plus size={20} /> Create New Listing
                            </Link>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <nav className="flex items-center gap-8 border-b border-gray-100 dark:border-white/5 pb-2">
                        {[
                            { id: 'listings', label: 'Assets', count: listings.length },
                            { id: 'leads', label: 'Intelligence', count: 0 },
                            { id: 'membership', label: 'Membership' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={cn(
                                    "pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                                    activeTab === item.id
                                        ? "text-blue-600"
                                        : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                )}
                            >
                                {item.label} {item.count !== undefined && <span className="ml-1 opacity-50">({item.count})</span>}
                                {activeTab === item.id && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-10 space-y-10">
                {activeTab === 'membership' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SubscriptionManager currentPlan={profile?.subscription_tier} />
                    </div>
                )}

                {activeTab !== 'membership' && profile?.verification_status !== 'verified' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "p-6 rounded-3xl border-2 flex flex-col md:flex-row items-center justify-between gap-6",
                            profile?.verification_status === 'pending'
                                ? "bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-500"
                                : "bg-red-500/5 border-red-500/20 text-red-700 dark:text-red-500"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "h-14 w-14 rounded-2xl flex items-center justify-center",
                                profile?.verification_status === 'pending' ? "bg-amber-500/20" : "bg-red-500/20"
                            )}>
                                {profile?.verification_status === 'pending' ? <Clock size={32} /> : <AlertCircle size={32} />}
                            </div>
                            <div>
                                <p className="font-black uppercase tracking-tighter text-xl italic">
                                    {profile?.verification_status === 'pending' ? "Security Clearance Pending" : "Identity Verification Required"}
                                </p>
                                <p className="text-sm font-medium opacity-80">
                                    {profile?.verification_status === 'pending'
                                        ? "Our team is currently reviewing your documents. Listings will go live once cleared."
                                        : "To ensure the highest level of trust, all agents must verify their identity."}
                                </p>
                            </div>
                        </div>
                        {profile?.verification_status !== 'pending' && (
                            <Link href="/agents/verify" className="btn-primary bg-red-600 hover:bg-red-500 border-none px-8 py-3 text-sm">
                                Complete Verification
                            </Link>
                        )}
                    </motion.div>
                )}

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Active Listings", value: listings.length, icon: Home, color: "blue", trend: "Live Assets" },
                        { label: "Total Leads", value: leads.length, icon: Users, color: "purple", trend: "Inquiries" },
                        { label: "Scheduled Tours", value: leads.filter(l => new Date(l.start_time) > new Date()).length, icon: Calendar, color: "green", trend: "Upcoming" },
                        { label: "Market Reach", value: "0", icon: TrendingUp, color: "orange", trend: "Views" }
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-6 flex flex-col justify-between group hover:border-blue-600/20 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-6">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                                    `bg-${stat.color}-600/10 text-${stat.color}-600`
                                )}>
                                    <stat.icon size={24} />
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.trend}</span>
                            </div>
                            <div>
                                <p className="text-4xl font-black tracking-tighter dark:text-white">{stat.value}</p>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Listings and Leads Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Listings Table */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black tracking-tighter uppercase italic dark:text-white">Active Listings</h2>
                            <Link href="/agents/list" className="text-sm font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                                View All <ChevronRight size={16} />
                            </Link>
                        </div>

                        <div className="glass-card overflow-hidden">
                            {listings.length === 0 ? (
                                <div className="p-20 text-center space-y-4">
                                    <div className="mx-auto h-20 w-20 bg-gray-100 dark:bg-gray-900 rounded-3xl flex items-center justify-center text-gray-300">
                                        <Home size={40} />
                                    </div>
                                    <p className="font-bold text-gray-500">No properties listed yet.</p>
                                    <Link href="/agents/list" className="text-blue-600 font-black uppercase tracking-widest text-sm inline-block">Start your first listing</Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-900">
                                    {listings.map((item) => (
                                        <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-6">
                                                <div className="h-16 w-20 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0 relative group">
                                                    {item.images?.[0] ? (
                                                        <img src={item.images[0]} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-gray-400"><Home size={24} /></div>
                                                    )}
                                                    <div className="absolute top-2 left-2 bg-blue-600 text-[10px] font-black text-white px-2 py-1 rounded uppercase tracking-tighter">
                                                        {item.type === 'buy' ? 'Sale' : 'Rent'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-lg dark:text-white truncate max-w-[200px] md:max-w-md">{item.title}</h3>
                                                    <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                                                        <MapPin size={12} /> {item.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-10">
                                                <div className="hidden md:block text-right">
                                                    <p className="text-lg font-black dark:text-white">${item.price.toLocaleString()}</p>
                                                    <p className="text-[10px] font-black uppercase text-blue-600 bg-blue-600/10 px-2 py-0.5 rounded ml-auto w-fit">
                                                        {item.status}
                                                    </p>
                                                </div>
                                                <button className="h-10 w-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors">
                                                    <MoreVertical size={20} className="text-gray-400" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activities / Leads */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic dark:text-white">Recent Leads</h2>
                        <div className="glass-card p-6 divide-y divide-gray-100 dark:divide-gray-900">
                            {leads.length > 0 ? leads.slice(0, 5).map((lead: any) => (
                                <div key={lead.id} className="py-4 first:pt-0 last:pb-0 group cursor-pointer">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="h-10 w-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 font-bold">
                                            {lead.profiles?.full_name?.substring(0, 2).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm dark:text-white">{lead.profiles?.full_name || 'Guest User'}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lead.properties.title}</p>
                                        </div>
                                        <div className="ml-auto text-[10px] font-medium text-gray-400 italic">
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2 italic">
                                        Scheduled viewing for {new Date(lead.start_time).toLocaleDateString()} at {new Date(lead.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            )) : (
                                <div className="py-8 text-center text-gray-400 text-xs font-medium">
                                    No active leads yet.
                                </div>
                            )}
                            <div className="pt-6">
                                <button className="w-full py-3 rounded-2xl bg-secondary text-gray-500 text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                    View All Conversations
                                </button>
                            </div>
                        </div>

                        {/* Viewing Stats Card */}
                        <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-600/30 overflow-hidden relative group">
                            <Eye size={120} className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-black tracking-tighter uppercase italic mb-2">Self-Guided Tours</h3>
                            <p className="text-sm font-medium text-white/80 mb-6 leading-relaxed">Implement self-guided viewings to increase your conversion rate by <span className="font-bold text-white">400%</span>.</p>
                            <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
                                Setup Smart Locks
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
