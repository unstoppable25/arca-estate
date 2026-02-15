import { ShieldCheck, Mail, MessageCircle, HelpCircle } from 'lucide-react';

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 dark:bg-black">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="text-center">
                    <HelpCircle className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Help Center</h1>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Everything you need to know about using Arca Estate.</p>
                </div>

                <div className="mt-12 space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">General Questions</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">How do self-guided tours work?</h3>
                                <p className="mt-1 text-gray-500 dark:text-gray-400">Once you book a tour on a property page, you'll receive a unique access code 5 minutes before your scheduled time. Simply enter the code on the property's smart lock.</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">Is my data secure?</h3>
                                <p className="mt-1 text-gray-500 dark:text-gray-400">Yes, we use industry-standard encryption and secure authentication via Supabase to protect your personal information.</p>
                            </div>
                        </div>
                    </section>

                    <section className="pt-8 border-t border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Still need help?</h2>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Our support team is available 24/7 to assist you.</p>
                        <div className="mt-6 flex flex-wrap gap-4">
                            <a href="mailto:support@arcaestate.com" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                                <Mail className="h-4 w-4" /> Email Support
                            </a>
                            <button className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                                <MessageCircle className="h-4 w-4" /> Contact an Agent
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
