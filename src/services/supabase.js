import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ---- Canales ----
export const canalesAPI = {
  getFeatured: () => supabase
    .from('canales')
    .select('*')
    .eq('estado', 'activo')
    .eq('featured', true)
    .limit(10),

  getByCategory: (categoria, limit = 1000) => supabase
    .from('canales')
    .select('*')
    .eq('estado', 'activo')
    .eq('categoria', categoria)
    .limit(limit),

  getById: (id) => supabase
    .from('canales')
    .select('*')
    .eq('id', id)
    .single(),

  getAll: (limit = 50) => supabase
    .from('canales')
    .select('*')
    .eq('estado', 'activo')
    .limit(limit),

  search: (q) => supabase
    .from('canales')
    .select('*')
    .eq('estado', 'activo')
    .ilike('nombre', `%${q}%`)
    .limit(20),
}

// ---- Auth ----
export const authAPI = {
  login: (email, password) => supabase.auth.signInWithPassword({ email, password }),
  register: (email, password) => supabase.auth.signUp({ 
  email, 
  password,
  options: {
    emailRedirectTo: 'https://edgarrdz132.github.io/EdgarAI_Stream/'
  }
}),
  logout: () => supabase.auth.signOut(),
  getSession: () => supabase.auth.getSession(),
  resetPassword: (email) => supabase.auth.resetPasswordForEmail(email),
}
