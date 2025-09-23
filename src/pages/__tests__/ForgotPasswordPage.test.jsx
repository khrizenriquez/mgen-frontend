/**
 * ForgotPasswordPage Component Tests
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import ForgotPasswordPage from '../ForgotPasswordPage'
import AuthService from '../../core/services/AuthService'

// Mock AuthService
vi.mock('../../core/services/AuthService', () => ({
  default: {
    resetPassword: vi.fn()
  }
}))

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders forgot password form correctly', () => {
    render(
      <TestWrapper>
        <ForgotPasswordPage />
      </TestWrapper>
    )

    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument()
    expect(screen.getByText('Ingresa tu correo para recuperar el acceso')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Enviar instrucciones/i })).toBeInTheDocument()
    expect(screen.getByText(/No te preocupes, te ayudamos a recuperar tu cuenta/i)).toBeInTheDocument()
  })

  test('shows validation error for empty email field', async () => {
    render(
      <TestWrapper>
        <ForgotPasswordPage />
      </TestWrapper>
    )

    const submitButton = screen.getByRole('button', { name: /enviar instrucciones/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('El correo electrónico es requerido')).toBeInTheDocument()
    })
  })

  test('shows validation error for invalid email', async () => {
    render(
      <TestWrapper>
        <ForgotPasswordPage />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText('Correo electrónico')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)

    await waitFor(() => {
      expect(screen.getByText('Ingresa un correo electrónico válido')).toBeInTheDocument()
    })
  })

  test('submits form with valid email', async () => {
    AuthService.resetPassword.mockResolvedValue({ success: true, message: 'Correo enviado' })

    render(
      <TestWrapper>
        <ForgotPasswordPage />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText('Correo electrónico')
    const submitButton = screen.getByRole('button', { name: /enviar instrucciones/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(AuthService.resetPassword).toHaveBeenCalledWith('test@example.com')
    })
  })

  test('shows success screen after successful password reset request', async () => {
    AuthService.resetPassword.mockResolvedValue({ success: true, message: 'Correo enviado' })

    render(
      <TestWrapper>
        <ForgotPasswordPage />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText('Correo electrónico')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar instrucciones/i }))

    await waitFor(() => {
      expect(screen.getByText('Revisa tu correo')).toBeInTheDocument()
      expect(screen.getByText('Te hemos enviado las instrucciones')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /volver a iniciar sesión/i })).toHaveAttribute('href', '/login')
    })
  })

  test('shows error message on password reset failure', async () => {
    const errorMessage = 'El correo no está registrado'
    AuthService.resetPassword.mockRejectedValue(new Error(errorMessage))

    render(
      <TestWrapper>
        <ForgotPasswordPage />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText('Correo electrónico')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar instrucciones/i }))

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  test('shows loading state during form submission', async () => {
    AuthService.resetPassword.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    )

    render(
      <TestWrapper>
        <ForgotPasswordPage />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText('Correo electrónico')
    const submitButton = screen.getByRole('button', { name: /enviar instrucciones/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
    // The component uses LoadingSpinner, not text change
    expect(screen.getByRole('button', { name: /enviar instrucciones/i })).toBeDisabled()

    await waitFor(() => {
      expect(screen.queryByText('Enviando correo...')).not.toBeInTheDocument()
    })
  })

  test('contains navigation links', () => {
    render(
      <TestWrapper>
        <ForgotPasswordPage />
      </TestWrapper>
    )

    expect(screen.getByRole('link', { name: /volver al inicio de sesión/i })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: /crear cuenta nueva/i })).toHaveAttribute('href', '/register')
  })

  test('allows user to go back to form from success screen', async () => {
    AuthService.resetPassword.mockResolvedValue({ success: true })

    render(
      <TestWrapper>
        <ForgotPasswordPage />
      </TestWrapper>
    )

    // Submit form to go to success screen
    const emailInput = screen.getByLabelText('Correo electrónico')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar instrucciones/i }))

    await waitFor(() => {
      expect(screen.getByText('Revisa tu correo')).toBeInTheDocument()
    })

    // Click "Enviar correo nuevamente" button
    const resendButton = screen.getByRole('button', { name: /enviar correo nuevamente/i })
    fireEvent.click(resendButton)

    // Should be back to the form
    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
  })

  test('displays instructional content and icon', () => {
    render(
      <TestWrapper>
        <ForgotPasswordPage />
      </TestWrapper>
    )

    expect(screen.getByText(/no te preocupes, te ayudamos a recuperar tu cuenta/i)).toBeInTheDocument()
    expect(screen.getByText(/ingresa tu correo electrónico y te enviaremos las instrucciones/i)).toBeInTheDocument()
  })

  test('success screen shows proper instructions', async () => {
    AuthService.resetPassword.mockResolvedValue({ success: true })

    render(
      <TestWrapper>
        <ForgotPasswordPage />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText('Correo electrónico')
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /enviar instrucciones/i }))

    await waitFor(() => {
      expect(screen.getByText(/revisa tu bandeja de entrada y sigue las instrucciones/i)).toBeInTheDocument()
      expect(screen.getByText(/si no encuentras el correo, revisa tu carpeta de spam/i)).toBeInTheDocument()
      expect(screen.getByText('user@example.com')).toBeInTheDocument()
    })
  })
})