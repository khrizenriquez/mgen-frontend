/**
 * Admin Users Management Page
 * CRUD interface for managing users in the system
 */
import { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Table, Badge, Modal, Form, Alert, InputGroup, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../core/services/api.js'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'USER',
    is_active: true
  })
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/admin/users')
      setUsers(response.data.users || [])
    } catch (err) {
      console.error('Error loading users:', err)
      setError('Error al cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      setFormLoading(true)
      await api.post('/admin/users', formData)
      setShowCreateModal(false)
      setFormData({ email: '', first_name: '', last_name: '', role: 'USER', is_active: true })
      await loadUsers()
    } catch (err) {
      console.error('Error creating user:', err)
      setError('Error al crear el usuario')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      setFormLoading(true)
      await api.put(`/admin/users/${selectedUser.id}`, formData)
      setShowEditModal(false)
      setSelectedUser(null)
      setFormData({ email: '', first_name: '', last_name: '', role: 'USER', is_active: true })
      await loadUsers()
    } catch (err) {
      console.error('Error updating user:', err)
      setError('Error al actualizar el usuario')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return

    try {
      await api.delete(`/admin/users/${userId}`)
      await loadUsers()
    } catch (err) {
      console.error('Error deleting user:', err)
      setError('Error al eliminar el usuario')
    }
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setFormData({
      email: user.email,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      role: user.roles?.[0] || 'USER',
      is_active: user.is_active
    })
    setShowEditModal(true)
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadge = (role) => {
    const variants = {
      ADMIN: 'danger',
      DONOR: 'success',
      USER: 'primary'
    }
    const displayText = {
      ADMIN: 'Admin',
      DONOR: 'Donante',
      USER: 'Usuario'
    }
    return <Badge bg={variants[role] || 'secondary'}>{displayText[role] || role}</Badge>
  }

  const getStatusBadge = (isActive) => {
    return (
      <Badge bg={isActive ? 'success' : 'secondary'}>
        {isActive ? 'Activo' : 'Inactivo'}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-users">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">Gestión de Usuarios</h1>
          <p className="text-muted mb-0">Administra los usuarios del sistema</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-plus-circle me-1"></i>
          Nuevo Usuario
        </Button>
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
                      placeholder="Buscar por email o nombre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={6} className="text-end">
                  <small className="text-muted">
                    {filteredUsers.length} de {users.length} usuarios
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

      {/* Users Table */}
      <Row className="g-4">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Lista de Usuarios</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Usuario</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Registro</th>
                      <th>Último Acceso</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                                 style={{width: '40px', height: '40px'}}>
                              <span className="text-primary fw-medium">
                                {user.email.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="fw-medium">{user.email}</div>
                              <div className="text-muted small">
                                {user.first_name && user.last_name
                                  ? `${user.first_name} ${user.last_name}`
                                  : 'Sin nombre completo'
                                }
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{getRoleBadge(user.roles?.[0] || 'USER')}</td>
                        <td>{getStatusBadge(user.is_active)}</td>
                        <td className="text-muted small">
                          {new Date(user.created_at).toLocaleDateString('es-GT')}
                        </td>
                        <td className="text-muted small">
                          {user.last_login_at
                            ? new Date(user.last_login_at).toLocaleDateString('es-GT')
                            : 'Nunca'
                          }
                        </td>
                        <td className="text-center">
                          <div className="btn-group" role="group">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => openEditModal(user)}
                              title="Editar"
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
                              title="Eliminar"
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-5">
                  <i className="bi bi-people text-muted" style={{fontSize: '3rem'}}></i>
                  <h5 className="mt-3 text-muted">
                    {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
                  </h5>
                  <p className="text-muted">
                    {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Crea el primer usuario del sistema'}
                  </p>
                  {!searchTerm && (
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                      <i className="bi bi-plus-circle me-1"></i>
                      Crear Usuario
                    </Button>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create User Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Usuario</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreate}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="USER">Usuario</option>
                <option value="DONOR">Donante</option>
                <option value="ADMIN">Administrador</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Usuario activo"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={formLoading}>
              {formLoading ? <Spinner animation="border" size="sm" /> : null}
              Crear Usuario
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEdit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="USER">Usuario</option>
                <option value="DONOR">Donante</option>
                <option value="ADMIN">Administrador</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Usuario activo"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={formLoading}>
              {formLoading ? <Spinner animation="border" size="sm" /> : null}
              Actualizar Usuario
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}
