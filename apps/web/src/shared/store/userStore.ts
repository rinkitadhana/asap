import { create } from "zustand"
import { supabase } from "@/shared/lib/supabaseClient"
import type { User } from "@supabase/supabase-js"

interface UserState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  fetchUser: () => Promise<void>
  logout: () => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    set({ user, isLoading: false })
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
