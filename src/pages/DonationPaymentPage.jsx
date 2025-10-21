/**
 * Donation Payment Page
 * Allows users to complete payment for a specific donation using PayU
 */
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Alert, Button, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'

import { useDonation } from '../hooks/useDonations.js'
import PayUButton from '../components/donation/PayUButton.jsx'
import PaymentStatus from '../components/donation/PaymentStatus.jsx'

const DonationPaymentPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { donationId } = useParams()

  const { data: donation, isLoading, error } = useDonation(donationId)

  // Redirect if donation doesn't exist or user doesn't have permission
  React.useEffect(() => {
    if (error && error.response?.status === 404) {
      toast.error(t('donation.notFound', 'Donación no encontrada'))
      navigate('/donations')
    } else if (error && error.response?.status === 403) {
      toast.error(t('donation.accessDenied', 'No tienes permiso para acceder a esta donación'))
      navigate('/dashboard')
    }
  }, [error, navigate, t])

  if (isLoading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="text-center">
              <Card.Body className="py-5">
                <Spinner animation="border" role="status" className="mb-3">
                  <span className="visually-hidden">
                    {t('common.loading', 'Cargando...')}
                  </span>
                </Spinner>
                <p>{t('donation.loading', 'Cargando donación...')}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }

  if (!donation) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Alert variant="danger" className="text-center">
              <h4>{t('donation.notFound', 'Donación no encontrada')}</h4>
              <p>{t('donation.notFoundMessage', 'La donación que buscas no existe o no tienes permiso para acceder a ella.')}</p>
              <Button variant="primary" onClick={() => navigate('/donations')}>
                {t('common.backToDonations', 'Volver a donaciones')}
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    )
  }

  // Check if payment is already completed
  const isPaymentCompleted = donation.status_id === 2 // APPROVED
  const isPaymentPending = donation.status_id === 1 // PENDING
  const canPay = isPaymentPending && !donation.payu_order_id

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">
                {t('payment.completeDonation', 'Completar Donación')}
              </h3>
            </Card.Header>

            <Card.Body>
              {/* Donation Summary */}
              <div className="mb-4">
                <h5>{t('donation.details', 'Detalles de la donación')}</h5>
                <Row>
                  <Col sm={6}>
                    <strong>{t('donation.donor', 'Donante')}:</strong> {donation.donor_name}
                  </Col>
                  <Col sm={6}>
                    <strong>{t('donation.email', 'Email')}:</strong> {donation.donor_email}
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col sm={6}>
                    <strong>{t('donation.amount', 'Monto')}:</strong> {donation.formatted_amount}
                  </Col>
                  <Col sm={6}>
                    <strong>{t('donation.status', 'Estado')}:</strong>{' '}
                    <PaymentStatus
                      donationId={donation.id}
                      showIcon={true}
                      polling={isPaymentPending}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col sm={6}>
                    <strong>{t('donation.reference', 'Referencia')}:</strong> {donation.reference_code}
                  </Col>
                  <Col sm={6}>
                    <strong>{t('donation.date', 'Fecha')}:</strong>{' '}
                    {new Date(donation.created_at).toLocaleDateString()}
                  </Col>
                </Row>
              </div>

              {/* Payment Section */}
              <div className="border-top pt-4">
                <h5>{t('payment.paymentMethod', 'Método de pago')}</h5>

                {isPaymentCompleted ? (
                  <Alert variant="success">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {t('payment.alreadyCompleted', 'Esta donación ya ha sido pagada exitosamente.')}
                  </Alert>
                ) : donation.payu_order_id ? (
                  <Alert variant="info">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    {t('payment.inProgress', 'El pago está en proceso.')}
                    <div className="mt-2">
                      <small className="text-muted">
                        {t('payment.orderId', 'ID de orden PayU')}: {donation.payu_order_id}
                      </small>
                    </div>
                  </Alert>
                ) : canPay ? (
                  <div className="text-center">
                    <p className="mb-3">
                      {t('payment.payWithPayUDescription',
                        'Complete su donación de forma segura usando PayU, nuestro procesador de pagos confiable.')}
                    </p>
                    <PayUButton
                      donationId={donation.id}
                      size="lg"
                      onSuccess={() => {
                        toast.success(t('payment.redirecting', 'Redirigiendo a PayU...'))
                      }}
                      onError={(error) => {
                        toast.error(t('payment.error', 'Error al procesar el pago'))
                        console.error('Payment error:', error)
                      }}
                    />
                    <p className="text-muted mt-3 small">
                      {t('payment.secureNote', 'Pago procesado de forma segura por PayU')}
                    </p>
                  </div>
                ) : (
                  <Alert variant="warning">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {t('payment.cannotPay', 'No se puede procesar el pago para esta donación en este momento.')}
                  </Alert>
                )}
              </div>
            </Card.Body>

            <Card.Footer className="text-center">
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/donations')}
              >
                {t('common.backToDonations', 'Volver a donaciones')}
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default DonationPaymentPage
