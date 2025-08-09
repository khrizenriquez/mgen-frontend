import React, { useState } from 'react'
import { Card, Button, Row, Col, Alert, Modal, Badge } from 'react-bootstrap'

const DonationConfirmation = ({ donationData, organization, onNewDonation }) => {
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSendReceipt = () => {
    // Simulate sending email receipt
    setEmailSent(true)
    setTimeout(() => {
      setShowReceiptModal(false)
      setTimeout(() => setEmailSent(false), 3000)
    }, 2000)
  }

  const getDonationIcon = () => {
    switch (donationData.donationType) {
      case 'volunteer':
        return { icon: 'bi-people', color: 'success', text: 'Voluntariado' }
      case 'goods':
        return { icon: 'bi-box-seam', color: 'warning', text: 'Donación en especie' }
      default:
        return { icon: 'bi-cash-coin', color: 'primary', text: 'Donación monetaria' }
    }
  }

  const donationInfo = getDonationIcon()

  return (
    <>
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          {/* Success Header */}
          <div className="text-center mb-4">
            <div className="mb-3">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
            </div>
            <h2 className="text-success mb-2">¡Gracias por tu {donationInfo.text.toLowerCase()}!</h2>
            <p className="text-muted">
              {donationData.donationType === 'money' 
                ? 'Tu donación ha sido procesada exitosamente'
                : donationData.donationType === 'volunteer'
                  ? 'Tu oferta de voluntariado ha sido enviada a la organización'
                  : 'Tu donación en especie ha sido registrada'
              }
            </p>
          </div>

          {/* Donation Summary */}
          <Card className="bg-light border-0 mb-4">
            <Card.Header className="bg-transparent border-0 py-3">
              <h5 className="mb-0">
                <i className={`bi ${donationInfo.icon} me-2 text-${donationInfo.color}`}></i>
                Resumen de tu contribución
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col sm={4} className="text-muted">Organización:</Col>
                <Col sm={8}>
                  <strong>{organization.name}</strong>
                  <Badge bg="secondary" className="ms-2">{organization.category}</Badge>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col sm={4} className="text-muted">Tipo:</Col>
                <Col sm={8}>
                  <Badge bg={donationInfo.color}>{donationInfo.text}</Badge>
                </Col>
              </Row>

              {donationData.donationType === 'money' && (
                <>
                  <Row className="mb-3">
                    <Col sm={4} className="text-muted">Monto:</Col>
                    <Col sm={8}>
                      <strong className="fs-5 text-success">Q{donationData.amount}</strong>
                    </Col>
                  </Row>
                  
                  {donationData.payment?.transactionRef && (
                    <Row className="mb-3">
                      <Col sm={4} className="text-muted">Referencia:</Col>
                      <Col sm={8}>
                        <code>{donationData.payment.transactionRef}</code>
                      </Col>
                    </Row>
                  )}
                  
                  {donationData.payment?.cardType && (
                    <Row className="mb-3">
                      <Col sm={4} className="text-muted">Método de pago:</Col>
                      <Col sm={8}>
                        {donationData.payment.cardType.toUpperCase()} terminada en {donationData.payment.lastFourDigits}
                      </Col>
                    </Row>
                  )}
                </>
              )}

              <Row className="mb-3">
                <Col sm={4} className="text-muted">Donante:</Col>
                <Col sm={8}>{donationData.donor.fullName}</Col>
              </Row>
              
              <Row className="mb-3">
                <Col sm={4} className="text-muted">Email:</Col>
                <Col sm={8}>{donationData.donor.email}</Col>
              </Row>

              {donationData.payment?.processedAt && (
                <Row className="mb-3">
                  <Col sm={4} className="text-muted">Fecha:</Col>
                  <Col sm={8}>{formatDate(donationData.payment.processedAt)}</Col>
                </Row>
              )}

              {donationData.donor.volunteerDetails && (
                <Row className="mb-3">
                  <Col sm={4} className="text-muted">Detalles:</Col>
                  <Col sm={8}>
                    <div className="bg-white p-2 rounded border">
                      {donationData.donor.volunteerDetails}
                    </div>
                  </Col>
                </Row>
              )}

              {donationData.donor.goodsDetails && (
                <Row className="mb-3">
                  <Col sm={4} className="text-muted">Artículos:</Col>
                  <Col sm={8}>
                    <div className="bg-white p-2 rounded border">
                      {donationData.donor.goodsDetails}
                    </div>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>

          {/* Next Steps */}
          <Alert variant="info" className="border-0 mb-4">
            <h6 className="alert-heading">
              <i className="bi bi-info-circle me-2"></i>
              Próximos pasos
            </h6>
            {donationData.donationType === 'money' ? (
              <ul className="mb-0">
                <li>Recibirás un comprobante por correo electrónico</li>
                <li>La organización recibirá los fondos en las próximas 24-48 horas</li>
                {donationData.donor.receiveUpdates && (
                  <li>Te mantendremos informado sobre el impacto de tu donación</li>
                )}
                {donationData.donor.taxReceipt && (
                  <li>Contacta a la organización para solicitar tu recibo deducible de impuestos</li>
                )}
              </ul>
            ) : donationData.donationType === 'volunteer' ? (
              <ul className="mb-0">
                <li>La organización revisará tu oferta de voluntariado</li>
                <li>Te contactarán en las próximas 48-72 horas</li>
                <li>Recibirás detalles sobre cómo y cuándo puedes colaborar</li>
              </ul>
            ) : (
              <ul className="mb-0">
                <li>La organización revisará tu donación en especie</li>
                <li>Te contactarán para coordinar la entrega</li>
                <li>Recibirás instrucciones sobre dónde y cuándo entregar los artículos</li>
              </ul>
            )}
          </Alert>

          {/* Organization Contact */}
          <Card className="bg-primary text-white border-0 mb-4">
            <Card.Body>
              <h6>
                <i className="bi bi-telephone me-2"></i>
                Contacto de la organización
              </h6>
              <p className="mb-2">
                Si tienes preguntas sobre tu {donationInfo.text.toLowerCase()}, 
                puedes contactar directamente con {organization.name}:
              </p>
              <div className="d-flex align-items-center">
                <i className="bi bi-phone me-2"></i>
                <span>+502 4220-2210</span>
              </div>
            </Card.Body>
          </Card>

          {/* Email Confirmation Alert */}
          {emailSent && (
            <Alert variant="success" className="border-0 mb-4">
              <i className="bi bi-envelope-check me-2"></i>
              ¡Comprobante enviado exitosamente a {donationData.donor.email}!
            </Alert>
          )}

          {/* Action Buttons */}
          <Row className="g-2">
            {donationData.donationType === 'money' && (
              <Col md={6}>
                <Button 
                  variant="outline-primary" 
                  className="w-100"
                  onClick={() => setShowReceiptModal(true)}
                >
                  <i className="bi bi-envelope me-2"></i>
                  Enviar comprobante por email
                </Button>
              </Col>
            )}
            
            <Col md={donationData.donationType === 'money' ? 6 : 12}>
              <Button 
                variant="primary" 
                className="w-100"
                onClick={onNewDonation}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Hacer otra donación
              </Button>
            </Col>
          </Row>

          {/* Social Sharing */}
          <div className="text-center mt-4">
            <h6 className="text-muted mb-3">Comparte tu buena acción</h6>
            <div className="d-flex justify-content-center gap-2">
              <Button variant="outline-primary" size="sm">
                <i className="bi bi-facebook"></i>
              </Button>
              <Button variant="outline-info" size="sm">
                <i className="bi bi-twitter"></i>
              </Button>
              <Button variant="outline-success" size="sm">
                <i className="bi bi-whatsapp"></i>
              </Button>
              <Button variant="outline-secondary" size="sm">
                <i className="bi bi-share"></i>
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Receipt Modal */}
      <Modal show={showReceiptModal} onHide={() => setShowReceiptModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-envelope me-2"></i>
            Enviar comprobante
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-envelope-heart text-primary mb-3" style={{ fontSize: '3rem' }}></i>
            <h5>¿Enviar comprobante por email?</h5>
            <p className="text-muted">
              Se enviará un comprobante detallado de tu donación a:
            </p>
            <strong>{donationData.donor.email}</strong>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowReceiptModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSendReceipt} disabled={emailSent}>
            {emailSent ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Enviando...</span>
                </div>
                Enviando...
              </>
            ) : (
              <>
                <i className="bi bi-send me-2"></i>
                Enviar comprobante
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DonationConfirmation