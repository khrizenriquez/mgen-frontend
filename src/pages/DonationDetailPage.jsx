/**
 * Donation Detail Page Component
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '@core/providers/AppProvider'
import { DonationStatus } from '@core/entities/Donation'
import LoadingSpinner from '@components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function DonationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { donationService } = useApp()
  const [donation, setDonation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadDonation()
  }, [id])

  const loadDonation = async () => {
    try {
      const donationData = await donationService.getById(parseInt(id))
      if (donationData) {
        setDonation(donationData)
      } else {
        navigate('/donations', { replace: true })
        toast.error('Donation not found')
      }
    } catch (error) {
      toast.error('Failed to load donation')
      navigate('/donations', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  const handleProcess = async () => {
    setProcessing(true)
    try {
      const updatedDonation = await donationService.process(donation.id)
      setDonation(updatedDonation)
      toast.success('Donation processed successfully!')
    } catch (error) {
      toast.error('Failed to process donation')
    } finally {
      setProcessing(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this donation?')) return
    
    setProcessing(true)
    try {
      const updatedDonation = await donationService.cancel(donation.id)
      setDonation(updatedDonation)
      toast.success('Donation cancelled')
    } catch (error) {
      toast.error('Failed to cancel donation')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading donation..." />
  }

  if (!donation) {
    return null
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case DonationStatus.COMPLETED:
        return <i className="bi bi-check-circle text-success" style={{fontSize: '1.25rem'}}></i>
      case DonationStatus.FAILED:
      case DonationStatus.CANCELLED:
        return <i className="bi bi-x-circle text-danger" style={{fontSize: '1.25rem'}}></i>
      default:
        return <i className="bi bi-clock text-warning" style={{fontSize: '1.25rem'}}></i>
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case DonationStatus.COMPLETED:
        return 'text-success bg-success-subtle'
      case DonationStatus.FAILED:
      case DonationStatus.CANCELLED:
        return 'text-danger bg-danger-subtle'
      default:
        return 'text-warning bg-warning-subtle'
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-xl-10">
        {/* Header */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/donations')}
            className="btn btn-link text-decoration-none p-0 mb-3 d-flex align-items-center"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Donations
          </button>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h1 className="h2 fw-bold text-dark">
                Donation #{donation.id}
              </h1>
              <p className="text-muted">
                Created on {donation.createdAt.toLocaleDateString()}
              </p>
            </div>
            <div className={`d-flex align-items-center px-3 py-2 rounded-pill ${getStatusColor(donation.status)}`}>
              {getStatusIcon(donation.status)}
              <span className="ms-2 fw-medium">{donation.statusDisplay}</span>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Main Information */}
          <div className="col-lg-8">
            <div className="mb-4">
              {/* Donor Information */}
              <div className="card mb-4">
                <div className="card-header">
                  <h3 className="card-title h5 mb-0">Donor Information</h3>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <dt className="small text-muted">Full Name</dt>
                      <dd className="fw-medium">{donation.donorName}</dd>
                    </div>
                    <div className="col-sm-6">
                      <dt className="small text-muted">Email</dt>
                      <dd className="fw-medium">{donation.donorEmail}</dd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donation Details */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title h5 mb-0">Donation Details</h3>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <dt className="small text-muted">Amount</dt>
                      <dd className="h3 fw-bold text-primary">
                        {donation.formattedAmount}
                      </dd>
                    </div>
                    <div className="col-sm-6">
                      <dt className="small text-muted">Type</dt>
                      <dd className="fw-medium">{donation.typeDisplay}</dd>
                    </div>
                    <div className="col-sm-6">
                      <dt className="small text-muted">Created</dt>
                      <dd className="small">
                        {donation.createdAt.toLocaleString()}
                      </dd>
                    </div>
                    <div className="col-sm-6">
                      <dt className="small text-muted">Last Updated</dt>
                      <dd className="small">
                        {donation.updatedAt.toLocaleString()}
                      </dd>
                    </div>
                    {donation.completedAt && (
                      <div className="col-12">
                        <dt className="small text-muted">Completed</dt>
                        <dd className="small">
                          {donation.completedAt.toLocaleString()}
                        </dd>
                      </div>
                    )}
                  </div>
                  
                  {donation.description && (
                    <div className="mt-3">
                      <dt className="small text-muted">Description</dt>
                      <dd className="mt-1">{donation.description}</dd>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="col-lg-4">
            <div className="mb-4">
              {/* Actions */}
              <div className="card mb-4">
                <div className="card-header">
                  <h3 className="card-title h5 mb-0">Actions</h3>
                </div>
                <div className="card-body d-grid gap-2">
                  {donation.isPending && (
                    <>
                      <button
                        onClick={handleProcess}
                        disabled={processing}
                        className="btn btn-success"
                      >
                        {processing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing...
                          </>
                        ) : (
                          'Process Donation'
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={processing}
                        className="btn btn-danger"
                      >
                        {processing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Cancelling...
                          </>
                        ) : (
                          'Cancel Donation'
                        )}
                      </button>
                    </>
                  )}
                  
                  {donation.isCompleted && (
                    <div className="text-center py-4">
                      <i className="bi bi-check-circle-fill text-success" style={{fontSize: '3rem'}}></i>
                      <p className="small text-muted mt-2">This donation has been completed</p>
                    </div>
                  )}
                  
                  {(donation.isFailed || donation.isCancelled) && (
                    <div className="text-center py-4">
                      <i className="bi bi-x-circle-fill text-danger" style={{fontSize: '3rem'}}></i>
                      <p className="small text-muted mt-2">
                        This donation has been {donation.statusDisplay.toLowerCase()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title h5 mb-0">Quick Info</h3>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">ID:</span>
                    <span className="fw-medium">#{donation.id}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Status:</span>
                    <span className="fw-medium">{donation.statusDisplay}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">Type:</span>
                    <span className="fw-medium">{donation.typeDisplay}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}