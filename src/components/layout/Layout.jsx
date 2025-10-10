/**
 * Main Layout Component
 * Provides the overall structure and navigation for the app
 */
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AuthService from '../../core/services/AuthService'

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const location = useLocation()
  const { t } = useTranslation()

  useEffect(() => {
    // Get current user info
    const user = AuthService.getCurrentUser()
    setCurrentUser(user)

    // Subscribe to auth changes
    const unsubscribe = AuthService.subscribe((user) => {
      setCurrentUser(user)
    })

    return unsubscribe
  }, [])

  const isAuthenticated = AuthService.isAuthenticated()

  // Base navigation items
  const baseNavigation = [
    { name: t('common.navigation.home'), href: '/', icon: 'bi-house' },
    { name: t('common.navigation.donations'), href: '/donations', icon: 'bi-list-ul' },
    { name: t('common.navigation.donate'), href: '/donate', icon: 'bi-heart-fill' },
  ]

  // Statistics only for authenticated users
  const authenticatedNavigation = [
    ...baseNavigation,
    { name: t('common.navigation.stats'), href: '/stats', icon: 'bi-graph-up' },
  ]

  const navigation = isAuthenticated ? authenticatedNavigation : baseNavigation

  return (
    <div className="min-vh-100 bg-light d-flex flex-column" data-testid="main-layout">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom" data-testid="navbar">
        <div className="container-fluid">
          {/* Logo and brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center" data-testid="navbar-brand">
            <i className="bi bi-heart-fill text-danger me-2" data-testid="navbar-logo" style={{fontSize: '1.5rem'}}></i>
            <span className="fw-semibold">{t('common.brand.name')}</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-controls="navbarNav"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation"
            data-testid="mobile-menu-toggle"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop navigation */}
          <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="navbarNav" data-testid="navbar-collapse">
            <ul className="navbar-nav ms-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <li className="nav-item" key={item.name}>
                    <Link
                      to={item.href}
                      className={`nav-link d-flex align-items-center ${
                        isActive ? 'active text-primary fw-medium' : 'text-dark'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`nav-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <i className={`${item.icon} me-2`}></i>
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Authentication / User section */}
          <div className="d-flex align-items-center ms-2 ms-md-3">
            {isAuthenticated ? (
              // Authenticated user - show dashboard link and user info
              <>
                {/* Mobile: Show compact user info */}
                <div className="d-flex d-md-none align-items-center me-2" data-testid="mobile-user-info">
                  <span className="badge bg-primary text-white" data-testid="mobile-user-role">
                    {currentUser?.roles?.[0] || 'USER'}
                  </span>
                </div>
                {/* Desktop: Show full user info */}
                <div className="d-none d-md-flex align-items-center me-3" data-testid="desktop-user-info">
                  <span className="text-muted small me-2">Bienvenido,</span>
                  <span className="fw-medium me-2">{currentUser?.email || 'Usuario'}</span>
                  <span className="badge bg-primary text-white">
                    {currentUser?.roles?.[0] || 'USER'}
                  </span>
                </div>
                <Link to="/dashboard" className="btn btn-outline-primary btn-sm" data-testid="dashboard-link">
                  <i className="bi bi-speedometer2 me-1"></i>
                  <span className="d-none d-sm-inline">Dashboard</span>
                </Link>
              </>
            ) : (
              // Unauthenticated user - show login link
              <Link to="/login" className="btn btn-outline-primary btn-sm" data-testid="login-link">
                <i className="bi bi-person-circle me-1"></i>
                <span className="d-none d-sm-inline">Iniciar Sesión</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="container-fluid py-4 flex-grow-1" data-testid="main-content">
        <div className="container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer bg-white border-top py-3 mt-auto">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6 text-center text-md-start">
              <div className="text-muted small" data-testid="footer-copyright">
                {t('common.footer.copyright', { year: new Date().getFullYear() })}
              </div>
            </div>
            <div className="col-12 col-md-6 text-center text-md-end">
              <div className="text-muted small" data-testid="footer-version">
                {t('common.footer.version')} {import.meta.env.VITE_APP_VERSION || '1.0.0'}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}