/**
 * Admin Dashboard Page
 * Comprehensive dashboard for system administrators
 */
import { Card, Row, Col, Button, Badge, Table, ProgressBar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'

export default function AdminDashboardPage() {
  // Mock data - will be replaced with real API calls
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalDonations: 3456,
    totalAmount: 125430.50,
    pendingDonations: 23,
    systemHealth: 98
  }

  const recentUsers = [
    { id: 1, name: 'María González', email: 'maria@example.com', role: 'DONOR', joinedAt: '2024-01-15', status: 'active' },
    { id: 2, name: 'Carlos Rodríguez', email: 'carlos@example.com', role: 'USER', joinedAt: '2024-01-14', status: 'active' },
    { id: 3, name: 'Ana López', email: 'ana@example.com', role: 'DONOR', joinedAt: '2024-01-13', status: 'pending' },
    { id: 4, name: 'José Martínez', email: 'jose@example.com', role: 'USER', joinedAt: '2024-01-12', status: 'active' },
    { id: 5, name: 'Laura Sánchez', email: 'laura@example.com', role: 'DONOR', joinedAt: '2024-01-11', status: 'active' },
  ]

  const recentDonations = [
    { id: 'DON-001', amount: 250.00, donor: 'María González', status: 'approved', date: '2024-01-15' },
    { id: 'DON-002', amount: 500.00, donor: 'Carlos Rodríguez', status: 'pending', date: '2024-01-14' },
    { id: 'DON-003', amount: 100.00, donor: 'Ana López', status: 'approved', date: '2024-01-13' },
    { id: 'DON-004', amount: 750.00, donor: 'José Martínez', status: 'approved', date: '2024-01-12' },
    { id: 'DON-005', amount: 300.00, donor: 'Laura Sánchez', status: 'pending', date: '2024-01-11' },
  ]

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      pending: 'warning',
      inactive: 'secondary',
      approved: 'success',
      declined: 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getRoleBadge = (role) => {
    const variants = {
      ADMIN: 'danger',
      USER: 'primary',
      DONOR: 'success'
    }
    return <Badge bg={variants[role] || 'secondary'}>{role}</Badge>
  }

  return (
    <DashboardLayout userRole="ADMIN" userName="Admin User">
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
                  <i className="bi bi-arrow-up"></i> +12% este mes
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
                  <i className="bi bi-arrow-up"></i> +8% este mes
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
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="fw-medium small">{user.name}</div>
                                <div className="text-muted small">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>{getRoleBadge(user.role)}</td>
                          <td>{getStatusBadge(user.status)}</td>
                          <td className="text-muted small">{user.joinedAt}</td>
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
                          <td className="text-muted small">{donation.id}</td>
                          <td className="fw-medium small">{donation.donor}</td>
                          <td className="fw-bold text-success">Q{donation.amount.toLocaleString()}</td>
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
    </DashboardLayout>
  )
}