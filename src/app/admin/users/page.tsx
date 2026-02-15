import { createClient } from '@/lib/supabase/server';
import { Check, X, Shield, User } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const revalidate = 0;

export default async function AdminUsersPage() {
    const supabase = createClient();
    const { data: profiles } = await (await supabase)
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    async function verifyUser(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        const supabase = await createClient(); // Await the promise
        await supabase.from('profiles').update({ is_verified: true }).eq('id', id);
        revalidatePath('/admin/users');
    }

    async function makeAgent(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        const supabase = await createClient(); // Await the promise
        await supabase.from('profiles').update({ role: 'agent' }).eq('id', id);
        revalidatePath('/admin/users');
    }

    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                User Management
            </h1>
            <p className="mt-2 text-gray-500">Manage user roles and identity verification.</p>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-800">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">User</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Role</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-black">
                                    {profiles?.map((person) => (
                                        <tr key={person.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                                        <User className="h-4 w-4 text-gray-500" />
                                                    </div>
                                                    <div>
                                                        {person.full_name || 'Anonymous'}
                                                        <div className="font-normal text-gray-500">{person.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${person.role === 'admin'
                                                        ? 'bg-purple-50 text-purple-700 ring-purple-600/20'
                                                        : person.role === 'agent'
                                                            ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                                                            : 'bg-gray-50 text-gray-600 ring-gray-500/10'
                                                    }`}>
                                                    {person.role}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {person.is_verified ? (
                                                    <span className="text-green-600 flex items-center gap-1"><Check className="h-4 w-4" /> Verified</span>
                                                ) : (
                                                    <span className="text-gray-400">Unverified</span>
                                                )}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex justify-end gap-2">
                                                    {!person.is_verified && (
                                                        <form action={verifyUser}>
                                                            <input type="hidden" name="id" value={person.id} />
                                                            <button type="submit" className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">Verify</button>
                                                        </form>
                                                    )}
                                                    {person.role === 'user' && (
                                                        <form action={makeAgent}>
                                                            <input type="hidden" name="id" value={person.id} />
                                                            <button type="submit" className="ml-4 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">Make Agent</button>
                                                        </form>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
