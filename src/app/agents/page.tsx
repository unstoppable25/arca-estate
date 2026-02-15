import { createClient } from '@/lib/supabase/server';
import { User, Mail, ShieldCheck, Star } from 'lucide-react';
import Image from 'next/image';

export const revalidate = 0;

export default async function AgentsPage() {
    const supabase = await createClient();
    const { data: agents } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'agent')
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 dark:bg-black">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                        Our Verified Agents
                    </h1>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Connect with the most trusted professionals in the industry. Every agent on our platform is thoroughly vetted for your peace of mind.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {agents?.map((agent) => (
                        <div key={agent.id} className="group relative flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-8 text-center transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
                            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                {agent.avatar_url ? (
                                    <Image
                                        src={agent.avatar_url}
                                        alt={agent.full_name || 'Agent'}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <User className="h-full w-full p-4 text-gray-400" />
                                )}
                            </div>

                            <div className="mt-6 flex items-center gap-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {agent.full_name || 'Anonymous Agent'}
                                </h3>
                                {agent.is_verified && (
                                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                                )}
                            </div>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Professional Agent</p>

                            <div className="mt-4 flex items-center gap-1 text-yellow-500">
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <span className="ml-1 text-xs text-gray-400">(4.9/5)</span>
                            </div>

                            <a
                                href={`mailto:${agent.email}`}
                                className="mt-8 inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
                            >
                                <Mail className="h-4 w-4" />
                                Contact
                            </a>
                        </div>
                    ))}
                </div>

                {!agents?.length && (
                    <div className="mt-20 text-center text-gray-500">
                        <p>No agents available at the moment. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
