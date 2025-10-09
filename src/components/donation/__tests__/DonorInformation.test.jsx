/**
 * DonorInformation Component Tests
 */
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import DonorInformation from '../DonorInformation'

const mockDonationData = {
  amount: 185,
  donationType: 'money',
  donor: {}
}

const mockOnComplete = vi.fn()
const mockOnBack = vi.fn()

describe('DonorInformation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders personal information form for money donation', () => {
    render(
      <DonorInformation
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    expect(screen.getByText('Tu información')).toBeInTheDocument()
    expect(screen.getByText('Donación de Q185')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tu nombre completo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('+502 1234-5678')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('12345678 o CF')).toBeInTheDocument()
  })

  test('renders volunteer details for volunteer donation', () => {
    const volunteerData = { ...mockDonationData, donationType: 'volunteer' }

    render(
      <DonorInformation
        donationData={volunteerData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    expect(screen.getByText('Voluntariado')).toBeInTheDocument()
    expect(screen.getByText('Detalles del voluntariado')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Describe tus habilidades, disponibilidad de tiempo, áreas de interés, etc.')).toBeInTheDocument()
  })

  test('renders goods details for goods donation', () => {
    const goodsData = { ...mockDonationData, donationType: 'goods' }

    render(
      <DonorInformation
        donationData={goodsData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    expect(screen.getByText('Donación en especie')).toBeInTheDocument()
    expect(screen.getByText('Detalles de la donación')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Describe los artículos que quieres donar: tipo, cantidad, estado, etc.')).toBeInTheDocument()
  })

  test('shows validation errors for empty required fields', () => {
    render(
      <DonorInformation
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const submitButton = screen.getByText('Continuar')
    fireEvent.click(submitButton)

    expect(screen.getByText('El nombre completo es requerido')).toBeInTheDocument()
    expect(screen.getByText('El correo electrónico es requerido')).toBeInTheDocument()
    expect(screen.getByText('El número de teléfono es requerido')).toBeInTheDocument()
  })

  test('validates email format', () => {
    render(
      <DonorInformation
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    // Fill form with invalid email
    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Tu nombre completo'), {
        target: { value: 'Juan Pérez', name: 'fullName' }
      })
      fireEvent.change(screen.getByPlaceholderText('tu@email.com'), {
        target: { value: 'invalid-email', name: 'email' }
      })
      fireEvent.change(screen.getByPlaceholderText('+502 1234-5678'), {
        target: { value: '+50212345678', name: 'phone' }
      })
    })

    const form = document.querySelector('form')
    act(() => {
      fireEvent.submit(form)
    })

    // The error message should be in the invalid-feedback div
    expect(screen.getByText('Ingresa un correo electrónico válido')).toBeInTheDocument()
  })

  test('validates phone number format', () => {
    render(
      <DonorInformation
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const phoneInput = screen.getByPlaceholderText('+502 1234-5678')
    fireEvent.change(phoneInput, { target: { value: 'abc', name: 'phone' } })
    fireEvent.blur(phoneInput)

    const submitButton = screen.getByText('Continuar')
    fireEvent.click(submitButton)

    expect(screen.getByText('Ingresa un número de teléfono válido')).toBeInTheDocument()
  })

  test('validates NIT format', () => {
    render(
      <DonorInformation
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    const nitInput = screen.getByPlaceholderText('12345678 o CF')
    fireEvent.change(nitInput, { target: { value: '123', name: 'nit' } })
    fireEvent.blur(nitInput)

    const submitButton = screen.getByText('Continuar')
    fireEvent.click(submitButton)

    expect(screen.getByText('El NIT debe contener entre 7 y 9 dígitos')).toBeInTheDocument()
  })

  test('validates volunteer details', () => {
    const volunteerData = { ...mockDonationData, donationType: 'volunteer' }

    render(
      <DonorInformation
        donationData={volunteerData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText('Tu nombre completo'), {
      target: { value: 'Juan Pérez', name: 'fullName' }
    })
    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), {
      target: { value: 'juan@example.com', name: 'email' }
    })
    fireEvent.change(screen.getByPlaceholderText('+502 1234-5678'), {
      target: { value: '+50212345678', name: 'phone' }
    })

    const submitButton = screen.getByText('Continuar')
    fireEvent.click(submitButton)

    expect(screen.getByText('Por favor describe cómo te gustaría colaborar')).toBeInTheDocument()
  })

  test('validates goods details', () => {
    const goodsData = { ...mockDonationData, donationType: 'goods' }

    render(
      <DonorInformation
        donationData={goodsData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText('Tu nombre completo'), {
      target: { value: 'Juan Pérez', name: 'fullName' }
    })
    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), {
      target: { value: 'juan@example.com', name: 'email' }
    })
    fireEvent.change(screen.getByPlaceholderText('+502 1234-5678'), {
      target: { value: '+50212345678', name: 'phone' }
    })

    const submitButton = screen.getByText('Continuar')
    fireEvent.click(submitButton)

    expect(screen.getByText('Por favor describe qué artículos quieres donar')).toBeInTheDocument()
  })

  test('clears errors when user starts typing', () => {
    render(
      <DonorInformation
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    // Trigger error
    const submitButton = screen.getByText('Continuar')
    fireEvent.click(submitButton)
    expect(screen.getByText('El nombre completo es requerido')).toBeInTheDocument()

    // Start typing
    const nameInput = screen.getByPlaceholderText('Tu nombre completo')
    fireEvent.change(nameInput, { target: { value: 'J', name: 'fullName' } })

    // Error should be cleared
    expect(screen.queryByText('El nombre completo es requerido')).not.toBeInTheDocument()
  })

  test('calls onComplete with correct data for money donation', () => {
    render(
      <DonorInformation
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Tu nombre completo'), {
      target: { value: 'Juan Pérez', name: 'fullName' }
    })
    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), {
      target: { value: 'juan@example.com', name: 'email' }
    })
    fireEvent.change(screen.getByPlaceholderText('+502 1234-5678'), {
      target: { value: '+50212345678', name: 'phone' }
    })
    fireEvent.change(screen.getByPlaceholderText('12345678 o CF'), {
      target: { value: '12345678', name: 'nit' }
    })

    // Check preferences
    const updatesCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(updatesCheckbox)

    const taxCheckbox = screen.getAllByRole('checkbox')[1]
    fireEvent.click(taxCheckbox)

    const submitButton = screen.getByText('Continuar')
    fireEvent.click(submitButton)

    expect(mockOnComplete).toHaveBeenCalledWith({
      donor: {
        fullName: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '+50212345678',
        nit: '12345678',
        volunteerDetails: '',
        goodsDetails: '',
        receiveUpdates: true,
        taxReceipt: true
      }
    })
  })

  test('calls onComplete with correct data for volunteer donation', () => {
    const volunteerData = { ...mockDonationData, donationType: 'volunteer' }

    render(
      <DonorInformation
        donationData={volunteerData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Tu nombre completo'), {
      target: { value: 'Juan Pérez', name: 'fullName' }
    })
    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), {
      target: { value: 'juan@example.com', name: 'email' }
    })
    fireEvent.change(screen.getByPlaceholderText('+502 1234-5678'), {
      target: { value: '+50212345678', name: 'phone' }
    })
    fireEvent.change(screen.getByPlaceholderText('Describe tus habilidades, disponibilidad de tiempo, áreas de interés, etc.'), {
      target: { value: 'Me gustaría ayudar con la enseñanza de valores a los niños', name: 'volunteerDetails' }
    })

    const submitButton = screen.getByText('Continuar')
    fireEvent.click(submitButton)

    expect(mockOnComplete).toHaveBeenCalledWith({
      donor: expect.objectContaining({
        fullName: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '+50212345678',
        volunteerDetails: 'Me gustaría ayudar con la enseñanza de valores a los niños'
      })
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

    expect(mockOnBack).toHaveBeenCalled()
  })

  test('shows tax receipt checkbox only for money donations', () => {
    render(
      <DonorInformation
        donationData={mockDonationData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    expect(screen.getByText('Solicito recibo para deducción de impuestos')).toBeInTheDocument()

    cleanup()

    const volunteerData = { ...mockDonationData, donationType: 'volunteer' }
    render(
      <DonorInformation
        donationData={volunteerData}
        onComplete={mockOnComplete}
        onBack={mockOnBack}
      />
    )

    expect(screen.queryByText('Solicito recibo para deducción de impuestos')).not.toBeInTheDocument()
  })
})