import { ShieldCheck, Lock, Eye, CheckCircle } from 'lucide-react';

export default function SafetyPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 dark:bg-black">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="text-center">
                    <ShieldCheck className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Safety Guide</h1>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Your security is our top priority.</p>
                </div>

                <div className="mt-12 space-y-12">
                    <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Verified Listings</h2>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">All properties on Arca Estate are manually verified by our team. We check legal documents and ownership info to prevent scams.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                            <Lock className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Secure Self-Tours</h2>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">Our smart access system ensures only authorized visitors can enter properties. Each code is unique to the user and their scheduled time.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                            <Eye className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Identity Protection</h2>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">We never share your personal contact details with third-party marketers. Your privacy is protected by end-to-end encryption.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
