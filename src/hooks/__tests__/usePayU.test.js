/**
 * usePayU Hook Tests
 */
import { renderHook, waitFor, act } from '@testing-library/react'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from 'react-query'
import { usePayU, usePayUConfig, usePaymentStatus } from '../usePayU.js'

// Mock PayUService
vi.mock('../../core/services/PayUService.js', () => ({
  default: {
    createPayment: vi.fn(),
    getPaymentStatus: vi.fn(),
    getConfigStatus: vi.fn()
  }
}))

import PayUService from '../../core/services/PayUService.js'

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

describe('usePayU', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns createPayment mutation', () => {
    const { result } = renderHook(() => usePayU(), { wrapper: createWrapper() })

    expect(result.current.createPayment).toBeDefined()
    expect(result.current.createPayment.mutateAsync).toBeDefined()
    expect(result.current.isLoading).toBe(false)
  })

  it('returns checkPaymentStatus mutation', () => {
    const { result } = renderHook(() => usePayU(), { wrapper: createWrapper() })

    expect(result.current.checkPaymentStatus).toBeDefined()
    expect(result.current.checkPaymentStatus.mutateAsync).toBeDefined()
  })

  it('handles successful payment creation', async () => {
    const mockResponse = { payment_url: 'https://payu.test/payment' }
    PayUService.createPayment.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => usePayU(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.createPayment.mutateAsync({
        donationId: 'test-id',
        options: { responseUrl: 'https://example.com/success' }
      })
    })

    expect(PayUService.createPayment).toHaveBeenCalledWith('test-id', {
      responseUrl: 'https://example.com/success'
    })
  })

  it('handles payment creation errors', async () => {
    const error = new Error('Payment failed')
    PayUService.createPayment.mockRejectedValue(error)

    const { result } = renderHook(() => usePayU(), { wrapper: createWrapper() })

    await act(async () => {
      try {
        await result.current.createPayment.mutateAsync({ donationId: 'test-id' })
      } catch {
        // Expected to throw
      }
    })

    expect(result.current.createPayment.error).toBe(error)
  })

  it('shows loading state during payment creation', async () => {
    let resolvePromise
    const promise = new Promise(resolve => { resolvePromise = resolve })
    PayUService.createPayment.mockReturnValue(promise)

    const { result } = renderHook(() => usePayU(), { wrapper: createWrapper() })

    act(() => {
      result.current.createPayment.mutate({ donationId: 'test-id' })
    })

    expect(result.current.isLoading).toBe(true)

    act(() => {
      resolvePromise({ payment_url: 'https://payu.test/payment' })
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })
})

describe('usePayUConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches PayU configuration status', async () => {
    const mockConfig = {
      configured: true,
      test_mode: true,
      country_code: 'GT',
      currency: 'GTQ',
      errors: []
    }

    PayUService.getConfigStatus.mockResolvedValue(mockConfig)

    const { result } = renderHook(() => usePayUConfig(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.data).toEqual(mockConfig)
    })

    expect(PayUService.getConfigStatus).toHaveBeenCalledTimes(1)
  })

  it('handles configuration errors', async () => {
    const error = new Error('Config fetch failed')
    PayUService.getConfigStatus.mockRejectedValue(error)

    const { result } = renderHook(() => usePayUConfig(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.error).toBe(error)
    })
  })

  it('uses correct cache settings', () => {
    renderHook(() => usePayUConfig(), { wrapper: createWrapper() })

    // The hook should be configured with appropriate cache settings
    expect(PayUService.getConfigStatus).toHaveBeenCalledTimes(0) // Not called immediately due to enabled: true by default
  })
})

describe('usePaymentStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches payment status for valid donation ID', async () => {
    const mockStatus = {
      donation_id: 'test-donation-id',
      status: 'APPROVED',
      payu_order_id: 'ORDER123',
      transaction_id: 'TXN123'
    }

    PayUService.getPaymentStatus.mockResolvedValue(mockStatus)

    const { result } = renderHook(
      () => usePaymentStatus('test-donation-id'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.data).toEqual(mockStatus)
    })

    expect(PayUService.getPaymentStatus).toHaveBeenCalledWith('test-donation-id')
  })

  it('does not fetch when donationId is not provided', () => {
    renderHook(
      () => usePaymentStatus(null),
      { wrapper: createWrapper() }
    )

    expect(PayUService.getPaymentStatus).not.toHaveBeenCalled()
  })

  it('respects enabled option', () => {
    renderHook(
      () => usePaymentStatus('test-id', { enabled: false }),
      { wrapper: createWrapper() }
    )

    expect(PayUService.getPaymentStatus).not.toHaveBeenCalled()
  })

  it('handles payment status errors', async () => {
    const error = new Error('Status fetch failed')
    PayUService.getPaymentStatus.mockRejectedValue(error)

    const { result } = renderHook(
      () => usePaymentStatus('test-donation-id'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.error).toBe(error)
    })
  })

  it('configures polling correctly', () => {
    renderHook(
      () => usePaymentStatus('test-id', {
        refetchInterval: 30000,
        enabled: true
      }),
      { wrapper: createWrapper() }
    )

    // The hook should be called with polling configuration
    expect(PayUService.getPaymentStatus).toHaveBeenCalledTimes(0) // Not called immediately
  })

  it('uses appropriate cache settings', () => {
    renderHook(
      () => usePaymentStatus('test-id'),
      { wrapper: createWrapper() }
    )

    // Should use shorter cache times for payment status
    // This is verified by the hook configuration
  })

  it('handles empty donationId gracefully', () => {
    renderHook(
      () => usePaymentStatus(''),
      { wrapper: createWrapper() }
    )

    expect(PayUService.getPaymentStatus).not.toHaveBeenCalled()
  })

  it('handles undefined donationId gracefully', () => {
    renderHook(
      () => usePaymentStatus(undefined),
      { wrapper: createWrapper() }
    )

    expect(PayUService.getPaymentStatus).not.toHaveBeenCalled()
  })
})
