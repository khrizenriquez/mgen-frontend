/**
 * Donations List Page Component
 * Updated to use PayU payment integration
 */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import { useDonations } from '../hooks/useDonations.js'
import DonationCard from '../components/donation/DonationCard.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'

const DonationsPage = () => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading, error, refetch } = useDonations()

  const donations = data?.donations || []

  // Filter donations based on search and status
  const filteredDonations = donations.filter(donation => {
    const matchesSearch = !searchTerm ||
      donation.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.reference_code?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !statusFilter || donation.status_id?.toString() === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleRefresh = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <Container className="py-5">
        <LoadingSpinner text={t('donation.loading', 'Cargando donaciones...')} />
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>{t('common.error', 'Error')}</h4>
          <p>{t('donation.errorLoading', 'Error al cargar las donaciones')}</p>
          <Button onClick={handleRefresh} variant="outline-danger">
            {t('common.retry', 'Reintentar')}
          </Button>
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">
            {t('navigation.donations', 'Donaciones')}
          </h1>
          <p className="text-muted mb-0">
            {t('donations.subtitle', 'Gestiona y realiza seguimiento de todas las donaciones')}
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            {t('common.refresh', 'Actualizar')}
          </Button>
          <Button as={Link} to="/donate" variant="primary">
            <i className="bi bi-plus-circle me-1"></i>
            {t('common.makeDonation', 'Hacer Donación')}
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      {data && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-primary">{data.total || 0}</h3>
                <p className="text-muted mb-0">
                  {t('donations.total', 'Total Donaciones')}
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-success">
                  Q{(data.total_amount || 0).toLocaleString()}
                </h3>
                <p className="text-muted mb-0">
                  {t('donations.totalAmount', 'Monto Total')}
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-warning">
                  {data.pending_count || 0}
                </h3>
                <p className="text-muted mb-0">
                  {t('donations.pending', 'Pendientes')}
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-info">
                  {data.approved_count || 0}
                </h3>
                <p className="text-muted mb-0">
                  {t('donations.approved', 'Aprobadas')}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>{t('common.search', 'Buscar')}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t('donations.searchPlaceholder', 'Buscar por nombre, email o referencia...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>{t('donation.status', 'Estado')}</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">{t('common.all', 'Todos')}</option>
                  <option value="1">{t('payment.status.pending', 'Pendiente')}</option>
                  <option value="2">{t('payment.status.approved', 'Aprobado')}</option>
                  <option value="3">{t('payment.status.declined', 'Rechazado')}</option>
                  <option value="4">{t('payment.status.expired', 'Expirado')}</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('')
                }}
                className="w-100"
              >
                {t('common.clear', 'Limpiar')}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Donations List */}
      <div className="mb-4">
        <h5 className="mb-3">
          {t('donations.found', '{{count}} donaciones encontradas', { count: filteredDonations.length })}
        </h5>

        {filteredDonations.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <i className="bi bi-inbox text-muted fs-1 mb-3"></i>
              <h5 className="text-muted">
                {t('donations.noDonations', 'No se encontraron donaciones')}
              </h5>
              <p className="text-muted mb-3">
                {searchTerm || statusFilter
                  ? t('donations.noDonationsFiltered', 'No hay donaciones que coincidan con los filtros aplicados')
                  : t('donations.noDonationsMessage', 'Aún no hay donaciones registradas')
                }
              </p>
              {(searchTerm || statusFilter) && (
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('')
                  }}
                >
                  {t('common.clearFilters', 'Limpiar filtros')}
                </Button>
              )}
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {filteredDonations.map((donation) => (
              <Col key={donation.id} lg={12} className="mb-3">
                <DonationCard
                  donation={donation}
                  showActions={true}
                  showPaymentStatus={true}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Load More - if pagination is implemented */}
      {data && data.total > filteredDonations.length && (
        <div className="text-center">
          <Button variant="outline-primary">
            {t('common.loadMore', 'Cargar más')}
          </Button>
        </div>
      )}
    </Container>
  )
}

export default DonationsPage