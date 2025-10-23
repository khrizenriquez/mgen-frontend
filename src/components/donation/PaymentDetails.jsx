import React, { useState } from 'react'
import { Card, Form, Button, Row, Col, Alert, Modal } from 'react-bootstrap'

const PaymentDetails = ({ donationData, organization, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    cardNumber: donationData.payment?.cardNumber || '',
    expiryDate: donationData.payment?.expiryDate || '',
    cvc: donationData.payment?.cvc || '',
    cardholderName: donationData.payment?.cardholderName || donationData.donor?.fullName || ''
  })
  
  const [errors, setErrors] = useState({})
  const [processing, setProcessing] = useState(false)
  const [showSecurityInfo, setShowSecurityInfo] = useState(false)

  // Skip payment for non-money donations
  if (donationData.donationType !== 'money') {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4 text-center">
          <div className="mb-4">
            <i className="bi bi-check-circle text-success" style={{ fontSize: '4rem' }}></i>
            <h3 className="text-success mt-3">¡Casi listo!</h3>
            <p className="text-muted">
              {donationData.donationType === 'volunteer' 
                ? 'Tu oferta de voluntariado está lista para ser enviada'
                : 'Tu donación en especie está lista para ser coordinada'
              }
            </p>
          </div>
          
          <Row className="mt-4">
            <Col>
              <Button 
                variant="outline-secondary" 
                onClick={onBack}
                className="me-2"
              >
                <i className="bi bi-arrow-left me-1"></i>
                Anterior
              </Button>
              <Button 
                variant="primary" 
                onClick={() => onComplete({ payment: {} })}
              >
                Continuar
                <i className="bi bi-arrow-right ms-1"></i>
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    )
  }

  const validateForm = () => {
    const newErrors = {}

    // Card number validation
    const cardNumber = formData.cardNumber.replace(/\s/g, '')
    if (!cardNumber) {
      newErrors.cardNumber = 'El número de tarjeta es requerido'
    } else if (cardNumber.length < 13 || cardNumber.length > 19) {
      newErrors.cardNumber = 'Número de tarjeta inválido'
    } else if (!/^\d+$/.test(cardNumber)) {
      newErrors.cardNumber = 'El número de tarjeta solo debe contener dígitos'
    }

    // Expiry date validation
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'La fecha de expiración es requerida'
    } else if (!/^\d{2}\/\d{4}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Formato inválido (MM/YYYY)'
    } else {
      const [month, year] = formData.expiryDate.split('/')
      const monthNum = parseInt(month)
      const yearNum = parseInt(year)
      
      if (monthNum < 1 || monthNum > 12) {
        newErrors.expiryDate = 'Mes inválido (01-12)'
      } else {
        const expiry = new Date(yearNum, monthNum - 1)
        const now = new Date()
        if (expiry < now) {
          newErrors.expiryDate = 'La tarjeta ha expirado'
        }
      }
    }

    // CVC validation
    if (!formData.cvc) {
      newErrors.cvc = 'El código CVC es requerido'
    } else if (!/^\d{3,4}$/.test(formData.cvc)) {
      newErrors.cvc = 'CVC inválido (3-4 dígitos)'
    }

    // Cardholder name validation
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'El nombre del titular es requerido'
    } else if (formData.cardholderName.trim().length < 2) {
      newErrors.cardholderName = 'El nombre debe tener al menos 2 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 6)
    }
    return v
  }

  const handleInputChange = (e) => {
    let { name, value } = e.target

    if (name === 'cardNumber') {
      value = formatCardNumber(value)
    } else if (name === 'expiryDate') {
      value = formatExpiryDate(value)
    } else if (name === 'cvc') {
      value = value.replace(/[^0-9]/g, '').substring(0, 4)
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const getCardType = (number) => {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/
    }
    
    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(number.replace(/\s/g, ''))) {
        return type
      }
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate transaction reference
      const transactionRef = '#' + Math.random().toString(36).substr(2, 8).toUpperCase()
      
      onComplete({
        payment: {
          ...formData,
          transactionRef,
          cardType: getCardType(formData.cardNumber),
          lastFourDigits: formData.cardNumber.slice(-4),
          processedAt: new Date().toISOString()
        }
      })
    } catch (error) {
      setErrors({ general: 'Error al procesar el pago. Por favor intenta de nuevo.' })
    } finally {
      setProcessing(false)
    }
  }

  const cardType = getCardType(formData.cardNumber)

  return (
    <>
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <h3 className="text-primary mb-2">
              <i className="bi bi-credit-card me-2"></i>
              Detalles de pago
            </h3>
            <p className="text-muted">
              Información segura para procesar tu donación
            </p>
          </div>

          {/* Donation Summary */}
          <Alert variant="success" className="border-0 mb-4">
            <Row className="align-items-center">
              <Col>
                <div className="d-flex align-items-center">
                  <i className="bi bi-shield-check fs-4 me-3 text-success"></i>
                  <div>
                    <strong>Monto a pagar: Q{donationData.amount}</strong>
                    <div className="small text-muted">
                      Donación para {organization.name}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs="auto">
                <Button 
                  variant="outline-info" 
                  size="sm"
                  onClick={() => setShowSecurityInfo(true)}
                >
                  <i className="bi bi-info-circle me-1"></i>
                  Seguridad
                </Button>
              </Col>
            </Row>
          </Alert>

          {errors.general && (
            <Alert variant="danger" className="border-0 mb-4">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {errors.general}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Card Information */}
            <div className="mb-4">
              <h5 className="text-primary mb-3">
                <i className="bi bi-credit-card-2-front me-2"></i>
                Información de la tarjeta
              </h5>
              
              <Form.Group className="mb-3">
                <Form.Label>Número de tarjeta *</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    isInvalid={!!errors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                  {cardType && (
                    <span className="input-group-text">
                      <i className={`bi bi-credit-card${cardType === 'amex' ? '-2' : ''}`}></i>
                    </span>
                  )}
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.cardNumber}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Aceptamos Visa, Mastercard y American Express
                </Form.Text>
              </Form.Group>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Fecha de expiración *</Form.Label>
                  <Form.Control
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    isInvalid={!!errors.expiryDate}
                    placeholder="MM/YYYY"
                    maxLength="7"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.expiryDate}
                  </Form.Control.Feedback>
                </Col>
                
                <Col md={6} className="mb-3">
                  <Form.Label>CVC *</Form.Label>
                  <Form.Control
                    type="text"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleInputChange}
                    isInvalid={!!errors.cvc}
                    placeholder="123"
                    maxLength="4"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cvc}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    3 dígitos atrás (4 para AmEx)
                  </Form.Text>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Nombre del titular *</Form.Label>
                <Form.Control
                  type="text"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  isInvalid={!!errors.cardholderName}
                  placeholder="Nombre como aparece en la tarjeta"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.cardholderName}
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            {/* Security Notice */}
            <Alert variant="info" className="border-0 mb-4">
              <div className="d-flex align-items-start">
                <i className="bi bi-shield-lock me-3 fs-5"></i>
                <div className="small">
                  <strong>Tu información está protegida</strong>
                  <p className="mb-0 mt-1">
                    Utilizamos encriptación SSL de 256 bits para proteger tus datos. 
                    Esta plataforma es operada por BAC Credomatic y cumple con los 
                    estándares de seguridad PCI DSS.
                  </p>
                </div>
              </div>
            </Alert>

            {/* Action Buttons */}
            <Row className="mt-4">
              <Col>
                <Button 
                  variant="outline-secondary" 
                  onClick={onBack}
                  className="me-2"
                  disabled={processing}
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  Anterior
                </Button>
                <Button 
                  variant="success" 
                  type="submit"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Procesando...</span>
                      </div>
                      Procesando pago...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-credit-card me-1"></i>
                      Procesar donación de Q{donationData.amount}
                    </>
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Security Info Modal */}
      <Modal show={showSecurityInfo} onHide={() => setShowSecurityInfo(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-shield-check me-2 text-success"></i>
            Seguridad en los pagos
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <h6><i className="bi bi-lock me-2"></i>Encriptación SSL</h6>
            <p className="small text-muted">
              Toda la información se transmite usando encriptación SSL de 256 bits, 
              el mismo nivel de seguridad que usan los bancos.
            </p>
          </div>
          <div className="mb-3">
            <h6><i className="bi bi-shield-check me-2"></i>Certificación PCI DSS</h6>
            <p className="small text-muted">
              Cumplimos con los estándares de seguridad PCI DSS para el manejo 
              seguro de información de tarjetas de crédito.
            </p>
          </div>
          <div className="mb-3">
            <h6><i className="bi bi-building me-2"></i>Respaldado por BAC</h6>
            <p className="small text-muted">
              Esta plataforma es operada por BAC Credomatic, con más de 65 años 
              de experiencia en servicios financieros.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSecurityInfo(false)}>
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PaymentDetails