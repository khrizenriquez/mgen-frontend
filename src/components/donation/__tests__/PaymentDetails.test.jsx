/**
 * PaymentDetails Component Tests
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PaymentDetails from '../PaymentDetails'

const mockDonationData = {
  amount: 185,
  donationType: 'money',
  donor: { fullName: 'Juan Pérez' }
}

const mockOrganization = {
  name: 'Más Generosidad'
}

const mockOnComplete = vi.fn()
const mockOnBack = vi.fn()

describe('PaymentDetails', () => {
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
    expect(screen.getByText('Monto a pagar: Q185')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('1234 5678 9012 3456')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('MM/AA')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('123')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nombre como aparece en la tarjeta')).toBeInTheDocument()
  })

  test('renders completion message for non-money donations', () => {
    const volunteerData = { ...mockDonationData, donationType: 'volunteer' }

    render(
      <PaymentDetails
        donationData={volunteerData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    expect(screen.getByText('¡Casi listo!')).toBeInTheDocument()
    expect(screen.getByText('Tu oferta de voluntariado está lista para ser enviada')).toBeInTheDocument()
  })

  test('formats card number correctly', () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456')
    fireEvent.change(cardInput, { target: { value: '1234567890123456', name: 'cardNumber' } })

    expect(cardInput.value).toBe('1234 5678 9012 3456')
  })

  test('formats expiry date correctly', () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const expiryInput = screen.getByPlaceholderText('MM/AA')
    fireEvent.change(expiryInput, { target: { value: '1225', name: 'expiryDate' } })

    expect(expiryInput.value).toBe('12/25')
  })

  test('limits CVC to 4 digits', () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const cvcInput = screen.getByPlaceholderText('123')
    fireEvent.change(cvcInput, { target: { value: '12345', name: 'cvc' } })

    expect(cvcInput.value).toBe('1234')
  })

  test('shows card type icon for Visa', () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456')
    fireEvent.change(cardInput, { target: { value: '4111111111111111', name: 'cardNumber' } })

    expect(document.querySelector('.bi-credit-card')).toBeInTheDocument()
  })

  test('shows validation errors for empty required fields', () => {
    const dataWithoutDonor = { ...mockDonationData, donor: {} }

    render(
      <PaymentDetails
        donationData={dataWithoutDonor}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const submitButton = screen.getByText('Procesar donación de Q185')
    fireEvent.click(submitButton)

    expect(screen.getByText('El número de tarjeta es requerido')).toBeInTheDocument()
    expect(screen.getByText('La fecha de expiración es requerida')).toBeInTheDocument()
    expect(screen.getByText('El código CVC es requerido')).toBeInTheDocument()
    expect(screen.getByText('El nombre del titular es requerido')).toBeInTheDocument()
  })

  test('validates card number length', () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456')
    fireEvent.change(cardInput, { target: { value: '123', name: 'cardNumber' } })

    const submitButton = screen.getByText('Procesar donación de Q185')
    fireEvent.click(submitButton)

    expect(screen.getByText('Número de tarjeta inválido')).toBeInTheDocument()
  })

  test('validates expiry date format', () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const expiryInput = screen.getByPlaceholderText('MM/AA')
    fireEvent.change(expiryInput, { target: { value: '1', name: 'expiryDate' } })

    const submitButton = screen.getByText('Procesar donación de Q185')
    fireEvent.click(submitButton)

    expect(screen.getByText('Formato inválido (MM/AA)')).toBeInTheDocument()
  })

  test('validates expired card', () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const expiryInput = screen.getByPlaceholderText('MM/AA')
    fireEvent.change(expiryInput, { target: { value: '01/20', name: 'expiryDate' } })

    const submitButton = screen.getByText('Procesar donación de Q185')
    fireEvent.click(submitButton)

    expect(screen.getByText('La tarjeta ha expirado')).toBeInTheDocument()
  })

  test('validates CVC format', () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const cvcInput = screen.getByPlaceholderText('123')
    fireEvent.change(cvcInput, { target: { value: '12', name: 'cvc' } })

    const submitButton = screen.getByText('Procesar donación de Q185')
    fireEvent.click(submitButton)

    expect(screen.getByText('CVC inválido (3-4 dígitos)')).toBeInTheDocument()
  })

  test('clears errors when user starts typing', () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    // Trigger error
    const submitButton = screen.getByText('Procesar donación de Q185')
    fireEvent.click(submitButton)
    expect(screen.getByText('El número de tarjeta es requerido')).toBeInTheDocument()

    // Start typing
    const cardInput = screen.getByPlaceholderText('1234 5678 9012 3456')
    fireEvent.change(cardInput, { target: { value: '4', name: 'cardNumber' } })

    // Error should be cleared
    expect(screen.queryByText('El número de tarjeta es requerido')).not.toBeInTheDocument()
  })

  test('shows processing state during payment', async () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    // Fill form with valid data
    fireEvent.change(screen.getByPlaceholderText('1234 5678 9012 3456'), {
      target: { value: '4111111111111111', name: 'cardNumber' }
    })
    fireEvent.change(screen.getByPlaceholderText('MM/AA'), {
      target: { value: '12/25', name: 'expiryDate' }
    })
    fireEvent.change(screen.getByPlaceholderText('123'), {
      target: { value: '123', name: 'cvc' }
    })
    fireEvent.change(screen.getByPlaceholderText('Nombre como aparece en la tarjeta'), {
      target: { value: 'Juan Pérez', name: 'cardholderName' }
    })

    const submitButton = screen.getByText('Procesar donación de Q185')
    fireEvent.click(submitButton)

    expect(screen.getByText('Procesando pago...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  test('calls onComplete with payment data after successful processing', async () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    // Fill form with valid data
    fireEvent.change(screen.getByPlaceholderText('1234 5678 9012 3456'), {
      target: { value: '4111111111111111', name: 'cardNumber' }
    })
    fireEvent.change(screen.getByPlaceholderText('MM/AA'), {
      target: { value: '12/25', name: 'expiryDate' }
    })
    fireEvent.change(screen.getByPlaceholderText('123'), {
      target: { value: '123', name: 'cvc' }
    })
    fireEvent.change(screen.getByPlaceholderText('Nombre como aparece en la tarjeta'), {
      target: { value: 'Juan Pérez', name: 'cardholderName' }
    })

    const submitButton = screen.getByText('Procesar donación de Q185')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith({
        payment: expect.objectContaining({
          cardNumber: '4111 1111 1111 1111',
          expiryDate: '12/25',
          cvc: '123',
          cardholderName: 'Juan Pérez',
          cardType: 'visa',
          lastFourDigits: '1111'
        })
      })
    }, { timeout: 3000 })
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

    expect(mockOnBack).toHaveBeenCalled()
  })

  test('opens security info modal', () => {
    render(
      <PaymentDetails
        donationData={mockDonationData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const securityButton = screen.getByText('Seguridad')
    fireEvent.click(securityButton)

    expect(screen.getByText('Seguridad en los pagos')).toBeInTheDocument()
    expect(screen.getByText('Encriptación SSL')).toBeInTheDocument()
  })

  test('calls onComplete for non-money donations', () => {
    const volunteerData = { ...mockDonationData, donationType: 'volunteer' }

    render(
      <PaymentDetails
        donationData={volunteerData}
        organization={mockOrganization}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const continueButton = screen.getByText('Continuar')
    fireEvent.click(continueButton)

    expect(mockOnComplete).toHaveBeenCalledWith({ payment: {} })
  })
})