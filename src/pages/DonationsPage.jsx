/**
 * Donations List Page Component
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@core/providers/AppProvider'
import { DonationStatus, DonationType } from '@core/entities/Donation'
import LoadingSpinner from '@components/ui/LoadingSpinner'

export default function DonationsPage() {
  const { donations, loading, actions } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    actions.loadDonations()
  }, [])

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || donation.status === statusFilter
    const matchesType = !typeFilter || donation.donationType === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case DonationStatus.COMPLETED:
        return 'badge bg-success-subtle text-success'
      case DonationStatus.PENDING:
        return 'badge bg-warning-subtle text-warning'
      case DonationStatus.FAILED:
        return 'badge bg-danger-subtle text-danger'
      default:
        return 'badge bg-secondary-subtle text-secondary'
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading donations..." />
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Donations</h1>
          <p className="text-muted">
            Manage and track all donations
          </p>
        </div>
        <Link to="/donations/new" className="btn btn-primary d-flex align-items-center">
          <i className="bi bi-plus-circle me-2"></i>
          New Donation
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Search</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {Object.values(DonationStatus).map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                {Object.values(DonationType).map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Donations List */}
      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Donor</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map((donation) => (
                <tr key={donation.id}>
                  <td>
                    <div>
                      <div className="fw-medium text-dark">
                        {donation.donorName}
                      </div>
                      <div className="small text-muted">
                        {donation.donorEmail}
                      </div>
                    </div>
                  </td>
                  <td className="fw-medium">
                    {donation.formattedAmount}
                  </td>
                  <td>
                    {donation.typeDisplay}
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(donation.status)}>
                      {donation.statusDisplay}
                    </span>
                  </td>
                  <td className="text-muted">
                    {donation.createdAt.toLocaleDateString()}
                  </td>
                  <td className="text-end">
                    <Link
                      to={`/donations/${donation.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredDonations.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{fontSize: '3rem'}}></i>
              <p className="text-muted mt-3">No donations found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}