import Link from 'next/link';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-black pt-32 px-6">
            <div className="max-w-2xl mx-auto space-y-8">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <ArrowLeft size={16} /> Back to Command Center
                </Link>

                <div className="space-y-4">
                    <div className="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-blue-600">
                        <SettingsIcon size={32} />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic dark:text-white">
                        Account <span className="text-blue-600">Settings</span>
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Advanced configuration protocols are currently being established. Please contact support for immediate profile modifications.
                    </p>
                </div>

                <div className="p-8 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                            <span className="font-bold dark:text-white">Notification Preferences</span>
                            <span className="text-xs font-black uppercase text-blue-600 bg-blue-600/10 px-2 py-1 rounded">Active</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                            <span className="font-bold dark:text-white">Privacy & Security</span>
                            <span className="text-xs font-black uppercase text-green-600 bg-green-600/10 px-2 py-1 rounded">Secured</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
