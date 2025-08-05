/**
 * Home Page Component
 * Dashboard with overview and quick actions
 */
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@core/providers/AppProvider'
import LoadingSpinner from '@components/ui/LoadingSpinner'

export default function HomePage() {
  const { statistics, loading, actions } = useApp()

  useEffect(() => {
    actions.loadStatistics()
  }, [])

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  const stats = [
    {
      name: 'Total Completed',
      value: statistics?.total_amount_completed ? 
        `$${statistics.total_amount_completed.toLocaleString()}` : '$0',
      icon: 'bi-currency-dollar',
      color: 'text-success',
      bgColor: 'bg-success-subtle',
    },
    {
      name: 'Pending Amount',
      value: statistics?.total_amount_pending ? 
        `$${statistics.total_amount_pending.toLocaleString()}` : '$0',
      icon: 'bi-clock',
      color: 'text-warning',
      bgColor: 'bg-warning-subtle',
    },
    {
      name: 'Completed Donations',
      value: statistics?.count_completed || 0,
      icon: 'bi-graph-up',
      color: 'text-primary',
      bgColor: 'bg-primary-subtle',
    },
    {
      name: 'Success Rate',
      value: statistics?.success_rate ? 
        `${statistics.success_rate.toFixed(1)}%` : '0%',
      icon: 'bi-people',
      color: 'text-info',
      bgColor: 'bg-info-subtle',
    },
  ]

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-dark mb-3">
          Donations Dashboard
        </h1>
        <p className="lead text-muted">
          Monitor and manage your donation campaigns
        </p>
      </div>

      {/* Quick Actions */}
      <div className="text-center mb-5">
        <Link
          to="/donations/new"
          className="btn btn-primary btn-lg d-inline-flex align-items-center"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Create New Donation
        </Link>
      </div>

      {/* Statistics Grid */}
      <div className="row g-4 mb-5">
        {stats.map((stat) => (
          <div key={stat.name} className="col-md-6 col-lg-3">
            <div className="card stats-card h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className={`stats-icon ${stat.bgColor} me-3`}>
                    <i className={`${stat.icon} ${stat.color}`} style={{fontSize: '1.5rem'}}></i>
                  </div>
                  <div>
                    <p className="card-text text-muted small mb-1">{stat.name}</p>
                    <h3 className="card-title h4 mb-0">{stat.value}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Cards */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title h5 mb-0">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <Link
                to="/donations"
                className="text-decoration-none"
              >
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body text-center">
                    <i className="bi bi-list-ul text-primary mb-3" style={{fontSize: '2rem'}}></i>
                    <h5 className="card-title text-dark">View All Donations</h5>
                    <p className="card-text text-muted small">
                      Browse and manage all donations
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="col-md-4">
              <Link
                to="/stats"
                className="text-decoration-none"
              >
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body text-center">
                    <i className="bi bi-graph-up text-success mb-3" style={{fontSize: '2rem'}}></i>
                    <h5 className="card-title text-dark">Detailed Statistics</h5>
                    <p className="card-text text-muted small">
                      View comprehensive analytics
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="col-md-4">
              <Link
                to="/donations/new"
                className="text-decoration-none"
              >
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body text-center">
                    <i className="bi bi-plus-circle text-primary mb-3" style={{fontSize: '2rem'}}></i>
                    <h5 className="card-title text-dark">Create Donation</h5>
                    <p className="card-text text-muted small">
                      Start a new donation campaign
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}