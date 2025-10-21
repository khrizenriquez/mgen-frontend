/**
 * DonationCard Component Tests
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter } from 'react-router-dom'
import DonationCard from '../DonationCard.jsx'

// Mock the hooks
const mockCreatePayment = vi.fn()
vi.mock('../../../hooks/usePayU.js', () => ({
  usePayU: () => ({
    createPayment: { mutateAsync: mockCreatePayment },
    isLoading: false
  })
}))

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
      <MemoryRouter>
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

describe('DonationCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders donation information correctly', () => {
    render(
      <DonationCard donation={mockDonation} />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    expect(screen.getByText('juan@example.com')).toBeInTheDocument()
    expect(screen.getByText('Q100.50')).toBeInTheDocument()
    expect(screen.getByText('REF123456')).toBeInTheDocument()
  })

  it('shows pending status badge', () => {
    render(
      <DonationCard donation={mockDonation} showPaymentStatus={true} />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })

  it('shows approved status with completion indicator', () => {
    const approvedDonation = { ...mockDonation, status_id: 2 } // APPROVED

    render(
      <DonationCard donation={approvedDonation} showPaymentStatus={true} />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Aprobado')).toBeInTheDocument()
    expect(screen.getByText('Completado')).toBeInTheDocument()
    expect(screen.getByClass('bi-check-circle-fill')).toBeInTheDocument()
  })

  it('shows PayU payment button for pending donations without order ID', () => {
    render(
      <DonationCard donation={mockDonation} showActions={true} />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Pagar Ahora')).toBeInTheDocument()
  })

  it('shows view status button for donations with PayU order ID', () => {
    const donationWithOrder = { ...mockDonation, payu_order_id: 'ORDER123' }

    render(
      <DonationCard donation={donationWithOrder} showActions={true} />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Ver Estado')).toBeInTheDocument()
  })

  it('does not show payment actions when showActions is false', () => {
    render(
      <DonationCard donation={mockDonation} showActions={false} />,
      { wrapper: createWrapper() }
    )

    expect(screen.queryByText('Pagar Ahora')).not.toBeInTheDocument()
    expect(screen.queryByText('Ver Estado')).not.toBeInTheDocument()
  })

  it('calls createPayment when PayU button is clicked', async () => {
    mockCreatePayment.mockResolvedValue({
      payment_url: 'https://payu.test/payment'
    })

    render(
      <DonationCard donation={mockDonation} showActions={true} />,
      { wrapper: createWrapper() }
    )

    const payButton = screen.getByText('Pagar Ahora')
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

  it('shows success toast on successful payment creation', async () => {
    const toastSuccess = vi.mocked(vi.importActual('react-hot-toast')).toast.success
    mockCreatePayment.mockResolvedValue({
      payment_url: 'https://payu.test/payment'
    })

    render(
      <DonationCard donation={mockDonation} showActions={true} />,
      { wrapper: createWrapper() }
    )

    const payButton = screen.getByText('Pagar Ahora')
    fireEvent.click(payButton)

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Pago iniciado correctamente')
    })
  })

  it('shows error toast on payment creation failure', async () => {
    const toastError = vi.mocked(vi.importActual('react-hot-toast')).toast.error
    const error = new Error('Payment failed')
    mockCreatePayment.mockRejectedValue(error)

    render(
      <DonationCard donation={mockDonation} showActions={true} />,
      { wrapper: createWrapper() }
    )

    const payButton = screen.getByText('Pagar Ahora')
    fireEvent.click(payButton)

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Error al procesar el pago')
    })
  })

  it('renders view link correctly', () => {
    render(
      <DonationCard donation={mockDonation} showActions={true} />,
      { wrapper: createWrapper() }
    )

    const viewLink = screen.getByText('Ver').closest('a')
    expect(viewLink).toHaveAttribute('href', '/donations/test-donation-id')
  })

  it('renders payment status link correctly', () => {
    const donationWithOrder = { ...mockDonation, payu_order_id: 'ORDER123' }

    render(
      <DonationCard donation={donationWithOrder} showActions={true} />,
      { wrapper: createWrapper() }
    )

    const statusLink = screen.getByText('Ver Estado').closest('a')
    expect(statusLink).toHaveAttribute('href', '/donations/test-donation-id/payment')
  })

  it('displays formatted creation date', () => {
    render(
      <DonationCard donation={mockDonation} />,
      { wrapper: createWrapper() }
    )

    // The date should be formatted and displayed
    expect(screen.getByText(/Creado/)).toBeInTheDocument()
  })

  it('passes through additional props to Card component', () => {
    render(
      <DonationCard
        donation={mockDonation}
        className="custom-class"
        data-testid="donation-card"
      />,
      { wrapper: createWrapper() }
    )

    const card = screen.getByTestId('donation-card')
    expect(card).toHaveClass('custom-class')
  })

  it('handles missing donor name gracefully', () => {
    const donationWithoutName = { ...mockDonation, donor_name: null }

    render(
      <DonationCard donation={donationWithoutName} />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Donante Anónimo')).toBeInTheDocument()
  })

  it('displays different layouts for mobile/desktop', () => {
    render(
      <DonationCard donation={mockDonation} />,
      { wrapper: createWrapper() }
    )

    // Check responsive classes are applied
    const row = screen.getByClass('row')
    expect(row).toBeInTheDocument()

    const cols = screen.getAllByClass('col')
    expect(cols.length).toBeGreaterThan(0)
  })

  it('does not render without donation prop', () => {
    const { container } = render(
      <DonationCard />,
      { wrapper: createWrapper() }
    )

    expect(container.firstChild).toBeNull()
  })
})
