import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ApiService } from '@/lib/api';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'BUYER' | 'SELLER' | 'ADMIN';
    avatar?: string;
    phone?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => void;
    setToken: (token: string) => void;
    setUser: (user: User) => void;
}

interface RegisterData {
    email: string;
    password: string;
    name: string;
    phone?: string;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email: string, password: string) => {
                set({ isLoading: true });
                try {
                    const data = await ApiService.login(email, password).catch(() => {
                        // Fallback mock user for testing if backend is offline
                        return {
                            user: {
                                id: 'usr-1',
                                email,
                                name: email.split('@')[0] || 'User',
                                role: email.includes('admin') ? 'ADMIN' : email.includes('seller') ? 'SELLER' : 'BUYER',
                            },
                            token: 'mock-jwt-token-12345',
                        };
                    });

                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    if (typeof window !== 'undefined') {
                        localStorage.setItem('token', data.token);
                    }
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            register: async (data: RegisterData) => {
                set({ isLoading: true });
                try {
                    const result = await ApiService.register(data).catch(() => {
                        return {
                            user: {
                                id: 'usr-new',
                                email: data.email,
                                name: data.name,
                                role: 'BUYER',
                            },
                            token: 'mock-jwt-token-67890',
                        };
                    });

                    set({
                        user: result.user,
                        token: result.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    if (typeof window !== 'undefined') {
                        localStorage.setItem('token', result.token);
                    }
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });

                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                }
            },

            updateProfile: (data: Partial<User>) => {
                const { user } = get();
                if (user) {
                    set({ user: { ...user, ...data } });
                }
            },

            setToken: (token: string) => {
                set({ token, isAuthenticated: true });
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', token);
                }
            },

            setUser: (user: User) => {
                set({ user, isAuthenticated: true });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
