'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Command } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function SearchInput({
    className,
    placeholder = "Enter neighborhood, city, or zip...",
    defaultValue = ""
}: {
    className?: string;
    placeholder?: string;
    defaultValue?: string;
}) {
    const [query, setQuery] = useState(defaultValue);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = async (val: string) => {
        if (val.length < 3) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        // Mapbox Geocoding API Mock/Fallback
        // In production, this would call Mapbox
        setTimeout(() => {
            const mockSuggestions = [
                { id: '1', place_name: 'Banana Island, Lagos', context: 'Elite Residential' },
                { id: '2', place_name: 'Ikoyi, Lagos', context: 'Prime Commercial' },
                { id: '3', place_name: 'Victoria Island, Lagos', context: 'Financial Hub' },
                { id: '4', place_name: 'Lekki Phase 1, Lagos', context: 'Urban Lifestyle' },
            ].filter(s => s.place_name.toLowerCase().includes(val.toLowerCase()));

            setSuggestions(mockSuggestions);
            setLoading(false);
        }, 300);
    };

    const handleSelect = (suggestion: any) => {
        setQuery(suggestion.place_name);
        setIsOpen(false);
        router.push(`/search?q=${encodeURIComponent(suggestion.place_name)}`);
    };

    return (
        <div ref={containerRef} className={cn("relative w-full max-w-2xl group", className)}>
            <div className="relative overflow-hidden rounded-[2rem] bg-white dark:bg-black/50 backdrop-blur-3xl border border-gray-100 dark:border-white/10 shadow-2xl transition-all group-focus-within:border-blue-600/50 group-focus-within:ring-4 group-focus-within:ring-blue-600/10">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <Search size={20} />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        fetchSuggestions(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => query.length >= 3 && setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full h-16 md:h-20 pl-16 pr-24 bg-transparent border-none text-sm md:text-base font-bold dark:text-white placeholder:text-gray-400 focus:ring-0 outline-none uppercase tracking-widest italic"
                />

                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {loading && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
                    {query && (
                        <button
                            onClick={() => { setQuery(''); setSuggestions([]); }}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <button
                        onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}
                        className="hidden md:flex items-center gap-2 px-6 h-12 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.05] transition-all"
                    >
                        Scan <Command size={14} />
                    </button>
                </div>
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-black/80 backdrop-blur-3xl border border-gray-100 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden z-[100] p-4 space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-6 mb-2">Detected Zones</p>
                    {suggestions.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => handleSelect(s)}
                            className="w-full flex items-center gap-4 p-5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 text-left transition-all group/item border border-transparent hover:border-blue-600/10"
                        >
                            <div className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-black dark:text-white italic uppercase tracking-wider">{s.place_name}</p>
                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">{s.context}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
