import { createClient } from '@/lib/supabase/server';
import { PropertyCard } from '@/components/properties/property-card';
import { SearchInput } from '@/components/search/search-input';
import { PropertyMap } from '@/components/discovery/property-map';
import { Search as SearchIcon, SlidersHorizontal, Map as MapIcon, LayoutGrid, ArrowUpDown, Filter, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
    searchParams: {
        q?: string;
        minPrice?: string;
        maxPrice?: string;
        type?: string;
        bedrooms?: string;
        sort?: string;
        view?: 'grid' | 'map';
    };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const supabase = await createClient();
    const sParams = await searchParams;

    const query = sParams.q || '';
    const minPrice = sParams.minPrice ? parseInt(sParams.minPrice) : 0;
    const maxPrice = sParams.maxPrice ? parseInt(sParams.maxPrice) : 1000000000;
    const type = sParams.type || '';
    const bedrooms = sParams.bedrooms ? parseInt(sParams.bedrooms) : 0;
    const sort = sParams.sort || 'created_at';
    const view = sParams.view || 'grid';

    let supabaseQuery = supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .gte('price', minPrice)
        .lte('price', maxPrice);

    if (query) {
        supabaseQuery = supabaseQuery.or(`title.ilike.% ${query}%, location.ilike.% ${query}% `);
    }

    if (type) {
        supabaseQuery = supabaseQuery.eq('type', type);
    }

    if (bedrooms) {
        supabaseQuery = supabaseQuery.gte('bedrooms', bedrooms);
    }

    if (sort === 'price_asc') {
        supabaseQuery = supabaseQuery.order('price', { ascending: true });
    } else if (sort === 'price_desc') {
        supabaseQuery = supabaseQuery.order('price', { ascending: false });
    } else {
        supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
    }

    const { data: properties } = await supabaseQuery;

    return (
        <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
            {/* Discovery Header */}
            <div className="pt-24 pb-8 px-6 lg:px-12 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-black/50 backdrop-blur-3xl sticky top-20 z-40">
                <div className="max-w-[1440px] mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex-1 max-w-2xl">
                            <SearchInput defaultValue={query} className="max-w-none" />
                        </div>

                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-2xl">
                            <Link
                                href={`/search?${new URLSearchParams({ ...sParams, view: 'grid' }).toString()}`}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                    view === 'grid' ? "bg-white dark:bg-white/10 text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                )}
                            >
                                <LayoutGrid size={14} /> Grid
                            </Link>
                            <Link
                                href={`/search?${new URLSearchParams({ ...sParams, view: 'map' }).toString()}`}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                    view === 'map' ? "bg-white dark:bg-white/10 text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                )}
                            >
                                <MapIcon size={14} /> Map
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 py-12">
                    {/* Result Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter uppercase italic dark:text-white leading-none">
                                {type === 'all' || !type ? 'All' : type} <span className="text-blue-600">Acquisitions</span>
                            </h1>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mt-2">
                                {properties?.length || 0} Premier Results Found {query && `within "${query}"`}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                                <ArrowUpDown size={14} /> Sort:
                                <select className="bg-transparent border-none outline-none text-gray-900 dark:text-white font-black uppercase tracking-widest cursor-pointer focus:ring-0">
                                    <option value="newest">Newest Arrival</option>
                                    <option value="price_asc">Lowest Price</option>
                                    <option value="price_desc">Highest Prestige</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Content */}
                    {view === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {properties?.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    ) : (
                        <div className="h-[70vh] w-full rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-2xl">
                            <PropertyMap
                                properties={properties || []}
                                className="h-full w-full"
                            />
                        </div>
                    )}

                    {/* Empty State */}
                    {properties?.length === 0 && (
                        <div className="mt-32 text-center space-y-8">
                            <div className="h-24 w-24 bg-gray-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-gray-300">
                                <SearchIcon size={48} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter uppercase italic dark:text-white">The collection is currently empty</h3>
                                <p className="mt-2 text-gray-500 font-medium">Try broadening your search criteria for more acquisition opportunities.</p>
                            </div>
                            <Link href="/search" className="btn-primary inline-flex items-center gap-2 px-10">
                                Reset Filters <SlidersHorizontal size={18} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
