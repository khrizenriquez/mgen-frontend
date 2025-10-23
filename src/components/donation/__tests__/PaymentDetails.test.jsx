/**
 * PaymentDetails Component Tests
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import PaymentDetails from '../PaymentDetails'

describe('PaymentDetails', () => {
  const mockOnComplete = vi.fn()
  const mockOnBack = vi.fn()
  const mockDonationData = {
    donationType: 'money',
    amount: 100,
    donor: {
      fullName: 'Juan Pérez'
    }
  }
  const mockOrganization = {
    name: 'Más Generosidad'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders payment form for money donations', () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    expect(screen.getByText('Detalles de pago')).toBeInTheDocument()
    expect(screen.getByLabelText(/Número de tarjeta/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Fecha de expiración/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/CVC/i)).toBeInTheDocument()
  })

  test('validates expiration date format MM/YYYY', async () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const expiryInput = screen.getByLabelText(/Fecha de expiración/i)
    const submitButton = screen.getByText(/Procesar donación/i)

    // Test invalid format
    fireEvent.change(expiryInput, { target: { value: '12/25' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Formato inválido \(MM\/YYYY\)/i)).toBeInTheDocument()
    })
  })

  test('accepts valid expiration date format MM/YYYY', async () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const cardNumberInput = screen.getByLabelText(/Número de tarjeta/i)
    const expiryInput = screen.getByLabelText(/Fecha de expiración/i)
    const cvcInput = screen.getByLabelText(/CVC/i)
    const cardholderInput = screen.getByLabelText(/Nombre del titular/i)

    // Fill form with valid data
    fireEvent.change(cardNumberInput, { target: { value: '4111111111111111' } })
    fireEvent.change(expiryInput, { target: { value: '12/2025' } })
    fireEvent.change(cvcInput, { target: { value: '123' } })
    fireEvent.change(cardholderInput, { target: { value: 'Juan Pérez' } })

    // The form should not show expiration date error
    await waitFor(() => {
      const expiryError = screen.queryByText(/Formato inválido/i)
      expect(expiryError).not.toBeInTheDocument()
    }, { timeout: 1000 })
  })

  test('validates expired card', async () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const expiryInput = screen.getByLabelText(/Fecha de expiración/i)
    const submitButton = screen.getByText(/Procesar donación/i)

    // Use expired date
    fireEvent.change(expiryInput, { target: { value: '01/2020' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/La tarjeta ha expirado/i)).toBeInTheDocument()
    })
  })

  test('validates invalid month in expiration date', async () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const cardNumberInput = screen.getByLabelText(/Número de tarjeta/i)
    const expiryInput = screen.getByLabelText(/Fecha de expiración/i)
    const cvcInput = screen.getByLabelText(/CVC/i)
    const cardholderInput = screen.getByLabelText(/Nombre del titular/i)
    const submitButton = screen.getByText(/Procesar donación/i)

    // Fill with invalid month
    fireEvent.change(cardNumberInput, { target: { value: '4111111111111111' } })
    fireEvent.change(expiryInput, { target: { value: '13/2025' } })
    fireEvent.change(cvcInput, { target: { value: '123' } })
    fireEvent.change(cardholderInput, { target: { value: 'Juan Pérez' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Mes inválido \(01-12\)/i)).toBeInTheDocument()
    })
  })

  test('has maxLength of 7 for expiration date field', () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const expiryInput = screen.getByLabelText(/Fecha de expiración/i)
    expect(expiryInput).toHaveAttribute('maxLength', '7')
    expect(expiryInput).toHaveAttribute('placeholder', 'MM/YYYY')
  })

  test('skips payment for non-money donations', () => {
    const nonMoneyDonation = {
      ...mockDonationData,
      donationType: 'volunteer'
    }

    render(
      <PaymentDetails
        donationData={nonMoneyDonation}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    // Should show different UI for non-money donations
    expect(screen.getByText(/¡Casi listo!/i)).toBeInTheDocument()
    expect(screen.queryByText('Detalles de pago')).not.toBeInTheDocument()
  })

  test('calls onBack when back button is clicked', () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const backButton = screen.getByText('Anterior')
    fireEvent.click(backButton)

    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })
})

