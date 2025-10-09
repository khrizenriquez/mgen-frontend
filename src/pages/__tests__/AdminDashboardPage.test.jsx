/**
 * AdminDashboardPage Component Tests
 */
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AdminDashboardPage from '../AdminDashboardPage'
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
    total_users: 1250,
    active_users: 980,
    total_donations: 3456,
    total_amount_gtq: 125000,
    pending_donations: 23,
    recent_users: [
      {
        id: 'user-123',
        email: 'juan@example.com',
        roles: ['USER'],
        status: 'active',
        joined_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 'user-456',
        email: 'maria@example.com',
        roles: ['DONOR'],
        status: 'active',
        joined_at: '2024-01-14T15:45:00Z'
      }
    ],
    recent_donations: [
      {
        id: 'donation-789',
        donor_name: 'Juan Pérez',
        donor_email: 'juan@example.com',
        amount_gtq: 185,
        status: 'APPROVED'
      },
      {
        id: 'donation-101',
        donor_name: 'María García',
        donor_email: 'maria@example.com',
        amount_gtq: 75,
        status: 'PENDING'
      }
    ]
  }
}

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('AdminDashboardPage', () => {
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
        <AdminDashboardPage />
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
        <AdminDashboardPage />
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
        <AdminDashboardPage />
      </TestWrapper>
    )

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument()
    })

    // Check header
    expect(screen.getByText('Panel de Administración')).toBeInTheDocument()
    expect(screen.getByText('Gestión completa del sistema de donaciones')).toBeInTheDocument()

    // Check stats cards
    expect(screen.getByText('1,250')).toBeInTheDocument() // total users
    expect(screen.getByText('Q125,000')).toBeInTheDocument() // total amount
    expect(screen.getByText('23')).toBeInTheDocument() // pending donations
    expect(screen.getByText('98%')).toBeInTheDocument() // system health

    // Check stat labels
    expect(screen.getByText('Usuarios Totales')).toBeInTheDocument()
    expect(screen.getByText('Total Donado')).toBeInTheDocument()
    expect(screen.getByText('Donaciones Pendientes')).toBeInTheDocument()
    expect(screen.getByText('Estado del Sistema')).toBeInTheDocument()

    // Check quick actions
    expect(screen.getByText('Gestionar Usuarios')).toBeInTheDocument()
    expect(screen.getByText('Revisar Donaciones')).toBeInTheDocument()
    expect(screen.getByText('Ver Reportes')).toBeInTheDocument()
    expect(screen.getByText('Configuración')).toBeInTheDocument()

    // Check recent users table
    expect(screen.getByText('Usuarios Recientes')).toBeInTheDocument()
    expect(screen.getByText('juan@example.com')).toBeInTheDocument()
    expect(screen.getByText('maria@example.com')).toBeInTheDocument()

    // Check recent donations table
    expect(screen.getByText('Donaciones Recientes')).toBeInTheDocument()
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    expect(screen.getByText('María García')).toBeInTheDocument()
    expect(screen.getByText('Q185')).toBeInTheDocument()
    expect(screen.getByText('Q75')).toBeInTheDocument()
  })

  test('displays status badges correctly', async () => {
    mockApi.get.mockResolvedValue({ data: mockDashboardData })

    render(
      <TestWrapper>
        <AdminDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument()
    })

    // Check status badges
    expect(screen.getAllByText('Activo')).toHaveLength(2) // Two active users
    expect(screen.getByText('Aprobado')).toBeInTheDocument() // Approved donation
    expect(screen.getByText('Pendiente')).toBeInTheDocument() // Pending donation
  })

  test('displays role badges correctly', async () => {
    mockApi.get.mockResolvedValue({ data: mockDashboardData })

    render(
      <TestWrapper>
        <AdminDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument()
    })

    // Check role badges
    expect(screen.getByText('Usuario')).toBeInTheDocument() // USER role
    expect(screen.getByText('Donante')).toBeInTheDocument() // DONOR role
  })

  test('renders action buttons with correct links', async () => {
    mockApi.get.mockResolvedValue({ data: mockDashboardData })

    render(
      <TestWrapper>
        <AdminDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument()
    })

    // Check export and settings buttons
    expect(screen.getByText('Exportar Reporte')).toBeInTheDocument()
    expect(screen.getByText('Configuración')).toBeInTheDocument()

    // Check "Ver todos" links
    expect(screen.getAllByText('Ver todos')).toHaveLength(2)
    expect(screen.getByText('Ver todas')).toBeInTheDocument()
  })

  test('handles empty data gracefully', async () => {
    const emptyData = {
      stats: {
        total_users: 0,
        active_users: 0,
        total_donations: 0,
        total_amount_gtq: 0,
        pending_donations: 0,
        recent_users: [],
        recent_donations: []
      }
    }

    mockApi.get.mockResolvedValue({ data: emptyData })

    render(
      <TestWrapper>
        <AdminDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument()
    })

    // Check zero values are displayed
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('Q0')).toBeInTheDocument()

    // Tables should be empty but headers should still be there
    expect(screen.getByText('Usuarios Recientes')).toBeInTheDocument()
    expect(screen.getByText('Donaciones Recientes')).toBeInTheDocument()
  })

  test('calls API on component mount', async () => {
    mockApi.get.mockResolvedValue({ data: mockDashboardData })

    render(
      <TestWrapper>
        <AdminDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/dashboard/stats')
    })
  })

  test('formats numbers correctly', async () => {
    const largeNumbersData = {
      stats: {
        total_users: 1000000,
        active_users: 750000,
        total_donations: 50000,
        total_amount_gtq: 5000000,
        pending_donations: 1000,
        recent_users: [],
        recent_donations: []
      }
    }

    mockApi.get.mockResolvedValue({ data: largeNumbersData })

    render(
      <TestWrapper>
        <AdminDashboardPage />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument()
    })

    // Check formatted numbers
    expect(screen.getByText('1,000,000')).toBeInTheDocument() // total users
    expect(screen.getByText('Q5,000,000')).toBeInTheDocument() // total amount
  })
})