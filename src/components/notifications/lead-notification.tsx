'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Zap, X, User, MessageSquare, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LeadNotification({ agentId }: { agentId: string }) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        if (!agentId) return;

        // Listen for new bookings/leads where the property belongs to this agent
        const channel = supabase
            .channel('lead-alerts')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'bookings'
                },
                (payload) => {
                    // In a real app, we'd verify the property owner_id matches agentId
                    // via a join or by including it in the payload
                    const newNotification = {
                        id: Math.random().toString(36).substr(2, 9),
                        type: 'booking',
                        title: 'New Viewing Protocol Initiated',
                        message: 'An elite user has requested access to one of your assets.',
                        data: payload.new
                    };
                    setNotifications(prev => [newNotification, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [agentId, supabase]);

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="fixed bottom-10 right-10 z-[100] space-y-4 pointer-events-none">
            <AnimatePresence>
                {notifications.map((n) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        className="w-96 glass-card p-6 border-blue-600/30 bg-white/80 dark:bg-black/80 backdrop-blur-3xl shadow-[0_20px_50px_rgba(37,99,235,0.2)] pointer-events-auto relative overflow-hidden group"
                    >
                        {/* Status Glow */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />

                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
                                <Zap size={24} className="fill-white" />
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Intelligence Alert</p>
                                    <button
                                        onClick={() => removeNotification(n.id)}
                                        className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                <h4 className="text-sm font-black italic uppercase tracking-tighter dark:text-white">{n.title}</h4>
                                <p className="text-[10px] font-medium text-gray-500 leading-relaxed uppercase tracking-widest">{n.message}</p>

                                <div className="pt-4 flex items-center gap-3">
                                    <button className="h-10 px-6 rounded-xl bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/10">
                                        Open Dossier <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Animated Glow Decor */}
                        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-600/5 blur-[40px] rounded-full group-hover:bg-blue-600/10 transition-colors" />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
