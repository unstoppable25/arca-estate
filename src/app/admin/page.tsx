import { createClient } from '@/lib/supabase/server';
import { Users, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminDashboard() {
    const supabase = createClient();

    // Fetch quick stats
    // Note: .count() is efficient
    const { count: userCount } = await (await supabase).from('profiles').select('*', { count: 'exact', head: true });
    const { count: propertyCount } = await (await supabase).from('properties').select('*', { count: 'exact', head: true });
    const { count: pendingCount } = await (await supabase).from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending');

    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Dashboard Overview
            </h1>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{userCount || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                            <Home className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Properties</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{propertyCount || 0}</p>
                        </div>
                    </div>
                </div>

                <Link href="/admin/approvals" className="block group">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 group-hover:border-blue-600/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                <RefreshCw className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Approvals</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {pendingCount || 0}
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Review Now →</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="mt-12">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-gray-500">No recent activity found.</p>
                </div>
            </div>
        </div>
    );
}
