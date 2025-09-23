/**
 * RegisterPage Component Tests
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import RegisterPage from '../RegisterPage'
import AuthService from '../../core/services/AuthService'

// Mock AuthService
vi.mock('../../core/services/AuthService', () => ({
  default: {
    register: vi.fn()
  }
}))

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders registration form correctly', () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    )

    expect(screen.getByText('Crear cuenta nueva')).toBeInTheDocument()
    expect(screen.getByText('Completa la información para registrarte')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmar contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument()
  })

  test('shows validation errors for empty fields', async () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    )

    const submitButton = screen.getByRole('button', { name: 'Crear cuenta' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument()
      expect(screen.getByText('El correo electrónico es requerido')).toBeInTheDocument()
      expect(screen.getByText('La contraseña es requerida')).toBeInTheDocument()
      expect(screen.getByText('Confirma tu contraseña')).toBeInTheDocument()
    })
  })

  test('shows validation error for invalid email', async () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText('Correo electrónico')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)

    await waitFor(() => {
      expect(screen.getByText('Ingresa un correo electrónico válido')).toBeInTheDocument()
    })
  })

  test('shows validation error for short name', async () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    )

    const nameInput = screen.getByLabelText('Nombre completo')
    fireEvent.change(nameInput, { target: { value: 'A' } })
    fireEvent.blur(nameInput)

    await waitFor(() => {
      expect(screen.getByText('El nombre debe tener al menos 2 caracteres')).toBeInTheDocument()
    })
  })

  test('shows validation error for weak password', async () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    )

    const passwordInput = screen.getByLabelText('Contraseña')
    fireEvent.change(passwordInput, { target: { value: 'weakpass' } })
    fireEvent.blur(passwordInput)

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe contener al menos una mayúscula, una minúscula y un número')).toBeInTheDocument()
    })
  })

  test('shows validation error when passwords do not match', async () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    )

    const passwordInput = screen.getByLabelText('Contraseña')
    const confirmPasswordInput = screen.getByLabelText('Confirmar contraseña')

    fireEvent.change(passwordInput, { target: { value: 'Password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass123' } })
    fireEvent.blur(confirmPasswordInput)

    await waitFor(() => {
      expect(screen.getByText('Las contraseñas deben coincidir')).toBeInTheDocument()
    })
  })

  test('shows validation error when terms are not accepted', async () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    )

    // Fill form with valid data but don't accept terms
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Password123' } })
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'Password123' } })

    const submitButton = screen.getByRole('button', { name: 'Crear cuenta' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Debes aceptar los términos y condiciones')).toBeInTheDocument()
    })
  })

  test('submits form with valid data', async () => {
    AuthService.register.mockResolvedValue({ success: true, user: { id: 1, email: 'john@example.com' } })

    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    )

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Password123' } })
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'Password123' } })
    fireEvent.click(screen.getByRole('checkbox'))

    const submitButton = screen.getByRole('button', { name: 'Crear cuenta' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(AuthService.register).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        acceptTerms: true
      })
    })
  })

  test('shows success screen after successful registration', async () => {
    AuthService.register.mockResolvedValue({ success: true, user: { id: 1, email: 'john@example.com' } })

    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    )

    // Fill and submit form
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Password123' } })
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'Password123' } })
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    await waitFor(() => {
      expect(screen.getByText('¡Cuenta creada!')).toBeInTheDocument()
      expect(screen.getByText('Tu cuenta ha sido creada exitosamente')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /iniciar sesión/i })).toHaveAttribute('href', '/login')
    })
  })

  test('shows error message on registration failure', async () => {
    const errorMessage = 'El correo ya está registrado'
    AuthService.register.mockRejectedValue(new Error(errorMessage))

    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    )

    // Fill and submit form
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Password123' } })
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'Password123' } })
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  test('shows loading state during form submission', async () => {
    AuthService.register.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    )

    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    )

    // Fill form
    fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Password123' } })
    fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: 'Password123' } })
    fireEvent.click(screen.getByRole('checkbox'))

    const submitButton = screen.getByRole('button', { name: 'Crear cuenta' })
    fireEvent.click(submitButton)

    expect(screen.getByText('Creando cuenta...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    await waitFor(() => {
      expect(screen.queryByText('Creando cuenta...')).not.toBeInTheDocument()
    })
  })

  test('contains link to login page', () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    )

    expect(screen.getByRole('link', { name: /iniciar sesión/i })).toHaveAttribute('href', '/login')
  })
})