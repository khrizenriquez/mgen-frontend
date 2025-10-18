/**
 * Admin Donations Management Page
 * CRUD interface for managing donations in the system
 */
import { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Table, Badge, Modal, Form, Alert, InputGroup, Spinner, Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../core/services/api.js'

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showProcessModal, setShowProcessModal] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [processingAction, setProcessingAction] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    loadDonations()
  }, [])

  const loadDonations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/admin/donations')
      setDonations(response.data.donations || [])
    } catch (err) {
      console.error('Error loading donations:', err)
      setError('Error al cargar las donaciones')
    } finally {
      setLoading(false)
    }
  }

  const handleProcessDonation = async (action) => {
    try {
      setFormLoading(true)
      if (action === 'approve') {
        await api.post(`/admin/donations/${selectedDonation.id}/approve`)
      } else if (action === 'reject') {
        await api.post(`/admin/donations/${selectedDonation.id}/reject`)
      }

      setShowProcessModal(false)
      setSelectedDonation(null)
      setProcessingAction('')
      await loadDonations()
    } catch (err) {
      console.error('Error processing donation:', err)
      setError(`Error al ${action === 'approve' ? 'aprobar' : 'rechazar'} la donación`)
    } finally {
      setFormLoading(false)
    }
  }

  const openProcessModal = (donation, action) => {
    setSelectedDonation(donation)
    setProcessingAction(action)
    setShowProcessModal(true)
  }

  const filteredDonations = donations.filter(donation => {
    const matchesSearch =
      donation.donor_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donation.donor_name && donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      donation.reference_code.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !statusFilter || donation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: 'warning',
      APPROVED: 'success',
      DECLINED: 'danger',
      EXPIRED: 'secondary'
    }
    const displayText = {
      PENDING: 'Pendiente',
      APPROVED: 'Aprobada',
      DECLINED: 'Rechazada',
      EXPIRED: 'Expirada'
    }
    return <Badge bg={variants[status] || 'secondary'}>{displayText[status] || status}</Badge>
  }

  const getStatusOptions = () => [
    { value: '', label: 'Todos los estados' },
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'APPROVED', label: 'Aprobada' },
    { value: 'DECLINED', label: 'Rechazada' },
    { value: 'EXPIRED', label: 'Expirada' }
  ]

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Cargando donaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-donations">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">Gestión de Donaciones</h1>
          <p className="text-muted mb-0">Revisa y administra todas las donaciones del sistema</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={loadDonations}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Actualizar
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Row className="g-4 mb-4">
        <Col lg={12}>
          <Card>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Buscar por email, nombre o referencia..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    {getStatusOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2} className="text-end">
                  <small className="text-muted">
                    {filteredDonations.length} de {donations.length} donaciones
                  </small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Donations Table */}
      <Row className="g-4">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Lista de Donaciones</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Donante</th>
                      <th>Monto</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Referencia</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.map((donation) => (
                      <tr key={donation.id}>
                        <td>
                          <code className="text-muted small">
                            {donation.id.substring(0, 8)}...
                          </code>
                        </td>
                        <td>
                          <div>
                            <div className="fw-medium">
                              {donation.donor_name || donation.donor_email}
                            </div>
                            <div className="text-muted small">
                              {donation.donor_email}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="fw-bold text-success">
                            Q{donation.amount_gtq.toLocaleString()}
                          </div>
                        </td>
                        <td>{getStatusBadge(donation.status)}</td>
                        <td className="text-muted small">
                          {new Date(donation.created_at).toLocaleDateString('es-GT')}
                        </td>
                        <td>
                          <code className="text-muted small">
                            {donation.reference_code}
                          </code>
                        </td>
                        <td className="text-center">
                          <div className="btn-group" role="group">
                            <Button
                              variant="outline-info"
                              size="sm"
                              as={Link}
                              to={`/donations/${donation.id}`}
                              title="Ver detalles"
                            >
                              <i className="bi bi-eye"></i>
                            </Button>
                            {donation.status === 'PENDING' && (
                              <>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  onClick={() => openProcessModal(donation, 'approve')}
                                  title="Aprobar"
                                >
                                  <i className="bi bi-check-circle"></i>
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => openProcessModal(donation, 'reject')}
                                  title="Rechazar"
                                >
                                  <i className="bi bi-x-circle"></i>
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {filteredDonations.length === 0 && (
                <div className="text-center py-5">
                  <i className="bi bi-cash-stack text-muted" style={{fontSize: '3rem'}}></i>
                  <h5 className="mt-3 text-muted">
                    {searchTerm || statusFilter ? 'No se encontraron donaciones' : 'No hay donaciones registradas'}
                  </h5>
                  <p className="text-muted">
                    {searchTerm || statusFilter
                      ? 'Intenta con otros términos de búsqueda o filtros'
                      : 'Las donaciones aparecerán aquí cuando los usuarios las realicen'
                    }
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Process Donation Modal */}
      <Modal show={showProcessModal} onHide={() => setShowProcessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {processingAction === 'approve' ? 'Aprobar Donación' : 'Rechazar Donación'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <div className={`bg-${processingAction === 'approve' ? 'success' : 'danger'} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
                 style={{width: '60px', height: '60px'}}>
              <i className={`bi bi-${processingAction === 'approve' ? 'check-circle' : 'x-circle'} text-${processingAction === 'approve' ? 'success' : 'danger'} fs-1`}></i>
            </div>
            <h5>
              {processingAction === 'approve' ? '¿Aprobar esta donación?' : '¿Rechazar esta donación?'}
            </h5>
          </div>

          {selectedDonation && (
            <Card className="bg-light">
              <Card.Body>
                <Row className="text-center">
                  <Col md={4}>
                    <div className="fw-bold text-success mb-1">
                      Q{selectedDonation.amount_gtq.toLocaleString()}
                    </div>
                    <small className="text-muted">Monto</small>
                  </Col>
                  <Col md={4}>
                    <div className="fw-medium mb-1">
                      {selectedDonation.donor_name || selectedDonation.donor_email}
                    </div>
                    <small className="text-muted">Donante</small>
                  </Col>
                  <Col md={4}>
                    <div className="mb-1">
                      {getStatusBadge(selectedDonation.status)}
                    </div>
                    <small className="text-muted">Estado</small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          <Alert variant={processingAction === 'approve' ? 'success' : 'warning'} className="mt-3">
            <strong>Nota:</strong> Esta acción {processingAction === 'approve' ? 'aprobará' : 'rechazará'} la donación y
            {processingAction === 'approve'
              ? ' notificará al donante sobre la aprobación.'
              : ' el donante podrá volver a intentar o contactar soporte.'
            }
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProcessModal(false)}>
            Cancelar
          </Button>
          <Button
            variant={processingAction === 'approve' ? 'success' : 'danger'}
            onClick={() => handleProcessDonation(processingAction)}
            disabled={formLoading}
          >
            {formLoading ? <Spinner animation="border" size="sm" /> : null}
            {processingAction === 'approve' ? 'Aprobar Donación' : 'Rechazar Donación'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
