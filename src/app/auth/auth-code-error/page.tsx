import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function AuthErrorPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-black border border-gray-200 dark:border-gray-800 text-center">
                <ShieldAlert className="mx-auto h-12 w-12 text-red-600" />
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Authentication Error
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    We could not sign you in. The link might be expired or invalid.
                </p>
                <div className="mt-6">
                    <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                        Try again
                    </Link>
                </div>
            </div>
        </div>
    );
}
