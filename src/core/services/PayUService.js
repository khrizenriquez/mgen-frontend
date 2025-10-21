/**
 * PayU Payment Service
 * Handles PayU payment operations
 */
import { apiService } from './api.js'

export class PayUService {
  /**
   * Create a PayU payment for an existing donation
   * @param {string} donationId - ID of the donation to pay for
   * @param {Object} options - Payment options
   * @returns {Promise<Object>} Payment response with payment URL
   */
  static async createPayment(donationId, options = {}) {
    try {
      const response = await apiService.post('/payments/create', {
        donation_id: donationId,
        response_url: options.responseUrl,
        confirmation_url: options.confirmationUrl
      })

      return response.data
    } catch (error) {
      console.error('Error creating PayU payment:', error)
      throw error
    }
  }

  /**
   * Get payment status from PayU
   * @param {string} donationId - Donation ID
   * @param {string} payuOrderId - PayU order ID (optional)
   * @returns {Promise<Object>} Payment status response
   */
  static async getPaymentStatus(donationId, payuOrderId = null) {
    try {
      const params = {}
      if (donationId) params.donation_id = donationId
      if (payuOrderId) params.payu_order_id = payuOrderId

      const response = await apiService.get('/payments/status', { params })
      return response.data
    } catch (error) {
      console.error('Error getting payment status:', error)
      throw error
    }
  }

  /**
   * Get PayU configuration status
   * @returns {Promise<Object>} Configuration status
   */
  static async getConfigStatus() {
    try {
      const response = await apiService.get('/config/status')
      return response.data
    } catch (error) {
      console.error('Error getting PayU config status:', error)
      throw error
    }
  }

  /**
   * Validate PayU configuration
   * @returns {Promise<boolean>} True if configuration is valid
   */
  static async validateConfig() {
    try {
      const config = await this.getConfigStatus()
      return config.configured && config.errors.length === 0
    } catch (error) {
      console.error('Error validating PayU config:', error)
      return false
    }
  }
}

export default PayUService
