/**
 * DonationService Tests
 */
import { vi } from 'vitest'
import { DonationService } from '../DonationService'
import { Donation } from '../../entities/Donation'
import { apiService } from '../api'

// Mock dependencies
vi.mock('../api', () => ({
  apiService: {
    post: vi.fn(),
    get: vi.fn()
  }
}))

vi.mock('../../entities/Donation', () => ({
  Donation: class {
    constructor(data) {
      this.data = data
    }
    toApiRequest() {
      return this.data
    }
    static fromApiResponse(data) {
      return data
    }
  }
}))

describe('DonationService', () => {
  let service

  beforeEach(() => {
    vi.clearAllMocks()
    service = new DonationService()
  })

  describe('create', () => {
    test('creates donation successfully', async () => {
      const donationData = {
        amount: 100,
        donorName: 'Juan Pérez',
        email: 'juan@example.com'
      }

      const mockDonation = { id: 1, ...donationData }
      const mockApiResponse = { data: mockDonation }

      apiService.post.mockResolvedValue(mockApiResponse)

      const result = await service.create(donationData)

      expect(apiService.post).toHaveBeenCalledWith('/donations', donationData)
      expect(result).toEqual(mockDonation)
    })

    test('throws error when API call fails', async () => {
      const donationData = { amount: 100 }
      const error = new Error('API Error')

      apiService.post.mockRejectedValue(error)

      await expect(service.create(donationData)).rejects.toThrow('API Error')
    })
  })

  describe('getById', () => {
    test('returns donation when found', async () => {
      const mockDonation = { id: 1, amount: 100 }
      const mockApiResponse = { data: mockDonation }

      apiService.get.mockResolvedValue(mockApiResponse)

      const result = await service.getById(1)

      expect(apiService.get).toHaveBeenCalledWith('/donations/1')
      expect(result).toEqual(mockDonation)
    })

    test('returns null when donation not found', async () => {
      const error = { response: { status: 404 } }
      apiService.get.mockRejectedValue(error)

      const result = await service.getById(999)

      expect(result).toBeNull()
    })

    test('throws error for other API errors', async () => {
      const error = new Error('Server Error')
      apiService.get.mockRejectedValue(error)

      await expect(service.getById(1)).rejects.toThrow('Server Error')
    })
  })

  describe('getAll', () => {
    test('returns donations with default params', async () => {
      const mockApiResponse = {
        data: {
          donations: [{ id: 1 }, { id: 2 }],
          total: 2,
          limit: 10,
          offset: 0
        }
      }

      apiService.get.mockResolvedValue(mockApiResponse)

      const result = await service.getAll()

      expect(apiService.get).toHaveBeenCalledWith('/donations?')
      expect(result).toEqual({
        donations: [{ id: 1 }, { id: 2 }],
        total: 2,
        limit: 10,
        offset: 0
      })
    })

    test('returns donations with custom params', async () => {
      const params = { limit: 5, offset: 10, status: 'completed' }
      const mockApiResponse = {
        data: {
          donations: [{ id: 1 }],
          total: 1,
          limit: 5,
          offset: 10
        }
      }

      apiService.get.mockResolvedValue(mockApiResponse)

      const result = await service.getAll(params)

      expect(apiService.get).toHaveBeenCalledWith('/donations?limit=5&offset=10&status=completed')
      expect(result.donations).toHaveLength(1)
    })
  })

  describe('getByEmail', () => {
    test('returns donations for email', async () => {
      const email = 'juan@example.com'
      const mockApiResponse = {
        data: {
          donations: [{ id: 1, donorEmail: email }]
        }
      }

      apiService.get.mockResolvedValue(mockApiResponse)

      const result = await service.getByEmail(email)

      expect(apiService.get).toHaveBeenCalledWith(`/donations?donor_email=${encodeURIComponent(email)}`)
      expect(result).toHaveLength(1)
    })
  })

  describe('process', () => {
    test('processes donation successfully', async () => {
      const mockDonation = { id: 1, status: 'processed' }
      const mockApiResponse = { data: mockDonation }

      apiService.post.mockResolvedValue(mockApiResponse)

      const result = await service.process(1)

      expect(apiService.post).toHaveBeenCalledWith('/donations/1/process')
      expect(result).toEqual(mockDonation)
    })
  })

  describe('cancel', () => {
    test('cancels donation successfully', async () => {
      const mockDonation = { id: 1, status: 'cancelled' }
      const mockApiResponse = { data: mockDonation }

      apiService.post.mockResolvedValue(mockApiResponse)

      const result = await service.cancel(1)

      expect(apiService.post).toHaveBeenCalledWith('/donations/1/cancel')
      expect(result).toEqual(mockDonation)
    })
  })

  describe('getStatistics', () => {
    test('returns statistics successfully', async () => {
      const mockStats = {
        totalDonations: 100,
        totalAmount: 5000,
        averageAmount: 50
      }
      const mockApiResponse = { data: mockStats }

      apiService.get.mockResolvedValue(mockApiResponse)

      const result = await service.getStatistics()

      expect(apiService.get).toHaveBeenCalledWith('/donations/stats')
      expect(result).toEqual(mockStats)
    })
  })

  describe('validateDonationAmount', () => {
    test('validates amount within range', async () => {
      const result = await service.validateDonationAmount(100, 'USD')
      expect(result).toBe(true)
    })

    test('throws error for amount below minimum', async () => {
      await expect(service.validateDonationAmount(0.5, 'USD')).rejects.toThrow('Minimum donation amount is 1 USD')
    })

    test('throws error for amount above maximum', async () => {
      await expect(service.validateDonationAmount(15000, 'USD')).rejects.toThrow('Maximum donation amount is 10000 USD')
    })
  })

  describe('formatCurrency', () => {
    test('formats amount with default currency', () => {
      const result = service.formatCurrency(1234.56)
      expect(result).toBe('$1,234.56')
    })

    test('formats amount with specified currency', () => {
      const result = service.formatCurrency(1234.56, 'EUR')
      expect(result).toBe('€1,234.56')
    })
  })

  describe('calculateProcessingFee', () => {
    test('calculates fee with default percentage', () => {
      const result = service.calculateProcessingFee(100)
      expect(result).toBe(2.9)
    })

    test('calculates fee with custom percentage', () => {
      const result = service.calculateProcessingFee(100, 0.05)
      expect(result).toBe(5)
    })
  })

  describe('getDonationTrends', () => {
    test('calculates trends from donations', () => {
      const donations = [
        { amount: 100, createdAt: new Date('2024-01-01T10:00:00Z') },
        { amount: 200, createdAt: new Date('2024-01-01T12:00:00Z') },
        { amount: 150, createdAt: new Date('2024-01-02T10:00:00Z') }
      ]

      const result = service.getDonationTrends(donations)

      expect(result['2024-01-01']).toEqual({ count: 2, amount: 300 })
      expect(result['2024-01-02']).toEqual({ count: 1, amount: 150 })
    })
  })
})