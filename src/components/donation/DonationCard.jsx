/**
 * Donation Card Component
 * Displays donation information with PayU payment integration
 */
import React from 'react'
import { Card, Button, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import PayUButton from './PayUButton.jsx'
import PaymentStatus from './PaymentStatus.jsx'

export const DonationCard = ({
  donation,
  showActions = true,
  showPaymentStatus = true,
  className = '',
  ...props
}) => {
  const { t } = useTranslation()

  if (!donation) return null

  const isPaymentCompleted = donation.status_id === 2 // APPROVED
  const isPaymentPending = donation.status_id === 1 // PENDING
  const canPay = isPaymentPending && !donation.payu_order_id

  const handlePaymentSuccess = () => {
    toast.success(t('payment.initiated', 'Pago iniciado correctamente'))
  }

  const handlePaymentError = (error) => {
    console.error('Payment error:', error)
    toast.error(t('payment.error', 'Error al procesar el pago'))
  }

  return (
    <Card className={`mb-3 ${className}`} {...props}>
      <Card.Body>
        <Row className="align-items-center">
          <Col md={8}>
            <div className="d-flex align-items-start">
              <div className="flex-grow-1">
                <Card.Title className="mb-1">
                  {donation.donor_name || t('donation.anonymous', 'Donante Anónimo')}
                </Card.Title>
                <Card.Subtitle className="text-muted mb-2">
                  {donation.donor_email}
                </Card.Subtitle>

                <Row className="mb-2">
                  <Col xs={6} sm={3}>
                    <small className="text-muted d-block">
                      {t('donation.amount', 'Monto')}
                    </small>
                    <strong className="text-primary">
                      {donation.formatted_amount}
                    </strong>
                  </Col>
                  <Col xs={6} sm={3}>
                    <small className="text-muted d-block">
                      {t('donation.status', 'Estado')}
                    </small>
                    {showPaymentStatus ? (
                      <PaymentStatus
                        donationId={donation.id}
                        showIcon={true}
                        polling={isPaymentPending}
                      />
                    ) : (
                      <span className="badge bg-secondary">
                        {donation.status_name || t('donation.unknown', 'Desconocido')}
                      </span>
                    )}
                  </Col>
                  <Col xs={12} sm={6}>
                    <small className="text-muted d-block">
                      {t('donation.reference', 'Referencia')}
                    </small>
                    <code className="small">{donation.reference_code}</code>
                  </Col>
                </Row>

                <small className="text-muted">
                  {t('donation.created', 'Creado')}: {new Date(donation.created_at).toLocaleDateString()}
                  {donation.paid_at && (
                    <>
                      {' • '}
                      {t('donation.paid', 'Pagado')}: {new Date(donation.paid_at).toLocaleDateString()}
                    </>
                  )}
                </small>
              </div>
            </div>
          </Col>

          <Col md={4} className="text-end">
            {showActions && (
              <div className="d-flex flex-column gap-2">
                <Button
                  as={Link}
                  to={`/donations/${donation.id}`}
                  variant="outline-primary"
                  size="sm"
                >
                  {t('common.view', 'Ver')}
                </Button>

                {canPay && (
                  <PayUButton
                    donationId={donation.id}
                    size="sm"
                    className="w-100"
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  >
                    {t('payment.payNow', 'Pagar Ahora')}
                  </PayUButton>
                )}

                {donation.payu_order_id && (
                  <Button
                    as={Link}
                    to={`/donations/${donation.id}/payment`}
                    variant="outline-info"
                    size="sm"
                    className="w-100"
                  >
                    {t('payment.viewStatus', 'Ver Estado')}
                  </Button>
                )}

                {isPaymentCompleted && (
                  <div className="text-center">
                    <i className="bi bi-check-circle-fill text-success fs-4"></i>
                    <br />
                    <small className="text-success">
                      {t('payment.completed', 'Completado')}
                    </small>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default DonationCard
