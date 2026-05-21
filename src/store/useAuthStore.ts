import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  nickname: string;
  avatarUrl?: string;
  isAdmin: boolean;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null }),
}));
