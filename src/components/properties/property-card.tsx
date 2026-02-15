'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, BedDouble, Bath, Maximize, ShieldCheck, Eye } from 'lucide-react';
import { Database } from '@/types/supabase';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Property = Database['public']['Tables']['properties']['Row'];

interface PropertyCardProps {
    property: Property;
    className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
    const mainImage = property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000';

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className={cn("group relative", className)}
        >
            <Link
                href={`/properties/${property.id}`}
                className="flex flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-black border border-gray-100 dark:border-white/5 transition-all hover:shadow-2xl hover:shadow-blue-600/10"
            >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                        src={mainImage}
                        alt={property.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Status Badges */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                        {(property as any).is_featured && (
                            <div className="bg-blue-600 text-[10px] font-black text-white px-3 py-1.5 rounded-full uppercase tracking-tighter flex items-center gap-1.5 shadow-xl shadow-blue-600/20">
                                <ShieldCheck size={12} /> Elite Listing
                            </div>
                        )}
                        {(property as any).self_viewing_enabled && (
                            <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-black text-blue-600 px-3 py-1.5 rounded-full uppercase tracking-tighter flex items-center gap-1.5">
                                <Eye size={12} /> Instant Access
                            </div>
                        )}
                    </div>

                    {/* Price Overlay */}
                    <div className="absolute bottom-6 right-6 flex flex-col items-end">
                        <div className="bg-white/90 dark:bg-black/80 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl border border-white/20">
                            <span className="text-xl font-black tracking-tighter text-blue-600">
                                {formatPrice(property.price)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col p-8 bg-white dark:bg-black">
                    <div className="space-y-2">
                        <h3 className="line-clamp-1 text-2xl font-black tracking-tighter uppercase italic dark:text-white transition-colors group-hover:text-blue-600">
                            {property.title}
                        </h3>
                        <div className="flex items-center text-xs font-medium text-gray-400 uppercase tracking-widest">
                            <MapPin size={14} className="mr-1.5 text-blue-600" />
                            <span className="line-clamp-1">{property.location}</span>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2 group/stat">
                                <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                                    <BedDouble size={14} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Beds</p>
                                    <p className="text-sm font-bold dark:text-white">{(property as any).bedrooms}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 group/stat">
                                <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                                    <Bath size={14} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Baths</p>
                                    <p className="text-sm font-bold dark:text-white">{(property as any).bathrooms}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 group/stat">
                                <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center group-hover/stat:scale-110 transition-transform">
                                    <Maximize size={14} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Sqft</p>
                                    <p className="text-sm font-bold dark:text-white">{(property as any).sqft}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export function PropertyCardSkeleton() {
    return (
        <div className="flex flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-black border border-gray-100 dark:border-white/5 animate-pulse">
            <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-white/5" />
            <div className="p-8 space-y-6">
                <div className="space-y-3">
                    <div className="h-8 w-3/4 bg-gray-100 dark:bg-white/5 rounded-xl" />
                    <div className="h-4 w-1/2 bg-gray-100 dark:bg-white/5 rounded-lg" />
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
                    <div className="flex gap-6">
                        <div className="h-10 w-24 bg-gray-100 dark:bg-white/5 rounded-xl" />
                        <div className="h-10 w-24 bg-gray-100 dark:bg-white/5 rounded-xl" />
                    </div>
                    <div className="h-12 w-12 bg-gray-100 dark:bg-white/5 rounded-2xl" />
                </div>
            </div>
        </div>
    );
}
