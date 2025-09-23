/**
 * Authentication Service
 * Handles authentication logic without backend connection
 */
class AuthService {
  constructor() {
    this.currentUser = null
    this.listeners = []
    this.loadUserFromStorage()
  }

  /**
   * Load user data from localStorage on app initialization
   */
  loadUserFromStorage() {
    try {
      const userData = localStorage.getItem('currentUser')
      if (userData) {
        this.currentUser = JSON.parse(userData)
        this.notifyListeners()
      }
    } catch (error) {
      console.error('Error loading user from storage:', error)
      localStorage.removeItem('currentUser')
    }
  }

  /**
   * Save user data to localStorage
   */
  saveUserToStorage(user) {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user))
    } catch (error) {
      console.error('Error saving user to storage:', error)
    }
  }

  /**
   * Remove user data from localStorage
   */
  removeUserFromStorage() {
    localStorage.removeItem('currentUser')
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
   * Simulate login (without backend)
   */
  async login(credentials) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simulate authentication logic
      // In a real app, this would call the backend API
      const mockUser = {
        id: 1,
        name: 'Usuario Ejemplo',
        email: credentials.email,
        token: 'mock-jwt-token-' + Date.now(),
        loginAt: new Date().toISOString()
      }

      this.currentUser = mockUser
      this.saveUserToStorage(mockUser)
      this.notifyListeners()

      return { success: true, user: mockUser }
    } catch (error) {
      throw new Error('Error al iniciar sesión')
    }
  }

  /**
   * Simulate registration (without backend)
   */
  async register(userData) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simulate registration logic
      // In a real app, this would call the backend API
      const mockUser = {
        id: Math.floor(Math.random() * 1000),
        name: userData.name,
        email: userData.email,
        token: 'mock-jwt-token-' + Date.now(),
        createdAt: new Date().toISOString()
      }

      // Don't auto-login after registration in this simulation
      return { success: true, user: mockUser }
    } catch (error) {
      throw new Error('Error al crear la cuenta')
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
   * Logout user
   */
  logout() {
    this.currentUser = null
    this.removeUserFromStorage()
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

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))

      // Update user data
      this.currentUser = { ...this.currentUser, ...userData }
      this.saveUserToStorage(this.currentUser)
      this.notifyListeners()

      return { success: true, user: this.currentUser }
    } catch (error) {
      throw new Error('Error al actualizar el perfil')
    }
  }

  /**
   * Validate authentication token
   */
  async validateToken() {
    try {
      if (!this.currentUser || !this.currentUser.token) {
        return false
      }

      // Simulate token validation
      // In a real app, this would validate against the backend
      return true
    } catch (error) {
      console.error('Token validation error:', error)
      return false
    }
  }
}

// Export singleton instance
export default new AuthService()