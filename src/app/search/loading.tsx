import { PropertyCardSkeleton } from '@/components/properties/property-card';

export default function SearchLoading() {
    return (
        <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
            {/* Shimmering Discovery Header Placeholder */}
            <div className="pt-24 pb-8 px-6 lg:px-12 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-black/50 backdrop-blur-3xl sticky top-20 z-40">
                <div className="max-w-[1440px] mx-auto space-y-8">
                    <div className="h-16 w-full max-w-2xl bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-12">
                    <div className="space-y-4">
                        <div className="h-10 w-64 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
                        <div className="h-4 w-48 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />
                    </div>
                    <div className="h-10 w-32 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <PropertyCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </main>
    );
}
