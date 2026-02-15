import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, Home, Settings, LogOut } from 'lucide-react';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check if user is admin
    // For MVP: We check the 'profiles' table
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        // If not admin, redirect to dashboard or home
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p>You do not have permission to view this page.</p>
                <Link href="/" className="text-blue-600 hover:underline">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-black">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 border-r border-gray-200 bg-white px-6 py-8 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
                    <LayoutDashboard className="h-6 w-6 text-blue-600" />
                    <span>Admin<span className="text-blue-600">Panel</span></span>
                </div>

                <nav className="mt-10 space-y-2">
                    <Link href="/admin" className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-white">
                        <LayoutDashboard className="h-4 w-4" />
                        Overview
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
                        <Users className="h-4 w-4" />
                        Users & Verification
                    </Link>
                    <Link href="/admin/properties" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
                        <Home className="h-4 w-4" />
                        Properties
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </nav>

                <div className="absolute bottom-8 left-6 right-6">
                    <form action="/auth/signout" method="post">
                        <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
