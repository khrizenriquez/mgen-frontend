/**
 * Donation Detail Page Component
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, X, Clock } from 'lucide-react'
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
        return <Check className="h-5 w-5 text-green-600" />
      case DonationStatus.FAILED:
      case DonationStatus.CANCELLED:
        return <X className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case DonationStatus.COMPLETED:
        return 'text-green-600 bg-green-100'
      case DonationStatus.FAILED:
      case DonationStatus.CANCELLED:
        return 'text-red-600 bg-red-100'
      default:
        return 'text-yellow-600 bg-yellow-100'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/donations')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Donations
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Donation #{donation.id}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Created on {donation.createdAt.toLocaleDateString()}
            </p>
          </div>
          <div className={`flex items-center px-3 py-1 rounded-full ${getStatusColor(donation.status)}`}>
            {getStatusIcon(donation.status)}
            <span className="ml-2 text-sm font-medium">{donation.statusDisplay}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Donor Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Donor Information</h3>
            </div>
            <div className="card-body">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{donation.donorName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{donation.donorEmail}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Donation Details */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Donation Details</h3>
            </div>
            <div className="card-body">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Amount</dt>
                  <dd className="mt-1 text-2xl font-bold text-gray-900">
                    {donation.formattedAmount}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{donation.typeDisplay}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {donation.createdAt.toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {donation.updatedAt.toLocaleString()}
                  </dd>
                </div>
                {donation.completedAt && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Completed</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {donation.completedAt.toLocaleString()}
                    </dd>
                  </div>
                )}
              </dl>
              
              {donation.description && (
                <div className="mt-6">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{donation.description}</dd>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Actions</h3>
            </div>
            <div className="card-body space-y-3">
              {donation.isPending && (
                <>
                  <button
                    onClick={handleProcess}
                    disabled={processing}
                    className="btn-success w-full"
                  >
                    {processing ? 'Processing...' : 'Process Donation'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={processing}
                    className="btn-danger w-full"
                  >
                    {processing ? 'Cancelling...' : 'Cancel Donation'}
                  </button>
                </>
              )}
              
              {donation.isCompleted && (
                <div className="text-center py-4">
                  <Check className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">This donation has been completed</p>
                </div>
              )}
              
              {(donation.isFailed || donation.isCancelled) && (
                <div className="text-center py-4">
                  <X className="h-12 w-12 text-red-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    This donation has been {donation.statusDisplay.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Quick Info</h3>
            </div>
            <div className="card-body space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">ID:</span>
                <span className="font-medium">#{donation.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium">{donation.statusDisplay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium">{donation.typeDisplay}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}