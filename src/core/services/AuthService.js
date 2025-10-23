/**
 * Authentication Service
 * Handles authentication logic with backend integration
 */
import api from './api.js'

class AuthService {
  constructor() {
    this.currentUser = null
    this.listeners = []
    this.isRefreshing = false
    this.failedQueue = []
    this.loadUserFromStorage()
  }

  /**
   * Load user data from localStorage on app initialization
   */
  loadUserFromStorage() {
    try {
      const userData = localStorage.getItem('currentUser')
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')

      // Check for mock tokens and clean them
      if (accessToken && accessToken.startsWith('mock_access_token_')) {
        console.warn('Found mock access token on app initialization, clearing invalid tokens')
        this.clearTokens()
        return
      }

      if (refreshToken && refreshToken.startsWith('mock_refresh_token_')) {
        console.warn('Found mock refresh token on app initialization, clearing invalid tokens')
        this.clearTokens()
        return
      }

      if (userData && accessToken) {
        this.currentUser = JSON.parse(userData)
        this.notifyListeners()
      } else {
        // Clean up if tokens are missing
        this.clearTokens()
      }
    } catch (error) {
      console.error('Error loading user from storage:', error)
      this.clearTokens()
    }
  }

  /**
   * Save user data and tokens to localStorage
   */
  saveUserToStorage(user, tokens = {}) {
    try {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user))
      }
      if (tokens.access_token) {
        localStorage.setItem('accessToken', tokens.access_token)
      }
      if (tokens.refresh_token) {
        localStorage.setItem('refreshToken', tokens.refresh_token)
      }
    } catch (error) {
      console.error('Error saving user to storage:', error)
    }
  }

  /**
   * Clear all authentication data from localStorage
   */
  clearTokens() {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  /**
   * Get stored access token
   */
  getAccessToken() {
    const token = localStorage.getItem('accessToken')

    // Detect and clean mock tokens from development
    if (token && token.startsWith('mock_access_token_')) {
      console.warn('Detected mock access token, clearing invalid tokens')
      this.clearTokens()
      return null
    }

    return token
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken() {
    const token = localStorage.getItem('refreshToken')

    // Detect and clean mock tokens from development
    if (token && token.startsWith('mock_refresh_token_')) {
      console.warn('Detected mock refresh token, clearing invalid tokens')
      this.clearTokens()
      return null
    }

    return token
  }

  /**
   * Subscribe to authentication state changes
   */
  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  /**
   * Notify all listeners of authentication state changes
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser))
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.currentUser !== null
  }

  /**
   * Login user with backend API
   */
  async login(credentials) {
    try {
      console.log('Starting login process...')

      const response = await api.post('/auth/login', credentials)
      const { access_token, refresh_token } = response.data
      console.log('Login API call successful')

      // Get user info after successful login
      console.log('Fetching user info...')
      const userInfo = await this.getUserInfo(access_token)
      console.log('User info fetched:', userInfo)

      const user = {
        id: userInfo.id,
        email: userInfo.email,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        roles: userInfo.roles,
        loginAt: new Date().toISOString()
      }
      console.log('User object created:', user)

      this.currentUser = user
      this.saveUserToStorage(user, { access_token, refresh_token })
      this.notifyListeners()
      console.log('User state updated and saved')

      return { success: true, user, tokens: { access_token, refresh_token } }
    } catch (error) {
      console.error('Login error:', error)
      throw new Error(error.response?.data?.detail || 'Error al iniciar sesión')
    }
  }

  /**
   * Register user with backend API
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return { success: true, message: response.data.message }
    } catch (error) {
      console.error('Registration error:', error)
      throw new Error(error.response?.data?.detail || 'Error al crear la cuenta')
    }
  }

  /**
   * Get user information from backend
   */
  async getUserInfo(accessToken = null) {
    try {
      const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {}
      const response = await api.get('/auth/me', config)
      return response.data
    } catch (error) {
      console.error('Get user info error:', error)
      throw new Error('Error al obtener información del usuario')
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
      const { access_token, refresh_token: newRefreshToken } = response.data

      // Update stored tokens
      this.saveUserToStorage(null, { access_token, refresh_token: newRefreshToken })

      return { access_token, refresh_token: newRefreshToken }
    } catch (error) {
      console.error('Token refresh error:', error)
      // Clear tokens on refresh failure
      this.clearTokens()
      this.currentUser = null
      this.notifyListeners()
      throw new Error('Sesión expirada, por favor inicia sesión nuevamente')
    }
  }

  /**
   * Simulate password reset (without backend)
   */
  async resetPassword(email) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200))

      // Simulate password reset logic
      // In a real app, this would call the backend API
      console.log('Password reset requested for:', email)

      return { success: true, message: 'Correo de recuperación enviado' }
    } catch (error) {
      throw new Error('Error al enviar el correo de recuperación')
    }
  }

  /**
   * Logout user - clears local session and notifies backend
   */
  async logout() {
    try {
      // Check if backend is available before attempting logout
      const isBackendHealthy = await this.checkBackendHealth()

      if (isBackendHealthy) {
        // Attempt to notify backend about logout
        const token = this.getAccessToken()
        if (token && !token.startsWith('mock_')) {
          try {
            await api.post('/auth/logout')
          } catch (apiError) {
            // Log error but don't fail logout - backend might be down
            console.warn('Backend logout notification failed:', apiError.message)
          }
        }
      } else {
        console.log('Backend not available, skipping logout notification')
      }
    } catch (error) {
      // Log any unexpected errors but continue with local logout
      console.error('Logout error:', error)
    }

    // Always clear local session regardless of backend response
    this.currentUser = null
    this.clearTokens()
    this.notifyListeners()

    return { success: true }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Usuario no autenticado')
      }

      // Note: Backend doesn't have profile update endpoint yet
      // This would need to be implemented in the backend first
      throw new Error('Funcionalidad no implementada en el backend')
    } catch (error) {
      throw new Error('Error al actualizar el perfil')
    }
  }

  /**
   * Validate authentication token by checking with backend
   */
  async validateToken() {
    try {
      if (!this.getAccessToken()) {
        return false
      }

      // Try to get user info to validate token
      await this.getUserInfo()
      return true
    } catch (error) {
      console.error('Token validation error:', error)
      return false
    }
  }

  /**
   * Get user role for dashboard redirection
   */
  getUserRole() {
    if (!this.currentUser || !this.currentUser.roles || this.currentUser.roles.length === 0) {
      return null
    }
    // Return the first role (as per user preference for single role handling)
    return this.currentUser.roles[0].toLowerCase()
  }

  /**
   * Clean mock tokens from localStorage (for development/debugging)
   */
  cleanMockTokens() {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    let cleaned = false

    if (accessToken && accessToken.startsWith('mock_access_token_')) {
      console.log('Cleaning mock access token')
      localStorage.removeItem('accessToken')
      cleaned = true
    }

    if (refreshToken && refreshToken.startsWith('mock_refresh_token_')) {
      console.log('Cleaning mock refresh token')
      localStorage.removeItem('refreshToken')
      cleaned = true
    }

    if (cleaned) {
      localStorage.removeItem('currentUser')
      this.currentUser = null
      this.notifyListeners()
      console.log('Mock tokens cleaned successfully. User logged out.')
    }

    return cleaned
  }

  /**
   * Get dashboard route based on user role
   * Now returns unified /dashboard route for all roles
   */
  getDashboardRoute() {
    return '/dashboard'
  }
}

// Export singleton instance
export default new AuthService()