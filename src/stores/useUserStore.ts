import { create } from "zustand";

type User = {
    username: string
}

export const useUserStore = create<{
    user: User | null,
    setUser: (user: User) => void
}>((set) => ({
    user: null,
    setUser: (user) => set({ user })
}))