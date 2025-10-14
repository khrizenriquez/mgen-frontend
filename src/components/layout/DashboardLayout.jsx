/**
 * Dashboard Layout Component
 * Provides navigation and structure for role-based dashboards
 */
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap'
import AuthService from '../../core/services/AuthService'

// Import dashboard components
import AdminDashboardPage from '../../pages/AdminDashboardPage'
import UserDashboardPage from '../../pages/UserDashboardPage'
import DonorDashboardPage from '../../pages/DonorDashboardPage'

export default function DashboardLayout({ children }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

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

  // Navigation items based on role
  const getNavigationItems = (role) => {
    const commonItems = [
      { name: 'Inicio', href: '/', icon: 'bi-house', external: true },
    ]

    switch (role) {
      case 'ADMIN':
        return [
          ...commonItems,
          { name: 'Panel Admin', href: '/admin-dashboard', icon: 'bi-speedometer2' },
          { name: 'Usuarios', href: '/admin/users', icon: 'bi-people' },
          { name: 'Donaciones', href: '/admin/donations', icon: 'bi-cash-stack' },
          { name: 'Reportes', href: '/admin/reports', icon: 'bi-graph-up' },
          { name: 'Configuración', href: '/admin/settings', icon: 'bi-gear' },
        ]
      case 'DONOR':
        return [
          ...commonItems,
          { name: 'Mi Panel', href: '/donor-dashboard', icon: 'bi-speedometer2' },
          { name: 'Mis Donaciones', href: '/donor/donations', icon: 'bi-heart' },
          { name: 'Nuevo Donativo', href: '/donate', icon: 'bi-plus-circle', external: true },
          { name: 'Perfil', href: '/donor/profile', icon: 'bi-person' },
          { name: 'Historial', href: '/donor/history', icon: 'bi-clock-history' },
        ]
      case 'USER':
      default:
        return [
          ...commonItems,
          { name: 'Mi Panel', href: '/user-dashboard', icon: 'bi-speedometer2' },
          { name: 'Ver Donaciones', href: '/donations', icon: 'bi-list-ul', external: true },
          { name: 'Estadísticas', href: '/stats', icon: 'bi-graph-up', external: true },
          { name: 'Perfil', href: '/user/profile', icon: 'bi-person' },
        ]
    }
  }

  const userRole = currentUser?.roles?.[0] || 'USER'
  const userName = currentUser?.email || 'Usuario'
  const navigationItems = getNavigationItems(userRole)

  // Render the appropriate dashboard component based on role
  const renderDashboardContent = () => {
    switch (userRole) {
      case 'ADMIN':
        return <AdminDashboardPage />
      case 'DONOR':
        return <DonorDashboardPage />
      case 'USER':
      default:
        return <UserDashboardPage />
    }
  }

  const handleLogout = async () => {
    try {
      await AuthService.logout()
    } catch (error) {
      console.error('Error during logout:', error)
    }
    navigate('/login')
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ADMIN': return 'Administrador'
      case 'DONOR': return 'Donante'
      case 'USER': return 'Usuario'
      default: return 'Usuario'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'danger'
      case 'DONOR': return 'success'
      case 'USER': return 'primary'
      default: return 'primary'
    }
  }

  return (
    <div className="dashboard-layout min-vh-100 bg-light">
      {/* Top Navigation Bar */}
      <Navbar bg="white" expand="lg" className="border-bottom shadow-sm">
        <Container fluid>
          {/* Logo and Brand */}
          <div className="d-flex align-items-center">
            <Link to="/" className="text-decoration-none me-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-heart-fill text-danger me-2" style={{fontSize: '1.5rem'}}></i>
                <span className="fw-semibold text-dark">Plataforma de donaciones</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <Navbar.Collapse id="dashboard-nav" className="d-none d-lg-block">
            <Nav className="mx-auto">
              {navigationItems.map((item) => {
                if (item.external) return null
                const isActive = location.pathname === item.href
                return (
                  <Nav.Link
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={`mx-2 ${isActive ? 'text-primary fw-medium' : 'text-dark'}`}
                  >
                    <i className={`${item.icon} me-1`}></i>
                    {item.name}
                  </Nav.Link>
                )
              })}
            </Nav>
          </Navbar.Collapse>

          {/* User Info and Logout */}
          <div className="d-flex align-items-center">
            {/* Mobile: Show compact user info */}
            <div className="d-flex d-md-none align-items-center me-2">
              <span className={`badge bg-${getRoleColor(userRole)} text-white me-2`}>
                {getRoleDisplayName(userRole)}
              </span>
            </div>
            {/* Desktop: Show full user info */}
            <div className="d-none d-md-flex align-items-center me-3">
              <span className="text-muted small me-2">Bienvenido,</span>
              <span className="fw-medium me-2">{userName || 'Usuario'}</span>
              <span className={`badge bg-${getRoleColor(userRole)} text-white`}>
                {getRoleDisplayName(userRole)}
              </span>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="outline-secondary"
              className="d-lg-none me-2"
              onClick={() => setShowMobileMenu(true)}
            >
              <i className="bi bi-list"></i>
            </Button>

            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              <span className="d-none d-sm-inline">Salir</span>
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Mobile Menu Offcanvas */}
      <Offcanvas
        show={showMobileMenu}
        onHide={() => setShowMobileMenu(false)}
        placement="end"
        className="d-lg-none"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <div className="d-flex align-items-center">
              <i className="bi bi-heart-fill text-danger me-2"></i>
              <span className="fw-semibold">Menú</span>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="mb-3">
            <div className="d-flex align-items-center mb-3">
              <div className="flex-grow-1">
                <div className="fw-medium">{userName || 'Usuario'}</div>
                <div className={`badge bg-${getRoleColor(userRole)} text-white mt-1`}>
                  {getRoleDisplayName(userRole)}
                </div>
              </div>
            </div>
          </div>

          <Nav className="flex-column">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Nav.Link
                  key={item.name}
                  as={item.external ? 'a' : Link}
                  to={item.external ? undefined : item.href}
                  href={item.external ? item.href : undefined}
                  className={`d-flex align-items-center py-3 px-2 mb-1 rounded ${
                    isActive ? 'bg-primary text-white' : 'text-dark'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <i className={`${item.icon} me-3 fs-5`}></i>
                  <span>{item.name}</span>
                  {item.external && (
                    <i className="bi bi-box-arrow-up-right ms-auto"></i>
                  )}
                </Nav.Link>
              )
            })}
          </Nav>

          <hr className="my-4" />

          <Button
            variant="outline-danger"
            className="w-100"
            onClick={() => {
              setShowMobileMenu(false)
              handleLogout()
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Cerrar sesión
          </Button>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <main className="flex-grow-1 py-4">
        <Container fluid>
          {renderDashboardContent()}
        </Container>
      </main>
    </div>
  )
}