'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheck, Loader2, Key, Lock, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
            router.refresh();
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Aesthetic */}
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
                        <Key size={32} />
                    </div>
                    <h2 className="mt-6 text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">
                        Elite Access
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Welcome back to Arca Estate.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-1 block">Credentials: Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="input-premium w-full pl-14"
                                    placeholder="alexander@arcaestate.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center ml-1 mb-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block">Access Key: Password</label>
                                <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:underline">Forgot Key?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="input-premium w-full pl-14"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
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
                            className="btn-primary w-full flex items-center justify-center h-14"
                        >
                            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "Authorize Entry"}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                    New to the circle?{' '}
                    <Link href="/signup" className="font-bold text-blue-600 hover:text-blue-500 hover:underline">
                        Initiate Membership
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
