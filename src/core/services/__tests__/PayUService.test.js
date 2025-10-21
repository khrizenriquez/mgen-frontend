/**
 * PayUService Tests
 */
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import PayUService from '../PayUService.js'

// Mock axios
vi.mock('./api.js', () => ({
  apiService: {
    post: vi.fn(),
    get: vi.fn()
  }
}))

import { apiService } from './api.js'

describe('PayUService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createPayment', () => {
    it('creates payment successfully', async () => {
      const mockResponse = {
        data: {
          donation_id: 'test-donation-id',
          payu_order_id: 'ORDER123',
          transaction_id: 'TXN123',
          payment_url: 'https://payu.test/payment',
          status: 'PENDING'
        }
      }

      apiService.post.mockResolvedValue(mockResponse)

      const result = await PayUService.createPayment('test-donation-id', {
        responseUrl: 'https://example.com/success',
        confirmationUrl: 'https://api.example.com/webhook'
      })

      expect(apiService.post).toHaveBeenCalledWith('/payments/create', {
        donation_id: 'test-donation-id',
        response_url: 'https://example.com/success',
        confirmation_url: 'https://api.example.com/webhook'
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('handles payment creation errors', async () => {
      const error = new Error('Payment creation failed')
      apiService.post.mockRejectedValue(error)

      await expect(PayUService.createPayment('test-donation-id'))
        .rejects.toThrow('Payment creation failed')
    })

    it('creates payment with default options', async () => {
      const mockResponse = { data: { payment_url: 'https://payu.test/payment' } }
      apiService.post.mockResolvedValue(mockResponse)

      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: { origin: 'https://example.com' },
        writable: true
      })

      await PayUService.createPayment('test-donation-id')

      expect(apiService.post).toHaveBeenCalledWith('/payments/create', {
        donation_id: 'test-donation-id',
        response_url: 'https://example.com/payment/success',
        confirmation_url: 'https://example.com/api/v1/webhooks/payu/confirmation'
      })
    })
  })

  describe('getPaymentStatus', () => {
    it('gets payment status by donation ID', async () => {
      const mockResponse = {
        data: {
          donation_id: 'test-donation-id',
          payu_order_id: 'ORDER123',
          transaction_id: 'TXN123',
          status: 'APPROVED',
          amount: 100.50,
          currency: 'GTQ'
        }
      }

      apiService.get.mockResolvedValue(mockResponse)

      const result = await PayUService.getPaymentStatus('test-donation-id')

      expect(apiService.get).toHaveBeenCalledWith('/payments/status', {
        params: { donation_id: 'test-donation-id' }
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('gets payment status by PayU order ID', async () => {
      const mockResponse = { data: { status: 'PENDING' } }
      apiService.get.mockResolvedValue(mockResponse)

      const result = await PayUService.getPaymentStatus(null, 'ORDER123')

      expect(apiService.get).toHaveBeenCalledWith('/payments/status', {
        params: { payu_order_id: 'ORDER123' }
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('handles status query errors', async () => {
      const error = new Error('Status query failed')
      apiService.get.mockRejectedValue(error)

      await expect(PayUService.getPaymentStatus('test-donation-id'))
        .rejects.toThrow('Status query failed')
    })

    it('throws error when neither donationId nor payuOrderId provided', async () => {
      await expect(PayUService.getPaymentStatus())
        .rejects.toThrow('Either donationId or payuOrderId must be provided')
    })
  })

  describe('getConfigStatus', () => {
    it('gets PayU configuration status', async () => {
      const mockResponse = {
        data: {
          configured: true,
          test_mode: true,
          country_code: 'GT',
          currency: 'GTQ',
          errors: []
        }
      }

      apiService.get.mockResolvedValue(mockResponse)

      const result = await PayUService.getConfigStatus()

      expect(apiService.get).toHaveBeenCalledWith('/config/status')
      expect(result).toEqual(mockResponse.data)
    })

    it('handles configuration status errors', async () => {
      const error = new Error('Config status failed')
      apiService.get.mockRejectedValue(error)

      await expect(PayUService.getConfigStatus())
        .rejects.toThrow('Config status failed')
    })
  })

  describe('validateConfig', () => {
    it('returns true for valid configuration', async () => {
      const mockResponse = {
        data: {
          configured: true,
          errors: []
        }
      }

      apiService.get.mockResolvedValue(mockResponse)

      const result = await PayUService.validateConfig()
      expect(result).toBe(true)
    })

    it('returns false for invalid configuration', async () => {
      const mockResponse = {
        data: {
          configured: false,
          errors: ['Missing API key']
        }
      }

      apiService.get.mockResolvedValue(mockResponse)

      const result = await PayUService.validateConfig()
      expect(result).toBe(false)
    })

    it('returns false when config request fails', async () => {
      apiService.get.mockRejectedValue(new Error('Request failed'))

      const result = await PayUService.validateConfig()
      expect(result).toBe(false)
    })
  })

  describe('error handling', () => {
    it('logs errors appropriately', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('Test error')

      apiService.post.mockRejectedValue(error)

      try {
        await PayUService.createPayment('test-id')
      } catch {
        // Expected to throw
      }

      expect(consoleSpy).toHaveBeenCalledWith('Error creating PayU payment:', error)

      consoleSpy.mockRestore()
    })

    it('preserves original error messages', async () => {
      const originalError = new Error('Original API error')
      apiService.post.mockRejectedValue(originalError)

      await expect(PayUService.createPayment('test-id'))
        .rejects.toThrow('Original API error')
    })
  })
})
