import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });

                    if (!response.ok) throw new Error('Login failed');

                    const data = await response.json();
                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    // Store token in localStorage
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
                    const response = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    });

                    if (!response.ok) throw new Error('Registration failed');

                    const result = await response.json();
                    set({
                        user: result.user,
                        token: result.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    // Store token in localStorage
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

                // Clear token from localStorage
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
