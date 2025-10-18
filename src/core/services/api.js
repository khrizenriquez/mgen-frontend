/**
 * API Service - HTTP client configuration and base methods
 */
import axios from 'axios'
import toast from 'react-hot-toast'
import AuthService from './AuthService.js'

// Get API base URL from environment (support both VITE_API_URL and VITE_API_BASE_URL)
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8000/api/v1'

// Configurable timeout
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Use the original get method (no mock fallbacks needed)
const originalGet = api.get.bind(api)
api.get = originalGet

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = AuthService.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor with token refresh logic
api.interceptors.response.use(
  (response) => {
    // Calculate request duration for monitoring
    if (response.config.metadata) {
      const duration = new Date() - response.config.metadata.startTime
      console.log(`API ${response.config.method?.toUpperCase()} ${response.config.url} took ${duration}ms`)
    }

    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle common error scenarios
    const { response, request, message } = error

    if (response) {
      // Server responded with error status
      const { status, data } = response

      // Handle 401 Unauthorized - attempt token refresh
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          // Attempt to refresh token
          await AuthService.refreshToken()

          // Retry the original request with new token
          const newToken = AuthService.getAccessToken()
          originalRequest.headers.Authorization = `Bearer ${newToken}`

          return api(originalRequest)
        } catch (refreshError) {
          // Refresh failed, redirect to login
          console.error('Token refresh failed:', refreshError)
          AuthService.logout()
          // Could redirect to login page here if needed
          toast.error('Sesión expirada. Por favor inicia sesión nuevamente.')
          return Promise.reject(refreshError)
        }
      }

      // Handle other error statuses
      switch (status) {
        case 400:
          toast.error(data.detail || 'Solicitud inválida')
          break
        case 403:
          toast.error('Acceso prohibido')
          break
        case 404:
          toast.error('Recurso no encontrado')
          break
        case 429:
          toast.error('Demasiadas solicitudes. Por favor intenta más tarde.')
          break
        case 500:
          toast.error('Error del servidor. Por favor intenta más tarde.')
          break
        default:
          toast.error(data.detail || 'Ocurrió un error')
      }
    } else if (request) {
      // Network error
      toast.error('Error de red. Por favor verifica tu conexión.')
    } else {
      // Request setup error
      toast.error('Solicitud fallida: ' + message)
    }

    return Promise.reject(error)
  }
)

// Health check utility
export const healthCheck = async () => {
  try {
    // Remove '/api/v1' from base URL for health check
    const baseUrl = API_BASE_URL.replace('/api/v1', '')
    const response = await fetch(`${baseUrl}/health`)
    return response.ok
  } catch {
    return false
  }
}

// API endpoints are now fully dynamic - no mock data needed

// Generic API methods
export const apiService = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
}

export default api