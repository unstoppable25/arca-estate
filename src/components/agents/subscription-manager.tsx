'use client';

import { useState } from 'react';
import { Check, ShieldCheck, Zap, Globe, Users, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const PLANS = [
    {
        id: 'standard',
        name: 'Standard Oracle',
        price: '49',
        description: 'Ideal for independent curators entering the Arca ecosystem.',
        features: [
            'Up to 10 Platinum Listings',
            'Identity Verification Shield',
            'Standard Lead Analytics',
            'Direct Client Messaging'
        ],
        color: 'gray'
    },
    {
        id: 'platinum',
        name: 'Platinum Elite',
        price: '149',
        description: 'Advanced spatial tools and prioritized discovery ranking.',
        features: [
            'Unlimited Listing Assets',
            'Priority Search Placement',
            'Self-Guided Tour Infrastructure',
            'Advanced Market Intelligence',
            'Video Portfolio Support'
        ],
        highlight: true,
        color: 'blue'
    },
    {
        id: 'enterprise',
        name: 'Enterprise Nexus',
        price: '499',
        description: 'Full-spectrum dominance for elite real estate agencies.',
        features: [
            'Global Network Access',
            'Dynamic API Integration',
            'Dedicated Account Strategist',
            'White-label Reporting',
            'Infinite Security Audits'
        ],
        color: 'indigo'
    }
];

export function SubscriptionManager({ currentPlan = 'standard' }: { currentPlan?: string }) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleSubscribe = (planId: string) => {
        setLoading(planId);
        // Integrate with Stripe/Paystack here
        setTimeout(() => {
            setLoading(null);
            alert(`Initiating secure protocol for ${planId} tier...`);
        }, 1500);
    };

    return (
        <section className="space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic dark:text-white leading-none">
                    Commercial <span className="text-blue-600">Tiers</span>
                </h2>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.3em] italic">
                    Acquire the tools of the global elite
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PLANS.map((plan) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -10 }}
                        className={cn(
                            "relative overflow-hidden p-10 rounded-[3rem] border transition-all duration-500",
                            plan.highlight
                                ? "bg-white dark:bg-white/5 border-blue-600 shadow-2xl shadow-blue-600/10"
                                : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/5"
                        )}
                    >
                        {plan.highlight && (
                            <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-blue-600/20">
                                <Zap size={10} className="fill-white" /> Recommended
                            </div>
                        )}

                        <div className="space-y-8 relative z-10">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{plan.name}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black tracking-tighter italic dark:text-white">${plan.price}</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">/mo</span>
                                </div>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">{plan.description}</p>
                            </div>

                            <div className="h-[1px] w-full bg-gray-100 dark:bg-white/10" />

                            <div className="space-y-4">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                                            plan.highlight ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-400"
                                        )}>
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                        <span className="text-xs font-bold dark:text-gray-300 uppercase tracking-wider">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={loading !== null}
                                className={cn(
                                    "w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2",
                                    plan.highlight
                                        ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500"
                                        : "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                                )}
                            >
                                {loading === plan.id ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Authorize Tier <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Background Glow */}
                        {plan.highlight && (
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full pointer-events-none" />
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-10 opacity-30 invert dark:invert-0">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] dark:text-white">Secure Commercial Protocol</span>
                </div>
                <div className="flex items-center gap-2">
                    <Globe size={20} className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] dark:text-white">Global Asset Network</span>
                </div>
                <div className="flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] dark:text-white">Verified Market Data</span>
                </div>
            </div>
        </section>
    );
}
