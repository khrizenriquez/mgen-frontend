/**
 * Create Donation Page Component
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
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
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Donation</h1>
        <p className="mt-1 text-sm text-gray-600">
          Fill in the details to create a new donation
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="card-body space-y-6">
          {/* Donor Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Donor Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="input"
                  {...register('donorName', { 
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                />
                {errors.donorName && (
                  <p className="mt-1 text-sm text-red-600">{errors.donorName.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  className="input"
                  {...register('donorEmail', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.donorEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.donorEmail.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Donation Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Donation Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max="10000"
                  className="input"
                  {...register('amount', { 
                    required: 'Amount is required',
                    min: { value: 1, message: 'Minimum amount is $1' },
                    max: { value: 10000, message: 'Maximum amount is $10,000' }
                  })}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  className="input"
                  {...register('currency')}
                  defaultValue="USD"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  className="input"
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
                  <p className="mt-1 text-sm text-red-600">{errors.donationType.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              rows={4}
              className="input"
              placeholder="Additional notes about this donation..."
              {...register('description')}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}