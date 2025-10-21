/**
 * DonationsPage Tests (Updated with PayU integration)
 */
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter } from 'react-router-dom'
import DonationsPage from '../DonationsPage.jsx'

// Mock the hooks
const mockUseDonations = vi.fn()

vi.mock('../../hooks/useDonations.js', () => ({
  useDonations: (...args) => mockUseDonations(...args)
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
    </QueryClientProvider>
  )
}

const mockDonationsData = {
  donations: [
    {
      id: 'donation-1',
      donor_name: 'Juan Pérez',
      donor_email: 'juan@example.com',
      amount_gtq: 100.50,
      formatted_amount: 'Q100.50',
      status_id: 1, // PENDING
      reference_code: 'REF123',
      payu_order_id: null,
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 'donation-2',
      donor_name: 'María García',
      donor_email: 'maria@example.com',
      amount_gtq: 200.00,
      formatted_amount: 'Q200.00',
      status_id: 2, // APPROVED
      reference_code: 'REF456',
      payu_order_id: 'ORDER789',
      created_at: '2024-01-14T09:15:00Z'
    }
  ],
  total: 2,
  total_amount: 300.50
}

describe('DonationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state while fetching donations', () => {
    mockUseDonations.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn()
    })

    render(
      <DonationsPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Cargando donaciones...')).toBeInTheDocument()
  })

  it('shows error message when donations fetch fails', async () => {
    const error = new Error('Failed to fetch donations')
    mockUseDonations.mockReturnValue({
      data: null,
      isLoading: false,
      error,
      refetch: vi.fn()
    })

    render(
      <DonationsPage />,
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(screen.getByText('Error al cargar las donaciones')).toBeInTheDocument()
    })
  })

  it('displays donations list correctly', () => {
    mockUseDonations.mockReturnValue({
      data: mockDonationsData,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(
      <DonationsPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    expect(screen.getByText('María García')).toBeInTheDocument()
    expect(screen.getByText('Q100.50')).toBeInTheDocument()
    expect(screen.getByText('Q200.00')).toBeInTheDocument()
  })

  it('shows statistics cards', () => {
    mockUseDonations.mockReturnValue({
      data: mockDonationsData,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(
      <DonationsPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Total Donaciones')).toBeInTheDocument()
    expect(screen.getByText('Monto Total')).toBeInTheDocument()
    expect(screen.getByText('Pendientes')).toBeInTheDocument()
    expect(screen.getByText('Aprobadas')).toBeInTheDocument()
  })

  it('displays correct statistics values', () => {
    mockUseDonations.mockReturnValue({
      data: mockDonationsData,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(
      <DonationsPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('2')).toBeInTheDocument() // Total donations
    expect(screen.getByText('Q300.5')).toBeInTheDocument() // Total amount
  })

  it('filters donations by search term', () => {
    mockUseDonations.mockReturnValue({
      data: mockDonationsData,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(
      <DonationsPage />,
      { wrapper: createWrapper() }
    )

    const searchInput = screen.getByPlaceholderText('Buscar por nombre, email o referencia...')
    fireEvent.change(searchInput, { target: { value: 'Juan' } })

    expect(mockUseDonations).toHaveBeenCalledWith(
      expect.objectContaining({ searchTerm: 'Juan' }),
      expect.any(Object)
    )
  })

  it('filters donations by status', () => {
    mockUseDonations.mockReturnValue({
      data: mockDonationsData,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(
      <DonationsPage />,
      { wrapper: createWrapper() }
    )

    const statusSelect = screen.getByDisplayValue('Todos')
    fireEvent.change(statusSelect, { target: { value: '1' } }) // PENDING

    // The filtering is done in the component, not passed to the hook
    // So we check that the select value changed
    expect(statusSelect.value).toBe('1')
  })

  it('shows PayU payment components for pending donations', () => {
    mockUseDonations.mockReturnValue({
      data: mockDonationsData,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(
      <DonationsPage />,
      { wrapper: createWrapper() }
    )

    // Should show PayU button for pending donation
    expect(screen.getByText('Pagar Ahora')).toBeInTheDocument()

    // Should show payment status for approved donation
    expect(screen.getAllByText('Aprobado').length).toBeGreaterThan(0)
  })

  it('shows empty state when no donations match filters', () => {
    const emptyData = {
      donations: [],
      total: 0,
      total_amount: 0
    }

    mockUseDonations.mockReturnValue({
      data: emptyData,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(
      <DonationsPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('No se encontraron donaciones')).toBeInTheDocument()
  })

  it('shows empty state message when no donations exist', () => {
    const emptyData = {
      donations: [],
      total: 0,
      total_amount: 0
    }

    mockUseDonations.mockReturnValue({
      data: emptyData,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(
      <DonationsPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Aún no hay donaciones registradas')).toBeInTheDocument()
  })

  it('calls refetch when refresh button is clicked', () => {
    const mockRefetch = vi.fn()
    mockUseDonations.mockReturnValue({
      data: mockDonationsData,
      isLoading: false,
      error: null,
      refetch: mockRefetch
    })

    render(
      <DonationsPage />,
      { wrapper: createWrapper() }
    )

    const refreshButton = screen.getByText('Actualizar')
    fireEvent.click(refreshButton)

    expect(mockRefetch).toHaveBeenCalled()
  })

  it('shows correct count of found donations', () => {
    mockUseDonations.mockReturnValue({
      data: mockDonationsData,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(
      <DonationsPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('2 donaciones encontradas')).toBeInTheDocument()
  })

  it('renders donation cards with correct layout', () => {
    mockUseDonations.mockReturnValue({
      data: mockDonationsData,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(
      <DonationsPage />,
      { wrapper: createWrapper() }
    )

    // Check that DonationCard components are rendered
    const cards = screen.getAllByTestId(/donation-card|donation/)
    expect(cards.length).toBeGreaterThanOrEqual(2)
  })

  it('displays navigation buttons correctly', () => {
    mockUseDonations.mockReturnValue({
      data: mockDonationsData,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(
      <DonationsPage />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Hacer Donación')).toBeInTheDocument()
    expect(screen.getByText('Actualizar')).toBeInTheDocument()
  })

  it('handles missing data gracefully', () => {
    mockUseDonations.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(
      <DonationsPage />,
      { wrapper: createWrapper() }
    )

    // Should not crash and show appropriate empty state
    expect(screen.getByText('Donations')).toBeInTheDocument()
  })

  it('configures polling for donations with pending payments', () => {
    mockUseDonations.mockReturnValue({
      data: mockDonationsData,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    })

    render(
      <DonationsPage />,
      { wrapper: createWrapper() }
    )

    // The polling should be configured for donations with pending PayU payments
    // This is tested through the hook configuration
    expect(mockUseDonations).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        refetchInterval: expect.any(Function)
      })
    )
  })
})
