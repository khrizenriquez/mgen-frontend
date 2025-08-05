/**
 * Donation Service - Business logic for donations
 * Implements use cases and orchestrates domain operations
 */
import { DonationRepository } from '@core/repositories/DonationRepository'
import { Donation } from '@core/entities/Donation'
import { apiService } from './api'

export class DonationService extends DonationRepository {
  constructor() {
    super()
  }

  async create(donationData) {
    try {
      // Validate data before sending to API
      const donation = new Donation(donationData)
      
      const response = await apiService.post('/donations', donation.toApiRequest())
      
      return Donation.fromApiResponse(response.data)
    } catch (error) {
      console.error('Error creating donation:', error)
      throw error
    }
  }

  async getById(id) {
    try {
      const response = await apiService.get(`/donations/${id}`)
      return Donation.fromApiResponse(response.data)
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      console.error('Error getting donation:', error)
      throw error
    }
  }

  async getAll(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.offset) queryParams.append('offset', params.offset)
      if (params.status) queryParams.append('status', params.status)
      if (params.donationType) queryParams.append('donation_type', params.donationType)
      
      const response = await apiService.get(`/donations?${queryParams}`)
      
      return {
        donations: response.data.donations.map(Donation.fromApiResponse),
        total: response.data.total,
        limit: response.data.limit,
        offset: response.data.offset,
      }
    } catch (error) {
      console.error('Error getting donations:', error)
      throw error
    }
  }

  async getByEmail(email) {
    try {
      // Note: This would require a specific endpoint in the backend
      const response = await apiService.get(`/donations?donor_email=${encodeURIComponent(email)}`)
      return response.data.donations.map(Donation.fromApiResponse)
    } catch (error) {
      console.error('Error getting donations by email:', error)
      throw error
    }
  }

  async process(id) {
    try {
      const response = await apiService.post(`/donations/${id}/process`)
      return Donation.fromApiResponse(response.data)
    } catch (error) {
      console.error('Error processing donation:', error)
      throw error
    }
  }

  async cancel(id) {
    try {
      const response = await apiService.post(`/donations/${id}/cancel`)
      return Donation.fromApiResponse(response.data)
    } catch (error) {
      console.error('Error cancelling donation:', error)
      throw error
    }
  }

  async getStatistics() {
    try {
      const response = await apiService.get('/donations/stats')
      return response.data
    } catch (error) {
      console.error('Error getting donation statistics:', error)
      throw error
    }
  }

  // Additional business logic methods
  async validateDonationAmount(amount, currency) {
    const minAmount = 1.00
    const maxAmount = 10000.00
    
    if (amount < minAmount) {
      throw new Error(`Minimum donation amount is ${minAmount} ${currency}`)
    }
    
    if (amount > maxAmount) {
      throw new Error(`Maximum donation amount is ${maxAmount} ${currency}`)
    }
    
    return true
  }

  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  calculateProcessingFee(amount, percentage = 0.029) {
    return Math.round(amount * percentage * 100) / 100
  }

  getDonationTrends(donations) {
    const trends = {}
    
    donations.forEach(donation => {
      const date = donation.createdAt.toISOString().split('T')[0]
      if (!trends[date]) {
        trends[date] = { count: 0, amount: 0 }
      }
      trends[date].count += 1
      trends[date].amount += donation.amount
    })
    
    return trends
  }
}