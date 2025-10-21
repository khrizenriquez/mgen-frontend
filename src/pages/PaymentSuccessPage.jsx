/**
 * Payment Success Page
 * Handles PayU payment return and shows payment result
 */
import React from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Alert, Button, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import { usePaymentStatus } from '../hooks/usePayU.js'

const PaymentSuccessPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Extract parameters from URL
  const referenceCode = searchParams.get('referenceCode')
  const transactionId = searchParams.get('transactionId')
  const paymentStatus = searchParams.get('lapPaymentMethodType') // PayU response parameter

  // Try to get donation ID from various sources
  const donationId = searchParams.get('donationId') ||
                    searchParams.get('extra1') || // Custom parameter
                    null

  // Query payment status if we have a reference code
  const { data: status, isLoading, error } = usePaymentStatus(null, {
    enabled: !!referenceCode,
    // Poll for status updates in case webhook hasn't processed yet
    refetchInterval: (data) => {
      const isPending = data?.status === 'PENDING'
      return isPending ? 10000 : false // Poll every 10 seconds if pending
    }
  })

  // Auto-redirect after successful payment
  React.useEffect(() => {
    if (status?.status === 'APPROVED') {
      const timer = setTimeout(() => {
        navigate('/donations', {
          state: {
            message: t('payment.successRedirect', 'Pago procesado exitosamente'),
            type: 'success'
          }
        })
      }, 5000) // Redirect after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [status, navigate, t])

  const getStatusVariant = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'success'
      case 'PENDING':
        return 'warning'
      case 'DECLINED':
      case 'ERROR':
        return 'danger'
      default:
        return 'info'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bi-check-circle-fill'
      case 'PENDING':
        return 'bi-clock'
      case 'DECLINED':
      case 'ERROR':
        return 'bi-x-circle-fill'
      default:
        return 'bi-info-circle-fill'
    }
  }

  const getStatusMessage = (status) => {
    switch (status) {
      case 'APPROVED':
        return t('payment.successMessage', '¡Su pago ha sido procesado exitosamente!')
      case 'PENDING':
        return t('payment.pendingMessage', 'Su pago está siendo procesado. Recibirá una confirmación por email.')
      case 'DECLINED':
        return t('payment.declinedMessage', 'Su pago fue rechazado. Por favor, inténtelo nuevamente o contacte a soporte.')
      case 'ERROR':
        return t('payment.errorMessage', 'Ocurrió un error al procesar su pago. Por favor, contacte a soporte.')
      default:
        return t('payment.processingMessage', 'Estamos verificando el estado de su pago...')
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow">
            <Card.Header className="text-center bg-light">
              <h2 className="mb-0">
                {t('payment.result', 'Resultado del Pago')}
              </h2>
            </Card.Header>

            <Card.Body className="text-center py-5">
              {isLoading ? (
                <div>
                  <Spinner animation="border" size="lg" className="mb-3" />
                  <h4>{t('payment.verifying', 'Verificando pago...')}</h4>
                  <p className="text-muted">
                    {t('payment.verifyingMessage', 'Por favor espere mientras confirmamos el estado de su pago.')}
                  </p>
                </div>
              ) : error ? (
                <div>
                  <i className="bi bi-exclamation-triangle-fill text-warning fs-1 mb-3"></i>
                  <h4>{t('payment.verificationError', 'Error de verificación')}</h4>
                  <p className="text-muted">
                    {t('payment.verificationErrorMessage',
                      'No pudimos verificar el estado de su pago. Por favor, contacte a soporte si el problema persiste.')}
                  </p>
                </div>
              ) : status ? (
                <div>
                  <i className={`bi ${getStatusIcon(status.status)} fs-1 mb-3 text-${getStatusVariant(status.status)}`}></i>
                  <h4 className={`text-${getStatusVariant(status.status)}`}>
                    {status.status === 'APPROVED' ? t('payment.successTitle', '¡Pago Exitoso!') :
                     status.status === 'PENDING' ? t('payment.pendingTitle', 'Pago en Proceso') :
                     t('payment.resultTitle', 'Resultado del Pago')}
                  </h4>
                  <p className="mb-4">{getStatusMessage(status.status)}</p>

                  <Alert variant={getStatusVariant(status.status)}>
                    <div className="text-start">
                      <strong>{t('payment.details', 'Detalles del pago')}:</strong>
                      <br />
                      {referenceCode && (
                        <><strong>{t('payment.reference', 'Referencia')}:</strong> {referenceCode}<br /></>
                      )}
                      {transactionId && (
                        <><strong>{t('payment.transactionId', 'ID de transacción')}:</strong> {transactionId}<br /></>
                      )}
                      {status.payu_order_id && (
                        <><strong>{t('payment.orderId', 'ID de orden PayU')}:</strong> {status.payu_order_id}<br /></>
                      )}
                      {status.amount && (
                        <><strong>{t('payment.amount', 'Monto')}:</strong> Q{status.amount}<br /></>
                      )}
                      <strong>{t('payment.status', 'Estado')}:</strong> {status.status}
                    </div>
                  </Alert>

                  {status.status === 'APPROVED' && (
                    <p className="text-muted small mt-3">
                      {t('payment.redirectMessage', 'Será redirigido automáticamente en unos segundos...')}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <i className="bi bi-question-circle-fill text-info fs-1 mb-3"></i>
                  <h4>{t('payment.noInfo', 'Información no disponible')}</h4>
                  <p className="text-muted">
                    {t('payment.noInfoMessage',
                      'No se pudo obtener información del pago. Por favor, revise sus donaciones para ver el estado.')}
                  </p>
                </div>
              )}
            </Card.Body>

            <Card.Footer className="text-center">
              <div className="d-flex justify-content-center gap-2">
                <Button
                  as={Link}
                  to="/donations"
                  variant="primary"
                >
                  {t('common.viewDonations', 'Ver mis donaciones')}
                </Button>
                <Button
                  as={Link}
                  to="/donate"
                  variant="outline-primary"
                >
                  {t('common.makeAnotherDonation', 'Hacer otra donación')}
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default PaymentSuccessPage
