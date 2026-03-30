import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@/services/supabase'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { data, error } = await authAPI.login(email, password)
        if (error) throw new Error(error.message)
        const user = {
          id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata?.role || 'usuario',
        }
        set({ user, isAuthenticated: true })
        return user
      },

      register: async (email, password) => {
        const { data, error } = await authAPI.register(email, password)
        if (error) throw new Error(error.message)
        return data
      },

      logout: async () => {
        await authAPI.logout()
        set({ user: null, isAuthenticated: false })
      },

      initialize: async () => {
        const { data } = await authAPI.getSession()
        if (data?.session?.user) {
          set({
            user: {
              id: data.session.user.id,
              email: data.session.user.email,
              role: data.session.user.user_metadata?.role || 'usuario',
            },
            isAuthenticated: true,
          })
        }
      },
    }),
    {
      name: 'edgarai-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
