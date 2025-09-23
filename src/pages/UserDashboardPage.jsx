/**
 * User Dashboard Page
 * Dashboard for regular authenticated users
 */
import { Card, Row, Col, Button, Badge, ProgressBar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'

export default function UserDashboardPage() {
  // Mock data - will be replaced with real API calls
  const userStats = {
    totalDonations: 12,
    totalAmount: 2850.00,
    favoriteCause: 'Evangelización Infantil',
    memberSince: '2023-06-15',
    nextMilestone: 3000.00,
    currentProgress: 2850.00
  }

  const recentActivity = [
    { id: 1, type: 'donation', title: 'Donación realizada', amount: 'Q250.00', date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'view', title: 'Vio estadísticas', description: 'Consultó reportes mensuales', date: '2024-01-14', status: 'completed' },
    { id: 3, type: 'donation', title: 'Donación realizada', amount: 'Q500.00', date: '2024-01-10', status: 'completed' },
    { id: 4, type: 'view', title: 'Vio donaciones', description: 'Revisó lista de donaciones activas', date: '2024-01-08', status: 'completed' },
  ]

  const upcomingEvents = [
    { id: 1, title: 'Campaña de Navidad', date: '2024-12-01', type: 'campaign', description: 'Ayuda a los niños en Navidad' },
    { id: 2, title: 'Día del Niño', date: '2024-04-30', type: 'event', description: 'Celebración especial para los niños' },
    { id: 3, title: 'Programa de Becas', date: '2024-03-15', type: 'program', description: 'Apoyo educativo continuo' },
  ]

  const getActivityIcon = (type) => {
    const icons = {
      donation: 'bi-heart-fill text-success',
      view: 'bi-eye text-info',
      profile: 'bi-person text-primary'
    }
    return icons[type] || 'bi-circle text-muted'
  }

  const getEventIcon = (type) => {
    const icons = {
      campaign: 'bi-calendar-event text-danger',
      event: 'bi-star text-warning',
      program: 'bi-book text-success'
    }
    return icons[type] || 'bi-circle text-muted'
  }

  const progressPercentage = (userStats.currentProgress / userStats.nextMilestone) * 100

  return (
    <DashboardLayout userRole="USER" userName="Juan Pérez">
      <div className="user-dashboard">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-1">Mi Panel</h1>
            <p className="text-muted mb-0">Bienvenido de vuelta, Juan. Aquí está tu resumen.</p>
          </div>
          <Button variant="primary" as={Link} to="/donate">
            <i className="bi bi-plus-circle me-1"></i>
            Hacer Donación
          </Button>
        </div>

        {/* User Stats */}
        <Row className="g-4 mb-5">
          <Col xl={4} lg={6}>
            <Card className="stats-card h-100">
              <Card.Body className="text-center">
                <div className="stats-icon bg-success bg-opacity-10 text-success mx-auto mb-3">
                  <i className="bi bi-heart-fill fs-1"></i>
                </div>
                <h3 className="fw-bold mb-1">{userStats.totalDonations}</h3>
                <p className="text-muted small mb-0">Donaciones Realizadas</p>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={4} lg={6}>
            <Card className="stats-card h-100">
              <Card.Body className="text-center">
                <div className="stats-icon bg-primary bg-opacity-10 text-primary mx-auto mb-3">
                  <i className="bi bi-cash-stack fs-1"></i>
                </div>
                <h3 className="fw-bold mb-1">Q{userStats.totalAmount.toLocaleString()}</h3>
                <p className="text-muted small mb-0">Total Donado</p>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={4} lg={12}>
            <Card className="stats-card h-100">
              <Card.Body className="text-center">
                <div className="stats-icon bg-info bg-opacity-10 text-info mx-auto mb-3">
                  <i className="bi bi-trophy fs-1"></i>
                </div>
                <h5 className="fw-bold mb-2">Próximo Hito</h5>
                <p className="text-muted small mb-2">Q{userStats.nextMilestone.toLocaleString()}</p>
                <ProgressBar now={progressPercentage} className="mb-2" />
                <small className="text-muted">
                  Q{(userStats.nextMilestone - userStats.currentProgress).toLocaleString()} restantes
                </small>
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
                  <Col md={4} sm={6}>
                    <Button variant="outline-success" className="w-100 h-100 p-3" as={Link} to="/donate">
                      <i className="bi bi-plus-circle fs-2 mb-2 text-success"></i>
                      <div className="fw-medium">Nueva Donación</div>
                      <small className="text-muted">Ayuda a una causa</small>
                    </Button>
                  </Col>
                  <Col md={4} sm={6}>
                    <Button variant="outline-primary" className="w-100 h-100 p-3" as={Link} to="/donations">
                      <i className="bi bi-list-ul fs-2 mb-2 text-primary"></i>
                      <div className="fw-medium">Ver Donaciones</div>
                      <small className="text-muted">Historial completo</small>
                    </Button>
                  </Col>
                  <Col md={4} sm={12}>
                    <Button variant="outline-info" className="w-100 h-100 p-3" as={Link} to="/stats">
                      <i className="bi bi-graph-up fs-2 mb-2 text-info"></i>
                      <div className="fw-medium">Estadísticas</div>
                      <small className="text-muted">Impacto generado</small>
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row className="g-4">
          {/* Recent Activity */}
          <Col lg={8}>
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Actividad Reciente</h5>
                <Button variant="link" size="sm" as={Link} to="/user/history">
                  Ver todo <i className="bi bi-arrow-right"></i>
                </Button>
              </Card.Header>
              <Card.Body>
                <div className="activity-timeline">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className={`d-flex mb-4 ${index === recentActivity.length - 1 ? '' : 'pb-3 border-bottom'}`}>
                      <div className="flex-shrink-0 me-3">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                             style={{width: '40px', height: '40px'}}>
                          <i className={`bi ${getActivityIcon(activity.type)} fs-5`}></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{activity.title}</h6>
                            {activity.amount && (
                              <p className="text-success fw-medium mb-1">{activity.amount}</p>
                            )}
                            {activity.description && (
                              <p className="text-muted small mb-1">{activity.description}</p>
                            )}
                          </div>
                          <small className="text-muted">{activity.date}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* User Info */}
            <Card className="mb-4">
              <Card.Header>
                <h6 className="mb-0">Mi Información</h6>
              </Card.Header>
              <Card.Body className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{width: '60px', height: '60px'}}>
                  <span className="text-primary fw-bold fs-4">JP</span>
                </div>
                <h6 className="mb-1">Juan Pérez</h6>
                <p className="text-muted small mb-2">juan@example.com</p>
                <Badge bg="primary">Usuario Activo</Badge>
                <div className="mt-3 pt-3 border-top">
                  <small className="text-muted">Miembro desde</small>
                  <div className="fw-medium">{new Date(userStats.memberSince).toLocaleDateString('es-GT')}</div>
                </div>
              </Card.Body>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <Card.Header>
                <h6 className="mb-0">Próximos Eventos</h6>
              </Card.Header>
              <Card.Body>
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="d-flex mb-3 pb-3 border-bottom">
                    <div className="flex-shrink-0 me-3">
                      <i className={`bi ${getEventIcon(event.type)} fs-4`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 small">{event.title}</h6>
                      <p className="text-muted small mb-1">{event.description}</p>
                      <small className="text-primary">{new Date(event.date).toLocaleDateString('es-GT')}</small>
                    </div>
                  </div>
                ))}
                <Button variant="outline-primary" size="sm" className="w-100">
                  Ver todos los eventos
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  )
}