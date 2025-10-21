/**
 * DonationPaymentPage Tests
 */
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import DonationPaymentPage from '../DonationPaymentPage.jsx'

// Mock the hooks
const mockUseDonation = vi.fn()
const mockUsePayU = vi.fn()

vi.mock('../../hooks/useDonations.js', () => ({
  useDonation: (...args) => mockUseDonation(...args)
}))

vi.mock('../../hooks/usePayU.js', () => ({
  usePayU: () => mockUsePayU()
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, defaultValue) => defaultValue || key
  })
}))

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

const createWrapper = (history = createMemoryHistory()) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter history={history}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  )
}

const mockDonation = {
  id: 'test-donation-id',
  donor_name: 'Juan Pérez',
  donor_email: 'juan@example.com',
  amount_gtq: 100.50,
  formatted_amount: 'Q100.50',
  status_id: 1, // PENDING
  reference_code: 'REF123456',
  payu_order_id: null,
  created_at: '2024-01-15T10:30:00Z'
}

describe('DonationPaymentPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePayU.mockReturnValue({
      createPayment: { mutateAsync: vi.fn() },
      isLoading: false
    })
  })

  it('shows loading spinner while fetching donation', () => {
    mockUseDonation.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    })

    render(
      <DonationPaymentPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Cargando donaciones...')).toBeInTheDocument()
  })

  it('shows error message when donation fetch fails', async () => {
    const error = { response: { status: 404 } }
    mockUseDonation.mockReturnValue({
      data: null,
      isLoading: false,
      error
    })

    render(
      <DonationPaymentPage />,
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(screen.getByText('Donación no encontrada')).toBeInTheDocument()
    })
  })

  it('displays donation information correctly', () => {
    mockUseDonation.mockReturnValue({
      data: mockDonation,
      isLoading: false,
      error: null
    })

    render(
      <DonationPaymentPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    expect(screen.getByText('juan@example.com')).toBeInTheDocument()
    expect(screen.getByText('Q100.50')).toBeInTheDocument()
    expect(screen.getByText('REF123456')).toBeInTheDocument()
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })

  it('shows PayU payment button for pending donations', () => {
    mockUseDonation.mockReturnValue({
      data: mockDonation,
      isLoading: false,
      error: null
    })

    render(
      <DonationPaymentPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Pagar con PayU')).toBeInTheDocument()
  })

  it('shows different UI for approved donations', () => {
    const approvedDonation = { ...mockDonation, status_id: 2 } // APPROVED

    mockUseDonation.mockReturnValue({
      data: approvedDonation,
      isLoading: false,
      error: null
    })

    render(
      <DonationPaymentPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Esta donación ya ha sido pagada exitosamente.')).toBeInTheDocument()
    expect(screen.queryByText('Pagar con PayU')).not.toBeInTheDocument()
  })

  it('shows processing message for donations with PayU order ID', () => {
    const processingDonation = { ...mockDonation, payu_order_id: 'ORDER123' }

    mockUseDonation.mockReturnValue({
      data: processingDonation,
      isLoading: false,
      error: null
    })

    render(
      <DonationPaymentPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('El pago está en proceso.')).toBeInTheDocument()
    expect(screen.getByText('Ver Estado')).toBeInTheDocument()
  })

  it('calls createPayment when PayU button is clicked', async () => {
    const mockCreatePayment = vi.fn().mockResolvedValue({
      payment_url: 'https://payu.test/payment'
    })

    mockUsePayU.mockReturnValue({
      createPayment: { mutateAsync: mockCreatePayment },
      isLoading: false
    })

    mockUseDonation.mockReturnValue({
      data: mockDonation,
      isLoading: false,
      error: null
    })

    // Mock window.location
    const mockLocation = { href: '' }
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    })

    render(
      <DonationPaymentPage />,
      { wrapper: createWrapper() }
    )

    const payButton = screen.getByText('Pagar con PayU')
    fireEvent.click(payButton)

    await waitFor(() => {
      expect(mockCreatePayment).toHaveBeenCalledWith({
        donationId: 'test-donation-id',
        options: {
          responseUrl: expect.stringContaining('/payment/success'),
          confirmationUrl: expect.stringContaining('/api/v1/webhooks/payu/confirmation')
        }
      })
    })
  })

  it('shows back button that navigates to donations list', () => {
    mockUseDonation.mockReturnValue({
      data: mockDonation,
      isLoading: false,
      error: null
    })

    const history = createMemoryHistory()
    const mockNavigate = vi.fn()
    history.push = mockNavigate

    render(
      <DonationPaymentPage />,
      { wrapper: createWrapper(history) }
    )

    const backButton = screen.getByText('Volver a donaciones')
    fireEvent.click(backButton)

    expect(mockNavigate).toHaveBeenCalledWith('/donations')
  })

  it('handles missing donation gracefully', () => {
    mockUseDonation.mockReturnValue({
      data: null,
      isLoading: false,
      error: null
    })

    render(
      <DonationPaymentPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Donación no encontrada')).toBeInTheDocument()
  })

  it('displays correct page title', () => {
    mockUseDonation.mockReturnValue({
      data: mockDonation,
      isLoading: false,
      error: null
    })

    render(
      <DonationPaymentPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Completar Donación')).toBeInTheDocument()
  })

  it('shows secure payment message', () => {
    mockUseDonation.mockReturnValue({
      data: mockDonation,
      isLoading: false,
      error: null
    })

    render(
      <DonationPaymentPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Pago procesado de forma segura por PayU')).toBeInTheDocument()
  })

  it('handles payment errors gracefully', async () => {
    const mockCreatePayment = vi.fn().mockRejectedValue(new Error('Payment failed'))
    const mockOnError = vi.fn()

    mockUsePayU.mockReturnValue({
      createPayment: { mutateAsync: mockCreatePayment },
      isLoading: false
    })

    mockUseDonation.mockReturnValue({
      data: mockDonation,
      isLoading: false,
      error: null
    })

    render(
      <DonationPaymentPage />,
      { wrapper: createWrapper() }
    )

    const payButton = screen.getByText('Pagar con PayU')
    fireEvent.click(payButton)

    await waitFor(() => {
      expect(mockCreatePayment).toHaveBeenCalled()
    })

    // Error should be handled internally by the PayUButton component
  })
})
