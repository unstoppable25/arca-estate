import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
                            <ShieldCheck className="h-6 w-6 text-blue-600" />
                            <span>
                                Arca<span className="text-blue-600"> Estate</span>
                            </span>
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            The most trusted real estate platform for buying, selling, and renting properties with confidence.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Platform</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/search" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400">Browse Properties</Link></li>
                            <li><Link href="/agents" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400">Find an Agent</Link></li>
                            <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Support</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/help" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400">Help Center</Link></li>
                            <li><Link href="/safety" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400">Safety Guide</Link></li>
                            <li><Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Contact</h3>
                        <ul className="mt-4 space-y-2">
                            <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Mail className="h-4 w-4" /> support@arcaestate.com
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Phone className="h-4 w-4" /> +1 (555) 123-4567
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <MapPin className="h-4 w-4" /> 123 Trust Avenue, NY
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} Arca Estate. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
