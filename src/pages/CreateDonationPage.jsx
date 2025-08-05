/**
 * Create Donation Page Component
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { DonationType } from '@core/entities/Donation'
import { useApp } from '@core/providers/AppProvider'

export default function CreateDonationPage() {
  const navigate = useNavigate()
  const { actions } = useApp()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const donation = await actions.createDonation({
        donorName: data.donorName,
        donorEmail: data.donorEmail,
        amount: parseFloat(data.amount),
        currency: data.currency,
        donationType: data.donationType,
        description: data.description,
      })
      
      toast.success('Donation created successfully!')
      navigate(`/donations/${donation.id}`)
    } catch (error) {
      toast.error('Failed to create donation')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        {/* Header */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-link text-decoration-none p-0 mb-3 d-flex align-items-center"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back
          </button>
          <h1 className="h2 fw-bold text-dark">Create New Donation</h1>
          <p className="text-muted">
            Fill in the details to create a new donation
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            {/* Donor Information */}
            <div className="mb-4">
              <h3 className="h5 fw-medium text-dark mb-3">
                Donor Information
              </h3>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.donorName ? 'is-invalid' : ''}`}
                    {...register('donorName', { 
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' }
                    })}
                  />
                  {errors.donorName && (
                    <div className="invalid-feedback">{errors.donorName.message}</div>
                  )}
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.donorEmail ? 'is-invalid' : ''}`}
                    {...register('donorEmail', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.donorEmail && (
                    <div className="invalid-feedback">{errors.donorEmail.message}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Donation Details */}
            <div className="mb-4">
              <h3 className="h5 fw-medium text-dark mb-3">
                Donation Details
              </h3>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="10000"
                    className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                    {...register('amount', { 
                      required: 'Amount is required',
                      min: { value: 1, message: 'Minimum amount is $1' },
                      max: { value: 10000, message: 'Maximum amount is $10,000' }
                    })}
                  />
                  {errors.amount && (
                    <div className="invalid-feedback">{errors.amount.message}</div>
                  )}
                </div>
                
                <div className="col-md-4">
                  <label className="form-label">
                    Currency
                  </label>
                  <select
                    className="form-select"
                    {...register('currency')}
                    defaultValue="USD"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                
                <div className="col-md-4">
                  <label className="form-label">
                    Type *
                  </label>
                  <select
                    className={`form-select ${errors.donationType ? 'is-invalid' : ''}`}
                    {...register('donationType', { required: 'Type is required' })}
                    defaultValue=""
                  >
                    <option value="">Select type</option>
                    {Object.values(DonationType).map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.donationType && (
                    <div className="invalid-feedback">{errors.donationType.message}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="form-label">
                Description (Optional)
              </label>
              <textarea
                rows={4}
                className="form-control"
                placeholder="Additional notes about this donation..."
                {...register('description')}
              />
            </div>

            {/* Actions */}
            <div className="d-flex justify-content-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-outline-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : (
                  'Create Donation'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}