import { useEffect, useState } from 'react';
import { socketService } from '@/lib/socket';
import { useAuthStore } from '@/store/auth.store';

export interface OrderUpdate {
    orderId: string;
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    message: string;
    timestamp: string;
    location?: {
        lat: number;
        lng: number;
        address: string;
    };
}

export function useOrderTracking(orderId: string) {
    const [updates, setUpdates] = useState<OrderUpdate[]>([]);
    const [currentStatus, setCurrentStatus] = useState<string>('');
    const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [estimatedDelivery, setEstimatedDelivery] = useState<string>('');
    const { token } = useAuthStore();

    useEffect(() => {
        if (!token || !orderId) return;

        // Connect socket
        socketService.connect(token);

        // Subscribe to order updates
        socketService.emit('order:track', { orderId });

        // Listen for status updates
        const handleStatusUpdate = (data: OrderUpdate) => {
            setUpdates((prev) => [...prev, data]);
            setCurrentStatus(data.status);

            if (data.location) {
                setLiveLocation({ lat: data.location.lat, lng: data.location.lng });
            }
        };

        // Listen for delivery location updates
        const handleLocationUpdate = (data: { lat: number; lng: number; timestamp: string }) => {
            setLiveLocation({ lat: data.lat, lng: data.lng });
        };

        // Listen for delivery time updates
        const handleDeliveryTimeUpdate = (data: { estimatedTime: string }) => {
            setEstimatedDelivery(data.estimatedTime);
        };

        socketService.on('order:status-update', handleStatusUpdate);
        socketService.on('order:location-update', handleLocationUpdate);
        socketService.on('order:delivery-time', handleDeliveryTimeUpdate);

        return () => {
            socketService.emit('order:untrack', { orderId });
            socketService.off('order:status-update', handleStatusUpdate);
            socketService.off('order:location-update', handleLocationUpdate);
            socketService.off('order:delivery-time', handleDeliveryTimeUpdate);
        };
    }, [token, orderId]);

    return {
        updates,
        currentStatus,
        liveLocation,
        estimatedDelivery,
    };
}
