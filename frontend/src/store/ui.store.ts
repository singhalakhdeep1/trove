import { create } from 'zustand';

interface UIState {
    sidebarOpen: boolean;
    modalOpen: boolean;
    modalContent: React.ReactNode | null;
    loading: boolean;
    theme: 'light' | 'dark';

    // Actions
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;
    setLoading: (loading: boolean) => void;
    toggleTheme: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    sidebarOpen: false,
    modalOpen: false,
    modalContent: null,
    loading: false,
    theme: 'light',

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

    openModal: (content: React.ReactNode) =>
        set({ modalOpen: true, modalContent: content }),

    closeModal: () =>
        set({ modalOpen: false, modalContent: null }),

    setLoading: (loading: boolean) => set({ loading }),

    toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
