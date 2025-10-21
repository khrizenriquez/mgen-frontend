/**
 * PayUButton Component Tests
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from 'react-query'
import PayUButton from '../PayUButton.jsx'

// Mock the usePayU hook
const mockCreatePayment = vi.fn()
vi.mock('../../../hooks/usePayU.js', () => ({
  usePayU: () => ({
    createPayment: { mutateAsync: mockCreatePayment },
    isLoading: false
  })
}))

// Mock toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
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

describe('PayUButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.location.href
    delete window.location
    window.location = { href: '' }
  })

  it('renders with default text', () => {
    render(
      <PayUButton donationId="test-donation-id" />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Pagar con PayU')).toBeInTheDocument()
  })

  it('renders with custom children', () => {
    render(
      <PayUButton donationId="test-donation-id">
        Custom Pay Button
      </PayUButton>,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Custom Pay Button')).toBeInTheDocument()
  })

  it('shows loading state when payment is processing', () => {
    // Mock loading state
    vi.mocked(vi.importActual('../../../hooks/usePayU.js')).usePayU.mockReturnValue({
      createPayment: { mutateAsync: vi.fn() },
      isLoading: true
    })

    render(
      <PayUButton donationId="test-donation-id" />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Procesando...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument() // Spinner
  })

  it('calls createPayment when clicked', async () => {
    mockCreatePayment.mockResolvedValue({
      payment_url: 'https://payu.test/payment'
    })

    render(
      <PayUButton donationId="test-donation-id" />,
      { wrapper: createWrapper() }
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockCreatePayment).toHaveBeenCalledWith({
        donationId: 'test-donation-id',
        options: {
          responseUrl: `${window.location.origin}/payment/success`,
          confirmationUrl: `${window.location.origin}/api/v1/webhooks/payu/confirmation`
        }
      })
    })
  })

  it('redirects to PayU URL on successful payment creation', async () => {
    const payuUrl = 'https://payu.test/payment'
    mockCreatePayment.mockResolvedValue({
      payment_url: payuUrl
    })

    render(
      <PayUButton donationId="test-donation-id" />,
      { wrapper: createWrapper() }
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(window.location.href).toBe(payuUrl)
    })
  })

  it('calls onError when payment creation fails', async () => {
    const mockOnError = vi.fn()
    const error = new Error('Payment failed')
    mockCreatePayment.mockRejectedValue(error)

    render(
      <PayUButton
        donationId="test-donation-id"
        onError={mockOnError}
      />,
      { wrapper: createWrapper() }
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(error)
    })
  })

  it('is disabled when donationId is not provided', () => {
    render(
      <PayUButton />,
      { wrapper: createWrapper() }
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('is disabled when loading', () => {
    // Mock loading state
    vi.mocked(vi.importActual('../../../hooks/usePayU.js')).usePayU.mockReturnValue({
      createPayment: { mutateAsync: vi.fn() },
      isLoading: true
    })

    render(
      <PayUButton donationId="test-donation-id" />,
      { wrapper: createWrapper() }
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('passes through additional props to button', () => {
    render(
      <PayUButton
        donationId="test-donation-id"
        variant="outline-primary"
        size="lg"
        className="custom-class"
        data-testid="payu-button"
      />,
      { wrapper: createWrapper() }
    )

    const button = screen.getByTestId('payu-button')
    expect(button).toHaveClass('btn-outline-primary', 'btn-lg', 'custom-class')
  })

  it('logs error when donationId is missing', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <PayUButton onError={() => {}} />,
      { wrapper: createWrapper() }
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(consoleSpy).toHaveBeenCalledWith('PayUButton: donationId is required')

    consoleSpy.mockRestore()
  })
})
