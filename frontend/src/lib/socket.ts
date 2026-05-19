import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';
import { useNotificationsStore } from '@/store/notifications.store';

class SocketService {
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    connect(token: string) {
        if (this.socket?.connected) {
            return this.socket;
        }

        this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000', {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: this.maxReconnectAttempts,
        });

        this.setupEventListeners();
        return this.socket;
    }

    private setupEventListeners() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('✅ WebSocket connected');
            this.reconnectAttempts = 0;
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ WebSocket disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            this.reconnectAttempts++;

            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error('Max reconnection attempts reached');
                this.disconnect();
            }
        });

        // Global notification handler
        this.socket.on('notification', (data) => {
            const notificationsStore = useNotificationsStore.getState();
            notificationsStore.addNotification({
                type: data.type || 'info',
                title: data.title,
                message: data.message,
            });
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    emit(event: string, data: any) {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        } else {
            console.error('Socket not connected');
        }
    }

    on(event: string, callback: (...args: any[]) => void) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event: string, callback?: (...args: any[]) => void) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    getSocket() {
        return this.socket;
    }

    isConnected() {
        return this.socket?.connected || false;
    }
}

export const socketService = new SocketService();
