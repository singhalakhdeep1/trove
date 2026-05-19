'use client';

import { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';

interface TrackingLocation {
    lat: number;
    lng: number;
    timestamp: string;
}

interface DeliveryTrackerProps {
    deliveryLocation: { lat: number; lng: number };
    destinationLocation: { lat: number; lng: number };
    path?: TrackingLocation[];
    height?: string;
}

export default function DeliveryTracker({
    deliveryLocation,
    destinationLocation,
    path = [],
    height = '400px',
}: DeliveryTrackerProps) {
    const [center, setCenter] = useState(deliveryLocation);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
    });

    useEffect(() => {
        // Update center when delivery location changes
        setCenter(deliveryLocation);
    }, [deliveryLocation]);

    const pathCoordinates = path.map((p) => ({ lat: p.lat, lng: p.lng }));

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
                center={center}
                zoom={14}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                }}
            >
                {/* Delivery Person Marker */}
                <Marker
                    position={deliveryLocation}
                    icon={{
                        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        scaledSize: new google.maps.Size(40, 40),
                    }}
                    title="Delivery Location"
                />

                {/* Destination Marker */}
                <Marker
                    position={destinationLocation}
                    icon={{
                        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        scaledSize: new google.maps.Size(40, 40),
                    }}
                    title="Your Location"
                />

                {/* Path Polyline */}
                {pathCoordinates.length > 0 && (
                    <Polyline
                        path={pathCoordinates}
                        options={{
                            strokeColor: '#2563eb',
                            strokeOpacity: 0.8,
                            strokeWeight: 4,
                        }}
                    />
                )}
            </GoogleMap>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-900">Live Tracking Active</span>
                </div>
                <span className="text-sm text-blue-700">Updates every 30 seconds</span>
            </div>
        </div>
    );
}
