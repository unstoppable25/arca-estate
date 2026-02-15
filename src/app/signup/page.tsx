'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheck, Loader2, User, UserPlus, Building2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<'user' | 'agent'>('user');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
                data: {
                    full_name: fullName,
                    role: role,
                }
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full max-w-md space-y-8 glass-card p-10 text-center"
                >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-500/10 text-green-500">
                        <CheckCircle2 size={48} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white uppercase italic">
                            Verify Your Identity
                        </h2>
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                            We've sent a high-priority activation link to <span className="text-blue-600 font-bold">{email}</span>. Please click it to finalize your secure access.
                        </p>
                    </div>
                    <div className="pt-4">
                        <Link href="/login" className="btn-primary w-full inline-block">
                            Back to Secure Login
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0066FF] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8 glass-card p-10"
            >
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-2xl shadow-blue-600/30">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="mt-6 text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">
                        Join Arca Estate
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Enter the elite circle of real estate.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    <div className="space-y-4">
                        {/* Role Selection */}
                        <div className="flex gap-4 mb-8">
                            <button
                                type="button"
                                onClick={() => setRole('user')}
                                className={cn(
                                    "flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                                    role === 'user'
                                        ? "border-blue-600 bg-blue-600/5 text-blue-600"
                                        : "border-transparent bg-secondary/50 text-gray-400 hover:bg-secondary"
                                )}
                            >
                                <User size={24} />
                                <span className="text-xs font-black uppercase tracking-widest">Buyer/Renter</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('agent')}
                                className={cn(
                                    "flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                                    role === 'agent'
                                        ? "border-blue-600 bg-blue-600/5 text-blue-600"
                                        : "border-transparent bg-secondary/50 text-gray-400 hover:bg-secondary"
                                )}
                            >
                                <Building2 size={24} />
                                <span className="text-xs font-black uppercase tracking-widest">Agent/Owner</span>
                            </button>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-1 block">Full Display Name</label>
                            <input
                                required
                                className="input-premium w-full"
                                placeholder="e.g. Alexander Pierce"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-1 block">Verified Email</label>
                            <input
                                type="email"
                                required
                                className="input-premium w-full"
                                placeholder="alexander@arcaestate.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-1 block">Secret Access Key</label>
                            <input
                                type="password"
                                required
                                className="input-premium w-full"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-xs text-red-500 font-black text-center uppercase tracking-tighter"
                            >
                                Security Alert: {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "Initiate Onboarding"}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Part of the guild?{' '}
                    <Link href="/login" className="font-bold text-blue-600 hover:text-blue-500 hover:underline">
                        Sign in for Secure Access
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
