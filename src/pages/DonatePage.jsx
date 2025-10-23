import React, { useState, useRef } from 'react'
import { Container, Card, Row, Col, Button, Form, Alert, Modal } from 'react-bootstrap'

const DonatePage = () => {
  const [currentStep, setCurrentStep] = useState('amount') // amount, details, processing, success
  const [showModal, setShowModal] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [donationData, setDonationData] = useState({
    amount: '',
    customAmount: '',
    donorName: '',
    phone: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    nit: ''
  })

  // Información de Más Generosidad
  const organization = {
    name: 'Más Generosidad',
    description: 'Fomentamos la generosidad en la sociedad en beneficio de los niños de Guatemala. Creemos firmemente que la generosidad puede ser la fuerza detrás de un cambio significativo en la vida de estos pequeños.',
    phone: '+(502) 5468 3386',
    email: 'info@masgenerosidad.org',
    impact: [
      'Evangelizamos a más de 500 niños al año',
      'Beneficiamos con alimentos a más de tres escuelas por año',
      'Trabajamos para otorgar becas escolares a los niños más necesitados'
    ],
    mission: 'Nuestro máximo deseo es hacer un poco más dulce la vida de los niños y adolescentes de escasos recursos de nuestro país.',
    partners: ['Dos Pinos', 'Bimbo', 'Waterlife', 'Colgate']
  }

  const suggestedAmounts = [185, 75, 35, 15]

  const handleAmountSelect = (amount) => {
    setDonationData(prev => ({ ...prev, amount: amount.toString(), customAmount: '' }))
  }

  const handleCustomAmountChange = (e) => {
    const value = e.target.value
    setDonationData(prev => ({ ...prev, customAmount: value, amount: '' }))
  }

  const getSelectedAmount = () => {
    return donationData.customAmount || donationData.amount
  }

  const handleInputChange = (field, value) => {
    setDonationData(prev => ({ ...prev, [field]: value }))
  }

  const validateAmount = () => {
    const amount = getSelectedAmount()
    return amount && parseFloat(amount) > 0
  }

  const validateDetails = () => {
    return donationData.donorName && 
           donationData.email && 
           donationData.cardNumber && 
           donationData.expiryDate && 
           donationData.cvc &&
           termsAccepted
  }

  const handleNext = () => {
    if (currentStep === 'amount' && validateAmount()) {
      setCurrentStep('details')
    } else if (currentStep === 'details' && validateDetails()) {
      setCurrentStep('processing')
      // Simular procesamiento
      setTimeout(() => {
        setCurrentStep('success')
        setShowModal(true)
      }, 2000)
    }
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const renderAmountStep = () => (
    <div className="donation-step">
      {/* Mobile-first hero section */}
      <div className="text-center mb-4">
        <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle mb-3" 
             style={{ width: '80px', height: '80px' }}>
          <i className="bi bi-heart-fill text-white" style={{ fontSize: '2rem' }}></i>
        </div>
        <h1 className="h3 fw-bold text-primary mb-2">Haz tu donación</h1>
        <h2 className="h5 text-warning fw-semibold">{organization.name}</h2>
        <p className="text-muted small mb-0">Tu generosidad transforma vidas</p>
      </div>

      {/* Amount selection */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <h3 className="h6 fw-bold mb-3">Monto</h3>
          
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">Q</span>
              <Form.Control
                type="number"
                placeholder="MONTO"
                value={donationData.customAmount}
                onChange={handleCustomAmountChange}
                className="border-start-0 fs-5 text-center"
                style={{ fontSize: '1.5rem', fontWeight: '600' }}
              />
            </div>
            <small className="text-muted">Algunos montos frecuentes:</small>
          </div>

          <Row className="g-2">
            {suggestedAmounts.map((amount) => (
              <Col xs={6} sm={3} key={amount}>
                <Button
                  variant={donationData.amount === amount.toString() ? 'primary' : 'outline-primary'}
                  className="w-100 fw-semibold"
                  onClick={() => handleAmountSelect(amount)}
                >
                  Q{amount}
                </Button>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Organization info */}
      <Card className="border-0 bg-light mb-4">
        <Card.Body className="p-4">
          <div className="d-flex align-items-start">
            <div className="flex-shrink-0 me-3">
              <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center" 
                   style={{ width: '50px', height: '50px' }}>
                <i className="bi bi-building text-white"></i>
              </div>
            </div>
            <div className="flex-grow-1">
              <h4 className="h6 fw-bold mb-2">{organization.name}</h4>
              <p className="small text-muted mb-2">{organization.description}</p>
              <div className="small text-success">
                <i className="bi bi-check-circle me-1"></i>
                Organización verificada
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Impact metrics */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <h5 className="h6 fw-bold mb-3">Nuestro impacto</h5>
          {organization.impact.map((impact, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <i className="bi bi-heart text-danger me-2"></i>
              <small className="text-muted">{impact}</small>
            </div>
          ))}
        </Card.Body>
      </Card>

      <div className="d-grid">
        <Button 
          variant="danger" 
          size="lg" 
          className="fw-semibold"
          disabled={!validateAmount()}
          onClick={handleNext}
        >
          Continuar donación
        </Button>
      </div>
    </div>
  )

  const renderDetailsStep = () => (
    <div className="donation-step">
      <div className="text-center mb-4">
        <h2 className="h5 fw-bold text-primary">Detalles del pago</h2>
        <p className="text-muted small">Monto: <span className="fw-semibold">Q{getSelectedAmount()}</span></p>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          {/* Donor information */}
          <div className="mb-4">
            <h5 className="h6 fw-bold mb-3">Información personal</h5>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Nombre completo"
                value={donationData.donorName}
                onChange={(e) => handleInputChange('donorName', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Correo electrónico"
                value={donationData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="tel"
                placeholder="Teléfono (opcional)"
                value={donationData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </Form.Group>
          </div>

          {/* Payment information */}
          <div className="mb-4">
            <h5 className="h6 fw-bold mb-3">Información de pago</h5>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Número de tu tarjeta"
                value={donationData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                maxLength={19}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="MM/YY"
                    value={donationData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    maxLength={5}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="CCV"
                    value={donationData.cvc}
                    onChange={(e) => handleInputChange('cvc', e.target.value)}
                    maxLength={4}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Tu NIT, ej: #########"
                value={donationData.nit}
                onChange={(e) => handleInputChange('nit', e.target.value)}
              />
              <Form.Text className="text-muted">
                Si no eres de Guatemala, puedes dejarlo en blanco
              </Form.Text>
            </Form.Group>
          </div>

          <Form.Check
            type="checkbox"
            id="terms"
            label="Al avanzar, aceptas nuestros términos & condiciones."
            className="mb-3 small"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            required
          />

          <div className="d-grid gap-2">
            <Button 
              variant="danger" 
              size="lg" 
              className="fw-semibold"
              disabled={!validateDetails()}
              onClick={handleNext}
            >
              Realizar donación
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={() => setCurrentStep('amount')}
            >
              Regresar
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )

  const renderProcessingStep = () => (
    <div className="donation-step text-center py-5">
      <div className="mb-4">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Procesando...</span>
        </div>
      </div>
      <h3 className="h5 fw-bold text-primary mb-2">Gracias por la espera</h3>
      <p className="text-muted">Tu donación está siendo procesada...</p>
    </div>
  )

  const renderSuccessModal = () => (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Body className="text-center p-4">
        <div className="mb-3">
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
        </div>
        <h4 className="fw-bold text-success mb-3">¡Gracias por tu donación!</h4>
        <Card className="border-0 bg-light mb-3">
          <Card.Body className="p-3">
            <div className="text-start small">
              <div className="d-flex justify-content-between mb-1">
                <span>Organización:</span>
                <span className="fw-semibold">{organization.name}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Monto:</span>
                <span className="fw-semibold">Q{getSelectedAmount()}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Ref.:</span>
                <span className="fw-semibold">#MG{Math.random().toString().substr(2, 8)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Tarjeta:</span>
                <span className="fw-semibold">***{donationData.cardNumber.slice(-4)}</span>
              </div>
            </div>
          </Card.Body>
        </Card>
        <div className="text-start small mb-3">
          <i className="bi bi-telephone me-2"></i>
          <span>{organization.phone}</span>
        </div>
        <p className="small text-muted mb-4">
          Escribe a la organización para solicitar un recibo por donaciones deducibles de impuesto de renta.
        </p>
        <div className="d-grid gap-2">
          <Button 
            variant="primary" 
            onClick={() => {
              setShowModal(false)
              setCurrentStep('amount')
              setDonationData({
                amount: '',
                customAmount: '',
                donorName: '',
                phone: '',
                email: '',
                cardNumber: '',
                expiryDate: '',
                cvc: '',
                nit: ''
              })
            }}
          >
            Hacer otra donación
          </Button>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )

  return (
    <Container className="py-4" style={{ maxWidth: '600px' }}>
      {currentStep === 'amount' && renderAmountStep()}
      {currentStep === 'details' && renderDetailsStep()}
      {currentStep === 'processing' && renderProcessingStep()}
      {renderSuccessModal()}

      {/* Contact section */}
      <div className="text-center mt-5 pt-4 border-top">
        <p className="small text-muted mb-2">Puedes contactar a {organization.name} vía:</p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <a href={`tel:${organization.phone}`} className="text-decoration-none small">
            <i className="bi bi-telephone me-1"></i>
            {organization.phone}
          </a>
          <a href={`mailto:${organization.email}`} className="text-decoration-none small">
            <i className="bi bi-envelope me-1"></i>
            {organization.email}
          </a>
        </div>
      </div>
    </Container>
  )
}

export default DonatePage