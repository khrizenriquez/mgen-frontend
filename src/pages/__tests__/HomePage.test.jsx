/**
 * HomePage Component Tests
 */
import { render, screen, cleanup } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import HomePage from '../HomePage'
import i18n from '../../i18n'

// Test wrapper component
const TestWrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </I18nextProvider>
)

describe('HomePage', () => {
  test('renders hero section with title and subtitle', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    )

    expect(screen.getByText('Ayudar sin esperar nada a cambio')).toBeInTheDocument()
    expect(screen.getByText(/Fomentamos la generosidad/)).toBeInTheDocument()
  })

  test('renders hero section buttons', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    )

    const donateButton = screen.getByRole('button', { name: /Donar ahora/i })
    const viewDonationsButton = screen.getByRole('button', { name: /Ver donaciones/i })

    expect(donateButton).toHaveAttribute('href', '/donate')
    expect(viewDonationsButton).toHaveAttribute('href', '/donations')
  })

  test('renders impact statistics section', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    )

    expect(screen.getByText('Nuestro impacto')).toBeInTheDocument()
    expect(screen.getByText('Números que reflejan el cambio que estamos generando')).toBeInTheDocument()

    // Check for impact stats
    expect(screen.getByText('Q45,250')).toBeInTheDocument()
    expect(screen.getByText('500+')).toBeInTheDocument()
    expect(screen.getByText('3+')).toBeInTheDocument()
    expect(screen.getAllByText('Programa en desarrollo')).toHaveLength(3)
  })

  test('renders about section with mission points', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    )

    expect(screen.getByText('¿Quiénes somos?')).toBeInTheDocument()
    expect(screen.getByText(/comprometida con fomentar/)).toBeInTheDocument()

    // Check mission points
    expect(screen.getByText('Misión clara')).toBeInTheDocument()
    expect(screen.getByText('Transparencia')).toBeInTheDocument()
    expect(screen.getByText('Impacto medible')).toBeInTheDocument()
  })

  test('renders programs section', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    )

    expect(screen.getByText('Nuestros programas')).toBeInTheDocument()
    expect(screen.getByText('Conoce las formas en que estamos transformando vidas')).toBeInTheDocument()

    // Check programs
    expect(screen.getByText('Evangelización Infantil')).toBeInTheDocument()
    expect(screen.getByText('Programa de Alimentación')).toBeInTheDocument()
    expect(screen.getByText('Becas Escolares')).toBeInTheDocument()
  })

  test('renders partners section', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    )

    expect(screen.getByText('Empresas que nos apoyan')).toBeInTheDocument()
    expect(screen.getByText('Organizaciones generosas que hacen posible nuestro trabajo')).toBeInTheDocument()
  })

  test('renders how to help section', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    )

    expect(screen.getByText('¿Cómo puedes ayudar?')).toBeInTheDocument()
    expect(screen.getByText('Múltiples formas de contribuir al bienestar de los niños')).toBeInTheDocument()

    // Check help options
    expect(screen.getByText('Donación monetaria')).toBeInTheDocument()
    expect(screen.getByText('Voluntariado')).toBeInTheDocument()
    expect(screen.getByText('Donación en especie')).toBeInTheDocument()
  })

  test('renders contact section with phone and email', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    )

    expect(screen.getByText('¿Tienes preguntas?')).toBeInTheDocument()
    expect(screen.getByText('Estamos aquí para ayudarte. Contáctanos para cualquier duda o consulta.')).toBeInTheDocument()

    expect(screen.getByText('+(502) 5468 3386')).toBeInTheDocument()
    expect(screen.getByText('info@masgenerosidad.org')).toBeInTheDocument()
  })

  test('renders call now button that opens phone dialer', () => {
    // Mock window.open
    const mockOpen = vi.fn()
    global.window.open = mockOpen

    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    )

    const callButton = screen.getByRole('button', { name: /llamar ahora/i })
    callButton.click()

    expect(mockOpen).toHaveBeenCalledWith('tel:+50254683386')
  })
})