'use client';

import { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface Location {
    lat: number;
    lng: number;
    address?: string;
}

interface LocationPickerProps {
    onLocationSelect: (location: Location) => void;
    initialLocation?: Location;
    height?: string;
}

const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York

export default function LocationPicker({
    onLocationSelect,
    initialLocation,
    height = '400px',
}: LocationPickerProps) {
    const [selected, setSelected] = useState<Location | null>(initialLocation || null);
    const [map, setMap] = useState<google.maps.Map | null>(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
    });

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const handleMapClick = async (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        // Reverse geocode to get address
        const geocoder = new google.maps.Geocoder();
        try {
            const response = await geocoder.geocode({ location: { lat, lng } });
            const address = response.results[0]?.formatted_address || '';

            const location = { lat, lng, address };
            setSelected(location);
            onLocationSelect(location);
        } catch (error) {
            console.error('Geocoding error:', error);
            const location = { lat, lng };
            setSelected(location);
            onLocationSelect(location);
        }
    };

    if (!isLoaded) {
        return (
            <div
                className="flex items-center justify-center bg-gray-100 rounded-lg"
                style={{ height }}
            >
                <div className="text-gray-500">Loading map...</div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <GoogleMap
                mapContainerStyle={{ width: '100%', height }}
                center={selected || initialLocation || defaultCenter}
                zoom={selected ? 15 : 12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleMapClick}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                }}
            >
                {selected && <Marker position={{ lat: selected.lat, lng: selected.lng }} />}
            </GoogleMap>

            {selected && (
                <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700">Selected Location:</div>
                    <div className="text-sm text-gray-600">
                        {selected.address || `${selected.lat.toFixed(6)}, ${selected.lng.toFixed(6)}`}
                    </div>
                </div>
            )}
        </div>
    );
}
