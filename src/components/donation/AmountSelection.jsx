import React, { useState } from 'react'
import { Card, Button, Form, Row, Col, ButtonGroup, Alert } from 'react-bootstrap'

const AmountSelection = ({ organization, donationData, onComplete, onBack }) => {
  const [selectedAmount, setSelectedAmount] = useState(donationData.amount || 0)
  const [customAmount, setCustomAmount] = useState('')
  const [donationType, setDonationType] = useState(donationData.donationType || 'money')
  const [errors, setErrors] = useState({})

  const { suggestedAmounts = [185, 75, 35, 15], currency = 'Q' } = organization

  const validateAndContinue = () => {
    const newErrors = {}

    if (donationType === 'money') {
      const amount = selectedAmount || parseFloat(customAmount)
      if (!amount || amount <= 0) {
        newErrors.amount = 'Por favor selecciona o ingresa un monto válido'
      } else if (amount < 5) {
        newErrors.amount = 'El monto mínimo de donación es Q5'
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      const finalAmount = donationType === 'money' ? (selectedAmount || parseFloat(customAmount)) : 0
      onComplete({
        amount: finalAmount,
        donationType,
        customAmount: donationType === 'money' ? customAmount : ''
      })
    }
  }

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount)
    setCustomAmount('')
    setErrors({})
  }

  const handleCustomAmountChange = (e) => {
    const value = e.target.value
    setCustomAmount(value)
    setSelectedAmount(0)
    setErrors({})
  }

  const handleDonationTypeChange = (type) => {
    setDonationType(type)
    setSelectedAmount(0)
    setCustomAmount('')
    setErrors({})
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-primary mb-2">
            <i className="bi bi-gift me-2"></i>
            ¿Cómo quieres contribuir?
          </h3>
          <p className="text-muted">
            Elige la forma en que quieres apoyar a {organization.name}
          </p>
        </div>

        {/* Donation Type Selection */}
        <div className="mb-4">
          <Row className="g-3">
            <Col md={4}>
              <Card 
                className={`h-100 cursor-pointer border-2 ${
                  donationType === 'money' ? 'border-primary bg-primary bg-opacity-10' : 'border-light'
                }`}
                onClick={() => handleDonationTypeChange('money')}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center py-4">
                  <i className={`bi bi-cash-coin fs-1 mb-3 ${
                    donationType === 'money' ? 'text-primary' : 'text-muted'
                  }`}></i>
                  <h5 className={donationType === 'money' ? 'text-primary' : 'text-muted'}>
                    Donación en dinero
                  </h5>
                  <p className="small text-muted mb-0">
                    Contribuye económicamente para apoyar los proyectos
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card 
                className={`h-100 cursor-pointer border-2 ${
                  donationType === 'volunteer' ? 'border-success bg-success bg-opacity-10' : 'border-light'
                }`}
                onClick={() => handleDonationTypeChange('volunteer')}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center py-4">
                  <i className={`bi bi-people fs-1 mb-3 ${
                    donationType === 'volunteer' ? 'text-success' : 'text-muted'
                  }`}></i>
                  <h5 className={donationType === 'volunteer' ? 'text-success' : 'text-muted'}>
                    Voluntariado
                  </h5>
                  <p className="small text-muted mb-0">
                    Ofrece tu tiempo y habilidades para ayudar
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card 
                className={`h-100 cursor-pointer border-2 ${
                  donationType === 'goods' ? 'border-warning bg-warning bg-opacity-10' : 'border-light'
                }`}
                onClick={() => handleDonationTypeChange('goods')}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center py-4">
                  <i className={`bi bi-box-seam fs-1 mb-3 ${
                    donationType === 'goods' ? 'text-warning' : 'text-muted'
                  }`}></i>
                  <h5 className={donationType === 'goods' ? 'text-warning' : 'text-muted'}>
                    Donación en especie
                  </h5>
                  <p className="small text-muted mb-0">
                    Dona artículos necesarios para la organización
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Money Donation Amount Selection */}
        {donationType === 'money' && (
          <div className="mb-4">
            <h5 className="text-primary mb-3">
              <i className="bi bi-calculator me-2"></i>
              Selecciona el monto de tu donación
            </h5>
            
            {/* Suggested Amounts */}
            <div className="mb-3">
              <p className="small text-muted mb-2">Montos sugeridos:</p>
              <ButtonGroup className="w-100 mb-3">
                {suggestedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? 'primary' : 'outline-primary'}
                    onClick={() => handleAmountClick(amount)}
                    className="flex-fill"
                  >
                    {currency}{amount}
                  </Button>
                ))}
              </ButtonGroup>
            </div>

            {/* Custom Amount */}
            <div className="mb-3">
              <Form.Label className="small text-muted">O ingresa otro monto:</Form.Label>
              <div className="input-group">
                <span className="input-group-text">{currency}</span>
                <Form.Control
                  type="number"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  min="5"
                  step="0.01"
                  className={errors.amount ? 'is-invalid' : ''}
                />
                {errors.amount && (
                  <div className="invalid-feedback">
                    {errors.amount}
                  </div>
                )}
              </div>
              <Form.Text className="text-muted">
                Monto mínimo: {currency}5.00
              </Form.Text>
            </div>

            {/* Amount Summary */}
            {(selectedAmount > 0 || customAmount) && (
              <Alert variant="success" className="border-0">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <strong>Monto a donar:</strong>
                  </div>
                  <div className="fs-5 fw-bold">
                    {currency}{selectedAmount || customAmount}
                  </div>
                </div>
              </Alert>
            )}
          </div>
        )}

        {/* Volunteer Information */}
        {donationType === 'volunteer' && (
          <Alert variant="success" className="border-0 mb-4">
            <h6 className="alert-heading">
              <i className="bi bi-heart me-2"></i>
              ¡Gracias por querer ser voluntario!
            </h6>
            <p className="mb-0">
              En el siguiente paso podrás proporcionar tus datos de contacto y 
              especificar en qué áreas te gustaría colaborar.
            </p>
          </Alert>
        )}

        {/* Goods Donation Information */}
        {donationType === 'goods' && (
          <Alert variant="warning" className="border-0 mb-4">
            <h6 className="alert-heading">
              <i className="bi bi-box-seam me-2"></i>
              Donación en especie
            </h6>
            <p className="mb-0">
              En el siguiente paso podrás especificar qué artículos quieres donar 
              y coordinar la entrega con la organización.
            </p>
          </Alert>
        )}

        {/* Action Buttons */}
        <Row className="mt-4">
          <Col>
            <Button 
              variant="outline-secondary" 
              onClick={onBack}
              className="me-2"
            >
              <i className="bi bi-arrow-left me-1"></i>
              Regresar
            </Button>
            <Button 
              variant="primary" 
              onClick={validateAndContinue}
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

export default AmountSelection