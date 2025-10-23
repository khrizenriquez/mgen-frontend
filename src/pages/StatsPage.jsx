/**
 * Statistics Page Component
 */
import { useEffect } from 'react'
import { useApp } from '@core/providers/AppProvider'
import LoadingSpinner from '@components/ui/LoadingSpinner'

export default function StatsPage() {
  const { statistics, donations, loading, actions } = useApp()

  useEffect(() => {
    actions.loadStatistics()
    actions.loadDonations()
  }, [])

  if (loading) {
    return <LoadingSpinner text="Cargando estadísticas..." />
  }

  const stats = [
    {
      name: 'Monto Total Completado',
      value: statistics?.total_amount_completed ? 
        `$${statistics.total_amount_completed.toLocaleString()}` : '$0',
      icon: 'bi-currency-dollar',
      color: 'text-success',
      bgColor: 'bg-success-subtle',
      description: 'Monto total de donaciones completadas'
    },
    {
      name: 'Monto Pendiente',
      value: statistics?.total_amount_pending ? 
        `$${statistics.total_amount_pending.toLocaleString()}` : '$0',
      icon: 'bi-clock',
      color: 'text-warning',
      bgColor: 'bg-warning-subtle',
      description: 'Monto esperando ser procesado'
    },
    {
      name: 'Donaciones Completadas',
      value: statistics?.count_completed || 0,
      icon: 'bi-graph-up',
      color: 'text-primary',
      bgColor: 'bg-primary-subtle',
      description: 'Número de donaciones exitosas'
    },
    {
      name: 'Tasa de Éxito',
      value: statistics?.success_rate ? 
        `${statistics.success_rate.toFixed(1)}%` : '0%',
      icon: 'bi-people',
      color: 'text-info',
      bgColor: 'bg-info-subtle',
      description: 'Porcentaje de donaciones exitosas'
    },
  ]

  const recentDonations = donations.slice(0, 5)

  const averageDonation = statistics?.count_completed > 0 ? 
    (statistics.total_amount_completed / statistics.count_completed).toFixed(2) : 0

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-5">
        <h1 className="h2 fw-bold text-dark">Estadísticas y Análisis</h1>
        <p className="text-muted">
          Resumen completo del rendimiento de donaciones
        </p>
      </div>

      {/* Main Statistics Grid */}
      <div className="row g-4 mb-5">
        {stats.map((stat) => (
          <div key={stat.name} className="col-md-6 col-lg-3">
            <div className="card stats-card h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className={`stats-icon ${stat.bgColor} me-3`}>
                    <i className={`${stat.icon} ${stat.color}`} style={{fontSize: '1.5rem'}}></i>
                  </div>
                  <div className="flex-grow-1">
                    <p className="card-text text-muted small mb-1">{stat.name}</p>
                    <p className="card-title h4 mb-0">{stat.value}</p>
                  </div>
                </div>
                <p className="mt-3 small text-muted">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="row g-4 mb-5">
        {/* Detailed Stats */}
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="card-title h5 mb-0">Métricas Detalladas</h3>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <dt className="text-muted small">Total de Donaciones</dt>
                <dd className="fw-medium">
                  {(statistics?.count_completed || 0) + (statistics?.count_pending || 0) + (statistics?.count_failed || 0)}
                </dd>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <dt className="text-muted small">Completadas</dt>
                <dd className="fw-medium text-success">
                  {statistics?.count_completed || 0}
                </dd>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <dt className="text-muted small">Pendientes</dt>
                <dd className="fw-medium text-warning">
                  {statistics?.count_pending || 0}
                </dd>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <dt className="text-muted small">Fallidas</dt>
                <dd className="fw-medium text-danger">
                  {statistics?.count_failed || 0}
                </dd>
              </div>
              <div className="d-flex justify-content-between border-top pt-3">
                <dt className="text-muted small">Donación Promedio</dt>
                <dd className="fw-medium">
                  ${averageDonation}
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="card-title h5 mb-0">Donaciones Recientes</h3>
            </div>
            <div className="card-body">
              {recentDonations.length > 0 ? (
                <div className="d-grid gap-3">
                  {recentDonations.map((donation) => (
                    <div key={donation.id} className="d-flex justify-content-between align-items-center">
                      <div className="flex-grow-1">
                        <p className="fw-medium mb-1">
                          {donation.donorName}
                        </p>
                        <p className="small text-muted">
                          {donation.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-end">
                        <p className="fw-medium mb-1">
                          {donation.formattedAmount}
                        </p>
                        <p className={`small ${
                          donation.isCompleted ? 'text-success' :
                          donation.isPending ? 'text-warning' : 'text-danger'
                        }`}>
                          {donation.statusDisplay}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4">
                  No hay donaciones recientes
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title h5 mb-0">Resumen de Rendimiento</h3>
        </div>
        <div className="card-body">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="h2 fw-bold text-success">
                {statistics?.success_rate ? statistics.success_rate.toFixed(1) : 0}%
              </div>
              <div className="text-muted">Tasa de Éxito</div>
              <div className="mt-2 small text-muted">
                Basado en donaciones completadas vs fallidas
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="h2 fw-bold text-primary">
                ${averageDonation}
              </div>
              <div className="text-muted">Donación Promedio</div>
              <div className="mt-2 small text-muted">
                Por donación completada
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="h2 fw-bold text-info">
                {statistics?.count_pending || 0}
              </div>
              <div className="text-muted">Pendientes de Procesar</div>
              <div className="mt-2 small text-muted">
                En espera de procesamiento manual
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}