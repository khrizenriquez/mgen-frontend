/**
 * Payment Status Component
 * Displays PayU payment status with appropriate styling
 */
import React from 'react'
import { Badge, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { usePaymentStatus } from '../../hooks/usePayU.js'

const PAYMENT_STATUS_VARIANTS = {
  PENDING: 'warning',
  APPROVED: 'success',
  DECLINED: 'danger',
  EXPIRED: 'secondary',
  ERROR: 'danger',
  default: 'secondary'
}

const PAYMENT_STATUS_TEXT = {
  PENDING: 'payment.status.pending',
  APPROVED: 'payment.status.approved',
  DECLINED: 'payment.status.declined',
  EXPIRED: 'payment.status.expired',
  ERROR: 'payment.status.error'
}

export const PaymentStatus = ({
  donationId,
  showIcon = false,
  polling = false,
  pollingInterval = 30000, // 30 seconds
  className = '',
  ...props
}) => {
  const { t } = useTranslation()

  const { data: status, isLoading, error } = usePaymentStatus(donationId, {
    enabled: !!donationId,
    refetchInterval: polling ? pollingInterval : false
  })

  if (isLoading) {
    return (
      <div className={`d-inline-flex align-items-center ${className}`}>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2"
        />
        <small className="text-muted">
          {t('payment.status.checking', 'Verificando...')}
        </small>
      </div>
    )
  }

  if (error) {
    return (
      <Badge
        bg="danger"
        className={className}
        {...props}
      >
        {showIcon && <i className="bi bi-exclamation-triangle me-1"></i>}
        {t('payment.status.error', 'Error')}
      </Badge>
    )
  }

  if (!status) {
    return (
      <Badge
        bg="secondary"
        className={className}
        {...props}
      >
        {showIcon && <i className="bi bi-question-circle me-1"></i>}
        {t('payment.status.unknown', 'Desconocido')}
      </Badge>
    )
  }

  const variant = PAYMENT_STATUS_VARIANTS[status.status] || PAYMENT_STATUS_VARIANTS.default
  const textKey = PAYMENT_STATUS_TEXT[status.status] || 'payment.status.unknown'
  const displayText = t(textKey, status.status || 'Desconocido')

  // Add icons based on status
  const getStatusIcon = (status) => {
    const icons = {
      PENDING: 'bi-clock',
      APPROVED: 'bi-check-circle',
      DECLINED: 'bi-x-circle',
      EXPIRED: 'bi-dash-circle',
      ERROR: 'bi-exclamation-triangle'
    }
    return icons[status] || 'bi-question-circle'
  }

  return (
    <Badge
      bg={variant}
      className={className}
      {...props}
    >
      {showIcon && (
        <i className={`bi ${getStatusIcon(status.status)} me-1`}></i>
      )}
      {displayText}
    </Badge>
  )
}

export default PaymentStatus
