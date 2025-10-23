/**
 * User Dashboard Page
 * Dashboard for regular authenticated users
 */
import { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Badge, ProgressBar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../core/services/api.js'
import AuthService from '../core/services/AuthService.js'

export default function UserDashboardPage() {
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser())
  const [userStats, setUserStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    favoriteCause: 'Programa General',
    memberSince: new Date(),
    nextMilestone: 3000.00,
    currentProgress: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [upcomingEvents, setUpcomingEvents] = useState([])

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = AuthService.subscribe((user) => {
      setCurrentUser(user)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load dashboard stats
        const statsResponse = await api.get('/dashboard/stats')
        const dashboardData = statsResponse.data

        // Load user preferences
        const prefsResponse = await api.get('/users/me/preferences')
        const prefsData = prefsResponse.data

        // Load user levels
        const levelsResponse = await api.get('/user/levels')
        const levelsData = levelsResponse.data

        // Load upcoming events
        const eventsResponse = await api.get('/dashboard/events/upcoming')
        const eventsData = eventsResponse.data

        // Load user's recent donations to show as activity
        let activityData = []
        try {
          const donationsResponse = await api.get('/api/v1/donations', {
            params: { limit: 5, offset: 0 }
          })
          
          if (donationsResponse.data && donationsResponse.data.donations) {
            // Convert donations to activity format
            activityData = donationsResponse.data.donations.map(donation => ({
              type: 'donation',
              message: `Donación de ${donation.formatted_amount || 'Q' + donation.amount_gtq}`,
              timestamp: donation.created_at,
              donation_id: donation.id
            }))
          }
        } catch (donError) {
          console.warn('Could not load donations for activity:', donError)
          // Fallback to dashboard recent_activity if available
          activityData = dashboardData.recent_activity || []
        }

        setUserStats({
          totalDonations: dashboardData.stats.total_donations || 0,
          totalAmount: dashboardData.stats.total_amount_gtq || 0,
          favoriteCause: prefsData.favorite_cause || 'Programa General',
          memberSince: new Date(dashboardData.stats.member_since || new Date()),
          nextMilestone: levelsData.next_level_threshold || 3000.00,
          currentProgress: dashboardData.stats.total_amount_gtq || 0
        })

        // Set upcoming events
        setUpcomingEvents(eventsData || [])

        // Set recent activity
        setRecentActivity(activityData)

      } catch (err) {
        console.error('Error loading user dashboard data:', err)
        setError('Error al cargar los datos del dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const getActivityIcon = (type) => {
    const icons = {
      donation: 'bi-heart-fill text-success',
      view: 'bi-eye text-info',
      profile: 'bi-person text-primary',
      system_donation: 'bi-heart-fill text-success'
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
                <Button variant="link" size="sm" as={Link} to="/donations">
                  Ver todo <i className="bi bi-arrow-right"></i>
                </Button>
              </Card.Header>
              <Card.Body>
                <div className="activity-timeline">
                  {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                    <div key={index} className={`d-flex mb-4 ${index === recentActivity.length - 1 ? '' : 'pb-3 border-bottom'}`}>
                      <div className="flex-shrink-0 me-3">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                             style={{width: '40px', height: '40px'}}>
                          <i className={`bi ${getActivityIcon(activity.type)} fs-5`}></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{activity.message}</h6>
                            <p className="text-muted small mb-1">Actividad del sistema</p>
                          </div>
                          <small className="text-muted">
                            {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString('es-GT') : 'Reciente'}
                          </small>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-muted py-4">
                      <i className="bi bi-info-circle fs-2 mb-2"></i>
                      <p>No hay actividad reciente</p>
                    </div>
                  )}
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
                  <span className="text-primary fw-bold fs-4">
                    {currentUser?.first_name?.charAt(0) || ''}{currentUser?.last_name?.charAt(0) || ''}
                  </span>
                </div>
                <h6 className="mb-1">
                  {currentUser?.first_name && currentUser?.last_name
                    ? `${currentUser.first_name} ${currentUser.last_name}`
                    : currentUser?.email || 'Usuario'}
                </h6>
                <p className="text-muted small mb-2">{currentUser?.email || ''}</p>
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
                {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
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
                )) : (
                  <div className="text-center text-muted py-3">
                    <i className="bi bi-calendar-x me-2"></i>
                    No hay eventos próximos
                  </div>
                )}
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="w-100"
                  onClick={() => alert('La funcionalidad de eventos estará disponible próximamente')}
                >
                  Ver todos los eventos
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
  )
}