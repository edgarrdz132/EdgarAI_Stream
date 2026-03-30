import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Error de conexión'
    const status  = error.response?.status

    if (status === 401) {
      // Token expired — clear auth
      localStorage.removeItem('edgarai-auth')
      window.location.href = '/login'
    } else if (status === 429) {
      toast.error('Demasiadas solicitudes. Espera un momento.')
    } else if (status >= 500) {
      toast.error('Error del servidor. Inténtalo de nuevo.')
    }

    return Promise.reject(error)
  }
)

export default api

// ---- Channels API ----
export const channelsAPI = {
  getAll: (params) => api.get('/channels', { params }),
  getById: (id) => api.get(`/channels/${id}`),
  getByCategory: (category, params) => api.get(`/channels/category/${category}`, { params }),
  search: (q) => api.get('/channels/search', { params: { q } }),
  getFeatured: () => api.get('/channels/featured'),
  getStreamUrl: (id) => api.get(`/channels/${id}/stream`),

  // Admin
  create: (data) => api.post('/channels', data),
  update: (id, data) => api.put(`/channels/${id}`, data),
  delete: (id) => api.delete(`/channels/${id}`),
  validate: (id) => api.post(`/channels/${id}/validate`),
  validateAll: () => api.post('/channels/validate-all'),
}

export const authAPI = {
  login: (creds) => api.post('/auth/login', creds),
  me: () => api.get('/auth/me'),
}

export const logsAPI = {
  getAll: (params) => api.get('/logs', { params }),
  getStats: () => api.get('/logs/stats'),
}
