/**
 * AuthService Tests
 */
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest'
import AuthService, { AuthService as AuthServiceClass } from '../AuthService'
import api from '../api.js'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock the API
vi.mock('../api.js', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    healthCheck: vi.fn()
  }
}))

const mockApi = api

describe('AuthService', () => {
  let authService

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()

    // Create fresh instance for each test
    authService = new AuthServiceClass()
  })

  afterEach(() => {
    // Clean up any listeners
    authService.listeners = []
  })

  describe('Initialization', () => {
    test('loads user from localStorage on initialization', () => {
      const mockUser = { id: 1, email: 'test@example.com', roles: ['USER'] }
      const mockToken = 'mock_token'

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'currentUser') return JSON.stringify(mockUser)
        if (key === 'accessToken') return mockToken
        if (key === 'refreshToken') return 'refresh_token'
        return null
      })

      const newService = new AuthService()

      expect(newService.currentUser).toEqual(mockUser)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('currentUser')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('accessToken')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('refreshToken')
    })

    test('clears tokens if user data exists but tokens are missing', () => {
      const mockUser = { id: 1, email: 'test@example.com', roles: ['USER'] }

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'currentUser') return JSON.stringify(mockUser)
        return null
      })

      const newService = new AuthService()

      expect(newService.currentUser).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('currentUser')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken')
    })

    test('handles invalid JSON in localStorage gracefully', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'currentUser') return 'invalid json'
        if (key === 'accessToken') return 'token'
        return null
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const newService = new AuthService()

      expect(newService.currentUser).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Error loading user from storage:', expect.any(SyntaxError))

      consoleSpy.mockRestore()
    })
  })

  describe('Storage Operations', () => {
    test('saves user and tokens to localStorage', () => {
      const user = { id: 1, email: 'test@example.com' }
      const tokens = { access_token: 'access', refresh_token: 'refresh' }

      authService.saveUserToStorage(user, tokens)

      expect(localStorageMock.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(user))
      expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'access')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', 'refresh')
    })

    test('clears all tokens from localStorage', () => {
      authService.clearTokens()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('currentUser')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken')
    })

    test('gets access token from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('test_token')

      const token = authService.getAccessToken()

      expect(token).toBe('test_token')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('accessToken')
    })

    test('gets refresh token from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('refresh_token')

      const token = authService.getRefreshToken()

      expect(token).toBe('refresh_token')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('refreshToken')
    })
  })

  describe('Authentication State', () => {
    test('returns current user', () => {
      const user = { id: 1, email: 'test@example.com' }
      authService.currentUser = user

      expect(authService.getCurrentUser()).toEqual(user)
    })

    test('checks if user is authenticated', () => {
      expect(authService.isAuthenticated()).toBe(false)

      authService.currentUser = { id: 1, email: 'test@example.com' }
      expect(authService.isAuthenticated()).toBe(true)
    })

    test('gets user role', () => {
      expect(authService.getUserRole()).toBeNull()

      authService.currentUser = { id: 1, roles: ['ADMIN'] }
      expect(authService.getUserRole()).toBe('admin')

      authService.currentUser = { id: 1, roles: ['USER', 'DONOR'] }
      expect(authService.getUserRole()).toBe('user')
    })

    test('returns dashboard route', () => {
      expect(authService.getDashboardRoute()).toBe('/dashboard')
    })
  })

  describe('Event Listeners', () => {
    test('subscribes and unsubscribes listeners', () => {
      const listener = vi.fn()
      const unsubscribe = authService.subscribe(listener)

      expect(authService.listeners).toContain(listener)

      unsubscribe()
      expect(authService.listeners).not.toContain(listener)
    })

    test('notifies all listeners when user state changes', () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()

      authService.subscribe(listener1)
      authService.subscribe(listener2)

      const user = { id: 1, email: 'test@example.com' }
      authService.currentUser = user
      authService.notifyListeners()

      expect(listener1).toHaveBeenCalledWith(user)
      expect(listener2).toHaveBeenCalledWith(user)
    })
  })

  describe('Login', () => {
    test('successful login with backend', async () => {
      const credentials = { email: 'test@example.com', password: 'password' }
      const mockResponse = {
        data: { access_token: 'access', refresh_token: 'refresh' }
      }
      const mockUserInfo = {
        id: 1,
        email: 'test@example.com',
        roles: ['USER']
      }

      mockApi.healthCheck.mockResolvedValue(true)
      mockApi.post.mockResolvedValue(mockResponse)
      mockApi.get.mockResolvedValue({ data: mockUserInfo })

      const result = await authService.login(credentials)

      expect(result.success).toBe(true)
      expect(result.user.id).toBe(1)
      expect(result.user.email).toBe('test@example.com')
      expect(result.tokens.access_token).toBe('access')
      expect(authService.currentUser).toEqual(result.user)
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    test('falls back to mock login when backend is unavailable', async () => {
      const credentials = { email: 'user@example.com', password: 'password' }

      mockApi.healthCheck.mockResolvedValue(false)

      const result = await authService.login(credentials)

      expect(result.success).toBe(true)
      expect(result.isMock).toBe(true)
      expect(result.user.roles).toEqual(['USER'])
      expect(authService.currentUser).toEqual(result.user)
    })

    test('handles network errors by falling back to mock login', async () => {
      const credentials = { email: 'user@example.com', password: 'password' }

      mockApi.healthCheck.mockResolvedValue(true)
      mockApi.post.mockRejectedValue({ code: 'ERR_NETWORK' })

      const result = await authService.login(credentials)

      expect(result.success).toBe(true)
      expect(result.isMock).toBe(true)
    })

    test('throws error on login failure', async () => {
      const credentials = { email: 'test@example.com', password: 'wrong' }

      mockApi.healthCheck.mockResolvedValue(true)
      mockApi.post.mockRejectedValue({
        response: { data: { detail: 'Invalid credentials' } }
      })

      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials')
    })

    test('assigns correct roles in mock login', async () => {
      mockApi.healthCheck.mockResolvedValue(false)

      // Admin role
      const adminResult = await authService.login({ email: 'admin@test.com', password: 'pass' })
      expect(adminResult.user.roles).toEqual(['ADMIN'])

      // Donor role
      const donorResult = await authService.login({ email: 'donor@test.com', password: 'pass' })
      expect(donorResult.user.roles).toEqual(['DONOR'])

      // User role (default)
      const userResult = await authService.login({ email: 'user@test.com', password: 'pass' })
      expect(userResult.user.roles).toEqual(['USER'])
    })
  })

  describe('Registration', () => {
    test('successful registration', async () => {
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        fullName: 'New User'
      }
      const mockResponse = {
        data: { message: 'User created successfully' }
      }

      mockApi.post.mockResolvedValue(mockResponse)

      const result = await authService.register(userData)

      expect(result.success).toBe(true)
      expect(result.message).toBe('User created successfully')
      expect(mockApi.post).toHaveBeenCalledWith('/auth/register', userData)
    })

    test('throws error on registration failure', async () => {
      const userData = { email: 'existing@example.com', password: 'pass' }

      mockApi.post.mockRejectedValue({
        response: { data: { detail: 'Email already exists' } }
      })

      await expect(authService.register(userData)).rejects.toThrow('Email already exists')
    })
  })

  describe('Token Management', () => {
    test('refreshes token successfully', async () => {
      localStorageMock.getItem.mockReturnValue('refresh_token')
      const mockResponse = {
        data: { access_token: 'new_access', refresh_token: 'new_refresh' }
      }

      mockApi.post.mockResolvedValue(mockResponse)

      const result = await authService.refreshToken()

      expect(result.access_token).toBe('new_access')
      expect(result.refresh_token).toBe('new_refresh')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'new_access')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', 'new_refresh')
    })

    test('throws error when no refresh token available', async () => {
      localStorageMock.getItem.mockReturnValue(null)

      await expect(authService.refreshToken()).rejects.toThrow('No refresh token available')
    })

    test('clears tokens on refresh failure', async () => {
      localStorageMock.getItem.mockReturnValue('invalid_token')
      mockApi.post.mockRejectedValue(new Error('Invalid token'))

      await expect(authService.refreshToken()).rejects.toThrow('Sesión expirada, por favor inicia sesión nuevamente')

      expect(authService.currentUser).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('currentUser')
    })
  })

  describe('Password Reset', () => {
    test('simulates password reset successfully', async () => {
      const result = await authService.resetPassword('test@example.com')

      expect(result.success).toBe(true)
      expect(result.message).toBe('Correo de recuperación enviado')
    })

    test('handles password reset errors', async () => {
      // Mock setTimeout to throw error
      const originalSetTimeout = global.setTimeout
      global.setTimeout = vi.fn(() => { throw new Error('Timeout error') })

      await expect(authService.resetPassword('test@example.com')).rejects.toThrow('Error al enviar el correo de recuperación')

      global.setTimeout = originalSetTimeout
    })
  })

  describe('Logout', () => {
    test('successful logout with backend notification', async () => {
      authService.currentUser = { id: 1, email: 'test@example.com' }
      localStorageMock.getItem.mockReturnValue('access_token')

      mockApi.healthCheck.mockResolvedValue(true)
      mockApi.post.mockResolvedValue({ data: { success: true } })

      const result = await authService.logout()

      expect(result.success).toBe(true)
      expect(authService.currentUser).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('currentUser')
      expect(mockApi.post).toHaveBeenCalledWith('/auth/logout')
    })

    test('logout works even when backend notification fails', async () => {
      authService.currentUser = { id: 1, email: 'test@example.com' }

      mockApi.healthCheck.mockResolvedValue(true)
      mockApi.post.mockRejectedValue(new Error('Backend error'))

      const result = await authService.logout()

      expect(result.success).toBe(true)
      expect(authService.currentUser).toBeNull()
    })

    test('logout works when backend is unavailable', async () => {
      authService.currentUser = { id: 1, email: 'test@example.com' }

      mockApi.healthCheck.mockResolvedValue(false)

      const result = await authService.logout()

      expect(result.success).toBe(true)
      expect(authService.currentUser).toBeNull()
      expect(mockApi.post).not.toHaveBeenCalled()
    })
  })

  describe('Token Validation', () => {
    test('validates token successfully when backend is healthy', async () => {
      localStorageMock.getItem.mockReturnValue('valid_token')
      authService.currentUser = { id: 1, email: 'test@example.com' }

      mockApi.healthCheck.mockResolvedValue(true)
      mockApi.get.mockResolvedValue({ data: { id: 1, email: 'test@example.com' } })

      const isValid = await authService.validateToken()

      expect(isValid).toBe(true)
      expect(mockApi.get).toHaveBeenCalledWith('/auth/me', {
        headers: { Authorization: 'Bearer valid_token' }
      })
    })

    test('returns false when no access token', async () => {
      localStorageMock.getItem.mockReturnValue(null)

      const isValid = await authService.validateToken()

      expect(isValid).toBe(false)
    })

    test('returns current user status when backend is down', async () => {
      localStorageMock.getItem.mockReturnValue('token')
      authService.currentUser = { id: 1, email: 'test@example.com' }

      mockApi.healthCheck.mockResolvedValue(false)

      const isValid = await authService.validateToken()

      expect(isValid).toBe(true)
    })

    test('returns false when token validation fails', async () => {
      localStorageMock.getItem.mockReturnValue('invalid_token')
      authService.currentUser = { id: 1, email: 'test@example.com' }

      mockApi.healthCheck.mockResolvedValue(true)
      mockApi.get.mockRejectedValue(new Error('Invalid token'))

      const isValid = await authService.validateToken()

      expect(isValid).toBe(false)
    })
  })

  describe('Backend Health Check', () => {
    test('returns true when backend is healthy', async () => {
      mockApi.healthCheck.mockResolvedValue(true)

      const isHealthy = await authService.checkBackendHealth()

      expect(isHealthy).toBe(true)
    })

    test('returns false when backend is unhealthy', async () => {
      mockApi.healthCheck.mockRejectedValue(new Error('Connection failed'))

      const isHealthy = await authService.checkBackendHealth()

      expect(isHealthy).toBe(false)
    })
  })

  describe('Profile Update', () => {
    test('throws error when user is not authenticated', async () => {
      authService.currentUser = null

      await expect(authService.updateProfile({ email: 'new@example.com' }))
        .rejects.toThrow('Usuario no autenticado')
    })

    test('throws error for unimplemented functionality', async () => {
      authService.currentUser = { id: 1, email: 'test@example.com' }

      await expect(authService.updateProfile({ email: 'new@example.com' }))
        .rejects.toThrow('Funcionalidad no implementada en el backend')
    })
  })
})