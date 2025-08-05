/**
 * Main Layout Component
 * Provides the overall structure and navigation for the app
 */
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: 'bi-bar-chart-line' },
  { name: 'Donations', href: '/donations', icon: 'bi-list-ul' },
  { name: 'New Donation', href: '/donations/new', icon: 'bi-plus-circle' },
  { name: 'Statistics', href: '/stats', icon: 'bi-graph-up' },
]

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          {/* Logo and brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <i className="bi bi-heart-fill text-danger me-2" style={{fontSize: '1.5rem'}}></i>
            <span className="fw-semibold">DonationHub</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-controls="navbarNav"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop navigation */}
          <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="navbarNav">
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
                    >
                      <i className={`${item.icon} me-2`}></i>
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="container-fluid py-4 flex-grow-1">
        <div className="container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer bg-white border-top py-3 mt-auto">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="text-muted small">
              © 2024 DonationHub. Built with ❤️ for nonprofits.
            </div>
            <div className="text-muted small">
              Version {import.meta.env.VITE_APP_VERSION || '1.0.0'}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}