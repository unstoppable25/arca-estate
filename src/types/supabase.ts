export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    avatar_url: string | null
                    role: 'user' | 'agent' | 'admin'
                    is_verified: boolean
                    created_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'user' | 'agent' | 'admin'
                    is_verified?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'user' | 'agent' | 'admin'
                    is_verified?: boolean
                    created_at?: string
                }
            }
            properties: {
                Row: {
                    id: string
                    owner_id: string
                    title: string
                    description: string | null
                    price: number
                    location: string
                    coordinates: { x: number; y: number } | null
                    images: string[]
                    features: string[]
                    status: 'available' | 'sold' | 'rented' | 'pending'
                    access_code: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    owner_id: string
                    title: string
                    description?: string | null
                    price: number
                    location: string
                    coordinates?: { x: number; y: number } | null
                    images?: string[]
                    features?: string[]
                    status?: 'available' | 'sold' | 'rented' | 'pending'
                    access_code?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    owner_id?: string
                    title?: string
                    description?: string | null
                    price?: number
                    location?: string
                    coordinates?: { x: number; y: number } | null
                    images?: string[]
                    features?: string[]
                    status?: 'available' | 'sold' | 'rented' | 'pending'
                    access_code?: string | null
                    created_at?: string
                }
            }
            bookings: {
                Row: {
                    id: string
                    property_id: string
                    user_id: string
                    start_time: string
                    end_time: string
                    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
                    created_at: string
                }
                Insert: {
                    id?: string
                    property_id: string
                    user_id: string
                    start_time: string
                    end_time: string
                    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
                    created_at?: string
                }
                Update: {
                    id?: string
                    property_id?: string
                    user_id?: string
                    start_time?: string
                    end_time?: string
                    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
                    created_at?: string
                }
            }
        }
    }
}
