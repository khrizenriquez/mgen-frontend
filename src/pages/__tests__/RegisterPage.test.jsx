/**
 * RegisterPage Component Tests
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { vi } from 'vitest'
import RegisterPage from '../RegisterPage'
import AuthService from '../../core/services/AuthService'
import i18n from '../../i18n'

// Mock AuthService
vi.mock('../../core/services/AuthService', () => ({
  default: {
    register: vi.fn()
  }
}))

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'auth.register.title': 'Crear cuenta nueva',
        'auth.register.subtitle': 'Completa la información para registrarte',
        'auth.register.name.label': 'Nombre completo',
        'auth.register.name.placeholder': 'tu nombre completo',
        'auth.register.email.label': 'Correo electrónico',
        'auth.register.email.placeholder': 'tu email',
        'auth.register.password.label': 'Contraseña',
        'auth.register.password.placeholder': 'tu contraseña',
        'auth.register.confirmPassword.label': 'Confirmar contraseña',
        'auth.register.confirmPassword.placeholder': 'confirma tu contraseña',
        'auth.register.submit': 'Crear cuenta',
        'auth.register.loading': 'Creando cuenta...',
        'auth.register.hasAccount': '¿Ya tienes cuenta?',
        'auth.register.login': 'Iniciar sesión',
        'auth.register.success.title': '¡Cuenta creada!',
        'auth.register.success.subtitle': 'Tu cuenta ha sido creada exitosamente',
        'auth.register.success.loginButton': 'Iniciar sesión',
        'auth.register.error.generic': 'Error al crear la cuenta. Intenta nuevamente.',
        'auth.validation.email.required': 'El correo electrónico es requerido',
        'auth.validation.email.invalid': 'Ingresa un correo electrónico válido',
        'auth.validation.password.required': 'La contraseña es requerida',
        'auth.validation.password.minLength': 'La contraseña debe tener al menos 8 caracteres',
        'auth.validation.password.strength': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
        'auth.validation.name.required': 'El nombre es requerido',
        'auth.validation.name.minLength': 'El nombre debe tener al menos 2 caracteres',
        'auth.validation.name.maxLength': 'El nombre no puede tener más de 50 caracteres',
        'auth.validation.confirmPassword.required': 'Confirma tu contraseña',
        'auth.validation.confirmPassword.match': 'Las contraseñas deben coincidir',
        'auth.validation.terms.required': 'Debes aceptar los términos y condiciones'
      }
      return translations[key] || key
    }
  }),
  I18nextProvider: ({ children }) => children
}))

// Test wrapper component
const TestWrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </I18nextProvider>
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
      expect(screen.getByText('El nombre debe tener al menos 2 caracteres')).toBeInTheDocument()
      expect(screen.getByText('El correo electrónico es requerido')).toBeInTheDocument()
      expect(screen.getByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument()
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
      expect(screen.getByRole('link', { name: /Iniciar sesión/i })).toHaveAttribute('href', '/login')
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

    expect(submitButton).toBeDisabled()
    // The component uses LoadingSpinner, not text change
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeDisabled()

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

    expect(screen.getByRole('link', { name: /Iniciar sesión/i })).toHaveAttribute('href', '/login')
  })
})