import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { vi } from 'vitest'
import i18n from '../../../i18n'
import Layout from '../Layout'
import AuthService from '../../../core/services/AuthService'
import { useLocation } from 'react-router-dom'

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
    isAuthenticated: vi.fn(),
  }
}))

// Mock i18n translations
const mockT = vi.fn((key, options) => {
  const translations = {
    'common.navigation.home': 'Inicio',
    'common.navigation.donations': 'Donaciones',
    'common.navigation.donate': 'Donar',
    'common.navigation.stats': 'Estadísticas',
    'common.brand.name': 'Plataforma de donaciones',
    'common.footer.copyright': `© ${options?.year || new Date().getFullYear()} Plataforma de donaciones`,
    'common.footer.version': 'Versión',
  }
  return translations[key] || key
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
  }),
  I18nextProvider: ({ children }) => children,
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

describe('Layout', () => {
  const mockChildren = <div data-testid="mock-children">Test Content</div>
  const mockUnsubscribe = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    AuthService.subscribe.mockReturnValue(mockUnsubscribe)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Unauthenticated user', () => {
    beforeEach(() => {
      AuthService.isAuthenticated.mockReturnValue(false)
      AuthService.getCurrentUser.mockReturnValue(null)
    })

    test('renders basic navigation items', () => {
      renderWithProviders(<Layout>{mockChildren}</Layout>)

      expect(screen.getByTestId('nav-link-inicio')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-donaciones')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-donar')).toBeInTheDocument()
      expect(screen.queryByTestId('nav-link-estadísticas')).not.toBeInTheDocument()
    })

    test('shows login link for unauthenticated users', () => {
      renderWithProviders(<Layout>{mockChildren}</Layout>)

      const loginLink = screen.getByTestId('login-link')
      expect(loginLink).toBeInTheDocument()
      expect(loginLink).toHaveAttribute('href', '/login')
      expect(loginLink).toHaveTextContent('Iniciar Sesión')
    })

    test('does not show user info or dashboard link', () => {
      renderWithProviders(<Layout>{mockChildren}</Layout>)

      expect(screen.queryByTestId('desktop-user-info')).not.toBeInTheDocument()
      expect(screen.queryByTestId('mobile-user-info')).not.toBeInTheDocument()
      expect(screen.queryByTestId('dashboard-link')).not.toBeInTheDocument()
    })
  })

  describe('Authenticated user', () => {
    const mockUser = {
      email: 'test@example.com',
      roles: ['USER']
    }

    beforeEach(() => {
      AuthService.isAuthenticated.mockReturnValue(true)
      AuthService.getCurrentUser.mockReturnValue(mockUser)
    })

    test('renders all navigation items including stats', () => {
      renderWithProviders(<Layout>{mockChildren}</Layout>)

      expect(screen.getByTestId('nav-link-inicio')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-donaciones')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-donar')).toBeInTheDocument()
      expect(screen.getByTestId('nav-link-estadísticas')).toBeInTheDocument()
    })

    test('shows dashboard link for authenticated users', () => {
      renderWithProviders(<Layout>{mockChildren}</Layout>)

      const dashboardLink = screen.getByTestId('dashboard-link')
      expect(dashboardLink).toBeInTheDocument()
      expect(dashboardLink).toHaveAttribute('href', '/dashboard')
      expect(dashboardLink).toHaveTextContent('Dashboard')
    })

    test('shows user info on desktop', () => {
      renderWithProviders(<Layout>{mockChildren}</Layout>)

      const userInfo = screen.getByTestId('desktop-user-info')
      expect(userInfo).toHaveTextContent('Bienvenido,')
      expect(userInfo).toHaveTextContent('test@example.com')
      expect(userInfo).toHaveTextContent('USER')
    })

    test('shows user role badge on mobile', () => {
      renderWithProviders(<Layout>{mockChildren}</Layout>)

      const mobileRole = screen.getByTestId('mobile-user-role')
      expect(mobileRole).toHaveTextContent('USER')
      expect(mobileRole).toHaveClass('badge', 'bg-primary', 'text-white')
    })

    test('does not show login link', () => {
      renderWithProviders(<Layout>{mockChildren}</Layout>)

      expect(screen.queryByTestId('login-link')).not.toBeInTheDocument()
    })
  })

  describe('Common functionality', () => {
    beforeEach(() => {
      AuthService.isAuthenticated.mockReturnValue(false)
      AuthService.getCurrentUser.mockReturnValue(null)
    })

    test('renders logo and brand correctly', () => {
      renderWithProviders(<Layout>{mockChildren}</Layout>)

      const brand = screen.getByTestId('navbar-brand')
      expect(brand).toHaveAttribute('href', '/')

      const logo = screen.getByTestId('navbar-logo')
      expect(logo).toHaveClass('bi-heart-fill', 'text-danger')

      expect(screen.getByText('Plataforma de donaciones')).toBeInTheDocument()
    })

    test('renders children content', () => {
      renderWithProviders(<Layout>{mockChildren}</Layout>)

      expect(screen.getByTestId('mock-children')).toBeInTheDocument()
      expect(screen.getByTestId('mock-children')).toHaveTextContent('Test Content')
    })

    test('renders footer with copyright and version', () => {
      const currentYear = new Date().getFullYear()

      renderWithProviders(<Layout>{mockChildren}</Layout>)

      const copyright = screen.getByTestId('footer-copyright')
      expect(copyright).toHaveTextContent(`© ${currentYear} Plataforma de donaciones`)

      const version = screen.getByTestId('footer-version')
      expect(version).toHaveTextContent('Versión 1.0.0')
    })

    test('subscribes to auth changes on mount', () => {
      renderWithProviders(<Layout>{mockChildren}</Layout>)

      expect(AuthService.getCurrentUser).toHaveBeenCalled()
      expect(AuthService.subscribe).toHaveBeenCalled()
    })

    test('unsubscribes from auth changes on unmount', () => {
      const { unmount } = renderWithProviders(<Layout>{mockChildren}</Layout>)

      unmount()

      expect(mockUnsubscribe).toHaveBeenCalled()
    })
  })

  describe('Mobile menu functionality', () => {
    beforeEach(() => {
      AuthService.isAuthenticated.mockReturnValue(false)
      AuthService.getCurrentUser.mockReturnValue(null)
    })

    test('shows mobile menu toggle button', () => {
      renderWithProviders(<Layout>{mockChildren}</Layout>)

      const toggle = screen.getByTestId('mobile-menu-toggle')
      expect(toggle).toBeInTheDocument()
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
    })

    test('toggles mobile menu when button is clicked', () => {
      renderWithProviders(<Layout>{mockChildren}</Layout>)

      const toggle = screen.getByTestId('mobile-menu-toggle')
      const navbarCollapse = screen.getByTestId('navbar-collapse')

      // Initially collapsed
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      expect(navbarCollapse).not.toHaveClass('show')

      // Click to open
      fireEvent.click(toggle)
      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      expect(navbarCollapse).toHaveClass('show')

      // Click to close
      fireEvent.click(toggle)
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      expect(navbarCollapse).not.toHaveClass('show')
    })

    test('closes mobile menu when navigation link is clicked', () => {
      renderWithProviders(<Layout>{mockChildren}</Layout>)

      const toggle = screen.getByTestId('mobile-menu-toggle')
      const navbarCollapse = screen.getByTestId('navbar-collapse')

      // Open mobile menu
      fireEvent.click(toggle)
      expect(navbarCollapse).toHaveClass('show')

      // Click a navigation link
      const navLink = screen.getByTestId('nav-link-inicio')
      fireEvent.click(navLink)

      // Menu should close
      expect(navbarCollapse).not.toHaveClass('show')
    })
  })

  describe('Navigation highlighting', () => {
    beforeEach(() => {
      AuthService.isAuthenticated.mockReturnValue(false)
      AuthService.getCurrentUser.mockReturnValue(null)
    })

    test('highlights active navigation item', () => {
      // Mock useLocation to return a specific pathname
      const mockUseLocation = vi.mocked(useLocation)
      mockUseLocation.mockReturnValue({ pathname: '/donations' })

      renderWithProviders(<Layout>{mockChildren}</Layout>)

      const activeLink = screen.getByTestId('nav-link-donaciones')
      expect(activeLink).toHaveClass('active', 'text-primary', 'fw-medium')
    })

    test('does not highlight inactive navigation items', () => {
      const mockUseLocation = vi.mocked(useLocation)
      mockUseLocation.mockReturnValue({ pathname: '/some-other-path' })

      renderWithProviders(<Layout>{mockChildren}</Layout>)

      const inactiveLink = screen.getByTestId('nav-link-inicio')
      expect(inactiveLink).toHaveClass('text-dark')
      expect(inactiveLink).not.toHaveClass('active', 'text-primary')
    })
  })

  describe('Responsive design', () => {
    test('applies correct responsive classes', () => {
      AuthService.isAuthenticated.mockReturnValue(false)
      AuthService.getCurrentUser.mockReturnValue(null)

      renderWithProviders(<Layout>{mockChildren}</Layout>)

      const mainLayout = screen.getByTestId('main-layout')
      expect(mainLayout).toHaveClass('min-vh-100', 'bg-light', 'd-flex', 'flex-column')

      const navbar = screen.getByTestId('navbar')
      expect(navbar).toHaveClass('navbar', 'navbar-expand-lg', 'navbar-light', 'bg-white')

      const mainContent = screen.getByTestId('main-content')
      expect(mainContent).toHaveClass('container-fluid', 'py-4', 'flex-grow-1')
    })

    test('shows appropriate user info based on screen size', () => {
      const mockUser = {
        email: 'test@example.com',
        roles: ['USER']
      }

      AuthService.isAuthenticated.mockReturnValue(true)
      AuthService.getCurrentUser.mockReturnValue(mockUser)

      renderWithProviders(<Layout>{mockChildren}</Layout>)

      // Desktop user info should be visible
      expect(screen.getByTestId('desktop-user-info')).toBeInTheDocument()
      expect(screen.getByTestId('mobile-user-info')).toBeInTheDocument()

      // Check responsive classes
      const desktopInfo = screen.getByTestId('desktop-user-info')
      expect(desktopInfo).toHaveClass('d-none', 'd-md-flex')

      const mobileInfo = screen.getByTestId('mobile-user-info')
      expect(mobileInfo).toHaveClass('d-flex', 'd-md-none')
    })
  })

  describe('Footer content', () => {
    beforeEach(() => {
      AuthService.isAuthenticated.mockReturnValue(false)
      AuthService.getCurrentUser.mockReturnValue(null)
    })

    test('displays current year in copyright', () => {
      const currentYear = new Date().getFullYear()

      renderWithProviders(<Layout>{mockChildren}</Layout>)

      const copyright = screen.getByTestId('footer-copyright')
      expect(copyright).toHaveTextContent(currentYear.toString())
    })

    test('displays version from environment variable', () => {
      // Mock environment variable
      import.meta.env.VITE_APP_VERSION = '2.1.0'

      renderWithProviders(<Layout>{mockChildren}</Layout>)

      const version = screen.getByTestId('footer-version')
      expect(version).toHaveTextContent('Versión 2.1.0')

      // Reset mock
      delete import.meta.env.VITE_APP_VERSION
    })

    test('displays default version when env var not set', () => {
      renderWithProviders(<Layout>{mockChildren}</Layout>)

      const version = screen.getByTestId('footer-version')
      expect(version).toHaveTextContent('Versión 1.0.0')
    })
  })
})