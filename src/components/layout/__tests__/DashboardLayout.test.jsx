import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { vi } from 'vitest'
import i18n from '../../../i18n'
import DashboardLayout from '../DashboardLayout'
import AuthService from '../../../core/services/AuthService'
import { useLocation, useNavigate } from 'react-router-dom'

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useLocation: vi.fn(() => ({ pathname: '/' })),
    Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
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

// Mock react-bootstrap
vi.mock('react-bootstrap', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    Offcanvas: Object.assign(
      ({ children, ...props }) => <div data-testid="mobile-offcanvas" {...props}>{children}</div>,
      {
        Header: ({ children, closeButton, ...props }) => <div data-testid="offcanvas-header" {...props}>{children}{closeButton && <button data-testid="offcanvas-close">×</button>}</div>,
        Title: ({ children, ...props }) => <div data-testid="offcanvas-title" {...props}>{children}</div>,
        Body: ({ children, ...props }) => <div data-testid="offcanvas-body" {...props}>{children}</div>,
      }
    ),
  }
})
vi.mock('../../../pages/AdminDashboardPage', () => ({
  default: function MockAdminDashboard() {
    return <div data-testid="admin-dashboard-content">Admin Dashboard Content</div>
  }
}))

vi.mock('../../../pages/UserDashboardPage', () => ({
  default: function MockUserDashboard() {
    return <div data-testid="user-dashboard-content">User Dashboard Content</div>
  }
}))

vi.mock('../../../pages/DonorDashboardPage', () => ({
  default: function MockDonorDashboard() {
    return <div data-testid="donor-dashboard-content">Donor Dashboard Content</div>
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

      // Check admin-specific navigation items by data-testid
      expect(screen.getByTestId('nav-link-panel-admin')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-usuarios')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-donaciones')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-reportes')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-configuración')).toBeInTheDocument()
    })

    test('renders admin dashboard content', () => {
      renderWithProviders(<DashboardLayout />)

      expect(screen.getByTestId('admin-dashboard-content')).toBeInTheDocument()
      expect(screen.queryByTestId('user-dashboard-content')).not.toBeInTheDocument()
      expect(screen.queryByTestId('donor-dashboard-content')).not.toBeInTheDocument()
    })

    test('displays admin role badge', () => {
      renderWithProviders(<DashboardLayout />)

      const desktopBadge = screen.getByTestId('desktop-role-badge')
      expect(desktopBadge).toHaveTextContent('Administrador')
      expect(desktopBadge).toHaveClass('badge', 'bg-danger', 'text-white')
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
      expect(screen.getByTestId('nav-link-perfil')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-historial')).toBeInTheDocument()
      // Nuevo Donativo is external, not in desktop nav
    })

    test('renders donor dashboard content', () => {
      renderWithProviders(<DashboardLayout />)

      expect(screen.getByTestId('donor-dashboard-content')).toBeInTheDocument()
      expect(screen.queryByTestId('admin-dashboard-content')).not.toBeInTheDocument()
      expect(screen.queryByTestId('user-dashboard-content')).not.toBeInTheDocument()
    })

    test('displays donor role badge', () => {
      renderWithProviders(<DashboardLayout />)

      const desktopBadge = screen.getByTestId('desktop-role-badge')
      expect(desktopBadge).toHaveTextContent('Donante')
      expect(desktopBadge).toHaveClass('badge', 'bg-success', 'text-white')
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
      expect(screen.getByTestId('nav-link-perfil')).toBeInTheDocument()
      // External items are not rendered in desktop nav
    })

    test('renders user dashboard content', () => {
      renderWithProviders(<DashboardLayout />)

      expect(screen.getByTestId('user-dashboard-content')).toBeInTheDocument()
      expect(screen.queryByTestId('admin-dashboard-content')).not.toBeInTheDocument()
      expect(screen.queryByTestId('donor-dashboard-content')).not.toBeInTheDocument()
    })

    test('displays user role badge', () => {
      renderWithProviders(<DashboardLayout />)

      const desktopBadge = screen.getByTestId('desktop-role-badge')
      expect(desktopBadge).toHaveTextContent('Usuario')
      expect(desktopBadge).toHaveClass('badge', 'bg-primary', 'text-white')
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

      const logoLink = screen.getByRole('link', { name: /plataforma de donaciones/i })
      expect(logoLink).toHaveAttribute('href', '/')

      const logoIcon = document.querySelector('.bi-heart-fill')
      expect(logoIcon).toBeInTheDocument()
      expect(logoIcon).toHaveClass('bi-heart-fill', 'text-danger')

      expect(screen.getByText('Plataforma de donaciones')).toBeInTheDocument()
    })

    test('displays user information correctly', () => {
      renderWithProviders(<DashboardLayout />)

      expect(screen.getByTestId('desktop-user-info')).toHaveTextContent('Bienvenido,test@example.comUsuario')
    })

    test('handles logout correctly', async () => {
      const mockNavigate = vi.fn()
      const mockUseNavigate = vi.mocked(useNavigate)
      mockUseNavigate.mockReturnValue(mockNavigate)

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
      expect(offcanvas).toBeInTheDocument()
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
      const mockUseNavigate = vi.mocked(useNavigate)
      mockUseNavigate.mockReturnValue(mockNavigate)

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
      const mockUseLocation = vi.mocked(useLocation)
      mockUseLocation.mockReturnValue({ pathname: '/user-dashboard' })

      renderWithProviders(<DashboardLayout />)

      const activeLink = screen.getByTestId('nav-link-mi-panel')
      expect(activeLink).toHaveClass('text-primary', 'fw-medium')
    })

    test('does not highlight inactive navigation items', () => {
      const mockUseLocation = vi.mocked(useLocation)
      mockUseLocation.mockReturnValue({ pathname: '/some-other-path' })

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

      expect(screen.getByTestId('desktop-role-badge')).toHaveTextContent('Usuario')
    })
  })
})