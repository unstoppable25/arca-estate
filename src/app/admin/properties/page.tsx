import { createClient } from '@/lib/supabase/server';
import { Check, X, Building } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import Image from 'next/image';

export const revalidate = 0;

export default async function AdminPropertiesPage() {
    const supabase = createClient();
    const { data: properties } = await (await supabase)
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

    async function approveProperty(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        const supabase = await createClient(); // Await
        await supabase.from('properties').update({ status: 'available' }).eq('id', id);
        revalidatePath('/admin/properties');
    }

    async function rejectProperty(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        const supabase = await createClient(); // Await
        await supabase.from('properties').delete().eq('id', id);
        revalidatePath('/admin/properties');
    }

    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Property Listings
            </h1>
            <p className="mt-2 text-gray-500">Approve pending listings or remove violating ones.</p>

            <ul className="mt-8 space-y-4">
                {properties?.map((property) => (
                    <li key={property.id} className="relative flex items-center space-x-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            <Image
                                src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=200'}
                                alt={property.title}
                                width={64}
                                height={64}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {property.title}
                                </h3>
                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${property.status === 'available'
                                        ? 'bg-green-50 text-green-700 ring-green-600/20'
                                        : 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                    }`}>
                                    {property.status}
                                </span>
                            </div>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{property.location}</p>
                            <p className="text-xs text-gray-400">ID: {property.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {property.status !== 'available' && (
                                <form action={approveProperty}>
                                    <input type="hidden" name="id" value={property.id} />
                                    <button className="flex items-center gap-1 rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100">
                                        <Check className="h-4 w-4" /> Approve
                                    </button>
                                </form>
                            )}
                            <form action={rejectProperty}>
                                <input type="hidden" name="id" value={property.id} />
                                <button className="flex items-center gap-1 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100">
                                    <X className="h-4 w-4" /> Remove
                                </button>
                            </form>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
