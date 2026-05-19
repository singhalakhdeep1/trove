'use client';

import { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

interface Location {
    id: string;
    lat: number;
    lng: number;
    title: string;
    description?: string;
    icon?: string;
}

interface MapViewProps {
    locations: Location[];
    center?: { lat: number; lng: number };
    zoom?: number;
    height?: string;
    onMarkerClick?: (location: Location) => void;
}

export default function MapView({
    locations,
    center,
    zoom = 12,
    height = '500px',
    onMarkerClick,
}: MapViewProps) {
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [mapCenter, setMapCenter] = useState(center || { lat: 40.7128, lng: -74.0060 });

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
    });

    useEffect(() => {
        if (locations.length > 0 && !center) {
            // Calculate center from locations
            const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
            const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
            setMapCenter({ lat: avgLat, lng: avgLng });
        }
    }, [locations, center]);

    const handleMarkerClick = (location: Location) => {
        setSelectedLocation(location);
        if (onMarkerClick) {
            onMarkerClick(location);
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
        <GoogleMap
            mapContainerStyle={{ width: '100%', height }}
            center={mapCenter}
            zoom={zoom}
            options={{
                streetViewControl: false,
                mapTypeControl: true,
                fullscreenControl: true,
            }}
        >
            {locations.map((location) => (
                <Marker
                    key={location.id}
                    position={{ lat: location.lat, lng: location.lng }}
                    onClick={() => handleMarkerClick(location)}
                    icon={location.icon}
                />
            ))}

            {selectedLocation && (
                <InfoWindow
                    position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                    onCloseClick={() => setSelectedLocation(null)}
                >
                    <div className="p-2">
                        <h3 className="font-semibold text-sm">{selectedLocation.title}</h3>
                        {selectedLocation.description && (
                            <p className="text-xs text-gray-600 mt-1">{selectedLocation.description}</p>
                        )}
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}
