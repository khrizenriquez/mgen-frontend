/**
 * Donor Dashboard Page
 * Specialized dashboard for registered donors
 */
import { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Badge, ProgressBar, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../core/services/api.js'

export default function DonorDashboardPage() {
  const [donorStats, setDonorStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    monthlyAverage: 0,
    favoriteProgram: null,
    impactChildren: 0,
    memberSince: new Date(),
    donationStreak: 0,
    nextReward: 'Donante Oro'
  })
  const [myDonations, setMyDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [impactMetrics, setImpactMetrics] = useState([
    { label: 'Niños beneficiados', value: 0, icon: 'bi-people', color: 'success' },
    { label: 'Comidas proporcionadas', value: 0, icon: 'bi-egg-fried', color: 'warning' },
    { label: 'Becas otorgadas', value: 0, icon: 'bi-mortarboard', color: 'info' },
    { label: 'Horas de evangelización', value: 0, icon: 'bi-book', color: 'primary' },
  ])

  const [activePrograms, setActivePrograms] = useState([])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load dashboard stats
        const statsResponse = await api.get('/dashboard/stats')
        const dashboardData = statsResponse.data

        // Load impact metrics
        const impactResponse = await api.get('/dashboard/impact')
        const impactData = impactResponse.data

        // Load active programs
        const programsResponse = await api.get('/dashboard/programs/active')
        const programsData = programsResponse.data

        // Load user levels for next reward
        const levelsResponse = await api.get('/user/levels')
        const levelsData = levelsResponse.data

        setDonorStats({
          totalDonations: dashboardData.stats.total_donations || 0,
          totalAmount: dashboardData.stats.total_amount_gtq || 0,
          monthlyAverage: dashboardData.stats.monthly_average || 0,
          favoriteProgram: dashboardData.stats.favorite_program || 'Programa General',
          impactChildren: impactData.children_impacted || 0,
          memberSince: new Date(dashboardData.stats.member_since || new Date()),
          donationStreak: dashboardData.stats.donation_streak || 0,
          nextReward: levelsData.next_level || 'Donante Platino'
        })

        // Update impact metrics with real data
        setImpactMetrics([
          { label: 'Niños beneficiados', value: impactData.children_impacted || 0, icon: 'bi-people', color: 'success' },
          { label: 'Comidas proporcionadas', value: impactData.meals_provided || 0, icon: 'bi-egg-fried', color: 'warning' },
          { label: 'Becas otorgadas', value: impactData.scholarships_awarded || 0, icon: 'bi-mortarboard', color: 'info' },
          { label: 'Horas de evangelización', value: impactData.evangelism_hours || 0, icon: 'bi-book', color: 'primary' },
        ])

        // Set active programs
        setActivePrograms(programsData || [])

        // Load user's donations
        setMyDonations(dashboardData.stats.my_donations || [])

      } catch (err) {
        console.error('Error loading donor dashboard data:', err)
        setError('Error al cargar los datos del dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando tu dashboard...</p>
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

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'success',
      pending: 'warning',
      failed: 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  return (
    <div className="donor-dashboard">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-1">Mi Panel de Donante</h1>
            <p className="text-muted mb-0">Gracias por tu generosidad, María. Tu impacto es invaluable.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-success" as={Link} to="/donate">
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
                <Button variant="link" size="sm" as={Link} to="/donations">
                  Ver todas <i className="bi bi-arrow-right"></i>
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {myDonations.length > 0 ? myDonations.map((donation) => (
                    <ListGroup.Item key={donation.id} className="px-4 py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                               style={{width: '40px', height: '40px'}}>
                            <i className="bi bi-check-circle-fill text-success"></i>
                          </div>
                          <div>
                            <h6 className="mb-1">Donación #{donation.id.substring(0, 8)}...</h6>
                            <p className="text-muted small mb-1">
                              {donation.donor_email} • {new Date(donation.created_at).toLocaleDateString('es-GT')}
                              <span className="ms-2">
                                <i className="bi bi-receipt text-info"></i> Recibo disponible
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-success mb-1">Q{donation.amount_gtq.toLocaleString()}</div>
                          <Badge bg={donation.status === 'APPROVED' ? 'success' : 'warning'}>
                            {donation.status === 'APPROVED' ? 'Aprobado' : donation.status}
                          </Badge>
                        </div>
                      </div>
                    </ListGroup.Item>
                  )) : (
                    <ListGroup.Item className="px-4 py-3 text-center text-muted">
                      <i className="bi bi-info-circle me-2"></i>
                      Aún no has realizado donaciones
                    </ListGroup.Item>
                  )}
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

            {/* Active Programs */}
            <Card>
              <Card.Header>
                <h6 className="mb-0">Programas Activos</h6>
              </Card.Header>
              <Card.Body>
                {activePrograms.length > 0 ? activePrograms.map((program) => (
                  <div key={program.id} className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-1 small">{program.name}</h6>
                      <small className="text-muted">{program.progress_percentage}%</small>
                    </div>
                    <p className="text-muted small mb-2">{program.description}</p>
                    <ProgressBar now={program.progress_percentage} size="sm" className="mb-2" />
                    <div className="d-flex justify-content-between small">
                      <span className="text-success">Q{program.current_amount.toLocaleString()}</span>
                      <span className="text-muted">Meta: Q{program.goal_amount.toLocaleString()}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-muted py-3">
                    <i className="bi bi-info-circle me-2"></i>
                    No hay programas activos actualmente
                  </div>
                )}
                <Button variant="outline-success" size="sm" className="w-100" as={Link} to="/donor/programs">
                  Ver todos los programas
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
  )
}