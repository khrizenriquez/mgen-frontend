/**
 * DonorInformation Component Tests
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import DonorInformation from '../DonorInformation'

describe('DonorInformation', () => {
  const mockOnComplete = vi.fn()
  const mockOnBack = vi.fn()
  const mockDonationData = {
    donationType: 'money',
    amount: 100
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders donor information form', () => {
    render(
      <DonorInformation
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    expect(screen.getByText('Tu información')).toBeInTheDocument()
    expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Número de teléfono/i)).toBeInTheDocument()
  })

  test('validates Guatemala phone number format - local format', async () => {
    render(
      <DonorInformation
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const phoneInput = screen.getByLabelText(/Número de teléfono/i)
    const submitButton = screen.getByText('Continuar')

    // Test invalid phone - too short
    fireEvent.change(phoneInput, { target: { value: '1234567' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/El número debe tener exactamente 8 dígitos/i)).toBeInTheDocument()
    })

    // Test invalid phone - doesn't start with 2-7
    fireEvent.change(phoneInput, { target: { value: '12345678' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/El número debe iniciar con dígito del 2 al 7/i)).toBeInTheDocument()
    })
  })

  test('validates Guatemala phone number format - international format', async () => {
    render(
      <DonorInformation
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const phoneInput = screen.getByLabelText(/Número de teléfono/i)
    const submitButton = screen.getByText('Continuar')

    // Test invalid international - too few digits
    fireEvent.change(phoneInput, { target: { value: '+502 1234567' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/El número debe tener 8 dígitos después del código \+502/i)).toBeInTheDocument()
    })
  })

  test('validates Guatemala phone number format - valid phone', async () => {
    render(
      <DonorInformation
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const nameInput = screen.getByLabelText(/Nombre completo/i)
    const emailInput = screen.getByLabelText(/Correo electrónico/i)
    const phoneInput = screen.getByLabelText(/Número de teléfono/i)
    const submitButton = screen.getByText('Continuar')

    // Fill form with valid data
    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } })
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } })
    fireEvent.change(phoneInput, { target: { value: '55443322' } }) // Valid Guatemala number
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith({
        donor: expect.objectContaining({
          fullName: 'Juan Pérez',
          email: 'juan@example.com',
          phone: '55443322'
        })
      })
    })
  })

  test('validates required fields', async () => {
    render(
      <DonorInformation
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const submitButton = screen.getByText('Continuar')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/El nombre completo es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/El correo electrónico es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/El número de teléfono es requerido/i)).toBeInTheDocument()
    })
  })

  test('calls onBack when back button is clicked', () => {
    render(
      <DonorInformation
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const backButton = screen.getByText('Anterior')
    fireEvent.click(backButton)

    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })
})

