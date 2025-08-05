import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Card, Row, Col, Button, ProgressBar, Alert } from 'react-bootstrap'
import AmountSelection from '../components/donation/AmountSelection'
import DonorInformation from '../components/donation/DonorInformation'
import PaymentDetails from '../components/donation/PaymentDetails'
import DonationConfirmation from '../components/donation/DonationConfirmation'

const DonationFlowPage = () => {
  const { organizationId } = useParams()
  const navigate = useNavigate()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [organization, setOrganization] = useState(null)
  const [donationData, setDonationData] = useState({
    amount: 0,
    donationType: 'money', // money, volunteer, goods
    donor: {
      fullName: '',
      email: '',
      phone: '',
      nit: ''
    },
    payment: {
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      cardholderName: ''
    }
  })
  
  const totalSteps = 4
  const stepNames = [
    'Seleccionar monto',
    'Información personal', 
    'Detalles de pago',
    'Confirmación'
  ]

  // Datos de ejemplo de organizaciones
  const sampleOrganizations = {
    1: {
      name: 'Propuesta Urbana - Reciclemos.GT',
      category: 'Medio ambiente',
      suggestedAmounts: [185, 75, 35, 15],
      currency: 'Q'
    },
    2: {
      name: 'Fundación Esperanza',
      category: 'Educación', 
      suggestedAmounts: [250, 100, 50, 25],
      currency: 'Q'
    },
    3: {
      name: 'Salud Para Todos',
      category: 'Salud',
      suggestedAmounts: [300, 150, 75, 30],
      currency: 'Q'
    }
  }

  useEffect(() => {
    const org = sampleOrganizations[organizationId]
    if (org) {
      setOrganization(org)
    } else {
      navigate('/organizations')
    }
  }, [organizationId, navigate])

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateDonationData = (stepData) => {
    setDonationData(prev => ({
      ...prev,
      ...stepData
    }))
  }

  const handleStepComplete = (stepData) => {
    updateDonationData(stepData)
    nextStep()
  }

  const goToStep = (step) => {
    setCurrentStep(step)
  }

  if (!organization) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Container>
    )
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AmountSelection
            organization={organization}
            donationData={donationData}
            onComplete={handleStepComplete}
            onBack={() => navigate('/organizations')}
          />
        )
      case 2:
        return (
          <DonorInformation
            donationData={donationData}
            onComplete={handleStepComplete}
            onBack={prevStep}
          />
        )
      case 3:
        return (
          <PaymentDetails
            donationData={donationData}
            organization={organization}
            onComplete={handleStepComplete}
            onBack={prevStep}
          />
        )
      case 4:
        return (
          <DonationConfirmation
            donationData={donationData}
            organization={organization}
            onNewDonation={() => navigate('/organizations')}
          />
        )
      default:
        return null
    }
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 bg-primary text-white">
            <Card.Body className="py-3">
              <Row className="align-items-center">
                <Col>
                  <h4 className="mb-1">
                    <i className="bi bi-heart-fill me-2"></i>
                    Donación para {organization.name}
                  </h4>
                  <small className="opacity-75">{organization.category}</small>
                </Col>
                <Col xs="auto">
                  <Button 
                    variant="outline-light" 
                    size="sm"
                    onClick={() => navigate('/organizations')}
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Cambiar organización
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Progress Bar */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="py-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">Paso {currentStep} de {totalSteps}</small>
                <small className="text-muted">{stepNames[currentStep - 1]}</small>
              </div>
              <ProgressBar 
                now={(currentStep / totalSteps) * 100} 
                className="mb-2"
                style={{ height: '8px' }}
              />
              <Row className="g-0">
                {stepNames.map((name, index) => (
                  <Col key={index} className="text-center">
                    <Button
                      variant="link"
                      size="sm"
                      className={`p-0 text-decoration-none ${
                        index + 1 === currentStep 
                          ? 'text-primary fw-bold' 
                          : index + 1 < currentStep 
                            ? 'text-success' 
                            : 'text-muted'
                      }`}
                      onClick={() => index + 1 < currentStep && goToStep(index + 1)}
                      disabled={index + 1 > currentStep}
                    >
                      {index + 1 < currentStep && <i className="bi bi-check-circle me-1"></i>}
                      {index + 1 === currentStep && <i className="bi bi-arrow-right me-1"></i>}
                      <small>{name}</small>
                    </Button>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Current Step Content */}
      <Row>
        <Col>
          {renderCurrentStep()}
        </Col>
      </Row>

      {/* Help Section */}
      {currentStep < 4 && (
        <Row className="mt-4">
          <Col>
            <Alert variant="info" className="border-0">
              <div className="d-flex align-items-center">
                <i className="bi bi-info-circle me-3 fs-5"></i>
                <div>
                  <strong>¿Necesitas ayuda?</strong>
                  <p className="mb-0 small">
                    Si tienes alguna duda sobre el proceso de donación, puedes contactar directamente 
                    con la organización o escribirnos a soporte@donaciones.gt
                  </p>
                </div>
              </div>
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default DonationFlowPage