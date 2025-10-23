/**
 * DonatePage Component Tests
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import DonatePage from '../DonatePage'

describe('DonatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders donation amount selection', () => {
    render(<DonatePage />)

    expect(screen.getByText(/Más Generosidad/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Continuar/i })).toBeInTheDocument()
  })

  test('allows selecting suggested amount', () => {
    render(<DonatePage />)

    // Select first suggested amount (Q185)
    const amountButton = screen.getByText('185')
    fireEvent.click(amountButton)

    const continueButton = screen.getByRole('button', { name: /Continuar/i })
    expect(continueButton).not.toBeDisabled()
  })

  test('validates terms and conditions checkbox is required', async () => {
    render(<DonatePage />)

    // Select amount
    const amountButton = screen.getByText('185')
    fireEvent.click(amountButton)

    // Continue to details step
    const continueButton = screen.getByRole('button', { name: /Continuar/i })
    fireEvent.click(continueButton)

    await waitFor(() => {
      // Should be on details step
      expect(screen.getByLabelText(/Nombre del donante/i)).toBeInTheDocument()
    })

    // Fill in all required fields
    const nameInput = screen.getByLabelText(/Nombre del donante/i)
    const emailInput = screen.getByLabelText(/Correo electrónico/i)
    const cardInput = screen.getByLabelText(/Número de tarjeta/i)
    const expiryInput = screen.getByLabelText(/Fecha de expiración/i)
    const cvcInput = screen.getByLabelText(/CVC/i)

    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } })
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } })
    fireEvent.change(cardInput, { target: { value: '4111111111111111' } })
    fireEvent.change(expiryInput, { target: { value: '12/2025' } })
    fireEvent.change(cvcInput, { target: { value: '123' } })

    // Make sure terms checkbox is NOT checked
    const termsCheckbox = screen.getByLabelText(/Al avanzar, aceptas nuestros términos/i)
    if (termsCheckbox.checked) {
      fireEvent.click(termsCheckbox)
    }

    // Submit button should be disabled when terms not accepted
    const submitButton = screen.getByRole('button', { name: /Realizar donación/i })
    expect(submitButton).toBeDisabled()
  })

  test('enables submit when terms and conditions are accepted', async () => {
    render(<DonatePage />)

    // Select amount
    const amountButton = screen.getByText('185')
    fireEvent.click(amountButton)

    // Continue to details step
    const continueButton = screen.getByRole('button', { name: /Continuar/i })
    fireEvent.click(continueButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/Nombre del donante/i)).toBeInTheDocument()
    })

    // Fill in all required fields
    const nameInput = screen.getByLabelText(/Nombre del donante/i)
    const emailInput = screen.getByLabelText(/Correo electrónico/i)
    const cardInput = screen.getByLabelText(/Número de tarjeta/i)
    const expiryInput = screen.getByLabelText(/Fecha de expiración/i)
    const cvcInput = screen.getByLabelText(/CVC/i)

    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } })
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } })
    fireEvent.change(cardInput, { target: { value: '4111111111111111' } })
    fireEvent.change(expiryInput, { target: { value: '12/2025' } })
    fireEvent.change(cvcInput, { target: { value: '123' } })

    // Accept terms and conditions
    const termsCheckbox = screen.getByLabelText(/Al avanzar, aceptas nuestros términos/i)
    fireEvent.click(termsCheckbox)

    // Submit button should be enabled
    const submitButton = screen.getByRole('button', { name: /Realizar donación/i })
    expect(submitButton).not.toBeDisabled()
  })

  test('displays terms and conditions checkbox', () => {
    render(<DonatePage />)

    // Navigate to details step
    const amountButton = screen.getByText('185')
    fireEvent.click(amountButton)

    const continueButton = screen.getByRole('button', { name: /Continuar/i })
    fireEvent.click(continueButton)

    // Wait for details step and check for terms checkbox
    waitFor(() => {
      const termsCheckbox = screen.getByLabelText(/Al avanzar, aceptas nuestros términos/i)
      expect(termsCheckbox).toBeInTheDocument()
      expect(termsCheckbox).toHaveAttribute('type', 'checkbox')
      expect(termsCheckbox).toHaveAttribute('required')
    })
  })

  test('can go back from details to amount selection', async () => {
    render(<DonatePage />)

    // Select amount
    const amountButton = screen.getByText('185')
    fireEvent.click(amountButton)

    // Continue to details
    const continueButton = screen.getByRole('button', { name: /Continuar/i })
    fireEvent.click(continueButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/Nombre del donante/i)).toBeInTheDocument()
    })

    // Click back button
    const backButton = screen.getByText('Regresar')
    fireEvent.click(backButton)

    // Should be back at amount selection
    await waitFor(() => {
      expect(screen.getByText('185')).toBeInTheDocument()
    })
  })
})

