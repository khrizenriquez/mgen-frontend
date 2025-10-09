import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { vi } from 'vitest'
import i18n from '../../../i18n'
import DashboardLayout from '../DashboardLayout'
import AuthService from '../../../core/services/AuthService'

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useLocation: vi.fn(() => ({ pathname: '/' })),
    Link: ({ children, ...props }) => <a {...props}>{children}</a>,
  }
})

// Mock AuthService
vi.mock('../../../core/services/AuthService', () => ({
  default: {
    getCurrentUser: vi.fn(),
    subscribe: vi.fn(),
    logout: vi.fn(),
  }
}))

// Mock dashboard components
vi.mock('../../../pages/AdminDashboardPage', () => ({
  default: function MockAdminDashboard() {
    return <div data-testid="admin-dashboard">Admin Dashboard Content</div>
  }
}))

vi.mock('../../../pages/UserDashboardPage', () => ({
  default: function MockUserDashboard() {
    return <div data-testid="user-dashboard">User Dashboard Content</div>
  }
}))

vi.mock('../../../pages/DonorDashboardPage', () => ({
  default: function MockDonorDashboard() {
    return <div data-testid="donor-dashboard">Donor Dashboard Content</div>
  }
}))

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  )
}

describe('DashboardLayout', () => {
  const mockNavigate = vi.fn()
  const mockUnsubscribe = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    AuthService.subscribe.mockReturnValue(mockUnsubscribe)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('User Role: ADMIN', () => {
    const adminUser = {
      email: 'admin@test.com',
      roles: ['ADMIN']
    }

    beforeEach(() => {
      AuthService.getCurrentUser.mockReturnValue(adminUser)
    })

    test('renders admin navigation items', () => {
      renderWithProviders(<DashboardLayout />)

      // Check admin-specific navigation items
      expect(screen.getByTestId('nav-link-panel-admin')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-usuarios')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-donaciones')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-reportes')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-configuración')).toBeInTheDocument()
    })

    test('renders admin dashboard content', () => {
      renderWithProviders(<DashboardLayout />)

      expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()
      expect(screen.queryByTestId('user-dashboard')).not.toBeInTheDocument()
      expect(screen.queryByTestId('donor-dashboard')).not.toBeInTheDocument()
    })

    test('displays admin role badge', () => {
      renderWithProviders(<DashboardLayout />)

      const desktopBadge = screen.getByTestId('desktop-role-badge')
      expect(desktopBadge).toHaveTextContent('Administrador')
      expect(desktopBadge).toHaveClass('bg-danger')
    })
  })

  describe('User Role: DONOR', () => {
    const donorUser = {
      email: 'donor@test.com',
      roles: ['DONOR']
    }

    beforeEach(() => {
      AuthService.getCurrentUser.mockReturnValue(donorUser)
    })

    test('renders donor navigation items', () => {
      renderWithProviders(<DashboardLayout />)

      expect(screen.getByTestId('nav-link-mi-panel')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-mis-donaciones')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-nuevo-donativo')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-perfil')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-historial')).toBeInTheDocument()
    })

    test('renders donor dashboard content', () => {
      renderWithProviders(<DashboardLayout />)

      expect(screen.getByTestId('donor-dashboard')).toBeInTheDocument()
      expect(screen.queryByTestId('admin-dashboard')).not.toBeInTheDocument()
      expect(screen.queryByTestId('user-dashboard')).not.toBeInTheDocument()
    })

    test('displays donor role badge', () => {
      renderWithProviders(<DashboardLayout />)

      const desktopBadge = screen.getByTestId('desktop-role-badge')
      expect(desktopBadge).toHaveTextContent('Donante')
      expect(desktopBadge).toHaveClass('bg-success')
    })
  })

  describe('User Role: USER (default)', () => {
    const user = {
      email: 'user@test.com',
      roles: ['USER']
    }

    beforeEach(() => {
      AuthService.getCurrentUser.mockReturnValue(user)
    })

    test('renders user navigation items', () => {
      renderWithProviders(<DashboardLayout />)

      expect(screen.getByTestId('nav-link-mi-panel')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-ver-donaciones')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-estadísticas')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-perfil')).toBeInTheDocument()
    })

    test('renders user dashboard content', () => {
      renderWithProviders(<DashboardLayout />)

      expect(screen.getByTestId('user-dashboard')).toBeInTheDocument()
      expect(screen.queryByTestId('admin-dashboard')).not.toBeInTheDocument()
      expect(screen.queryByTestId('donor-dashboard')).not.toBeInTheDocument()
    })

    test('displays user role badge', () => {
      renderWithProviders(<DashboardLayout />)

      const desktopBadge = screen.getByTestId('desktop-role-badge')
      expect(desktopBadge).toHaveTextContent('Usuario')
      expect(desktopBadge).toHaveClass('bg-primary')
    })
  })

  describe('Common functionality', () => {
    const user = {
      email: 'test@example.com',
      roles: ['USER']
    }

    beforeEach(() => {
      AuthService.getCurrentUser.mockReturnValue(user)
    })

    test('renders logo and brand correctly', () => {
      renderWithProviders(<DashboardLayout />)

      const logoLink = screen.getByTestId('logo-link')
      expect(logoLink).toHaveAttribute('href', '/')

      const logoIcon = screen.getByTestId('navbar-logo-icon')
      expect(logoIcon).toHaveClass('bi-heart-fill', 'text-danger')

      expect(screen.getByText('Plataforma de donaciones')).toBeInTheDocument()
    })

    test('displays user information correctly', () => {
      renderWithProviders(<DashboardLayout />)

      const userInfo = screen.getByTestId('desktop-user-info')
      expect(userInfo).toHaveTextContent('Bienvenido,')
      expect(userInfo).toHaveTextContent('test@example.com')
    })

    test('handles logout correctly', async () => {
      const mockNavigate = vi.fn()
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom')
        return {
          ...actual,
          useNavigate: () => mockNavigate,
        }
      })

      AuthService.logout.mockResolvedValue()

      renderWithProviders(<DashboardLayout />)

      const logoutButton = screen.getByTestId('logout-button')
      fireEvent.click(logoutButton)

      await waitFor(() => {
        expect(AuthService.logout).toHaveBeenCalled()
        expect(mockNavigate).toHaveBeenCalledWith('/login')
      })
    })

    test('subscribes to auth changes on mount', () => {
      renderWithProviders(<DashboardLayout />)

      expect(AuthService.getCurrentUser).toHaveBeenCalled()
      expect(AuthService.subscribe).toHaveBeenCalled()
    })

    test('unsubscribes from auth changes on unmount', () => {
      const { unmount } = renderWithProviders(<DashboardLayout />)

      unmount()

      expect(mockUnsubscribe).toHaveBeenCalled()
    })
  })

  describe('Mobile menu functionality', () => {
    const user = {
      email: 'mobile@test.com',
      roles: ['USER']
    }

    beforeEach(() => {
      AuthService.getCurrentUser.mockReturnValue(user)
    })

    test('shows mobile menu toggle button', () => {
      renderWithProviders(<DashboardLayout />)

      const mobileToggle = screen.getByTestId('mobile-menu-toggle')
      expect(mobileToggle).toBeInTheDocument()
    })

    test('opens mobile menu when toggle is clicked', () => {
      renderWithProviders(<DashboardLayout />)

      const mobileToggle = screen.getByTestId('mobile-menu-toggle')
      fireEvent.click(mobileToggle)

      const offcanvas = screen.getByTestId('mobile-offcanvas')
      expect(offcanvas).toHaveClass('show')
    })

    test('displays user info in mobile menu', () => {
      renderWithProviders(<DashboardLayout />)

      const mobileToggle = screen.getByTestId('mobile-menu-toggle')
      fireEvent.click(mobileToggle)

      const offcanvasBody = screen.getByTestId('offcanvas-body')
      expect(offcanvasBody).toHaveTextContent('mobile@test.com')
      expect(screen.getByTestId('offcanvas-role-badge')).toHaveTextContent('Usuario')
    })

    test('renders navigation items in mobile menu', () => {
      renderWithProviders(<DashboardLayout />)

      const mobileToggle = screen.getByTestId('mobile-menu-toggle')
      fireEvent.click(mobileToggle)

      expect(screen.getByTestId('mobile-nav-link-inicio')).toBeInTheDocument()
      expect(screen.getByTestId('mobile-nav-link-mi-panel')).toBeInTheDocument()
    })

    test('closes mobile menu when navigation item is clicked', () => {
      renderWithProviders(<DashboardLayout />)

      const mobileToggle = screen.getByTestId('mobile-menu-toggle')
      fireEvent.click(mobileToggle)

      const navLink = screen.getByTestId('mobile-nav-link-inicio')
      fireEvent.click(navLink)

      // Menu should close (offcanvas should not be visible)
      const offcanvas = screen.getByTestId('mobile-offcanvas')
      expect(offcanvas).not.toHaveClass('show')
    })

    test('handles mobile logout correctly', async () => {
      const mockNavigate = vi.fn()
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom')
        return {
          ...actual,
          useNavigate: () => mockNavigate,
        }
      })

      AuthService.logout.mockResolvedValue()

      renderWithProviders(<DashboardLayout />)

      const mobileToggle = screen.getByTestId('mobile-menu-toggle')
      fireEvent.click(mobileToggle)

      const mobileLogoutButton = screen.getByTestId('mobile-logout-button')
      fireEvent.click(mobileLogoutButton)

      await waitFor(() => {
        expect(AuthService.logout).toHaveBeenCalled()
        expect(mockNavigate).toHaveBeenCalledWith('/login')
      })
    })
  })

  describe('Navigation highlighting', () => {
    const user = {
      email: 'test@example.com',
      roles: ['USER']
    }

    beforeEach(() => {
      AuthService.getCurrentUser.mockReturnValue(user)
    })

    test('highlights active navigation item', () => {
      // Mock useLocation to return a specific pathname
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom')
        return {
          ...actual,
          useLocation: () => ({ pathname: '/user-dashboard' }),
        }
      })

      renderWithProviders(<DashboardLayout />)

      const activeLink = screen.getByTestId('nav-link-mi-panel')
      expect(activeLink).toHaveClass('text-primary', 'fw-medium')
    })

    test('does not highlight inactive navigation items', () => {
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom')
        return {
          ...actual,
          useLocation: () => ({ pathname: '/some-other-path' }),
        }
      })

      renderWithProviders(<DashboardLayout />)

      const inactiveLink = screen.getByTestId('nav-link-mi-panel')
      expect(inactiveLink).toHaveClass('text-dark')
      expect(inactiveLink).not.toHaveClass('text-primary')
    })
  })

  describe('Error handling', () => {
    test('handles logout error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      AuthService.getCurrentUser.mockReturnValue({ email: 'test@example.com', roles: ['USER'] })
      AuthService.logout.mockRejectedValue(new Error('Logout failed'))

      renderWithProviders(<DashboardLayout />)

      const logoutButton = screen.getByTestId('logout-button')
      fireEvent.click(logoutButton)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error during logout:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })

    test('handles null user gracefully', () => {
      AuthService.getCurrentUser.mockReturnValue(null)

      renderWithProviders(<DashboardLayout />)

      expect(screen.getByText('Usuario')).toBeInTheDocument()
      expect(screen.getByTestId('desktop-role-badge')).toHaveTextContent('Usuario')
    })
  })
})