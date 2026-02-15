'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Calendar, Clock, ShieldCheck, Zap, Info, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function BookingForm({
    propertyId,
    price,
    selfViewingEnabled = false
}: {
    propertyId: string;
    price: number;
    selfViewingEnabled?: boolean;
}) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push(`/login?next=/properties/${propertyId}`);
            return;
        }

        const startTime = new Date(`${date}T${time}`);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

        const { error } = await supabase.from('bookings').insert({
            property_id: propertyId,
            user_id: user.id,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            status: 'confirmed',
        });

        if (error) {
            alert('Selection failed: ' + error.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="glass-card p-10 border border-white/20 dark:border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-all duration-700" />

            <div className="relative z-10 space-y-8">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Fixed Acquisition Value</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black tracking-tighter italic dark:text-white">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">Net</span>
                    </div>
                </div>

                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-100 dark:via-white/10 to-transparent" />

                <form onSubmit={handleBook} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block ml-4 text-center">
                                Selection Date
                            </label>
                            <div className="relative group/input">
                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within/input:text-blue-600 transition-colors" />
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-[1.5rem] pl-16 pr-6 h-14 text-sm font-bold focus:ring-2 focus:ring-blue-600/20 transition-all dark:text-white appearance-none"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block ml-4 text-center">
                                Preferred Window
                            </label>
                            <div className="relative group/input">
                                <Clock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within/input:text-blue-600 transition-colors" />
                                <select
                                    required
                                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-[1.5rem] pl-16 pr-6 h-14 text-sm font-bold focus:ring-2 focus:ring-blue-600/20 transition-all dark:text-white appearance-none cursor-pointer"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                >
                                    <option value="" className="bg-white dark:bg-black">Select Window...</option>
                                    <option value="09:00" className="bg-white dark:bg-black">Early Morning (09:00)</option>
                                    <option value="11:00" className="bg-white dark:bg-black">Late Morning (11:00)</option>
                                    <option value="14:00" className="bg-white dark:bg-black">Mid Afternoon (14:00)</option>
                                    <option value="16:00" className="bg-white dark:bg-black">Late Afternoon (16:00)</option>
                                    <option value="18:30" className="bg-white dark:bg-black">Sunset Perspective (18:30)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={cn(
                                "w-full h-16 rounded-[1.5rem] bg-blue-600 text-white text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/40 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3",
                                loading && "opacity-70 cursor-not-allowed"
                            )}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Authorize Access <ShieldCheck size={18} />
                                </>
                            )}
                        </button>

                        <div className="flex items-center justify-center gap-6">
                            <div className="flex items-center gap-1.5 opacity-50">
                                <ShieldCheck size={12} className="text-blue-600" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 text-center">Encrypted</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-50">
                                <Zap size={12} className="text-blue-600" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 text-center">Instant</span>
                            </div>
                            {selfViewingEnabled && (
                                <div className="flex items-center gap-1.5">
                                    <Eye size={12} className="text-blue-600" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-blue-600 text-center">Self-Guided</span>
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                <div className="bg-blue-600/5 dark:bg-blue-600/10 p-4 rounded-2xl flex gap-3 items-start border border-blue-600/10">
                    <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[9px] font-medium leading-relaxed text-gray-600 dark:text-gray-400 uppercase tracking-wider text-center">
                        Identity verification is mandatory prior to physical access. Viewing codes are valid for 60 minutes.
                    </p>
                </div>
            </div>
        </div>
    );
}
