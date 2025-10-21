/**
 * PaymentSuccessPage Tests
 */
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter } from 'react-router-dom'
import PaymentSuccessPage from '../PaymentSuccessPage.jsx'

// Mock the hook
const mockUsePaymentStatus = vi.fn()

vi.mock('../../hooks/usePayU.js', () => ({
  usePaymentStatus: (...args) => mockUsePaymentStatus(...args)
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, defaultValue) => defaultValue || key
  })
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
  )
}

describe('PaymentSuccessPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock URL search params
    vi.mocked(URLSearchParams).mockImplementation(() => ({
      get: vi.fn((key) => {
        const params = {
          referenceCode: 'REF123456',
          transactionId: 'TXN123',
          donationId: 'donation-123'
        }
        return params[key] || null
      })
    }))

    // Mock useSearchParams
    vi.mocked(vi.importActual('react-router-dom')).useSearchParams.mockReturnValue([
      new URLSearchParams('referenceCode=REF123456&transactionId=TXN123&donationId=donation-123')
    ])
  })

  it('shows loading state initially', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    })

    render(
      <PaymentSuccessPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Verificando pago...')).toBeInTheDocument()
  })

  it('shows verification message while loading', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    })

    render(
      <PaymentSuccessPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Por favor espere mientras confirmamos el estado de su pago.')).toBeInTheDocument()
  })

  it('displays success message for approved payments', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: {
        status: 'APPROVED',
        reference_code: 'REF123456',
        transaction_id: 'TXN123',
        payu_order_id: 'ORDER123',
        amount: 100.50
      },
      isLoading: false,
      error: null
    })

    render(
      <PaymentSuccessPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('¡Pago Exitoso!')).toBeInTheDocument()
    expect(screen.getByText('¡Su pago ha sido procesado exitosamente!')).toBeInTheDocument()
  })

  it('displays pending message for pending payments', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: {
        status: 'PENDING',
        reference_code: 'REF123456',
        transaction_id: 'TXN123'
      },
      isLoading: false,
      error: null
    })

    render(
      <PaymentSuccessPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Pago en Proceso')).toBeInTheDocument()
    expect(screen.getByText('Su pago está siendo procesado. Recibirá una confirmación por email.')).toBeInTheDocument()
  })

  it('displays declined message for declined payments', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: {
        status: 'DECLINED',
        reference_code: 'REF123456',
        transaction_id: 'TXN123'
      },
      isLoading: false,
      error: null
    })

    render(
      <PaymentSuccessPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Resultado del Pago')).toBeInTheDocument()
    expect(screen.getByText('Su pago fue rechazado. Por favor, inténtelo nuevamente o contacte a soporte.')).toBeInTheDocument()
  })

  it('shows payment details correctly', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: {
        status: 'APPROVED',
        reference_code: 'REF123456',
        transaction_id: 'TXN123',
        payu_order_id: 'ORDER123',
        amount: 100.50
      },
      isLoading: false,
      error: null
    })

    render(
      <PaymentSuccessPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('REF123456')).toBeInTheDocument()
    expect(screen.getByText('TXN123')).toBeInTheDocument()
    expect(screen.getByText('ORDER123')).toBeInTheDocument()
    expect(screen.getByText('Q100.5')).toBeInTheDocument()
    expect(screen.getByText('Aprobado')).toBeInTheDocument()
  })

  it('shows appropriate icons for each status', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'APPROVED' },
      isLoading: false,
      error: null
    })

    render(
      <PaymentSuccessPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByClass('bi-check-circle')).toBeInTheDocument()
  })

  it('shows error message when payment verification fails', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Verification failed')
    })

    render(
      <PaymentSuccessPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Error de verificación')).toBeInTheDocument()
  })

  it('shows unknown status message when no payment data available', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: null,
      isLoading: false,
      error: null
    })

    render(
      <PaymentSuccessPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Información no disponible')).toBeInTheDocument()
  })

  it('shows redirect message for successful payments', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'APPROVED' },
      isLoading: false,
      error: null
    })

    render(
      <PaymentSuccessPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Será redirigido automáticamente en unos segundos...')).toBeInTheDocument()
  })

  it('provides navigation buttons', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'APPROVED' },
      isLoading: false,
      error: null
    })

    render(
      <PaymentSuccessPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Ver mis donaciones')).toBeInTheDocument()
    expect(screen.getByText('Hacer otra donación')).toBeInTheDocument()
  })

  it('handles missing URL parameters gracefully', () => {
    // Mock empty search params
    vi.mocked(vi.importActual('react-router-dom')).useSearchParams.mockReturnValue([
      new URLSearchParams('')
    ])

    mockUsePaymentStatus.mockReturnValue({
      data: null,
      isLoading: false,
      error: null
    })

    render(
      <PaymentSuccessPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Información no disponible')).toBeInTheDocument()
  })

  it('displays correct page title', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'APPROVED' },
      isLoading: false,
      error: null
    })

    render(
      <PaymentSuccessPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Resultado del Pago')).toBeInTheDocument()
  })

  it('handles different error states appropriately', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'ERROR' },
      isLoading: false,
      error: null
    })

    render(
      <PaymentSuccessPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Ocurrió un error al procesar su pago. Por favor, contacte a soporte.')).toBeInTheDocument()
  })

  it('configures polling for pending payments', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'PENDING' },
      isLoading: false,
      error: null
    })

    render(
      <PaymentSuccessPage />,
      { wrapper: createWrapper() }
    )

    // The polling configuration should be tested through the hook call
    expect(mockUsePaymentStatus).toHaveBeenCalledWith(null, {
      enabled: true,
      refetchInterval: expect.any(Function)
    })
  })
})
