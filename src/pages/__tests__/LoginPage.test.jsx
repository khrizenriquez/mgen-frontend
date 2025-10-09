/**
 * LoginPage Component Tests
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { vi } from 'vitest'
import LoginPage from '../LoginPage'
import AuthService from '../../core/services/AuthService'
import i18n from '../../i18n'

// Mock AuthService
vi.mock('../../core/services/AuthService', () => ({
  default: {
    login: vi.fn(),
    getDashboardRoute: vi.fn()
  }
}))

// Mock react-router-dom useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn(),
    useParams: vi.fn(),
  }
})

// Test wrapper component
const TestWrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </I18nextProvider>
)

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders login form correctly', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    expect(screen.getByText('Tu cuenta en')).toBeInTheDocument()
    expect(screen.getByText('Ingresa tu correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeInTheDocument()
  })

  test('shows validation errors for empty fields', async () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    const submitButton = screen.getByRole('button', { name: 'Siguiente' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('El correo electrónico es requerido')).toBeInTheDocument()
      expect(screen.getByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument()
    })
  })

  test('shows validation error for invalid email', async () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText('Correo electrónico')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)

    await waitFor(() => {
      expect(screen.getByText('Ingresa un correo electrónico válido')).toBeInTheDocument()
    })
  })

  test('shows validation error for short password', async () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    const passwordInput = screen.getByLabelText('Contraseña')
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.blur(passwordInput)

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument()
    })
  })

  test('submits form with valid data', async () => {
    AuthService.login.mockResolvedValue({ success: true, user: { id: 1, email: 'test@example.com' } })
    AuthService.getDashboardRoute.mockReturnValue('/dashboard')

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText('Correo electrónico')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: 'Siguiente' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    expect(AuthService.getDashboardRoute).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
  })

  test('shows error message on login failure', async () => {
    const errorMessage = 'Credenciales inválidas'
    AuthService.login.mockRejectedValue(new Error(errorMessage))

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText('Correo electrónico')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: 'Siguiente' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  test('shows loading state during form submission', async () => {
    AuthService.login.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    )

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText('Correo electrónico')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: 'Siguiente' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
    // The component uses LoadingSpinner, not text change
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled()

    await waitFor(() => {
      expect(screen.queryByText('Iniciando sesión...')).not.toBeInTheDocument()
    })
  })

  test('contains links to register and forgot password pages', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    )

    expect(screen.getByRole('link', { name: /crear cuenta nueva/i })).toHaveAttribute('href', '/register')
    expect(screen.getByRole('link', { name: /o regresa al paso anterior/i })).toHaveAttribute('href', '/forgot-password')
  })
})