/**
 * PaymentStatus Component Tests
 */
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from 'react-query'
import PaymentStatus from '../PaymentStatus.jsx'

// Mock the usePaymentStatus hook
const mockUsePaymentStatus = vi.fn()
vi.mock('../../../hooks/usePayU.js', () => ({
  usePaymentStatus: (...args) => mockUsePaymentStatus(...args)
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
      {children}
    </QueryClientProvider>
  )
}

describe('PaymentStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading spinner when loading', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    })

    render(
      <PaymentStatus donationId="test-donation-id" />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Verificando...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument() // Spinner
  })

  it('shows error state when there is an error', () => {
    const error = new Error('Payment status error')
    mockUsePaymentStatus.mockReturnValue({
      data: null,
      isLoading: false,
      error
    })

    render(
      <PaymentStatus donationId="test-donation-id" />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('shows unknown status when no data', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: null,
      isLoading: false,
      error: null
    })

    render(
      <PaymentStatus donationId="test-donation-id" />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Desconocido')).toBeInTheDocument()
  })

  it('shows APPROVED status correctly', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'APPROVED' },
      isLoading: false,
      error: null
    })

    render(
      <PaymentStatus donationId="test-donation-id" showIcon={true} />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Aprobado')).toBeInTheDocument()
    expect(screen.getByClass('bi-check-circle')).toBeInTheDocument()
  })

  it('shows PENDING status correctly', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'PENDING' },
      isLoading: false,
      error: null
    })

    render(
      <PaymentStatus donationId="test-donation-id" showIcon={true} />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Pendiente')).toBeInTheDocument()
    expect(screen.getByClass('bi-clock')).toBeInTheDocument()
  })

  it('shows DECLINED status correctly', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'DECLINED' },
      isLoading: false,
      error: null
    })

    render(
      <PaymentStatus donationId="test-donation-id" showIcon={true} />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Rechazado')).toBeInTheDocument()
    expect(screen.getByClass('bi-x-circle')).toBeInTheDocument()
  })

  it('shows EXPIRED status correctly', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'EXPIRED' },
      isLoading: false,
      error: null
    })

    render(
      <PaymentStatus donationId="test-donation-id" showIcon={true} />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Expirado')).toBeInTheDocument()
    expect(screen.getByClass('bi-dash-circle')).toBeInTheDocument()
  })

  it('shows ERROR status correctly', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'ERROR' },
      isLoading: false,
      error: null
    })

    render(
      <PaymentStatus donationId="test-donation-id" showIcon={true} />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByClass('bi-exclamation-triangle')).toBeInTheDocument()
  })

  it('applies correct Bootstrap variant classes', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'APPROVED' },
      isLoading: false,
      error: null
    })

    const { container } = render(
      <PaymentStatus donationId="test-donation-id" />,
      { wrapper: createWrapper() }
    )

    const badge = container.querySelector('.badge')
    expect(badge).toHaveClass('bg-success')
  })

  it('passes through additional props', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'APPROVED' },
      isLoading: false,
      error: null
    })

    render(
      <PaymentStatus
        donationId="test-donation-id"
        className="custom-class"
        data-testid="payment-status"
      />,
      { wrapper: createWrapper() }
    )

    const badge = screen.getByTestId('payment-status')
    expect(badge).toHaveClass('custom-class')
  })

  it('does not show icon when showIcon is false', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'APPROVED' },
      isLoading: false,
      error: null
    })

    render(
      <PaymentStatus donationId="test-donation-id" showIcon={false} />,
      { wrapper: createWrapper() }
    )

    expect(screen.queryByClass('bi')).not.toBeInTheDocument()
  })

  it('enables polling when polling prop is true', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'PENDING' },
      isLoading: false,
      error: null
    })

    render(
      <PaymentStatus
        donationId="test-donation-id"
        polling={true}
        pollingInterval={5000}
      />,
      { wrapper: createWrapper() }
    )

    expect(mockUsePaymentStatus).toHaveBeenCalledWith('test-donation-id', {
      enabled: true,
      refetchInterval: 5000
    })
  })

  it('does not enable polling when polling prop is false', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'APPROVED' },
      isLoading: false,
      error: null
    })

    render(
      <PaymentStatus
        donationId="test-donation-id"
        polling={false}
      />,
      { wrapper: createWrapper() }
    )

    expect(mockUsePaymentStatus).toHaveBeenCalledWith('test-donation-id', {
      enabled: true,
      refetchInterval: false
    })
  })

  it('handles unknown status gracefully', () => {
    mockUsePaymentStatus.mockReturnValue({
      data: { status: 'UNKNOWN_STATUS' },
      isLoading: false,
      error: null
    })

    render(
      <PaymentStatus donationId="test-donation-id" showIcon={true} />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Desconocido')).toBeInTheDocument()
    expect(screen.getByClass('bi-question-circle')).toBeInTheDocument()
  })
})
