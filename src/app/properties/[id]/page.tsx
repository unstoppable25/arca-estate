import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { BookingForm } from '@/components/bookings/booking-form';
import { MapPin, Check, ShieldCheck, Bed, Bath, Maximize, Share2, Heart, Eye, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as motion from 'framer-motion/client';
import { PropertyMap } from '@/components/discovery/property-map';

export const revalidate = 0;

interface PropertyPageProps {
    params: {
        id: string;
    };
}

export async function generateMetadata({ params }: PropertyPageProps) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: property } = await supabase
        .from('properties')
        .select('title, description, location, type, price')
        .eq('id', id)
        .single();

    if (!property) return { title: 'Asset Not Found | Arca Estate' };

    const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(property.price);

    return {
        title: `${property.title} | ${price} | Arca Estate Prestige`,
        description: `Experience ${property.title} in ${property.location}. A premier ${property.type} acquisition offered at ${price}. Secure your private tour today.`,
        openGraph: {
            title: property.title,
            description: property.description,
            type: 'website',
        }
    };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: property, error } = await supabase
        .from('properties')
        .select(`
            *,
            agent:profiles!properties_owner_id_fkey (*)
        `)
        .eq('id', id)
        .single();

    if (error || !property) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black pb-24">
            {/* Elite Sub-Header (Stats & Actions) */}
            <div className="pt-24 pb-10 px-6 lg:px-12 border-b border-gray-100 dark:border-white/5">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 bg-blue-600/10 px-3 py-1.5 rounded-lg shadow-sm">
                                Prestige {property.type === 'buy' ? 'Sale' : 'Residence'}
                            </span>
                            {property.is_featured && (
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 bg-amber-600/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                                    <Zap size={10} className="fill-amber-600" /> Featured Asset
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic dark:text-white leading-[0.85]">
                            {property.title}
                        </h1>
                        <div className="flex items-center text-sm font-medium text-gray-400 uppercase tracking-widest gap-2">
                            <MapPin size={18} className="text-blue-600" />
                            {property.location}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="h-14 w-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/20">
                            <Heart size={24} />
                        </button>
                        <button className="h-14 w-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors border border-transparent hover:border-blue-600/20">
                            <Share2 size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Immersive Gallery Section */}
            <div className="px-6 lg:px-12 mt-10">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[50vh] min-h-[500px] overflow-hidden rounded-[3rem]">
                        <div className="lg:col-span-2 relative h-full group cursor-pointer overflow-hidden">
                            <Image
                                src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'}
                                alt=""
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div className="hidden lg:grid grid-rows-2 gap-4 lg:col-span-1">
                            <div className="relative h-full overflow-hidden group cursor-pointer">
                                <Image
                                    src={property.images?.[1] || 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=800'}
                                    alt=""
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="relative h-full overflow-hidden group cursor-pointer">
                                <Image
                                    src={property.images?.[2] || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800'}
                                    alt=""
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        </div>
                        <div className="hidden lg:grid grid-rows-2 gap-4 lg:col-span-1">
                            <div className="relative h-full overflow-hidden group cursor-pointer">
                                <Image
                                    src={property.images?.[3] || 'https://images.unsplash.com/photo-1600607687940-4e52723659a9?auto=format&fit=crop&q=80&w=800'}
                                    alt=""
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="relative h-full overflow-hidden group cursor-pointer bg-blue-600 flex items-center justify-center text-white">
                                <div className="text-center">
                                    <p className="text-2xl font-black italic">+ {property.images?.length || '12'}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest mt-1">Full Portfolio</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content & Logic */}
            <div className="px-6 lg:px-12 mt-20">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-20">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-16">
                        {/* Highlights Grid */}
                        <div className="grid grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <div className="h-16 w-16 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center text-blue-600">
                                    <Bed size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bedrooms</p>
                                    <p className="text-xl font-black italic dark:text-white">{property.bedrooms} Units</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-16 w-16 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center text-blue-600">
                                    <Bath size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bathrooms</p>
                                    <p className="text-xl font-black italic dark:text-white">{property.bathrooms} Luxury</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-16 w-16 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center text-blue-600">
                                    <Maximize size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Surface</p>
                                    <p className="text-xl font-black italic dark:text-white">4,200 SQFT</p>
                                </div>
                            </div>
                        </div>

                        {/* Story / Description */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic dark:text-white">Curator's Notes</h2>
                            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed dark:text-gray-400">
                                {property.description || "This exceptional residence offers an unparalleled blend of modern sophistication and timeless elegance. Situated in a prime location, it features cutting-edge security, premium finishes, and expansive living spaces designed for the discerning individual."}
                            </p>
                        </div>

                        {/* Amenities Grid */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic dark:text-white">Amenities</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(property.amenities as string[] || ["Smart Home Automation", "Private Infinity Pool", "24/7 Elite Security", "Custom Chef Kitchen", "Wine Cellar", "Private Spa"]).map((amenity, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border border-transparent hover:border-blue-600/20 transition-all">
                                        <div className="h-8 w-8 bg-blue-600/10 text-blue-600 rounded-lg flex items-center justify-center">
                                            <Check size={18} />
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-widest">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Spatial Location Map */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic dark:text-white">Spatial Coordinates</h2>
                            <PropertyMap
                                properties={[property as any]}
                                center={[property.longitude || 3.3792, property.latitude || 6.4654]}
                                zoom={15}
                                className="h-[400px] w-full"
                            />
                        </div>

                        {/* Agent / Curator Card */}
                        <div className="p-10 rounded-[3rem] bg-blue-600 text-white relative overflow-hidden group">
                            <ShieldCheck size={200} className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                <div className="h-32 w-32 rounded-[2rem] bg-white p-1 shadow-2xl overflow-hidden flex-shrink-0">
                                    <Image
                                        src={property.agent?.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'}
                                        alt=""
                                        width={128}
                                        height={128}
                                        className="h-full w-full object-cover rounded-[1.8rem]"
                                    />
                                </div>
                                <div className="text-center md:text-left space-y-4">
                                    <div>
                                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Verified Agent</span>
                                            <ShieldCheck size={14} />
                                        </div>
                                        <h3 className="text-3xl font-black tracking-tighter uppercase italic italic">{property.agent?.full_name || 'Marcus Sterling'}</h3>
                                        <p className="text-white/70 font-medium">Head of Private Acquisitions</p>
                                    </div>
                                    <button className="bg-white text-blue-600 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-gray-100 transition-colors">
                                        Initiate Consultation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Widget */}
                    <div className="relative">
                        <div className="sticky top-32 space-y-6">
                            <BookingForm
                                propertyId={property.id}
                                price={property.price}
                                selfViewingEnabled={property.self_viewing_enabled || false}
                            />

                            <div className="p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 space-y-4 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-green-500">Currently Available</p>
                                </div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                                    This asset is listed under our <span className="text-blue-600 font-bold">Standard of Excellence</span> protocol. Guaranteed authenticity and secure access.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
