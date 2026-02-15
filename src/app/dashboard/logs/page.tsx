import Link from 'next/link';
import { ArrowLeft, KeyRound } from 'lucide-react';

export default function AccessLogsPage() {
    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-black pt-32 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <ArrowLeft size={16} /> Back to Command Center
                </Link>

                <div className="space-y-4">
                    <div className="h-16 w-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                        <KeyRound size={32} />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic dark:text-white">
                        Access <span className="text-blue-600">Logs</span>
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Secure audit trail of your physical property access events.
                    </p>
                </div>

                <div className="p-12 rounded-[2rem] bg-white dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 text-center space-y-4">
                    <p className="text-gray-400 font-bold uppercase tracking-widest">No access events detected</p>
                </div>
            </div>
        </div>
    );
}
