'use client';

import Link from 'next/link';
import { ShieldCheck, User, Search, Bell, Menu, Zap } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";
import { SignOutButton } from '@/components/auth/sign-out-button';
import { cn } from "@/lib/utils";
import { AIPrestigeTrigger } from '@/components/discovery/ai-prestige-trigger';
import { useState, useEffect } from 'react';

export function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState('user');
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                setRole(profile?.role || 'user');
            }
        };
        checkUser();
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-2xl">
            <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-12">
                {/* Logo Section */}
                <div className="flex items-center gap-10">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20 group-hover:scale-105 transition-transform">
                            <ShieldCheck size={24} />
                        </div>
                        <span className="text-2xl font-black uppercase tracking-tighter italic dark:text-white">
                            Arca<span className="text-blue-600">.</span>Estate
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link href="/search?type=buy" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-blue-600 transition-colors">Experience</Link>
                        <Link href="/search?type=rent" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-blue-600 transition-colors">Residences</Link>
                        <Link href="/agents" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-blue-600 transition-colors">Elite Network</Link>
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-4 border-r border-gray-200 dark:border-white/10 pr-6">
                        <AIPrestigeTrigger className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-500">
                            <Search size={20} />
                        </AIPrestigeTrigger>
                        <AIPrestigeTrigger className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-500 relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-blue-600 rounded-full border-2 border-white dark:border-black" />
                        </AIPrestigeTrigger>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                {role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-600/10 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                    >
                                        Super Panel
                                    </Link>
                                )}
                                <Link
                                    href="/dashboard"
                                    className="text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 px-6 py-2.5 rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2"
                                >
                                    Command Center <Zap size={14} />
                                </Link>
                                <div className="hidden md:block">
                                    <SignOutButton />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="text-[11px] font-black uppercase tracking-widest bg-blue-600 text-white px-8 py-3.5 rounded-2xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20 active:scale-95"
                                >
                                    Join the Circle
                                </Link>
                            </div>
                        )}
                        <button className="lg:hidden h-12 w-12 flex items-center justify-center rounded-2xl bg-secondary text-gray-900 dark:text-white">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
