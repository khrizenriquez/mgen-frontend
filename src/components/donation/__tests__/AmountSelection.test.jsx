/**
 * AmountSelection Component Tests
 */
import { render, screen, fireEvent } from '@testing-library/react'
import AmountSelection from '../AmountSelection'

const mockOrganization = {
  name: 'Más Generosidad',
  suggestedAmounts: [185, 75, 35, 15],
  currency: 'Q'
}

const mockDonationData = {
  amount: 0,
  donationType: 'money'
}

const mockOnComplete = vi.fn()
const mockOnBack = vi.fn()

describe('AmountSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders donation type selection', () => {
    render(
      <AmountSelection
        organization={mockOrganization}
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    expect(screen.getByText('¿Cómo quieres contribuir?')).toBeInTheDocument()
    expect(screen.getByText('Donación en dinero')).toBeInTheDocument()
    expect(screen.getByText('Voluntariado')).toBeInTheDocument()
    expect(screen.getByText('Donación en especie')).toBeInTheDocument()
  })

  test('defaults to money donation type', () => {
    render(
      <AmountSelection
        organization={mockOrganization}
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    expect(screen.getByText('Selecciona el monto de tu donación')).toBeInTheDocument()
    expect(screen.getByText('Q185')).toBeInTheDocument()
    expect(screen.getByText('Q75')).toBeInTheDocument()
    expect(screen.getByText('Q35')).toBeInTheDocument()
    expect(screen.getByText('Q15')).toBeInTheDocument()
  })

  test('allows switching to volunteer donation type', () => {
    render(
      <AmountSelection
        organization={mockOrganization}
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const volunteerCard = screen.getByText('Voluntariado').closest('.card')
    fireEvent.click(volunteerCard)

    expect(screen.getByText('¡Gracias por querer ser voluntario!')).toBeInTheDocument()
    expect(screen.queryByText('Selecciona el monto de tu donación')).not.toBeInTheDocument()
  })

  test('allows switching to goods donation type', () => {
    render(
      <AmountSelection
        organization={mockOrganization}
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const goodsCard = screen.getByText('Donación en especie').closest('.card')
    fireEvent.click(goodsCard)

    expect(screen.getByRole('alert')).toHaveTextContent('Donación en especie')
    expect(screen.queryByText('Selecciona el monto de tu donación')).not.toBeInTheDocument()
  })

  test('allows selecting suggested amounts', () => {
    render(
      <AmountSelection
        organization={mockOrganization}
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const amountButton = screen.getByText('Q185')
    fireEvent.click(amountButton)

    expect(amountButton.closest('button')).toHaveClass('btn-primary')
  })

  test('allows custom amount input', () => {
    render(
      <AmountSelection
        organization={mockOrganization}
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const customAmountInput = screen.getByPlaceholderText('0.00')
    fireEvent.change(customAmountInput, { target: { value: '100' } })

    expect(customAmountInput.value).toBe('100')
  })

  test('shows amount summary when amount is selected', () => {
    render(
      <AmountSelection
        organization={mockOrganization}
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const amountButton = screen.getByText('Q185')
    fireEvent.click(amountButton)

    expect(screen.getByText('Monto a donar:')).toBeInTheDocument()
    expect(screen.getByText('Q185', { selector: '.fs-5' })).toBeInTheDocument()
  })

  test('shows validation error for amount below minimum', () => {
    render(
      <AmountSelection
        organization={mockOrganization}
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const customAmountInput = screen.getByPlaceholderText('0.00')
    fireEvent.change(customAmountInput, { target: { value: '3' } })

    const continueButton = screen.getByText('Continuar')
    fireEvent.click(continueButton)

    expect(screen.getByText('El monto mínimo de donación es Q5')).toBeInTheDocument()
  })

  test('shows validation error for empty amount', () => {
    render(
      <AmountSelection
        organization={mockOrganization}
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const continueButton = screen.getByText('Continuar')
    fireEvent.click(continueButton)

    expect(screen.getByText('Por favor selecciona o ingresa un monto válido')).toBeInTheDocument()
  })

  test('calls onComplete with correct data for money donation', () => {
    render(
      <AmountSelection
        organization={mockOrganization}
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const amountButton = screen.getByText('Q185')
    fireEvent.click(amountButton)

    const continueButton = screen.getByText('Continuar')
    fireEvent.click(continueButton)

    expect(mockOnComplete).toHaveBeenCalledWith({
      amount: 185,
      donationType: 'money',
      customAmount: ''
    })
  })

  test('calls onComplete with correct data for volunteer donation', () => {
    render(
      <AmountSelection
        organization={mockOrganization}
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const volunteerCard = screen.getByText('Voluntariado').closest('.card')
    fireEvent.click(volunteerCard)

    const continueButton = screen.getByText('Continuar')
    fireEvent.click(continueButton)

    expect(mockOnComplete).toHaveBeenCalledWith({
      amount: 0,
      donationType: 'volunteer',
      customAmount: ''
    })
  })

  test('calls onComplete with correct data for goods donation', () => {
    render(
      <AmountSelection
        organization={mockOrganization}
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const goodsCard = screen.getByText('Donación en especie').closest('.card')
    fireEvent.click(goodsCard)

    const continueButton = screen.getByText('Continuar')
    fireEvent.click(continueButton)

    expect(mockOnComplete).toHaveBeenCalledWith({
      amount: 0,
      donationType: 'goods',
      customAmount: ''
    })
  })

  test('calls onBack when back button is clicked', () => {
    render(
      <AmountSelection
        organization={mockOrganization}
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const backButton = screen.getByText('Regresar')
    fireEvent.click(backButton)

    expect(mockOnBack).toHaveBeenCalled()
  })

  test('clears errors when changing donation type', () => {
    render(
      <AmountSelection
        organization={mockOrganization}
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    // First trigger an error
    const continueButton = screen.getByText('Continuar')
    fireEvent.click(continueButton)
    expect(screen.getByText('Por favor selecciona o ingresa un monto válido')).toBeInTheDocument()

    // Change donation type
    const volunteerCard = screen.getByText('Voluntariado').closest('.card')
    fireEvent.click(volunteerCard)

    // Error should be cleared
    expect(screen.queryByText('Por favor selecciona o ingresa un monto válido')).not.toBeInTheDocument()
  })
})