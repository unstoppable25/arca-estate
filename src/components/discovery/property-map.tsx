'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2, Navigation, Maximize2, Map as MapIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Access token should be in .env.local
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94LWV4YW1wbGUiLCJhIjoiY2p4ZzRndHozMDBpazN5bzB5bzB5bzB5dyJ9';

interface Property {
    id: string;
    title: string;
    location: string;
    price: number;
    latitude: number;
    longitude: number;
}

export function PropertyMap({
    properties,
    className,
    center = [3.3792, 6.4654], // Default Lagos coordinates
    zoom = 12,
    onCoordinateSelect
}: {
    properties: Property[];
    className?: string;
    center?: [number, number];
    zoom?: number;
    onCoordinateSelect?: (lng: number, lat: number) => void;
}) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const marker = useRef<mapboxgl.Marker | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11', // High-end dark theme
            center: center,
            zoom: zoom,
            pitch: 45, // Elite 3D perspective
            antialias: true
        });

        map.current.on('click', (e) => {
            if (onCoordinateSelect) {
                const { lng, lat } = e.lngLat;

                // Update or create marker
                if (marker.current) {
                    marker.current.setLngLat([lng, lat]);
                } else {
                    const el = document.createElement('div');
                    el.className = 'property-marker-selector';
                    el.innerHTML = `
                        <div class="h-6 w-6 bg-blue-600 rounded-full border-2 border-white shadow-2xl animate-bounce" />
                    `;
                    marker.current = new mapboxgl.Marker(el)
                        .setLngLat([lng, lat])
                        .addTo(map.current!);
                }

                onCoordinateSelect(lng, lat);
            }
        });

        map.current.on('load', () => {
            setLoading(false);

            // Add custom markers
            properties.forEach((prop) => {
                if (prop.latitude && prop.longitude) {
                    const el = document.createElement('div');
                    el.className = 'property-marker';
                    el.innerHTML = `
                        <div class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl border border-white/20 transform hover:scale-110 transition-transform cursor-pointer">
                            $${(prop.price / 1000).toFixed(0)}K
                        </div>
                    `;

                    new mapboxgl.Marker(el)
                        .setLngLat([prop.longitude, prop.latitude])
                        .setPopup(
                            new mapboxgl.Popup({ offset: 25 })
                                .setHTML(`
                                    <div class="p-4 space-y-2 dark:bg-black rounded-2xl">
                                        <p class="text-[8px] font-black uppercase tracking-widest text-blue-600">Elite Asset</p>
                                        <h4 class="text-sm font-black italic uppercase italic tracking-tighter">${prop.title}</h4>
                                        <p class="text-[9px] font-medium text-gray-500 uppercase tracking-widest">${prop.location}</p>
                                        <a href="/properties/${prop.id}" class="block mt-2 text-[8px] font-black uppercase tracking-[0.2em] text-blue-600 hover:underline">Full Briefing</a>
                                    </div>
                                `)
                        )
                        .addTo(map.current!);
                }
            });
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        return () => {
            if (map.current) map.current.remove();
        };
    }, [properties, center, zoom]);

    return (
        <div className={cn("relative rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl group", className)}>
            <div ref={mapContainer} className="w-full h-full" />

            {loading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-3xl flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Calibrating Spatial Grid</p>
                    </div>
                </div>
            )}

            {/* Elite Overlay Controls */}
            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-3xl border border-white/10 p-3 rounded-2xl pointer-events-auto">
                    <button className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
                        <Navigation size={18} />
                    </button>
                    <div className="px-4">
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Current Zone</p>
                        <p className="text-[10px] font-black text-white italic uppercase tracking-widest">Global Sector 01</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                    <button className="h-12 px-6 rounded-2xl bg-white/10 backdrop-blur-3xl border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2">
                        Interactive Grid <MapIcon size={14} />
                    </button>
                    <button className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-3xl border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all">
                        <Maximize2 size={18} />
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .mapboxgl-popup-content {
                    background: transparent !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                }
                .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
                    border-top-color: #000 !important;
                    opacity: 0.1;
                }
                .property-marker {
                    z-index: 10;
                }
            `}</style>
        </div>
    );
}
