import React, { useState } from 'react'
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap'

const DonorInformation = ({ donationData, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    fullName: donationData.donor?.fullName || '',
    email: donationData.donor?.email || '',
    phone: donationData.donor?.phone || '',
    nit: donationData.donor?.nit || '',
    volunteerDetails: donationData.donor?.volunteerDetails || '',
    goodsDetails: donationData.donor?.goodsDetails || '',
    receiveUpdates: donationData.donor?.receiveUpdates || false,
    taxReceipt: donationData.donor?.taxReceipt || false
  })
  
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    // Required fields for all donation types
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El número de teléfono es requerido'
    } else {
      // Remove all non-digit characters except the + at the start
      const cleanPhone = formData.phone.replace(/[^\d+]/g, '')
      
      // Guatemala phone validation
      // Format: +502 XXXX-XXXX (8 digits after country code)
      // or just XXXX-XXXX (8 digits)
      if (cleanPhone.startsWith('+502')) {
        // International format
        const digits = cleanPhone.substring(4) // Remove +502
        if (digits.length !== 8) {
          newErrors.phone = 'El número debe tener 8 dígitos después del código +502'
        } else if (!/^[2-7]/.test(digits)) {
          newErrors.phone = 'El número debe iniciar con dígito del 2 al 7'
        }
      } else if (cleanPhone.startsWith('+')) {
        // Other international format - allow it
        if (cleanPhone.length < 10) {
          newErrors.phone = 'Número internacional incompleto'
        }
      } else {
        // Local format - 8 digits
        if (cleanPhone.length !== 8) {
          newErrors.phone = 'El número debe tener exactamente 8 dígitos'
        } else if (!/^[2-7]/.test(cleanPhone)) {
          newErrors.phone = 'El número debe iniciar con dígito del 2 al 7'
        }
      }
    }

    // NIT validation for Guatemala
    if (formData.nit && formData.nit !== '000000000') {
      if (!/^\d{7,9}$/.test(formData.nit.replace(/[-\s]/g, ''))) {
        newErrors.nit = 'El NIT debe contener entre 7 y 9 dígitos'
      }
    }

    // Specific validations for volunteer
    if (donationData.donationType === 'volunteer') {
      if (!formData.volunteerDetails.trim()) {
        newErrors.volunteerDetails = 'Por favor describe cómo te gustaría colaborar'
      } else if (formData.volunteerDetails.trim().length < 10) {
        newErrors.volunteerDetails = 'Por favor proporciona más detalles (mínimo 10 caracteres)'
      }
    }

    // Specific validations for goods donation
    if (donationData.donationType === 'goods') {
      if (!formData.goodsDetails.trim()) {
        newErrors.goodsDetails = 'Por favor describe qué artículos quieres donar'
      } else if (formData.goodsDetails.trim().length < 10) {
        newErrors.goodsDetails = 'Por favor proporciona más detalles (mínimo 10 caracteres)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onComplete({
        donor: formData
      })
    }
  }

  const getDonationTypeIcon = () => {
    switch (donationData.donationType) {
      case 'volunteer':
        return 'bi-people'
      case 'goods':
        return 'bi-box-seam'
      default:
        return 'bi-cash-coin'
    }
  }

  const getDonationTypeText = () => {
    switch (donationData.donationType) {
      case 'volunteer':
        return 'Voluntariado'
      case 'goods':
        return 'Donación en especie'
      default:
        return `Donación de Q${donationData.amount}`
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-primary mb-2">
            <i className="bi bi-person-circle me-2"></i>
            Tu información
          </h3>
          <p className="text-muted">
            Necesitamos algunos datos para procesar tu contribución
          </p>
        </div>

        {/* Donation Summary */}
        <Alert variant="primary" className="border-0 mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i className={`bi ${getDonationTypeIcon()} fs-4 me-3`}></i>
              <div>
                <strong>Tipo de contribución:</strong>
                <div className="small">{getDonationTypeText()}</div>
              </div>
            </div>
          </div>
        </Alert>

        <Form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="mb-4">
            <h5 className="text-primary mb-3">
              <i className="bi bi-person-badge me-2"></i>
              Información personal
            </h5>
            
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Nombre completo *</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  isInvalid={!!errors.fullName}
                  placeholder="Tu nombre completo"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fullName}
                </Form.Control.Feedback>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Label>Correo electrónico *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  isInvalid={!!errors.email}
                  placeholder="tu@email.com"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Número de teléfono *</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  isInvalid={!!errors.phone}
                  placeholder="+502 1234-5678"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Label>NIT (opcional)</Form.Label>
                <Form.Control
                  type="text"
                  name="nit"
                  value={formData.nit}
                  onChange={handleInputChange}
                  isInvalid={!!errors.nit}
                  placeholder="12345678 o CF"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nit}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Si no eres de Guatemala, puedes dejarlo en blanco
                </Form.Text>
              </Col>
            </Row>
          </div>

          {/* Volunteer Details */}
          {donationData.donationType === 'volunteer' && (
            <div className="mb-4">
              <h5 className="text-success mb-3">
                <i className="bi bi-clipboard-heart me-2"></i>
                Detalles del voluntariado
              </h5>
              <Form.Group className="mb-3">
                <Form.Label>¿En qué te gustaría colaborar? *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="volunteerDetails"
                  value={formData.volunteerDetails}
                  onChange={handleInputChange}
                  isInvalid={!!errors.volunteerDetails}
                  placeholder="Describe tus habilidades, disponibilidad de tiempo, áreas de interés, etc."
                />
                <Form.Control.Feedback type="invalid">
                  {errors.volunteerDetails}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Comparte tus habilidades, experiencia y en qué horarios podrías colaborar
                </Form.Text>
              </Form.Group>
            </div>
          )}

          {/* Goods Details */}
          {donationData.donationType === 'goods' && (
            <div className="mb-4">
              <h5 className="text-warning mb-3">
                <i className="bi bi-box-seam me-2"></i>
                Detalles de la donación
              </h5>
              <Form.Group className="mb-3">
                <Form.Label>¿Qué artículos quieres donar? *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="goodsDetails"
                  value={formData.goodsDetails}
                  onChange={handleInputChange}
                  isInvalid={!!errors.goodsDetails}
                  placeholder="Describe los artículos que quieres donar: tipo, cantidad, estado, etc."
                />
                <Form.Control.Feedback type="invalid">
                  {errors.goodsDetails}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Especifica qué quieres donar para que la organización pueda coordinarse contigo
                </Form.Text>
              </Form.Group>
            </div>
          )}

          {/* Preferences */}
          <div className="mb-4">
            <h5 className="text-primary mb-3">
              <i className="bi bi-gear me-2"></i>
              Preferencias
            </h5>
            
            <Form.Check
              type="checkbox"
              name="receiveUpdates"
              checked={formData.receiveUpdates}
              onChange={handleInputChange}
              label="Quiero recibir actualizaciones sobre el impacto de mi contribución"
              className="mb-2"
            />
            
            {donationData.donationType === 'money' && (
              <Form.Check
                type="checkbox"
                name="taxReceipt"
                checked={formData.taxReceipt}
                onChange={handleInputChange}
                label="Solicito recibo para deducción de impuestos"
                className="mb-2"
              />
            )}
          </div>

          {/* Action Buttons */}
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
                type="submit"
              >
                Continuar
                <i className="bi bi-arrow-right ms-1"></i>
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default DonorInformation