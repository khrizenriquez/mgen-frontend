/**
 * Admin Dashboard Page
 * Comprehensive dashboard for system administrators
 */
import { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Badge, Table, ProgressBar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../core/services/api.js'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalDonations: 0,
    totalAmount: 0,
    pendingDonations: 0,
    systemHealth: 100,
    growthMetrics: {
      users_growth_percentage: 0,
      donations_growth_percentage: 0,
      amount_growth_percentage: 0
    }
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [recentDonations, setRecentDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load dashboard stats
        const statsResponse = await api.get('/dashboard/stats')
        const dashboardData = statsResponse.data

        setStats({
          totalUsers: dashboardData.stats.total_users || 0,
          activeUsers: dashboardData.stats.active_users || 0,
          totalDonations: dashboardData.stats.total_donations || 0,
          totalAmount: dashboardData.stats.total_amount_gtq || 0,
          pendingDonations: dashboardData.stats.pending_donations || 0,
          systemHealth: dashboardData.stats.system_health || 98,
          growthMetrics: dashboardData.stats.growth_metrics || {
            users_growth_percentage: 0,
            donations_growth_percentage: 0,
            amount_growth_percentage: 0
          }
        })

        // Load recent users and donations (already included in dashboard stats for admin)
        setRecentUsers(dashboardData.stats.recent_users || [])
        setRecentDonations(dashboardData.stats.recent_donations || [])

      } catch (err) {
        console.error('Error loading dashboard data:', err)
        setError('Error al cargar los datos del dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      pending: 'warning',
      inactive: 'secondary',
      approved: 'success',
      declined: 'danger',
      APPROVED: 'success',
      PENDING: 'warning',
      DECLINED: 'danger',
      EXPIRED: 'secondary'
    }
    const displayText = {
      active: 'Activo',
      pending: 'Pendiente',
      inactive: 'Inactivo',
      approved: 'Aprobado',
      declined: 'Rechazado',
      APPROVED: 'Aprobado',
      PENDING: 'Pendiente',
      DECLINED: 'Rechazado',
      EXPIRED: 'Expirado'
    }
    return <Badge bg={variants[status] || 'secondary'}>{displayText[status] || status}</Badge>
  }

  const getRoleBadge = (role) => {
    const variants = {
      ADMIN: 'danger',
      USER: 'primary',
      DONOR: 'success'
    }
    const displayText = {
      ADMIN: 'Admin',
      USER: 'Usuario',
      DONOR: 'Donante'
    }
    return <Badge bg={variants[role] || 'secondary'}>{displayText[role] || role}</Badge>
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-1">Panel de Administración</h1>
            <p className="text-muted mb-0">Gestión completa del sistema de donaciones</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" size="sm">
              <i className="bi bi-download me-1"></i>
              Exportar Reporte
            </Button>
            <Button variant="primary" size="sm">
              <i className="bi bi-gear me-1"></i>
              Configuración
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <Row className="g-4 mb-5">
          <Col xl={3} lg={6} md={6}>
            <Card className="stats-card h-100">
              <Card.Body className="text-center">
                <div className="stats-icon bg-primary bg-opacity-10 text-primary mx-auto mb-3">
                  <i className="bi bi-people-fill fs-1"></i>
                </div>
                <h3 className="fw-bold mb-1">{stats.totalUsers.toLocaleString()}</h3>
                <p className="text-muted small mb-2">Usuarios Totales</p>
                <div className="text-success small">
                  <i className="bi bi-arrow-up"></i> +{stats.growthMetrics.users_growth_percentage.toFixed(1)}% este mes
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={6} md={6}>
            <Card className="stats-card h-100">
              <Card.Body className="text-center">
                <div className="stats-icon bg-success bg-opacity-10 text-success mx-auto mb-3">
                  <i className="bi bi-cash-stack fs-1"></i>
                </div>
                <h3 className="fw-bold mb-1">Q{stats.totalAmount.toLocaleString()}</h3>
                <p className="text-muted small mb-2">Total Donado</p>
                <div className="text-success small">
                  <i className="bi bi-arrow-up"></i> +{stats.growthMetrics.amount_growth_percentage.toFixed(1)}% este mes
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={6} md={6}>
            <Card className="stats-card h-100">
              <Card.Body className="text-center">
                <div className="stats-icon bg-warning bg-opacity-10 text-warning mx-auto mb-3">
                  <i className="bi bi-clock-history fs-1"></i>
                </div>
                <h3 className="fw-bold mb-1">{stats.pendingDonations}</h3>
                <p className="text-muted small mb-2">Donaciones Pendientes</p>
                <div className="text-warning small">
                  Requieren atención
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={6} md={6}>
            <Card className="stats-card h-100">
              <Card.Body className="text-center">
                <div className="stats-icon bg-info bg-opacity-10 text-info mx-auto mb-3">
                  <i className="bi bi-activity fs-1"></i>
                </div>
                <h3 className="fw-bold mb-1">{stats.systemHealth}%</h3>
                <p className="text-muted small mb-2">Estado del Sistema</p>
                <ProgressBar now={stats.systemHealth} className="mt-2" style={{height: '4px'}} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="g-4 mb-5">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Acciones Rápidas</h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={3} sm={6}>
                    <Button variant="outline-primary" className="w-100 h-100 p-3" as={Link} to="/admin/users">
                      <i className="bi bi-people-fill fs-2 mb-2"></i>
                      <div className="fw-medium">Gestionar Usuarios</div>
                      <small className="text-muted">Crear, editar, eliminar usuarios</small>
                    </Button>
                  </Col>
                  <Col md={3} sm={6}>
                    <Button variant="outline-success" className="w-100 h-100 p-3" as={Link} to="/admin/donations">
                      <i className="bi bi-cash-stack fs-2 mb-2"></i>
                      <div className="fw-medium">Revisar Donaciones</div>
                      <small className="text-muted">Aprobar o rechazar donaciones</small>
                    </Button>
                  </Col>
                  <Col md={3} sm={6}>
                    <Button variant="outline-info" className="w-100 h-100 p-3" as={Link} to="/admin/reports">
                      <i className="bi bi-graph-up fs-2 mb-2"></i>
                      <div className="fw-medium">Ver Reportes</div>
                      <small className="text-muted">Estadísticas y análisis</small>
                    </Button>
                  </Col>
                  <Col md={3} sm={6}>
                    <Button variant="outline-warning" className="w-100 h-100 p-3" as={Link} to="/admin/settings">
                      <i className="bi bi-gear-fill fs-2 mb-2"></i>
                      <div className="fw-medium">Configuración</div>
                      <small className="text-muted">Ajustes del sistema</small>
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <Row className="g-4">
          {/* Recent Users */}
          <Col lg={6}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Usuarios Recientes</h5>
                <Button variant="link" size="sm" as={Link} to="/admin/users">
                  Ver todos <i className="bi bi-arrow-right"></i>
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2"
                                   style={{width: '32px', height: '32px'}}>
                                <span className="text-primary fw-medium small">
                                  {user.email.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="fw-medium small">{user.email}</div>
                                <div className="text-muted small">ID: {user.id.substring(0, 8)}...</div>
                              </div>
                            </div>
                          </td>
                          <td>{user.roles && user.roles.length > 0 ? getRoleBadge(user.roles[0]) : getRoleBadge('USER')}</td>
                          <td>{getStatusBadge(user.status)}</td>
                          <td className="text-muted small">{new Date(user.joined_at).toLocaleDateString('es-GT')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Recent Donations */}
          <Col lg={6}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Donaciones Recientes</h5>
                <Button variant="link" size="sm" as={Link} to="/admin/donations">
                  Ver todas <i className="bi bi-arrow-right"></i>
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Donante</th>
                        <th>Monto</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDonations.map((donation) => (
                        <tr key={donation.id}>
                          <td className="text-muted small">{donation.id.substring(0, 12)}...</td>
                          <td className="fw-medium small">{donation.donor_name || donation.donor_email}</td>
                          <td className="fw-bold text-success">Q{donation.amount_gtq.toLocaleString()}</td>
                          <td>{getStatusBadge(donation.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
  )
}