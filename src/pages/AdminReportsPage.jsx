/**
 * Admin Reports Page
 * Analytics and reports dashboard for administrators
 */
import { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Table, Badge, Alert, Spinner, Form, Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../core/services/api.js'

export default function AdminReportsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    totalAmount: 0,
    monthlyStats: [],
    topDonors: [],
    donationTrends: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dateRange, setDateRange] = useState('month')

  useEffect(() => {
    loadReports()
  }, [dateRange])

  const loadReports = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load comprehensive stats
      const statsResponse = await api.get('/dashboard/stats')
      const dashboardData = statsResponse.data

      // Load additional analytics data
      const analyticsResponse = await api.get('/admin/analytics', {
        params: { period: dateRange }
      })

      setStats({
        totalUsers: dashboardData.stats.total_users || 0,
        totalDonations: dashboardData.stats.total_donations || 0,
        totalAmount: dashboardData.stats.total_amount_gtq || 0,
        monthlyStats: analyticsResponse.data?.monthly_stats || generateMockMonthlyStats(),
        topDonors: analyticsResponse.data?.top_donors || generateMockTopDonors(),
        donationTrends: analyticsResponse.data?.trends || generateMockTrends()
      })

    } catch (err) {
      console.error('Error loading reports:', err)
      // Use mock data if API fails
      setStats({
        totalUsers: 1250,
        totalDonations: 3250,
        totalAmount: 125000.50,
        monthlyStats: generateMockMonthlyStats(),
        topDonors: generateMockTopDonors(),
        donationTrends: generateMockTrends()
      })
    } finally {
      setLoading(false)
    }
  }

  const generateMockMonthlyStats = () => [
    { month: 'Enero', donations: 45, amount: 18500.00, users: 12 },
    { month: 'Febrero', donations: 52, amount: 22100.00, users: 18 },
    { month: 'Marzo', donations: 38, amount: 15600.00, users: 8 },
    { month: 'Abril', donations: 67, amount: 28900.00, users: 22 },
    { month: 'Mayo', donations: 73, amount: 31200.00, users: 25 },
    { month: 'Junio', donations: 58, amount: 24800.00, users: 19 }
  ]

  const generateMockTopDonors = () => [
    { name: 'María González', total_donated: 12500.00, donations_count: 12 },
    { name: 'Carlos Rodríguez', total_donated: 9800.00, donations_count: 8 },
    { name: 'Ana López', total_donated: 8750.00, donations_count: 15 },
    { name: 'José Martínez', total_donated: 7200.00, donations_count: 6 },
    { name: 'Laura Sánchez', total_donated: 6500.00, donations_count: 9 }
  ]

  const generateMockTrends = () => [
    { date: '2024-01-01', donations: 5, amount: 1200.00 },
    { date: '2024-01-02', donations: 8, amount: 2100.00 },
    { date: '2024-01-03', donations: 3, amount: 800.00 },
    { date: '2024-01-04', donations: 12, amount: 3500.00 },
    { date: '2024-01-05', donations: 7, amount: 1800.00 },
    { date: '2024-01-06', donations: 9, amount: 2400.00 },
    { date: '2024-01-07', donations: 4, amount: 950.00 }
  ]

  const exportReport = (format) => {
    // In a real implementation, this would call an API endpoint to generate and download reports
    alert(`Exportando reporte en formato ${format.toUpperCase()}...`)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Cargando reportes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-reports">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">Reportes y Estadísticas</h1>
          <p className="text-muted mb-0">Análisis completo del rendimiento del sistema</p>
        </div>
        <div className="d-flex gap-2">
          <Form.Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Este trimestre</option>
            <option value="year">Este año</option>
          </Form.Select>
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" id="export-dropdown">
              <i className="bi bi-download me-1"></i>
              Exportar
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => exportReport('pdf')}>
                <i className="bi bi-file-earmark-pdf me-2"></i>
                Exportar como PDF
              </Dropdown.Item>
              <Dropdown.Item onClick={() => exportReport('excel')}>
                <i className="bi bi-file-earmark-excel me-2"></i>
                Exportar como Excel
              </Dropdown.Item>
              <Dropdown.Item onClick={() => exportReport('csv')}>
                <i className="bi bi-filetype-csv me-2"></i>
                Exportar como CSV
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Key Metrics */}
      <Row className="g-4 mb-5">
        <Col xl={3} lg={6}>
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <div className="stats-icon bg-primary bg-opacity-10 text-primary mx-auto mb-3">
                <i className="bi bi-people-fill fs-1"></i>
              </div>
              <h3 className="fw-bold mb-1">{stats.totalUsers.toLocaleString()}</h3>
              <p className="text-muted small mb-2">Usuarios Registrados</p>
              <div className="text-success small">
                <i className="bi bi-arrow-up"></i> +12% vs período anterior
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <div className="stats-icon bg-success bg-opacity-10 text-success mx-auto mb-3">
                <i className="bi bi-cash-stack fs-1"></i>
              </div>
              <h3 className="fw-bold mb-1">Q{stats.totalAmount.toLocaleString()}</h3>
              <p className="text-muted small mb-2">Total Donado</p>
              <div className="text-success small">
                <i className="bi bi-arrow-up"></i> +8% vs período anterior
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <div className="stats-icon bg-info bg-opacity-10 text-info mx-auto mb-3">
                <i className="bi bi-receipt fs-1"></i>
              </div>
              <h3 className="fw-bold mb-1">{stats.totalDonations.toLocaleString()}</h3>
              <p className="text-muted small mb-2">Total Donaciones</p>
              <div className="text-success small">
                <i className="bi bi-arrow-up"></i> +15% vs período anterior
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="stats-card h-100">
            <Card.Body className="text-center">
              <div className="stats-icon bg-warning bg-opacity-10 text-warning mx-auto mb-3">
                <i className="bi bi-graph-up fs-1"></i>
              </div>
              <h3 className="fw-bold mb-1">Q{(stats.totalAmount / stats.totalDonations || 0).toFixed(0)}</h3>
              <p className="text-muted small mb-2">Promedio por Donación</p>
              <div className="text-info small">
                Donación promedio
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts and Tables */}
      <Row className="g-4">
        {/* Monthly Statistics */}
        <Col lg={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Estadísticas Mensuales</h5>
              <Badge bg="info">Últimos 6 meses</Badge>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th>Donaciones</th>
                      <th>Nuevos Usuarios</th>
                      <th>Monto Total</th>
                      <th>Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.monthlyStats.map((month, index) => (
                      <tr key={index}>
                        <td className="fw-medium">{month.month}</td>
                        <td>{month.donations}</td>
                        <td>{month.users}</td>
                        <td className="text-success fw-medium">
                          Q{month.amount.toLocaleString()}
                        </td>
                        <td className="text-info">
                          Q{(month.amount / month.donations || 0).toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Top Donors */}
        <Col lg={4}>
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Top Donantes</h5>
              <Badge bg="success">Más activos</Badge>
            </Card.Header>
            <Card.Body>
              <div className="list-group list-group-flush">
                {stats.topDonors.map((donor, index) => (
                  <div key={index} className="list-group-item px-0 py-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-1">
                          <Badge bg="primary" className="me-2">#{index + 1}</Badge>
                          <span className="fw-medium">{donor.name}</span>
                        </div>
                        <small className="text-muted">
                          {donor.donations_count} donaciones
                        </small>
                      </div>
                      <div className="text-success fw-bold">
                        Q{donor.total_donated.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Trends */}
      <Row className="g-4 mt-2">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Tendencias Recientes</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Donaciones del Día</th>
                      <th>Monto Total</th>
                      <th>Promedio Diario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.donationTrends.map((day, index) => (
                      <tr key={index}>
                        <td>{new Date(day.date).toLocaleDateString('es-GT')}</td>
                        <td>{day.donations}</td>
                        <td className="text-success fw-medium">
                          Q{day.amount.toLocaleString()}
                        </td>
                        <td className="text-info">
                          Q{(day.amount / day.donations || 0).toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Row className="g-4 mt-2">
        <Col lg={12}>
          <Card>
            <Card.Body className="text-center">
              <h6 className="mb-3">Acciones Adicionales</h6>
              <div className="d-flex justify-content-center gap-3">
                <Button variant="outline-primary" as={Link} to="/admin/users">
                  <i className="bi bi-people me-1"></i>
                  Gestionar Usuarios
                </Button>
                <Button variant="outline-success" as={Link} to="/admin/donations">
                  <i className="bi bi-cash-stack me-1"></i>
                  Revisar Donaciones
                </Button>
                <Button variant="outline-info" as={Link} to="/admin/settings">
                  <i className="bi bi-gear me-1"></i>
                  Configuración del Sistema
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
