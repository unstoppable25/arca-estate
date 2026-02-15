import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, XCircle, MapPin, Clock, ExternalLink, ChevronLeft } from 'lucide-react';

export const revalidate = 0;

export default async function AdminApprovalsPage() {
    const supabase = await createClient();

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') redirect('/dashboard');

    // Fetch pending properties
    const { data: pendingProperties } = await supabase
        .from('properties')
        .select(`
            *,
            owner:profiles (
                full_name,
                email,
                verification_status
            )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
            {/* Admin Header */}
            <div className="pt-24 pb-12 px-6 lg:px-12 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-black/50 backdrop-blur-3xl">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                    <div>
                        <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors mb-4">
                            <ChevronLeft size={14} /> Back to Super Panel
                        </Link>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic dark:text-white">
                            Approval <span className="text-blue-600">Queue</span>
                        </h1>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-2">
                            Awaiting Vetting: {pendingProperties?.length || 0} Assets
                        </p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 shadow-xl shadow-blue-600/5">
                        <ShieldCheck size={28} />
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto p-6 lg:p-12">
                <div className="grid grid-cols-1 gap-8">
                    {pendingProperties && pendingProperties.length > 0 ? pendingProperties.map((property: any) => (
                        <div key={property.id} className="bg-white dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm hover:border-blue-600/20 transition-all group flex flex-col lg:flex-row">
                            {/* Image Preview */}
                            <div className="relative w-full lg:w-[400px] h-[300px] lg:h-auto overflow-hidden shrink-0">
                                <Image
                                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'}
                                    alt=""
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute top-6 left-6 text-[10px] font-black uppercase tracking-[0.2em] bg-black/50 text-white backdrop-blur-xl px-4 py-2 rounded-xl">
                                    {property.type}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-10 flex flex-col justify-between gap-10">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Owner Identity</p>
                                            <div className="flex items-center gap-2">
                                                <span className="font-black dark:text-white italic uppercase">{property.owner?.full_name || 'Anonymous User'}</span>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">({property.owner?.email})</span>
                                                {property.owner?.verification_status === 'verified' && <ShieldCheck size={12} className="text-blue-600" />}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Asking Price</p>
                                            <p className="text-2xl font-black text-gray-900 dark:text-white italic">${property.price.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black tracking-tighter uppercase italic dark:text-white leading-none">
                                            {property.title}
                                        </h3>
                                        <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest gap-2">
                                            <MapPin size={14} className="text-blue-600" />
                                            {property.location}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        {property.amenities?.slice(0, 4).map((amenity: string) => (
                                            <span key={amenity} className="text-[8px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/10 px-3 py-1 rounded-full text-gray-400">
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center gap-4">
                                    <button
                                        formAction={async () => {
                                            'use server';
                                            const supabase = await createClient();
                                            await supabase.from('properties').update({ status: 'available' }).eq('id', property.id);
                                        }}
                                        className="h-14 w-full sm:w-auto px-10 rounded-2xl bg-green-600 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-green-600/20 hover:bg-green-500 transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 size={18} /> Authorize Listing
                                    </button>
                                    <button
                                        formAction={async () => {
                                            'use server';
                                            const supabase = await createClient();
                                            await supabase.from('properties').update({ status: 'rejected' }).eq('id', property.id);
                                        }}
                                        className="h-14 w-full sm:w-auto px-10 rounded-2xl bg-white dark:bg-white/5 text-red-500 border border-red-500/20 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <XCircle size={18} /> Reject Asset
                                    </button>
                                    <Link
                                        href={`/properties/${property.id}`}
                                        className="h-14 w-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all border border-transparent hover:border-blue-600/20 ml-auto"
                                    >
                                        <ExternalLink size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-32 text-center space-y-8 bg-white dark:bg-white/5 rounded-[4rem] border border-dashed border-gray-200 dark:border-white/10">
                            <div className="h-24 w-24 rounded-[3rem] bg-gray-50 dark:bg-white/5 flex items-center justify-center mx-auto text-gray-200">
                                <Clock size={48} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter uppercase italic dark:text-white">Queue is Empty</h3>
                                <p className="text-gray-500 font-medium mt-2">All global assets have been vetted and authorized.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
