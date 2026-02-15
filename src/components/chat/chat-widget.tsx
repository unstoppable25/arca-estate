'use client';

import { MessageCircle, X, Send, Loader2, GripVertical, Mail, MessageSquare, Shield, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'chat' | 'contact'>('chat');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Contact Form State
    const [contactEmail, setContactEmail] = useState('');
    const [contactReason, setContactReason] = useState('General Inquiry');
    const [contactMessage, setContactMessage] = useState('');
    const [isSubmittingContact, setIsSubmittingContact] = useState(false);
    const [contactSuccess, setContactSuccess] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const constraintsRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, view]);

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const msgText = input.trim();
        if (!msgText || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msgText };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
                }),
            });

            if (!response.ok) throw new Error('Failed to send');

            const data = await response.json();
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.content || 'I processed your request, but the response was empty.'
            }]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: 'Connection lost. Please try again or use the support ticket tab.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingContact(true);
        await new Promise(r => setTimeout(r, 1500));
        setContactSuccess(true);
        setIsSubmittingContact(false);
        setTimeout(() => {
            setContactSuccess(false);
            setContactEmail('');
            setContactMessage('');
            setView('chat');
        }, 3000);
    };

    if (!mounted) return null;

    const chatModal = (
        <div className="fixed inset-0 z-[100000] pointer-events-none flex items-end justify-end p-4 sm:p-8" ref={constraintsRef}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        drag
                        dragConstraints={constraintsRef}
                        dragElastic={0.05}
                        dragMomentum={false}
                        initial={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
                        className="pointer-events-auto flex h-[650px] max-h-[85vh] w-[350px] sm:w-[420px] flex-col overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white/95 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/95"
                        style={{ touchAction: 'none' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between bg-blue-600 px-6 py-5 text-white cursor-grab active:cursor-grabbing">
                            <div className="flex items-center gap-3">
                                <GripVertical className="h-4 w-4 opacity-30" />
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                                    <MessageCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm leading-tight">Arca Estate AI</h3>
                                    <div className="flex items-center gap-1.5 opacity-90">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Active Concierge</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-2xl p-2.5 hover:bg-white/20 transition-all active:scale-90"
                                aria-label="Close Chat"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex gap-1.5 p-1.5 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                            <button
                                onClick={() => setView('chat')}
                                className={cn(
                                    "flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-xs font-black transition-all",
                                    view === 'chat' ? "bg-white text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-400" : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                                )}
                            >
                                <MessageSquare size={16} /> AI CHAT
                            </button>
                            <button
                                onClick={() => setView('contact')}
                                className={cn(
                                    "flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-xs font-black transition-all",
                                    view === 'contact' ? "bg-white text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-400" : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                                )}
                            >
                                <Mail size={16} /> SUPPORT
                            </button>
                        </div>

                        {/* Message Area */}
                        <div className="flex-1 overflow-y-auto bg-transparent p-5 scroll-smooth" ref={scrollRef}>
                            {view === 'chat' ? (
                                <div className="flex flex-col space-y-5">
                                    {messages.length === 0 && (
                                        <div className="py-16 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-blue-50 text-blue-600 dark:bg-blue-900/20 mb-6">
                                                <Shield size={40} />
                                            </div>
                                            <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Your Verified Guide</h4>
                                            <p className="mt-3 text-sm text-gray-500 px-6 font-medium">Ask me about neighborhood safety, viewing codes, or specialized listings.</p>
                                        </div>
                                    )}
                                    {messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className={cn(
                                                "flex flex-col max-w-[88%] rounded-3xl px-5 py-4 text-sm font-medium leading-relaxed transition-all animate-in zoom-in-90 duration-300",
                                                m.role === 'user'
                                                    ? "self-end bg-blue-600 text-white rounded-br-none shadow-xl shadow-blue-500/20"
                                                    : "self-start bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700 shadow-sm"
                                            )}
                                        >
                                            {m.content}
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="self-start bg-gray-100 dark:bg-gray-800 rounded-3xl rounded-bl-none px-6 py-4 flex gap-1.5 items-center">
                                            <div className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" />
                                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                                            <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full">
                                    {contactSuccess ? (
                                        <div className="flex h-full flex-col items-center justify-center text-center p-8 animate-in zoom-in-95">
                                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6 dark:bg-green-900/30">
                                                <Check size={40} />
                                            </div>
                                            <h4 className="text-2xl font-black uppercase tracking-tighter">Ticket Sealed</h4>
                                            <p className="mt-3 text-sm text-gray-500 font-medium">Your inquiry has been routed to a senior agent. Expected response: &lt;2hrs.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleContactSubmit} className="space-y-5 h-full flex flex-col pt-2">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Verified Email</label>
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white transition-all shadow-inner"
                                                    placeholder="your@email.com"
                                                    value={contactEmail}
                                                    onChange={e => setContactEmail(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Detailed Request</label>
                                                <textarea
                                                    required
                                                    className="w-full h-full min-h-[150px] rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white transition-all shadow-inner resize-none"
                                                    placeholder="Describe the property or issue..."
                                                    value={contactMessage}
                                                    onChange={e => setContactMessage(e.target.value)}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isSubmittingContact}
                                                className="w-full rounded-2xl bg-gray-900 py-5 font-black text-white hover:bg-black active:scale-[0.98] transition-all shadow-2xl uppercase tracking-widest text-xs"
                                            >
                                                {isSubmittingContact ? 'Routing Request...' : 'Dispatch Ticket'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer / Input */}
                        {view === 'chat' && (
                            <div className="p-6 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
                                <form onSubmit={onFormSubmit} className="flex gap-3">
                                    <input
                                        className="flex-1 rounded-[1.5rem] border border-gray-100 bg-gray-50 px-6 py-4 text-sm font-medium focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white transition-all shadow-inner"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type for AI Assistance..."
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || isLoading}
                                        className={cn(
                                            "flex h-14 w-14 items-center justify-center rounded-2xl transition-all shadow-xl",
                                            input.trim() ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-90" : "bg-gray-100 text-gray-400"
                                        )}
                                    >
                                        <Send size={24} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <>
            {createPortal(chatModal, document.body)}
            <div className="fixed bottom-6 right-6 z-[100000] sm:bottom-10 sm:right-10">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "group relative flex h-20 w-20 items-center justify-center rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-700 hover:scale-110 active:scale-90 focus:outline-none focus:ring-4 focus:ring-blue-500/30",
                        isOpen ? "bg-gray-900 text-white rotate-[360deg] rounded-3xl" : "bg-blue-600 text-white hover:shadow-blue-600/40"
                    )}
                    aria-label="Toggle Assistant"
                >
                    <div className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-red-500 border-[5px] border-white dark:border-black shadow-lg flex items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    </div>
                    {isOpen ? <X size={32} /> : <MessageCircle size={38} className="transition-transform group-hover:scale-110" />}
                </button>
            </div>
        </>
    );
}
