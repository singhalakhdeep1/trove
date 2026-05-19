import { useEffect, useRef, useState } from 'react';
import { socketService } from '@/lib/socket';
import { useAuthStore } from '@/store/auth.store';

export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    text: string;
    createdAt: string;
    read: boolean;
    attachments?: string[];
}

export interface ChatRoom {
    id: string;
    participants: string[];
    lastMessage?: Message;
    unreadCount: number;
}

export function useChatSocket(chatId: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [typing, setTyping] = useState<string[]>([]);
    const { token, user } = useAuthStore();
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (!token || !chatId) return;

        // Connect socket
        const socket = socketService.connect(token);
        setIsConnected(socketService.isConnected());

        // Join chat room
        socketService.emit('chat:join', { chatId });

        // Listen for new messages
        const handleNewMessage = (message: Message) => {
            setMessages((prev) => [...prev, message]);
        };

        // Listen for typing indicators
        const handleTyping = ({ userId }: { userId: string }) => {
            if (userId !== user?.id) {
                setTyping((prev) => [...new Set([...prev, userId])]);

                // Clear typing indicator after 3 seconds
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
                typingTimeoutRef.current = setTimeout(() => {
                    setTyping((prev) => prev.filter((id) => id !== userId));
                }, 3000);
            }
        };

        // Listen for stop typing
        const handleStopTyping = ({ userId }: { userId: string }) => {
            setTyping((prev) => prev.filter((id) => id !== userId));
        };

        socketService.on('chat:message', handleNewMessage);
        socketService.on('chat:typing', handleTyping);
        socketService.on('chat:stop-typing', handleStopTyping);

        return () => {
            socketService.emit('chat:leave', { chatId });
            socketService.off('chat:message', handleNewMessage);
            socketService.off('chat:typing', handleTyping);
            socketService.off('chat:stop-typing', handleStopTyping);

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [token, chatId, user?.id]);

    const sendMessage = (text: string, attachments?: string[]) => {
        if (!text.trim() && !attachments?.length) return;

        const message = {
            chatId,
            text,
            attachments,
            senderId: user?.id,
        };

        socketService.emit('chat:send-message', message);
    };

    const emitTyping = () => {
        socketService.emit('chat:typing', { chatId });
    };

    const emitStopTyping = () => {
        socketService.emit('chat:stop-typing', { chatId });
    };

    const markAsRead = (messageIds: string[]) => {
        socketService.emit('chat:mark-read', { chatId, messageIds });
    };

    return {
        messages,
        isConnected,
        typing,
        sendMessage,
        emitTyping,
        emitStopTyping,
        markAsRead,
    };
}
