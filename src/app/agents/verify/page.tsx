'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheck, Upload, Phone, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';

export default function AgentVerifyPage() {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                router.push('/login');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role, verification_status')
                .eq('id', authUser.id)
                .single();

            if (profile?.role !== 'agent' && profile?.role !== 'admin') {
                router.push('/dashboard');
                return;
            }

            if (profile?.verification_status === 'verified') {
                router.push('/agents/dashboard');
                return;
            }

            setUser(authUser);
        };
        checkUser();
    }, [router, supabase]);

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate phone verification
        setTimeout(() => {
            setStep(2);
            setLoading(false);
        }, 1500);
    };

    const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !user) return;
        setLoading(true);
        // Simulate ID upload to Supabase Storage
        setTimeout(async () => {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    verification_status: 'pending',
                    phone_number: phone
                })
                .eq('id', user.id);

            if (updateError) {
                setError(updateError.message);
            } else {
                setStep(3);
            }
            setLoading(false);
        }, 2000);
    };

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center dark:bg-gray-950">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl glass-card p-12"
            >
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between mb-4">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-full font-black transition-all",
                                    step >= s ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-secondary text-gray-400"
                                )}
                            >
                                {step > s ? <CheckCircle2 size={20} /> : s}
                            </div>
                        ))}
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-600"
                            animate={{ width: `${((step - 1) / 2) * 100}%` }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center">
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600/10 text-blue-600">
                                    <Phone size={40} />
                                </div>
                                <h2 className="mt-6 text-3xl font-black tracking-tighter uppercase italic text-gray-900 dark:text-white">Secure Contact</h2>
                                <p className="mt-2 text-gray-500 font-medium text-sm">Verify your mobile number to receive lead alerts.</p>
                            </div>

                            <form onSubmit={handlePhoneSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-1 block">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        className="input-premium w-full text-lg tracking-widest"
                                        placeholder="+1 (555) 000-0000"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <button type="submit" disabled={loading} className="btn-primary w-full h-16 text-lg">
                                    {loading ? <Loader2 className="animate-spin mx-auto h-6 w-6" /> : "Receive Verification Code"}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center">
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600/10 text-blue-600">
                                    <Upload size={40} />
                                </div>
                                <h2 className="mt-6 text-3xl font-black tracking-tighter uppercase italic text-gray-900 dark:text-white">Identify Yourself</h2>
                                <p className="mt-2 text-gray-500 font-medium text-sm">Upload a valid government ID to start listing properties.</p>
                            </div>

                            <div className="border-4 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center hover:border-blue-600/30 transition-all cursor-pointer relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleIdUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    disabled={loading}
                                />
                                <Upload className="mx-auto h-12 w-12 text-gray-300 group-hover:text-blue-600 transition-colors" />
                                <p className="mt-4 text-sm font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                                    {loading ? "Uploading Encrypted Data..." : "Drop ID Image or Click to Browse"}
                                </p>
                                <p className="mt-2 text-xs text-gray-400 uppercase italic">PNG, JPG up to 10MB</p>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-2xl">
                                    <AlertCircle size={20} />
                                    <span className="text-sm font-bold uppercase tracking-tighter">{error}</span>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8"
                        >
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-blue-600 text-white shadow-2xl shadow-blue-600/30">
                                <ShieldCheck size={56} />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black tracking-tighter uppercase italic text-gray-900 dark:text-white">Under Review</h2>
                                <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                    Our security team is verifying your documents. This usually takes <span className="text-blue-600 font-bold">less than 2 hours</span>. We'll notify you once you're cleared to list.
                                </p>
                            </div>
                            <div className="pt-4">
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="btn-primary w-full h-16 text-lg"
                                >
                                    Go to My Dashboard
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
