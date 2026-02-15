'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
    Users,
    Home,
    ShieldCheck,
    AlertCircle,
    TrendingUp,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Search,
    Filter,
    BarChart3,
    Activity
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [pendingListings, setPendingListings] = useState<any[]>([]);
    const [pendingAgents, setPendingAgents] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalProperties: 0,
        activeAgents: 0,
        pendingApprovals: 0,
        platformVolume: 0
    });
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchAdminData = async () => {
            setLoading(true);

            // Fetch Stats (Simulated or aggregate)
            const { count: propCount } = await supabase.from('properties').select('*', { count: 'exact', head: true });
            const { count: agentCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'agent');

            // Fetch Pending Listings
            const { data: listings } = await supabase
                .from('properties')
                .select('*, agent:profiles!properties_owner_id_fkey(full_name, email)')
                .eq('status', 'pending');

            // Fetch Pending Verifications
            const { data: agents } = await supabase
                .from('profiles')
                .select('*')
                .eq('verification_status', 'pending');

            setStats({
                totalProperties: propCount || 0,
                activeAgents: agentCount || 0,
                pendingApprovals: listings?.length || 0,
                platformVolume: 124000000 // Mock value
            });
            setPendingListings(listings || []);
            setPendingAgents(agents || []);
            setLoading(false);
        };

        fetchAdminData();
    }, []);

    const handleApproveListing = async (id: string) => {
        const { error } = await supabase.from('properties').update({ status: 'available' }).eq('id', id);
        if (!error) {
            setPendingListings(prev => prev.filter(l => l.id !== id));
            setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }));
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-black flex">
            {/* Sidebar */}
            <aside className="w-80 border-r border-gray-100 dark:border-white/5 bg-white dark:bg-black/50 backdrop-blur-3xl hidden lg:flex flex-col p-8 sticky top-20 h-[calc(100vh-80px)]">
                <div className="space-y-12">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">Command Console</p>
                        <nav className="space-y-2">
                            {[
                                { id: 'overview', label: 'Global Intelligence', icon: Activity },
                                { id: 'listings', label: 'Approval Queue', icon: Home, count: stats.pendingApprovals },
                                { id: 'agents', label: 'Agent Verifications', icon: Users, count: pendingAgents.length },
                                { id: 'analytics', label: 'Market Metrics', icon: BarChart3 },
                                { id: 'security', label: 'Platform Security', icon: ShieldCheck },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                                        activeTab === item.id
                                            ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                                            : "text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={18} />
                                        {item.label}
                                    </div>
                                    {item.count !== undefined && item.count > 0 && (
                                        <span className={cn(
                                            "h-5 w-5 rounded-full flex items-center justify-center text-[10px]",
                                            activeTab === item.id ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                                        )}>
                                            {item.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">System Health</p>
                        <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">API Latency</span>
                                <span className="text-[10px] font-black text-green-500">24ms</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">DB Operations</span>
                                <span className="text-[10px] font-black text-green-500">Steady</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 lg:p-12 space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic dark:text-white leading-none">
                            Super <span className="text-blue-600">Panel</span>
                        </h1>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mt-4 italic">
                            Authorized clearance level: <span className="text-blue-600">Standard-Zero</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Universal Search..."
                                className="h-14 w-64 pl-12 pr-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-600/20 transition-all dark:text-white"
                            />
                        </div>
                        <button className="h-14 w-14 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-400">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* Tab Content: Overview */}
                {activeTab === 'overview' && (
                    <div className="space-y-12">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: 'Total Assets', value: stats.totalProperties, icon: Home, trend: '+4% MoM' },
                                { label: 'Elite Agents', value: stats.activeAgents, icon: Users, trend: '+12% MoM' },
                                { label: 'Approvals Pending', value: stats.pendingApprovals, icon: AlertCircle, variant: 'warning' },
                                { label: 'Market Cap (USD)', value: '$124M', icon: TrendingUp, trend: '+1.2% MoM' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 space-y-4 shadow-sm shadow-black/5">
                                    <div className={cn(
                                        "h-14 w-14 rounded-2xl flex items-center justify-center",
                                        stat.variant === 'warning' ? "bg-amber-600/10 text-amber-600" : "bg-blue-600/10 text-blue-600"
                                    )}>
                                        <stat.icon size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                                        <p className="text-3xl font-black italic dark:text-white mt-1">{stat.value}</p>
                                    </div>
                                    {stat.trend && (
                                        <div className="flex items-center gap-2 text-[10px] font-black text-green-500 uppercase tracking-widest">
                                            <TrendingUp size={12} /> {stat.trend}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity Mockup */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/5 p-10 space-y-8 shadow-sm shadow-black/5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-black tracking-tighter uppercase italic dark:text-white">Escalation Events</h3>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-blue-600">View All</button>
                                </div>
                                <div className="space-y-6">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-blue-600/20 transition-all cursor-pointer group">
                                            <div className="flex items-center gap-6">
                                                <div className="h-12 w-12 rounded-xl bg-amber-600/10 text-amber-600 flex items-center justify-center">
                                                    <AlertCircle size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black dark:text-white group-hover:text-blue-600 transition-colors uppercase italic">Suspicious Access Request</p>
                                                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mt-1">Property ID: #AX892 • 12 mins ago</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-600 transition-all" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/5 p-10 space-y-8 shadow-sm shadow-black/5">
                                <h3 className="text-2xl font-black tracking-tighter uppercase italic dark:text-white">Protocol Status</h3>
                                <div className="space-y-8">
                                    {[
                                        { label: 'Asset Vetting', status: 'Online', val: 100 },
                                        { label: 'KYC Verification', status: 'Online', val: 100 },
                                        { label: 'Booking Sync', status: 'Warning', val: 82, variant: 'warning' },
                                    ].map((p, i) => (
                                        <div key={i} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{p.label}</span>
                                                <span className={cn("text-[10px] font-black uppercase tracking-widest", p.variant === 'warning' ? 'text-amber-500' : 'text-green-500')}>{p.status}</span>
                                            </div>
                                            <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden p-0.5">
                                                <div
                                                    className={cn("h-full rounded-full", p.variant === 'warning' ? 'bg-amber-500' : 'bg-blue-600')}
                                                    style={{ width: `${p.val}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content: Listings Approval */}
                {activeTab === 'listings' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic dark:text-white">Inventory <span className="text-blue-600">Approval Queue</span></h2>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-blue-600/10 text-blue-600 px-4 py-2 rounded-full border border-blue-600/20">{pendingListings.length} Priorities</span>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {pendingListings.length > 0 ? pendingListings.map((listing) => (
                                <div key={listing.id} className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm shadow-black/5 hover:border-blue-600/20 transition-all">
                                    <div className="flex items-center gap-8 w-full md:w-auto">
                                        <div className="h-24 w-40 bg-gray-100 dark:bg-white/10 rounded-2xl overflow-hidden shrink-0 relative">
                                            {listing.images?.[0] ? (
                                                <img src={listing.images[0]} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400"><Home size={32} /></div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">{listing.type} • {listing.location}</p>
                                            <h4 className="text-xl font-black italic dark:text-white uppercase leading-none">{listing.title}</h4>
                                            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mt-2">Agent: <span className="text-gray-900 dark:text-white font-bold">{listing.agent?.full_name}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
                                        <button
                                            onClick={() => handleApproveListing(listing.id)}
                                            className="flex-1 md:flex-none h-14 px-8 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.05] transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 size={16} /> Approve
                                        </button>
                                        <button className="flex-1 md:flex-none h-14 px-8 rounded-2xl bg-red-600/10 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2">
                                            <XCircle size={16} /> Reject Asset
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-32 bg-white dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/5">
                                    <CheckCircle2 size={64} className="mx-auto text-blue-600 mb-6" />
                                    <h3 className="text-2xl font-black tracking-tighter uppercase italic dark:text-white">All assets cleared</h3>
                                    <p className="text-gray-500 font-medium mt-2">The approval queue is currently empty. Excellent efficiency.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
