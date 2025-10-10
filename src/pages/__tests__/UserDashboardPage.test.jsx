/**
 * UserDashboardPage Component Tests
 */
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import UserDashboardPage from '../UserDashboardPage'
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
    total_donations: 8,
    total_amount_gtq: 1200,
    member_since: '2023-09-15T00:00:00Z'
  },
  recent_activity: [
    {
      type: 'donation',
      message: 'Realizaste una donación de Q185',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      type: 'view',
      message: 'Viste el programa de alimentación',
      timestamp: '2024-01-14T15:45:00Z'
    },
    {
      type: 'profile',
      message: 'Actualizaste tu información de perfil',
      timestamp: '2024-01-13T09:20:00Z'
    }
  ]
}

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('UserDashboardPage', () => {
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
        <UserDashboardPage />
      </TestWrapper>
    )

    expect(screen.getByText('Cargando dashboard...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  test('renders error state when API fails', async () => {
    const errorMessage = 'Error al cargar los datos del dashboard'
    mockApi.get.mockRejectedValue(new Error('API Error'))

    render(
      <TestWrapper>
        <UserDashboardPage />
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
        <UserDashboardPage />
      </TestWrapper>
    )

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument()
    })

    // Check header
    expect(screen.getByText('Mi Panel')).toBeInTheDocument()
    expect(screen.getByText('Bienvenido de vuelta, Juan. Aquí está tu resumen.')).toBeInTheDocument()

    // Check action button
    expect(screen.getByText('Hacer Donación')).toBeInTheDocument()

    // Check stats cards
    expect(screen.getByText('8')).toBeInTheDocument() // total donations
    expect(screen.getByText('Q1,200')).toBeInTheDocument() // total amount
    expect(screen.getByText('Q3,000')).toBeInTheDocument() // next milestone

    // Check stat labels
    expect(screen.getByText('Donaciones Realizadas')).toBeInTheDocument()
    expect(screen.getByText('Total Donado')).toBeInTheDocument()
    expect(screen.getByText('Próximo Hito')).toBeInTheDocument()

    // Check progress information
    expect(screen.getByText('Q1,800 restantes')).toBeInTheDocument()

    // Check quick actions
    expect(screen.getByText('Acciones Rápidas')).toBeInTheDocument()
    expect(screen.getByText('Nueva Donación')).toBeInTheDocument()
    expect(screen.getByText('Ver Donaciones')).toBeInTheDocument()
    expect(screen.getByText('Estadísticas')).toBeInTheDocument()

    // Check recent activity
    expect(screen.getByText('Actividad Reciente')).toBeInTheDocument()
    expect(screen.getByText('Realizaste una donación de Q185')).toBeInTheDocument()
    expect(screen.getByText('Viste el programa de alimentación')).toBeInTheDocument()
    expect(screen.getByText('Actualizaste tu información de perfil')).toBeInTheDocument()
  })

  test('displays progress bar correctly', async () => {
    mockApi.get.mockResolvedValue({ data: mockDashboardData })

    render(
      <TestWrapper>
        <UserDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument()
    })

    // Progress should be 40% (1200/3000)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '40')
  })

  test('renders upcoming events with correct icons', async () => {
    mockApi.get.mockResolvedValue({ data: mockDashboardData })

    render(
      <TestWrapper>
        <UserDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument()
    })

    // Check events section
    expect(screen.getByText('Próximos Eventos')).toBeInTheDocument()
    expect(screen.getByText('Campaña de Navidad')).toBeInTheDocument()
    expect(screen.getByText('Día del Niño')).toBeInTheDocument()
    expect(screen.getByText('Programa de Becas')).toBeInTheDocument()

    // Check event descriptions
    expect(screen.getByText('Ayuda a los niños en Navidad')).toBeInTheDocument()
    expect(screen.getByText('Celebración especial para los niños')).toBeInTheDocument()
    expect(screen.getByText('Apoyo educativo continuo')).toBeInTheDocument()
  })

  test('displays user information in sidebar', async () => {
    mockApi.get.mockResolvedValue({ data: mockDashboardData })

    render(
      <TestWrapper>
        <UserDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument()
    })

    // Check user info section
    expect(screen.getByText('Mi Información')).toBeInTheDocument()
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    expect(screen.getByText('juan@example.com')).toBeInTheDocument()
    expect(screen.getByText('Usuario Activo')).toBeInTheDocument()
    expect(screen.getByText('Miembro desde')).toBeInTheDocument()
  })

  test('handles empty recent activity', async () => {
    const emptyData = {
      stats: mockDashboardData.stats,
      recent_activity: []
    }

    mockApi.get.mockResolvedValue({ data: emptyData })

    render(
      <TestWrapper>
        <UserDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument()
    })

    // Check empty state
    expect(screen.getByText('No hay actividad reciente')).toBeInTheDocument()
  })

  test('formats numbers correctly', async () => {
    const largeNumbersData = {
      stats: {
        ...mockDashboardData.stats,
        total_amount_gtq: 1000000,
        nextMilestone: 5000000
      }
    }

    mockApi.get.mockResolvedValue({ data: largeNumbersData })

    render(
      <TestWrapper>
        <UserDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument()
    })

    // Check formatted numbers
    expect(screen.getByText('Q1,000,000')).toBeInTheDocument()
  })

  test('displays activity icons correctly', async () => {
    mockApi.get.mockResolvedValue({ data: mockDashboardData })

    render(
      <TestWrapper>
        <UserDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument()
    })

    // The icons are rendered but we can check that the activity items are present
    expect(screen.getAllByText('Actividad del sistema')).toHaveLength(3)
  })

  test('calls API on component mount', async () => {
    mockApi.get.mockResolvedValue({ data: mockDashboardData })

    render(
      <TestWrapper>
        <UserDashboardPage />
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
        <UserDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument()
    })

    // Check various navigation links
    expect(screen.getByText('Ver todo')).toBeInTheDocument()
    expect(screen.getByText('Ver todos los eventos')).toBeInTheDocument()
  })

  test('handles zero donations gracefully', async () => {
    const zeroData = {
      stats: {
        total_donations: 0,
        total_amount_gtq: 0,
        member_since: '2023-09-15T00:00:00Z'
      },
      recent_activity: []
    }

    mockApi.get.mockResolvedValue({ data: zeroData })

    render(
      <TestWrapper>
        <UserDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument()
    })

    // Check zero values are displayed
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('Q0')).toBeInTheDocument()
  })
})