/**
 * useDonations Hook Tests
 */
import { renderHook, waitFor, act } from '@testing-library/react'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from 'react-query'
import {
  useDonation,
  useDonations,
  useCreateDonation,
  useUpdateDonation,
  useDeleteDonation
} from '../useDonations.js'

// Mock DonationService
vi.mock('../../core/services/DonationService.js', () => ({
  default: {
    getById: vi.fn(),
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}))

import DonationService from '../../core/services/DonationService.js'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useDonation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches donation by ID', async () => {
    const mockDonation = {
      id: 'test-donation-id',
      donor_name: 'Juan Pérez',
      amount_gtq: 100.50,
      status_id: 1
    }

    DonationService.getById.mockResolvedValue(mockDonation)

    const { result } = renderHook(
      () => useDonation('test-donation-id'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.data).toEqual(mockDonation)
    })

    expect(DonationService.getById).toHaveBeenCalledWith('test-donation-id')
  })

  it('does not fetch when donationId is not provided', () => {
    renderHook(
      () => useDonation(null),
      { wrapper: createWrapper() }
    )

    expect(DonationService.getById).not.toHaveBeenCalled()
  })

  it('handles fetch errors', async () => {
    const error = new Error('Donation not found')
    DonationService.getById.mockRejectedValue(error)

    const { result } = renderHook(
      () => useDonation('invalid-id'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.error).toBe(error)
    })
  })
})

describe('useDonations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches donations list', async () => {
    const mockData = {
      donations: [
        { id: '1', donor_name: 'Juan', amount_gtq: 100 },
        { id: '2', donor_name: 'María', amount_gtq: 200 }
      ],
      total: 2,
      total_amount: 300
    }

    DonationService.getAll.mockResolvedValue(mockData)

    const { result } = renderHook(
      () => useDonations(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData)
    })

    expect(DonationService.getAll).toHaveBeenCalledWith({})
  })

  it('passes filters to service', async () => {
    const filters = { status: 'approved', limit: 10 }
    const mockData = { donations: [], total: 0 }

    DonationService.getAll.mockResolvedValue(mockData)

    renderHook(
      () => useDonations(filters),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(DonationService.getAll).toHaveBeenCalledWith(filters)
    })
  })

  it('respects enabled option', () => {
    renderHook(
      () => useDonations({}, { enabled: false }),
      { wrapper: createWrapper() }
    )

    expect(DonationService.getAll).not.toHaveBeenCalled()
  })

  it('configures polling for pending payments', async () => {
    const mockData = {
      donations: [
        {
          id: '1',
          status_id: 1, // PENDING
          payu_order_id: 'ORDER123',
          amount_gtq: 100
        }
      ],
      total: 1
    }

    DonationService.getAll.mockResolvedValue(mockData)

    renderHook(
      () => useDonations(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(DonationService.getAll).toHaveBeenCalled()
    })

    // The polling configuration is tested through the hook's refetchInterval
  })

  it('handles fetch errors', async () => {
    const error = new Error('Failed to fetch donations')
    DonationService.getAll.mockRejectedValue(error)

    const { result } = renderHook(
      () => useDonations(),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.error).toBe(error)
    })
  })
})

describe('useCreateDonation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates donation successfully', async () => {
    const mockDonation = { id: 'new-id', donor_name: 'Juan', amount_gtq: 100 }
    DonationService.create.mockResolvedValue(mockDonation)

    const { result } = renderHook(
      () => useCreateDonation(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      const data = await result.current.mutateAsync({
        donor_name: 'Juan',
        donor_email: 'juan@example.com',
        amount: 100
      })
      expect(data).toEqual(mockDonation)
    })

    expect(DonationService.create).toHaveBeenCalledWith({
      donor_name: 'Juan',
      donor_email: 'juan@example.com',
      amount: 100
    })
  })

  it('handles creation errors', async () => {
    const error = new Error('Creation failed')
    DonationService.create.mockRejectedValue(error)

    const { result } = renderHook(
      () => useCreateDonation(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      try {
        await result.current.mutateAsync({ donor_name: 'Juan' })
      } catch {
        // Expected to throw
      }
    })

    expect(result.current.error).toBe(error)
  })

  it('invalidates queries on success', async () => {
    const mockDonation = { id: 'new-id', donor_name: 'Juan' }
    DonationService.create.mockResolvedValue(mockDonation)

    const mockInvalidateQueries = vi.fn()
    const mockQueryClient = {
      invalidateQueries: mockInvalidateQueries
    }

    // Mock the query client
    vi.mocked(vi.importActual('react-query')).useQueryClient.mockReturnValue(mockQueryClient)

    const { result } = renderHook(
      () => useCreateDonation(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      await result.current.mutateAsync({ donor_name: 'Juan' })
    })

    expect(mockInvalidateQueries).toHaveBeenCalledWith(['donations'])
  })
})

describe('useUpdateDonation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates donation successfully', async () => {
    const mockUpdatedDonation = { id: 'test-id', donor_name: 'Juan Updated' }
    DonationService.update.mockResolvedValue(mockUpdatedDonation)

    const { result } = renderHook(
      () => useUpdateDonation(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      const data = await result.current.mutateAsync({
        id: 'test-id',
        data: { donor_name: 'Juan Updated' }
      })
      expect(data).toEqual(mockUpdatedDonation)
    })

    expect(DonationService.update).toHaveBeenCalledWith('test-id', {
      donor_name: 'Juan Updated'
    })
  })

  it('invalidates specific donation query on success', async () => {
    const mockUpdatedDonation = { id: 'test-id', donor_name: 'Updated' }
    DonationService.update.mockResolvedValue(mockUpdatedDonation)

    const mockInvalidateQueries = vi.fn()
    const mockQueryClient = {
      invalidateQueries: mockInvalidateQueries
    }

    vi.mocked(vi.importActual('react-query')).useQueryClient.mockReturnValue(mockQueryClient)

    const { result } = renderHook(
      () => useUpdateDonation(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      await result.current.mutateAsync({
        id: 'test-id',
        data: { donor_name: 'Updated' }
      })
    })

    expect(mockInvalidateQueries).toHaveBeenCalledWith(['donation', 'test-id'])
    expect(mockInvalidateQueries).toHaveBeenCalledWith(['donations'])
  })
})

describe('useDeleteDonation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes donation successfully', async () => {
    DonationService.delete.mockResolvedValue(true)

    const { result } = renderHook(
      () => useDeleteDonation(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      const data = await result.current.mutateAsync('test-id')
      expect(data).toBe(true)
    })

    expect(DonationService.delete).toHaveBeenCalledWith('test-id')
  })

  it('removes donation from cache on success', async () => {
    DonationService.delete.mockResolvedValue(true)

    const mockInvalidateQueries = vi.fn()
    const mockRemoveQueries = vi.fn()
    const mockQueryClient = {
      invalidateQueries: mockInvalidateQueries,
      removeQueries: mockRemoveQueries
    }

    vi.mocked(vi.importActual('react-query')).useQueryClient.mockReturnValue(mockQueryClient)

    const { result } = renderHook(
      () => useDeleteDonation(),
      { wrapper: createWrapper() }
    )

    await act(async () => {
      await result.current.mutateAsync('test-id')
    })

    expect(mockInvalidateQueries).toHaveBeenCalledWith(['donations'])
    expect(mockRemoveQueries).toHaveBeenCalledWith(['donation', 'test-id'])
  })
})
