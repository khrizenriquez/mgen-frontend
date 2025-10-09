/**
 * DonatePage Component Tests
 */
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import DonatePage from '../DonatePage'

describe('DonatePage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  test('renders amount selection step initially', () => {
    render(<DonatePage />)

    expect(screen.getByText('Haz tu donación')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Más Generosidad', level: 2 })).toBeInTheDocument()
    expect(screen.getByText('Tu generosidad transforma vidas')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('MONTO')).toBeInTheDocument()
    expect(screen.getByText('Q185')).toBeInTheDocument()
    expect(screen.getByText('Q75')).toBeInTheDocument()
    expect(screen.getByText('Q35')).toBeInTheDocument()
    expect(screen.getByText('Q15')).toBeInTheDocument()
  })

  test('renders organization information', () => {
    render(<DonatePage />)

    expect(screen.getByRole('heading', { name: 'Más Generosidad', level: 4 })).toBeInTheDocument()
    expect(screen.getByText(/Fomentamos la generosidad/)).toBeInTheDocument()
    expect(screen.getByText('Organización verificada')).toBeInTheDocument()
  })

  test('renders impact metrics', () => {
    render(<DonatePage />)

    expect(screen.getByText('Nuestro impacto')).toBeInTheDocument()
    expect(screen.getByText('Evangelizamos a más de 500 niños al año')).toBeInTheDocument()
    expect(screen.getByText('Beneficiamos con alimentos a más de tres escuelas por año')).toBeInTheDocument()
    expect(screen.getByText('Trabajamos para otorgar becas escolares a los niños más necesitados')).toBeInTheDocument()
  })

  test('allows custom amount input', () => {
    render(<DonatePage />)

    const amountInput = screen.getByPlaceholderText('MONTO')
    fireEvent.change(amountInput, { target: { value: '100' } })

    expect(amountInput.value).toBe('100')
  })

  test('allows selecting suggested amounts', () => {
    render(<DonatePage />)

    const amountButton = screen.getByText('Q185')
    fireEvent.click(amountButton)

    expect(amountButton).toHaveClass('btn-primary')
  })

  test('continue button is disabled when no amount selected', () => {
    render(<DonatePage />)

    const continueButton = screen.getByText('Continuar donación')
    expect(continueButton).toBeDisabled()
  })

  test('continue button is enabled when amount is selected', () => {
    render(<DonatePage />)

    const amountInput = screen.getByPlaceholderText('MONTO')
    fireEvent.change(amountInput, { target: { value: '50' } })

    const continueButton = screen.getByText('Continuar donación')
    expect(continueButton).not.toBeDisabled()
  })

  test('navigates to details step when amount is selected and continue is clicked', () => {
    render(<DonatePage />)

    const amountInput = screen.getByPlaceholderText('MONTO')
    fireEvent.change(amountInput, { target: { value: '50' } })

    const continueButton = screen.getByText('Continuar donación')
    fireEvent.click(continueButton)

    expect(screen.getByText('Detalles del pago')).toBeInTheDocument()
    expect(screen.getByText('Q50')).toBeInTheDocument()
  })

  test('renders payment details form', () => {
    render(<DonatePage />)

    // First go to details step
    const amountInput = screen.getByPlaceholderText('MONTO')
    fireEvent.change(amountInput, { target: { value: '50' } })
    const continueButton = screen.getByText('Continuar donación')
    fireEvent.click(continueButton)

    expect(screen.getByPlaceholderText('Nombre completo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Teléfono (opcional)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Número de tu tarjeta')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('MM/YY')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('CCV')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tu NIT, ej: #########')).toBeInTheDocument()
  })

  test('formats card number correctly', () => {
    render(<DonatePage />)

    // First go to details step
    const amountInput = screen.getByPlaceholderText('MONTO')
    fireEvent.change(amountInput, { target: { value: '50' } })
    const continueButton = screen.getByText('Continuar donación')
    fireEvent.click(continueButton)

    const cardInput = screen.getByPlaceholderText('Número de tu tarjeta')
    fireEvent.change(cardInput, { target: { value: '1234567890123456' } })

    expect(cardInput.value).toBe('1234 5678 9012 3456')
  })

  test('donation button is disabled when form is incomplete', () => {
    render(<DonatePage />)

    // First go to details step
    const amountInput = screen.getByPlaceholderText('MONTO')
    fireEvent.change(amountInput, { target: { value: '50' } })
    const continueButton = screen.getByText('Continuar donación')
    fireEvent.click(continueButton)

    const donateButton = screen.getByText('Realizar donación')
    expect(donateButton).toBeDisabled()
  })

  test('donation button is enabled when form is complete', () => {
    render(<DonatePage />)

    // First go to details step
    const amountInput = screen.getByPlaceholderText('MONTO')
    fireEvent.change(amountInput, { target: { value: '50' } })
    const continueButton = screen.getByText('Continuar donación')
    fireEvent.click(continueButton)

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Nombre completo'), { target: { value: 'Juan Pérez' } })
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'juan@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Número de tu tarjeta'), { target: { value: '1234567890123456' } })
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/25' } })
    fireEvent.change(screen.getByPlaceholderText('CCV'), { target: { value: '123' } })

    const donateButton = screen.getByText('Realizar donación')
    expect(donateButton).not.toBeDisabled()
  })

  test('shows processing step when donation is submitted', async () => {
    render(<DonatePage />)

    // First go to details step
    const amountInput = screen.getByPlaceholderText('MONTO')
    fireEvent.change(amountInput, { target: { value: '50' } })
    const continueButton = screen.getByText('Continuar donación')
    fireEvent.click(continueButton)

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Nombre completo'), { target: { value: 'Juan Pérez' } })
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'juan@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Número de tu tarjeta'), { target: { value: '1234567890123456' } })
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/25' } })
    fireEvent.change(screen.getByPlaceholderText('CCV'), { target: { value: '123' } })

    const donateButton = screen.getByText('Realizar donación')
    fireEvent.click(donateButton)

    expect(screen.getByText('Gracias por la espera')).toBeInTheDocument()
    expect(screen.getByText('Tu donación está siendo procesada...')).toBeInTheDocument()
  })

  test('shows success modal after donation processing', async () => {
    render(<DonatePage />)

    // Select amount
    const amountButton = screen.getByText('Q185')
    act(() => {
      fireEvent.click(amountButton)
    })

    // Go to details step
    const continueButton = screen.getByText('Continuar donación')
    act(() => {
      fireEvent.click(continueButton)
    })

    // Fill form
    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Nombre completo'), {
        target: { value: 'Juan Pérez' }
      })
      fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
        target: { value: 'juan@example.com' }
      })
      fireEvent.change(screen.getByPlaceholderText('Número de tu tarjeta'), {
        target: { value: '4111111111111111' }
      })
      fireEvent.change(screen.getByPlaceholderText('MM/YY'), {
        target: { value: '12/25' }
      })
      fireEvent.change(screen.getByPlaceholderText('CCV'), {
        target: { value: '123' }
      })
    })

    // Submit donation
    const donateButton = screen.getByText('Realizar donación')
    act(() => {
      fireEvent.click(donateButton)
    })

    // Advance timers to complete processing
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    // Check success modal appears
    expect(screen.getByText('¡Gracias por tu donación!')).toBeInTheDocument()
  }, 10000)

  test('renders contact information', () => {
    render(<DonatePage />)

    expect(screen.getByText('+(502) 5468 3386')).toBeInTheDocument()
    expect(screen.getByText('info@masgenerosidad.org')).toBeInTheDocument()
  })

  test('back button returns to amount step', () => {
    render(<DonatePage />)

    // First go to details step
    const amountInput = screen.getByPlaceholderText('MONTO')
    fireEvent.change(amountInput, { target: { value: '50' } })
    const continueButton = screen.getByText('Continuar donación')
    fireEvent.click(continueButton)

    // Click back button
    const backButton = screen.getByText('Regresar')
    fireEvent.click(backButton)

    expect(screen.getByText('Haz tu donación')).toBeInTheDocument()
  })
})