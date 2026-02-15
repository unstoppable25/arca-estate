'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
    Home,
    MapPin,
    LayoutList,
    Camera,
    Eye,
    ChevronRight,
    ChevronLeft,
    Plus,
    X,
    CheckCircle2,
    Loader2,
    Lock,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PropertyMap } from '@/components/discovery/property-map';

const AMENITIES_OPTIONS = [
    "WiFi", "Parking", "Pool", "Gym", "Security", "Furnished", "Air Conditioning", "Balcony", "Garden", "Elevator"
];

export default function ListingWizardPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        type: 'buy',
        bedrooms: '1',
        bathrooms: '1',
        amenities: [] as string[],
        images: [] as string[],
        video_url: '',
        self_viewing_enabled: false,
        lockbox_code: '',
        viewing_slots: [] as any[],
        latitude: 6.4654,
        longitude: 3.3792
    });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            // Fetch profile for verification status
            const { data: profile } = await supabase
                .from('profiles')
                .select('verification_status')
                .eq('id', user.id)
                .single();

            setUser({ ...user, verification_status: profile?.verification_status });
        };
        checkUser();
    }, [router, supabase]);

    const handleAmenityToggle = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        const isVerified = user.verification_status === 'verified';

        const { error } = await supabase.from('properties').insert({
            owner_id: user.id,
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            location: formData.location,
            type: formData.type,
            bedrooms: parseInt(formData.bedrooms),
            bathrooms: parseInt(formData.bathrooms),
            amenities: formData.amenities,
            images: formData.images,
            video_tour_url: formData.video_url,
            self_viewing_enabled: formData.self_viewing_enabled,
            lockbox_code: formData.lockbox_code,
            viewing_slots: formData.viewing_slots,
            latitude: formData.latitude,
            longitude: formData.longitude,
            status: isVerified ? 'available' : 'pending' // Moderated access
        });

        if (error) {
            alert(error.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
        }
    };

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Sidebar Progress */}
            <div className="hidden lg:flex w-80 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex-col p-10">
                <div className="flex items-center gap-3 mb-12">
                    <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                        <Home size={24} />
                    </div>
                    <span className="font-black uppercase tracking-tighter italic text-xl dark:text-white">Arca Estate</span>
                </div>

                <div className="space-y-8">
                    {[
                        { s: 1, label: "The Basics", icon: LayoutList },
                        { s: 2, label: "Property Specs", icon: Home },
                        { s: 3, label: "Media Assets", icon: Camera },
                        { s: 4, label: "Self-Viewing", icon: Eye }
                    ].map((item) => (
                        <div key={item.s} className="flex items-center gap-4">
                            <div className={cn(
                                "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
                                step === item.s ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" :
                                    step > item.s ? "bg-green-500/10 text-green-500" : "bg-secondary text-gray-400"
                            )}>
                                {step > item.s ? <CheckCircle2 size={24} /> : <item.icon size={24} />}
                            </div>
                            <div>
                                <p className={cn(
                                    "text-[10px] font-black uppercase tracking-widest",
                                    step >= item.s ? "text-blue-600" : "text-gray-400"
                                )}>Step 0{item.s}</p>
                                <p className={cn(
                                    "font-bold text-sm",
                                    step >= item.s ? "text-gray-900 dark:text-white" : "text-gray-400"
                                )}>{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Wizard Area */}
            <div className="flex-1 p-10 lg:p-20 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div>
                                    <h1 className="text-4xl font-black tracking-tighter uppercase italic dark:text-white">The Basics</h1>
                                    <p className="text-gray-500 font-medium">Define the core identity of your listing.</p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-2 block">Listing Headline</label>
                                        <input
                                            className="input-premium w-full text-xl"
                                            placeholder="e.g. Modern Penthouse with Skyline View"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-2 block">Property Type</label>
                                            <select
                                                className="input-premium w-full appearance-none"
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option value="buy">For Sale</option>
                                                <option value="rent">For Rent</option>
                                                <option value="short-let">Short Let</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-2 block">Price (USD)</label>
                                            <input
                                                type="number"
                                                className="input-premium w-full"
                                                placeholder="$ 250,000"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-2 block">Precise Spatial Coordinates</label>
                                        <div className="h-64 md:h-80 w-full mb-4">
                                            <PropertyMap
                                                properties={[]}
                                                center={[formData.longitude, formData.latitude]}
                                                zoom={14}
                                                className="h-full w-full rounded-[2rem]"
                                                onCoordinateSelect={(lng: number, lat: number) => {
                                                    setFormData({ ...formData, longitude: lng, latitude: lat });
                                                }}
                                            />
                                        </div>
                                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest italic text-center">
                                            Click on the map to drop the asset pin for precision tracking
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div>
                                    <h1 className="text-4xl font-black tracking-tighter uppercase italic dark:text-white">Specs & Perks</h1>
                                    <p className="text-gray-500 font-medium">What makes this property stand out?</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-2 block">Bedrooms</label>
                                            <input
                                                type="number"
                                                className="input-premium w-full"
                                                value={formData.bedrooms}
                                                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-2 block">Bathrooms</label>
                                            <input
                                                type="number"
                                                className="input-premium w-full"
                                                value={formData.bathrooms}
                                                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-4 block">Key Amenities</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {AMENITIES_OPTIONS.map((amenity) => (
                                                <button
                                                    key={amenity}
                                                    type="button"
                                                    onClick={() => handleAmenityToggle(amenity)}
                                                    className={cn(
                                                        "p-4 rounded-2xl border-2 transition-all font-bold text-sm text-left flex items-center justify-between",
                                                        formData.amenities.includes(amenity)
                                                            ? "border-blue-600 bg-blue-600/5 text-blue-600"
                                                            : "border-transparent bg-secondary/50 text-gray-400 hover:bg-secondary"
                                                    )}
                                                >
                                                    {amenity}
                                                    {formData.amenities.includes(amenity) && <CheckCircle2 size={16} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-2 block">Property Story</label>
                                        <textarea
                                            className="input-premium w-full min-h-[150px] py-4"
                                            placeholder="Write a compelling description that highlights unique features..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div>
                                    <h1 className="text-4xl font-black tracking-tighter uppercase italic dark:text-white">Media Assets</h1>
                                    <p className="text-gray-500 font-medium">Visuals are the bridge to conversion.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="border-4 border-dashed border-secondary rounded-3xl p-20 text-center hover:border-blue-600/30 transition-all cursor-pointer relative group">
                                        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <Camera className="mx-auto h-16 w-16 text-gray-300 group-hover:text-blue-600 transition-colors" />
                                        <p className="mt-4 text-sm font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                                            Upload up to 20 Ultra-HD Photos
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-2 block">Video Tour Link (Optional)</label>
                                        <input
                                            className="input-premium w-full"
                                            placeholder="Vimeo or YouTube URL"
                                            value={formData.video_url}
                                            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div>
                                    <h1 className="text-4xl font-black tracking-tighter uppercase italic dark:text-white">Self-Viewing</h1>
                                    <p className="text-gray-500 font-medium">Revolutionize the viewing experience.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className={cn(
                                        "p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer",
                                        formData.self_viewing_enabled
                                            ? "border-blue-600 bg-blue-600/5"
                                            : "border-transparent bg-secondary/50"
                                    )} onClick={() => setFormData({ ...formData, self_viewing_enabled: !formData.self_viewing_enabled })}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-14 w-14 rounded-2xl flex items-center justify-center transition-all",
                                                    formData.self_viewing_enabled ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                                                )}>
                                                    <Eye size={32} />
                                                </div>
                                                <div>
                                                    <p className="font-black uppercase tracking-tighter text-xl dark:text-white">Enable Self-Guided Tours</p>
                                                    <p className="text-sm text-gray-500 font-medium italic">Allow approved users to view without you.</p>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "h-8 w-14 rounded-full relative transition-all",
                                                formData.self_viewing_enabled ? "bg-blue-600" : "bg-gray-300"
                                            )}>
                                                <div className={cn(
                                                    "h-6 w-6 bg-white rounded-full absolute top-1 transition-all shadow-sm",
                                                    formData.self_viewing_enabled ? "left-7" : "left-1"
                                                )} />
                                            </div>
                                        </div>
                                    </div>

                                    {formData.self_viewing_enabled && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="space-y-10 pt-4"
                                        >
                                            <div className="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 space-y-6">
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-2 block flex items-center gap-2">
                                                        <Lock size={12} className="text-blue-600" /> Secure Lockbox Protocol
                                                    </label>
                                                    <input
                                                        className="input-premium w-full text-4xl tracking-[0.5em] font-black text-center py-6"
                                                        placeholder="123456"
                                                        maxLength={6}
                                                        value={formData.lockbox_code}
                                                        onChange={(e) => setFormData({ ...formData, lockbox_code: e.target.value })}
                                                    />
                                                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest text-center mt-4 italic"> This code is only shared with identity-verified users during their active booking window.</p>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-2 block flex items-center gap-2">
                                                    <Clock size={12} className="text-blue-600" /> Availability Matrix (Next 7 Days)
                                                </label>

                                                <div className="grid grid-cols-7 gap-2">
                                                    {Array.from({ length: 7 }).map((_, i) => {
                                                        const date = new Date();
                                                        date.setDate(date.getDate() + i);
                                                        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                                                        const dayNum = date.getDate();

                                                        return (
                                                            <div key={i} className="space-y-4">
                                                                <div className="text-center p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                                                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">{dayName}</p>
                                                                    <p className="text-xs font-black dark:text-white">{dayNum}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    {['09:00', '12:00', '15:00', '18:00'].map((time) => {
                                                                        const slotId = `${date.toISOString().split('T')[0]}_${time}`;
                                                                        const isSelected = formData.viewing_slots.includes(slotId);

                                                                        return (
                                                                            <button
                                                                                key={time}
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setFormData(prev => ({
                                                                                        ...prev,
                                                                                        viewing_slots: isSelected
                                                                                            ? prev.viewing_slots.filter(s => s !== slotId)
                                                                                            : [...prev.viewing_slots, slotId]
                                                                                    }));
                                                                                }}
                                                                                className={cn(
                                                                                    "w-full py-2 rounded-lg text-[9px] font-black transition-all border",
                                                                                    isSelected
                                                                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                                                                                        : "bg-white dark:bg-transparent border-gray-100 dark:border-white/10 text-gray-400 hover:border-blue-600/50"
                                                                                )}
                                                                            >
                                                                                {time}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="mt-20 flex justify-between items-center bg-white dark:bg-black p-6 rounded-[2rem] border border-gray-100 dark:border-gray-900 shadow-premium">
                        <button
                            onClick={prevStep}
                            disabled={step === 1}
                            className={cn(
                                "flex items-center gap-2 font-black uppercase tracking-widest text-xs transition-all",
                                step === 1 ? "opacity-0 invisible" : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            )}
                        >
                            <ChevronLeft size={16} /> Back
                        </button>

                        <div className="flex gap-4">
                            {step < 4 ? (
                                <button
                                    onClick={nextStep}
                                    className="btn-primary flex items-center gap-2 px-10"
                                >
                                    Proceed to Next Step <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="btn-primary flex items-center gap-2 px-10 bg-green-600 hover:bg-green-500 shadow-green-600/20"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <>Finalize & Publish Listing <CheckCircle2 size={18} /></>}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
