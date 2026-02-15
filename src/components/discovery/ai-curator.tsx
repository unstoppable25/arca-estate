'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, Loader2, MessageCircle, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AIPrestigeCurator() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'ai' | 'support'>('ai');
    const [supportStatus, setSupportStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [supportData, setSupportData] = useState({ email: '', subject: '', message: '' });
    const [msg, setMsg] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Destructure everything to see what's available, provide defaults
    const chat = useChat({
        api: '/api/chat',
        streamProtocol: 'text',
        body: {
            // content will be sent as standard string in text protocol
        },
        initialMessages: [
            {
                id: 'init',
                role: 'assistant',
                content: "Welcome to Arca Elite. I am your Prestige Curator. How may I assist you in acquiring your next exceptional asset today?"
            }
        ]
    });

    const { messages = [], error, reload } = chat;
    const isActuallyLoading = (chat as any).isLoading ||
        (chat as any).status === 'streaming' ||
        (chat as any).status === 'submitted' ||
        (chat as any).status === 'loading';

    // Global listener to open curator
    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-prestige-curator', handleOpen);
        return () => window.removeEventListener('open-prestige-curator', handleOpen);
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isActuallyLoading]);

    const handleAISubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const content = msg.trim();
        if (!content || isActuallyLoading) return;

        setMsg(''); // Clear immediately for prestige feel

        // Hyper-defensive transmission logic
        try {
            // Method 0: sendMessage (Latest SDK version standard)
            // Note: In latest versions, sendMessage expects { text: string }
            if (typeof (chat as any).sendMessage === 'function') {
                try {
                    // Manual history inclusion if needed
                    await (chat as any).sendMessage({
                        text: content,
                        // Some versions allow passing extra data or history here
                        data: { messages: [...messages, { role: 'user', content }] }
                    });
                    return;
                } catch (sendErr) {
                    console.warn('sendMessage with object failed, trying string...', sendErr);
                    await (chat as any).sendMessage(content);
                    return;
                }
            }

            // Method 1: Append (Older SDK version standard)
            if (typeof (chat as any).append === 'function') {
                await (chat as any).append({ role: 'user', content });
                return;
            }

            // Method 2: HandleSubmit fallback
            if (typeof chat.handleSubmit === 'function') {
                if (typeof (chat as any).setInput === 'function') {
                    (chat as any).setInput(content);
                }
                chat.handleSubmit(e as any);
                return;
            }
        } catch (err) {
            console.error('AI submission failed:', err);
        }
    };

    const handleSupportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSupportStatus('sending');
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setSupportStatus('sent');
        setSupportData({ email: '', subject: '', message: '' });
        setTimeout(() => {
            setSupportStatus('idle');
            setMode('ai');
        }, 3000);
    };

    // Helper to extract text from a message (handles legacy content and new parts system)
    const getMessageContent = (m: any) => {
        // Log for debugging if needed (invisible to user)
        // if (m.role === 'assistant') console.debug('Message structure:', m);

        if (m.content && typeof m.content === 'string' && m.content.trim()) return m.content;

        if (Array.isArray(m.parts)) {
            const textParts = m.parts
                .filter((part: any) => part.type === 'text')
                .map((part: any) => part.text)
                .join('');

            if (textParts) return textParts;
        }

        // Fallback for streaming objects where content might be nested or in progress
        return m.content || m.text || '';
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-10 right-10 z-[100] h-16 w-16 rounded-[2rem] bg-blue-600 text-white shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex items-center justify-center group overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles size={28} className="relative z-10" />
            </motion.button>

            {/* Chat Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white dark:bg-black z-[120] shadow-2xl flex flex-col border-l border-gray-100 dark:border-white/5"
                        >
                            {/* Header */}
                            <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-black/50 backdrop-blur-xl">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                                        {mode === 'ai' ? <Sparkles size={24} /> : <MessageCircle size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black tracking-tighter uppercase italic dark:text-white">
                                            {mode === 'ai' ? 'Prestige Curator' : 'Direct Support'}
                                        </h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1.5 font-bold">
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                                            {mode === 'ai' ? 'AI Intelligence Operational' : 'Secure Human Line Open'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setMode(mode === 'ai' ? 'support' : 'ai')}
                                        className="h-10 px-4 rounded-xl bg-gray-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors"
                                    >
                                        {mode === 'ai' ? 'Support Form' : 'Switch to AI'}
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 overflow-hidden flex flex-col">
                                {mode === 'ai' ? (
                                    <>
                                        {/* Messages */}
                                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                                            {messages.map((m) => {
                                                const displayContent = getMessageContent(m);
                                                if (!displayContent) return null; // Skip empty messages if any remain

                                                return (
                                                    <motion.div
                                                        key={m.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className={cn(
                                                            "flex gap-4",
                                                            m.role === 'user' ? "flex-row-reverse" : "flex-row"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                                            m.role === 'assistant' ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-400"
                                                        )}>
                                                            {m.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                                                        </div>
                                                        <div className={cn(
                                                            "max-w-[80%] p-5 rounded-[1.5rem] text-sm font-medium leading-relaxed",
                                                            m.role === 'assistant'
                                                                ? "bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-tl-none"
                                                                : "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10"
                                                        )}>
                                                            {displayContent}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                            {isActuallyLoading && !error && (
                                                <div className="flex gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                                                        <Loader2 size={20} className="animate-spin" />
                                                    </div>
                                                    <div className="bg-gray-50 dark:bg-white/5 p-5 rounded-[1.5rem] rounded-tl-none flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 bg-gray-300 dark:bg-white/20 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                        <span className="h-1.5 w-1.5 bg-gray-300 dark:bg-white/20 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                        <span className="h-1.5 w-1.5 bg-gray-300 dark:bg-white/20 rounded-full animate-bounce" />
                                                    </div>
                                                </div>
                                            )}
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-between gap-4"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Bot size={14} />
                                                        <div className="flex flex-col">
                                                            <span>Intelligence Synchronizing (Error)</span>
                                                            <span className="opacity-60 lowercase font-medium">{error.message || 'Protocol Disruption'}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => reload()}
                                                        className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shrink-0"
                                                    >
                                                        Retry Protocol
                                                    </button>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* AI Input */}
                                        <div className="p-8 bg-white dark:bg-black border-t border-gray-100 dark:border-white/5">
                                            <form
                                                onSubmit={handleAISubmit}
                                                className="relative flex items-center"
                                            >
                                                <input
                                                    autoFocus
                                                    name="chat-input"
                                                    value={msg}
                                                    onChange={(e) => setMsg(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey && msg.trim() && !isActuallyLoading) {
                                                            e.preventDefault();
                                                            handleAISubmit();
                                                        }
                                                    }}
                                                    placeholder="Consult your curator..."
                                                    className="w-full h-16 pl-6 pr-20 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-blue-600/30 dark:text-white outline-none transition-all font-medium"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={isActuallyLoading || !msg.trim()}
                                                    className="absolute right-3 h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                >
                                                    <ArrowRight size={20} className={isActuallyLoading ? "animate-pulse" : ""} />
                                                </button>
                                            </form>
                                            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">
                                                Secure AI Intelligence Protocol V3.0
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-8 space-y-10 overflow-y-auto no-scrollbar">
                                        <div className="text-center space-y-4">
                                            <div className="h-20 w-20 rounded-[2rem] bg-gray-50 dark:bg-white/5 flex items-center justify-center mx-auto text-blue-600">
                                                <ShieldCheck size={40} />
                                            </div>
                                            <h4 className="text-2xl font-black uppercase italic tracking-tighter dark:text-white">Manual Transmission</h4>
                                            <p className="text-xs font-medium text-gray-500 leading-relaxed">
                                                Prefer direct correspondence? Submit your briefing below and our protocol officers will respond within 12 standard hours.
                                            </p>
                                        </div>

                                        {supportStatus === 'sent' ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-green-500/10 border border-green-500/20 p-8 rounded-[2.5rem] text-center space-y-4"
                                            >
                                                <CheckCircle2 size={48} className="mx-auto text-green-500" />
                                                <p className="text-sm font-black uppercase tracking-widest text-green-600 italic">Briefing Received</p>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Protocol is being processed.</p>
                                            </motion.div>
                                        ) : (
                                            <form onSubmit={handleSupportSubmit} className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Identity (Email)</label>
                                                    <input
                                                        name="email"
                                                        type="email"
                                                        required
                                                        value={supportData.email}
                                                        onChange={(e) => setSupportData({ ...supportData, email: e.target.value })}
                                                        className="input-premium w-full"
                                                        placeholder="agent@arca-elite.com"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Subject / Protocol</label>
                                                    <input
                                                        name="subject"
                                                        type="text"
                                                        required
                                                        value={supportData.subject}
                                                        onChange={(e) => setSupportData({ ...supportData, subject: e.target.value })}
                                                        className="input-premium w-full"
                                                        placeholder="Asset Acquisition Inquiry"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Message Briefing</label>
                                                    <textarea
                                                        name="message"
                                                        required
                                                        rows={4}
                                                        value={supportData.message}
                                                        onChange={(e) => setSupportData({ ...supportData, message: e.target.value })}
                                                        className="input-premium w-full py-4 resize-none"
                                                        placeholder="Details of your requirement..."
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={supportStatus === 'sending'}
                                                    className="w-full h-16 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center gap-3"
                                                >
                                                    {supportStatus === 'sending' ? (
                                                        <Loader2 size={18} className="animate-spin" />
                                                    ) : (
                                                        <>Submit Briefing <Send size={18} /></>
                                                    )}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
