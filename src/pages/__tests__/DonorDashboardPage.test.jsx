/**
 * DonorDashboardPage Component Tests
 */
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import DonorDashboardPage from '../DonorDashboardPage'
import api from '../../core/services/api.js'

// Mock the API
vi.mock('../../core/services/api.js', () => ({
  default: {
    get: vi.fn()
  }
}))

const mockApi = api

// Mock data
const mockDashboardData = {
  stats: {
    total_donations: 12,
    total_amount_gtq: 2500,
    monthly_average: 208,
    favorite_program: 'Programa de Alimentación',
    member_since: '2023-06-15T00:00:00Z',
    donation_streak: 5,
    my_donations: [
      {
        id: 'donation-123',
        donor_email: 'maria@example.com',
        amount_gtq: 185,
        status: 'APPROVED',
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 'donation-456',
        donor_email: 'maria@example.com',
        amount_gtq: 75,
        status: 'APPROVED',
        created_at: '2024-01-10T15:45:00Z'
      }
    ]
  }
}

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('DonorDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  test('renders loading state initially', () => {
    mockApi.get.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(
      <TestWrapper>
        <DonorDashboardPage />
      </TestWrapper>
    )

    expect(screen.getByText('Cargando tu dashboard...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  test('renders error state when API fails', async () => {
    const errorMessage = 'Error al cargar los datos del dashboard'
    mockApi.get.mockRejectedValue(new Error('API Error'))

    render(
      <TestWrapper>
        <DonorDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    expect(mockApi.get).toHaveBeenCalledWith('/dashboard/stats')
  })

  test('renders dashboard with stats and data on successful load', async () => {
    mockApi.get.mockResolvedValue({ data: mockDashboardData })

    render(
      <TestWrapper>
        <DonorDashboardPage />
      </TestWrapper>
    )

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Cargando tu dashboard...')).not.toBeInTheDocument()
    })

    // Check header
    expect(screen.getByText('Mi Panel de Donante')).toBeInTheDocument()
    expect(screen.getByText('Gracias por tu generosidad, María. Tu impacto es invaluable.')).toBeInTheDocument()

    // Check action buttons
    expect(screen.getByText('Nueva Donación')).toBeInTheDocument()
    expect(screen.getByText('Donar Ahora')).toBeInTheDocument()

    // Check stats cards
    expect(screen.getByText('12')).toBeInTheDocument() // total donations
    expect(screen.getByText('Q2,500')).toBeInTheDocument() // total amount
    expect(screen.getByText('Q208')).toBeInTheDocument() // monthly average
    expect(screen.getByText('Programa de Alimentación')).toBeInTheDocument() // favorite program

    // Check stat labels
    expect(screen.getByText('Donaciones Totales')).toBeInTheDocument()
    expect(screen.getByText('Total Donado')).toBeInTheDocument()
    expect(screen.getByText('Tu nivel actual')).toBeInTheDocument()
    expect(screen.getByText('Tu causa favorita')).toBeInTheDocument()

    // Check impact metrics
    expect(screen.getByText('Tu Impacto Generado')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument() // impact children
    expect(screen.getByText('2,250')).toBeInTheDocument() // meals provided
    expect(screen.getByText('180')).toBeInTheDocument() // evangelization hours

    // Check impact labels
    expect(screen.getByText('Niños beneficiados')).toBeInTheDocument()
    expect(screen.getByText('Comidas proporcionadas')).toBeInTheDocument()
    expect(screen.getByText('Horas de evangelización')).toBeInTheDocument()

    // Check recent donations
    expect(screen.getByText('Mis Donaciones Recientes')).toBeInTheDocument()
    expect(screen.getByText('Donación #donation-')).toBeInTheDocument()
    expect(screen.getByText('Q185')).toBeInTheDocument()
    expect(screen.getByText('Q75')).toBeInTheDocument()
  })

  test('displays donation streak and level information', async () => {
    mockApi.get.mockResolvedValue({ data: mockDashboardData })

    render(
      <TestWrapper>
        <DonorDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando tu dashboard...')).not.toBeInTheDocument()
    })

    // Check streak display
    expect(screen.getByText('5 meses consecutivos')).toBeInTheDocument()
    expect(screen.getByText('Donante Oro')).toBeInTheDocument()
    expect(screen.getByText('Donante Platino')).toBeInTheDocument()
  })

  test('renders upcoming programs with progress bars', async () => {
    mockApi.get.mockResolvedValue({ data: mockDashboardData })

    render(
      <TestWrapper>
        <DonorDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando tu dashboard...')).not.toBeInTheDocument()
    })

    // Check programs section
    expect(screen.getByText('Programas Activos')).toBeInTheDocument()
    expect(screen.getByText('Campaña de Verano')).toBeInTheDocument()
    expect(screen.getByText('Programa de Becas 2024')).toBeInTheDocument()
    expect(screen.getByText('Alimentación Escolar')).toBeInTheDocument()

    // Check progress values
    expect(screen.getByText('65%')).toBeInTheDocument()
    expect(screen.getByText('40%')).toBeInTheDocument()
    expect(screen.getByText('80%')).toBeInTheDocument()

    // Check monetary values
    expect(screen.getByText('Q9,750')).toBeInTheDocument()
    expect(screen.getByText('Q10,000')).toBeInTheDocument()
    expect(screen.getByText('Q9,600')).toBeInTheDocument()
  })

  test('renders quick actions sidebar', async () => {
    mockApi.get.mockResolvedValue({ data: mockDashboardData })

    render(
      <TestWrapper>
        <DonorDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando tu dashboard...')).not.toBeInTheDocument()
    })

    // Check quick actions
    expect(screen.getByText('Acciones Rápidas')).toBeInTheDocument()
    expect(screen.getAllByText('Nueva Donación')).toHaveLength(2) // Header and sidebar
    expect(screen.getByText('Mi Perfil')).toBeInTheDocument()
    expect(screen.getByText('Historial Completo')).toBeInTheDocument()
    expect(screen.getByText('Mis Recibos')).toBeInTheDocument()
  })

  test('displays approved donation status badges', async () => {
    mockApi.get.mockResolvedValue({ data: mockDashboardData })

    render(
      <TestWrapper>
        <DonorDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando tu dashboard...')).not.toBeInTheDocument()
    })

    // Check status badges
    expect(screen.getAllByText('Aprobado')).toHaveLength(2)
    expect(screen.getAllByText('Recibo disponible')).toHaveLength(2)
  })

  test('handles empty donations list', async () => {
    const emptyData = {
      stats: {
        ...mockDashboardData.stats,
        my_donations: []
      }
    }

    mockApi.get.mockResolvedValue({ data: emptyData })

    render(
      <TestWrapper>
        <DonorDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando tu dashboard...')).not.toBeInTheDocument()
    })

    // Check empty state message
    expect(screen.getByText('Aún no has realizado donaciones')).toBeInTheDocument()
  })

  test('formats numbers correctly', async () => {
    const largeNumbersData = {
      stats: {
        ...mockDashboardData.stats,
        total_amount_gtq: 1000000,
        monthly_average: 83333
      }
    }

    mockApi.get.mockResolvedValue({ data: largeNumbersData })

    render(
      <TestWrapper>
        <DonorDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando tu dashboard...')).not.toBeInTheDocument()
    })

    // Check formatted numbers
    expect(screen.getByText('Q1,000,000')).toBeInTheDocument()
    expect(screen.getByText('Q83,333')).toBeInTheDocument()
  })

  test('calls API on component mount', async () => {
    mockApi.get.mockResolvedValue({ data: mockDashboardData })

    render(
      <TestWrapper>
        <DonorDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/dashboard/stats')
    })
  })

  test('renders navigation links correctly', async () => {
    mockApi.get.mockResolvedValue({ data: mockDashboardData })

    render(
      <TestWrapper>
        <DonorDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando tu dashboard...')).not.toBeInTheDocument()
    })

    // Check various navigation links
    expect(screen.getByText('Ver todas')).toBeInTheDocument()
    expect(screen.getByText('Ver todos los programas')).toBeInTheDocument()
  })
})