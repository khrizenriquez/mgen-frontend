/**
 * Donor Dashboard Page
 * Specialized dashboard for registered donors
 */
import { Card, Row, Col, Button, Badge, ProgressBar, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'

export default function DonorDashboardPage() {
  // Mock data - will be replaced with real API calls
  const donorStats = {
    totalDonations: 28,
    totalAmount: 8750.00,
    monthlyAverage: 625.00,
    favoriteProgram: 'Evangelización Infantil',
    impactChildren: 45,
    memberSince: '2023-03-10',
    donationStreak: 12,
    nextReward: 'Donante Platino'
  }

  const myDonations = [
    { id: 'DON-001', amount: 500.00, program: 'Evangelización Infantil', date: '2024-01-15', status: 'completed', receipt: true },
    { id: 'DON-002', amount: 250.00, program: 'Programa de Alimentación', date: '2024-01-10', status: 'completed', receipt: true },
    { id: 'DON-003', amount: 750.00, program: 'Becas Escolares', date: '2024-01-05', status: 'completed', receipt: true },
    { id: 'DON-004', amount: 300.00, program: 'Evangelización Infantil', date: '2023-12-20', status: 'completed', receipt: true },
  ]

  const impactMetrics = [
    { label: 'Niños beneficiados', value: donorStats.impactChildren, icon: 'bi-people', color: 'success' },
    { label: 'Comidas proporcionadas', value: 2250, icon: 'bi-egg-fried', color: 'warning' },
    { label: 'Becas otorgadas', value: 3, icon: 'bi-mortarboard', color: 'info' },
    { label: 'Horas de evangelización', value: 180, icon: 'bi-book', color: 'primary' },
  ]

  const upcomingPrograms = [
    { id: 1, name: 'Campaña de Verano', description: 'Apoyo estival para niños', progress: 65, goal: 15000.00, current: 9750.00 },
    { id: 2, name: 'Programa de Becas 2024', description: 'Educación para el futuro', progress: 40, goal: 25000.00, current: 10000.00 },
    { id: 3, name: 'Alimentación Escolar', description: 'Nutrición para el aprendizaje', progress: 80, goal: 12000.00, current: 9600.00 },
  ]

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'success',
      pending: 'warning',
      failed: 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  return (
    <DashboardLayout userRole="DONOR" userName="María González">
      <div className="donor-dashboard">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-1">Mi Panel de Donante</h1>
            <p className="text-muted mb-0">Gracias por tu generosidad, María. Tu impacto es invaluable.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-success" as={Link} to="/donor/donations">
              <i className="bi bi-plus-circle me-1"></i>
              Nueva Donación
            </Button>
            <Button variant="success" as={Link} to="/donate">
              <i className="bi bi-heart-fill me-1"></i>
              Donar Ahora
            </Button>
          </div>
        </div>

        {/* Donor Stats */}
        <Row className="g-4 mb-5">
          <Col xl={3} lg={6}>
            <Card className="stats-card h-100 border-success">
              <Card.Body className="text-center">
                <div className="stats-icon bg-success bg-opacity-10 text-success mx-auto mb-3">
                  <i className="bi bi-heart-fill fs-1"></i>
                </div>
                <h3 className="fw-bold mb-1">{donorStats.totalDonations}</h3>
                <p className="text-muted small mb-2">Donaciones Totales</p>
                <div className="text-success small">
                  <i className="bi bi-fire"></i> {donorStats.donationStreak} meses consecutivos
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={6}>
            <Card className="stats-card h-100 border-success">
              <Card.Body className="text-center">
                <div className="stats-icon bg-success bg-opacity-10 text-success mx-auto mb-3">
                  <i className="bi bi-cash-stack fs-1"></i>
                </div>
                <h3 className="fw-bold mb-1">Q{donorStats.totalAmount.toLocaleString()}</h3>
                <p className="text-muted small mb-2">Total Donado</p>
                <div className="text-success small">
                  <i className="bi bi-arrow-up"></i> Promedio Q{donorStats.monthlyAverage.toLocaleString()}/mes
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={6}>
            <Card className="stats-card h-100 border-success">
              <Card.Body className="text-center">
                <div className="stats-icon bg-success bg-opacity-10 text-success mx-auto mb-3">
                  <i className="bi bi-trophy fs-1"></i>
                </div>
                <h4 className="fw-bold mb-1">Donante Oro</h4>
                <p className="text-muted small mb-2">Tu nivel actual</p>
                <div className="text-warning small">
                  <i className="bi bi-star-fill"></i> Próximo: {donorStats.nextReward}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={6}>
            <Card className="stats-card h-100 border-success">
              <Card.Body className="text-center">
                <div className="stats-icon bg-success bg-opacity-10 text-success mx-auto mb-3">
                  <i className="bi bi-calendar-heart fs-1"></i>
                </div>
                <h5 className="fw-bold mb-1">{donorStats.favoriteProgram}</h5>
                <p className="text-muted small mb-0">Tu causa favorita</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Impact Metrics */}
        <Row className="g-4 mb-5">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Tu Impacto Generado</h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-4">
                  {impactMetrics.map((metric, index) => (
                    <Col md={3} sm={6} key={index}>
                      <div className="text-center">
                        <div className={`bg-${metric.color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2`}
                             style={{width: '50px', height: '50px'}}>
                          <i className={`bi ${metric.icon} text-${metric.color} fs-4`}></i>
                        </div>
                        <h4 className="fw-bold mb-1">{metric.value.toLocaleString()}</h4>
                        <p className="text-muted small mb-0">{metric.label}</p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row className="g-4">
          {/* My Donations */}
          <Col lg={8}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Mis Donaciones Recientes</h5>
                <Button variant="link" size="sm" as={Link} to="/donor/donations">
                  Ver todas <i className="bi bi-arrow-right"></i>
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {myDonations.map((donation) => (
                    <ListGroup.Item key={donation.id} className="px-4 py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                               style={{width: '40px', height: '40px'}}>
                            <i className="bi bi-check-circle-fill text-success"></i>
                          </div>
                          <div>
                            <h6 className="mb-1">{donation.program}</h6>
                            <p className="text-muted small mb-1">
                              {donation.id} • {new Date(donation.date).toLocaleDateString('es-GT')}
                              {donation.receipt && (
                                <span className="ms-2">
                                  <i className="bi bi-receipt text-info"></i> Recibo disponible
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-success mb-1">Q{donation.amount.toLocaleString()}</div>
                          {getStatusBadge(donation.status)}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Quick Actions */}
            <Card className="mb-4">
              <Card.Header>
                <h6 className="mb-0">Acciones Rápidas</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button variant="success" size="sm" as={Link} to="/donate">
                    <i className="bi bi-plus-circle me-1"></i>
                    Nueva Donación
                  </Button>
                  <Button variant="outline-primary" size="sm" as={Link} to="/donor/profile">
                    <i className="bi bi-person me-1"></i>
                    Mi Perfil
                  </Button>
                  <Button variant="outline-info" size="sm" as={Link} to="/donor/history">
                    <i className="bi bi-clock-history me-1"></i>
                    Historial Completo
                  </Button>
                  <Button variant="outline-secondary" size="sm" as={Link} to="/donor/receipts">
                    <i className="bi bi-receipt me-1"></i>
                    Mis Recibos
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Upcoming Programs */}
            <Card>
              <Card.Header>
                <h6 className="mb-0">Programas Activos</h6>
              </Card.Header>
              <Card.Body>
                {upcomingPrograms.map((program) => (
                  <div key={program.id} className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-1 small">{program.name}</h6>
                      <small className="text-muted">{program.progress}%</small>
                    </div>
                    <p className="text-muted small mb-2">{program.description}</p>
                    <ProgressBar now={program.progress} size="sm" className="mb-2" />
                    <div className="d-flex justify-content-between small">
                      <span className="text-success">Q{program.current.toLocaleString()}</span>
                      <span className="text-muted">Meta: Q{program.goal.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline-success" size="sm" className="w-100" as={Link} to="/donor/programs">
                  Ver todos los programas
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  )
}