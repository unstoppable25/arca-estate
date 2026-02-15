import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin, KeyRound, User as UserIcon, Mail, ShieldCheck, Settings, ChevronRight, MessageCircle, Heart, Zap, Eye, Plus } from 'lucide-react';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { cn } from '@/lib/utils';
import { AIPrestigeTrigger } from '@/components/discovery/ai-prestige-trigger';

export const revalidate = 0;

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch user's bookings (as a buyer)
    const { data: bookings } = await supabase
        .from('bookings')
        .select(`
            *,
            properties (
                id,
                title,
                location,
                images,
                lockbox_code,
                type
            )
        `)
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

    const upcomingBookings = bookings?.filter(b => new Date(b.start_time) > new Date()) || [];

    // Fetch user's own listings (as a seller)
    const { data: listings } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

    // Fetch user's profile for verification status
    const { data: profile } = await supabase
        .from('profiles')
        .select('verification_status, full_name')
        .eq('id', user.id)
        .single();

    const isVerified = profile?.verification_status === 'verified';

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-black pb-24">
            {/* Prestige Header & Profile */}
            <div className="pt-24 pb-12 px-6 lg:px-12 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-black/50 backdrop-blur-3xl">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-600 blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative h-32 w-32 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 p-1 border border-gray-100 dark:border-white/10 overflow-hidden shadow-2xl">
                                <div className="h-full w-full rounded-[2.2rem] bg-white dark:bg-black flex items-center justify-center text-blue-600">
                                    <UserIcon size={48} />
                                </div>
                            </div>
                        </div>

                        <div className="text-center md:text-left space-y-3 pb-2">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 bg-blue-600/10 px-3 py-1 rounded-lg">
                                    {isVerified ? 'Verified Agent' : 'Platinum Member'}
                                </span>
                                <ShieldCheck size={14} className="text-blue-600" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic dark:text-white leading-[0.9]">
                                {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]} <span className="text-blue-600">Command</span>
                            </h1>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 italic">Security Level: Authorized</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/agents/list" className="h-14 px-8 rounded-2xl bg-blue-600 text-white flex items-center gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition-all active:scale-95">
                            <Plus size={18} /> Post Asset
                        </Link>
                        <Link href="/settings" className="h-14 w-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all border border-transparent hover:border-blue-600/20">
                            <Settings size={18} />
                        </Link>
                        <SignOutButton />
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto p-6 lg:p-12 grid grid-cols-1 lg:grid-cols-3 gap-16 mt-10">

                {/* Main: Active Itinerary */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic dark:text-white">Active <span className="text-blue-600">Itinerary</span></h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Currently {upcomingBookings.length} Scheduled Access Points</p>
                        </div>
                        <Link href="/search" className="h-12 px-6 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.05] transition-all flex items-center gap-2">
                            Locate New Asset <Zap size={14} />
                        </Link>
                    </div>

                    <div className="space-y-8">
                        {upcomingBookings.length > 0 ? upcomingBookings.map((booking: any) => (
                            <div key={booking.id} className="bg-white dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm shadow-black/5 hover:border-blue-600/20 transition-all group">
                                <div className="flex flex-col md:flex-row h-full">
                                    <div className="relative w-full md:w-72 h-64 md:h-auto overflow-hidden shrink-0">
                                        <Image
                                            src={booking.properties.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'}
                                            alt=""
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                    </div>

                                    <div className="flex-1 p-10 flex flex-col justify-between gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">{booking.properties.type} Acquisition</span>
                                                <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                                    Verified Access
                                                </span>
                                            </div>
                                            <h3 className="text-3xl font-black tracking-tighter uppercase italic dark:text-white leading-none group-hover:text-blue-600 transition-colors">
                                                {booking.properties.title}
                                            </h3>
                                            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest gap-2">
                                                <MapPin size={14} className="text-blue-600" />
                                                {booking.properties.location}
                                            </div>
                                            <div className="flex items-center gap-3 mt-6">
                                                <div className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                                                    <Clock size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Temporal Window</p>
                                                    <p className="text-sm font-black dark:text-white uppercase italic">
                                                        {new Date(booking.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} @ {new Date(booking.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                                            <div className="w-full sm:w-auto space-y-2">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Secure Access Token</p>
                                                <div className="h-14 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center px-8 border border-transparent group-hover:border-blue-600/20 transition-all">
                                                    <KeyRound size={18} className="text-blue-600 mr-4" />
                                                    <span className="text-xl font-black italic tracking-[0.4em] dark:text-white">
                                                        {booking.properties.lockbox_code || "####"}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/properties/${booking.properties.id}`}
                                                className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest hover:scale-[1.05] transition-all flex items-center justify-center gap-2"
                                            >
                                                View Asset <ChevronRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-24 text-center space-y-8 bg-gray-50/50 dark:bg-white/5 rounded-[4rem] border border-dashed border-gray-200 dark:border-white/10">
                                <div className="h-24 w-24 rounded-[2rem] bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto text-gray-300">
                                    <Clock size={48} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tighter uppercase italic dark:text-white">Your Itinerary is clear</h3>
                                    <p className="text-gray-500 font-medium mt-2">Ready to explore elite acquisitions? Start your search below.</p>
                                </div>
                                <Link href="/search" className="btn-primary inline-flex">Explore Catalog</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Intelligence & Vault */}
                <div className="space-y-12">
                    {/* My Assets (Selling) Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 italic">Active Assets</h3>
                            <span className="h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-black">
                                {listings?.length || 0}
                            </span>
                        </div>
                        <div className="space-y-4">
                            {listings && listings.length > 0 ? listings.map((listing: any) => (
                                <Link key={listing.id} href={`/properties/${listing.id}`} className="block group">
                                    <div className="p-4 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-blue-600/20 transition-all flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative shrink-0">
                                            <Image
                                                src={listing.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400'}
                                                alt=""
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-black truncate dark:text-white group-hover:text-blue-600 transition-colors uppercase italic">{listing.title}</h4>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-[10px] font-bold text-gray-500 truncate">{listing.location}</p>
                                                <span className={cn(
                                                    "text-[8px] font-black uppercase px-2 py-0.5 rounded",
                                                    listing.status === 'available' ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                                                )}>
                                                    {listing.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <div className="p-10 text-center rounded-[2.5rem] border border-dashed border-gray-100 dark:border-white/5">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No assets listed</p>
                                    <Link href="/agents/list" className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2 block hover:underline">List First Asset</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-10 rounded-[3rem] bg-blue-600 text-white shadow-2xl shadow-blue-600/30 relative overflow-hidden group">
                        <ShieldCheck size={180} className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10 space-y-6 text-center">
                            <h3 className="text-2xl font-black tracking-tighter uppercase italic">Concierge <br /> <span className="opacity-70">Intelligence</span></h3>
                            <p className="text-sm font-medium leading-relaxed opacity-80">
                                Need technical briefing for your next visit? Our senior consultants are on standby to assist with protocol.
                            </p>
                            <AIPrestigeTrigger className="h-14 w-full rounded-2xl bg-white text-blue-600 text-xs font-black uppercase tracking-widest shadow-xl hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-center gap-2">
                                <MessageCircle size={18} /> Open Comms
                            </AIPrestigeTrigger>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-4 italic">Security Vault</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Saved Assets', icon: Heart, count: 4 },
                                { label: 'Selection History', icon: Eye },
                                { label: 'Access Logs', icon: KeyRound },
                                { label: 'My Contracts', icon: ShieldCheck, variant: 'soon' },
                            ].map((item, i) => (
                                <button key={i} className="w-full h-16 flex items-center justify-between px-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-blue-600/20 transition-all group">
                                    <div className="flex items-center gap-4 text-gray-400 group-hover:text-blue-600 transition-colors">
                                        <item.icon size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-gray-900 dark:group-hover:text-white">{item.label}</span>
                                    </div>
                                    {item.count ? (
                                        <span className="h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-black">{item.count}</span>
                                    ) : item.variant === 'soon' ? (
                                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-300">Soon</span>
                                    ) : (
                                        <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-600 transition-all" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
