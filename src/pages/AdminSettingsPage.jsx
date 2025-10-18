/**
 * Admin Settings Page
 * System configuration and user profile management
 */
import { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Form, Alert, Spinner, Tab, Tabs, Badge, Modal } from 'react-bootstrap'
import api from '../core/services/api.js'
import AuthService from '../core/services/AuthService.js'

export default function AdminSettingsPage() {
  const [user, setUser] = useState(null)
  const [settings, setSettings] = useState({
    // User Profile Settings
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',

    // Communication Preferences
    email_notifications: true,
    sms_notifications: false,
    monthly_reports: true,
    donation_confirmations: true,

    // Privacy Settings
    show_donations_publicly: false,
    allow_contact: true,
    profile_visibility: 'private',

    // System Settings (Admin only)
    system_name: 'Sistema de Donaciones',
    contact_email: '',
    maintenance_mode: false,
    max_donation_amount: 50000,
    min_donation_amount: 1
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      const currentUser = AuthService.getCurrentUser()
      setUser(currentUser)

      // Load user preferences
      const prefsResponse = await api.get('/user/preferences')
      const prefsData = prefsResponse.data

      // Load user profile data
      const profileResponse = await api.get('/user/profile')
      const profileData = profileResponse.data

      setSettings({
        // Profile data
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        email: profileData.email || currentUser?.email || '',
        phone: profileData.phone || '',
        address: profileData.address || '',

        // Communication preferences
        email_notifications: prefsData.communication_preferences?.email_notifications ?? true,
        sms_notifications: prefsData.communication_preferences?.sms_notifications ?? false,
        monthly_reports: prefsData.communication_preferences?.monthly_reports ?? true,
        donation_confirmations: true,

        // Privacy settings
        show_donations_publicly: prefsData.privacy_settings?.show_donations_publicly ?? false,
        allow_contact: prefsData.privacy_settings?.allow_contact ?? true,
        profile_visibility: 'private',

        // System settings (mock for now)
        system_name: 'Sistema de Donaciones',
        contact_email: 'admin@sistemadonaciones.gt',
        maintenance_mode: false,
        max_donation_amount: 50000,
        min_donation_amount: 1
      })

    } catch (err) {
      console.error('Error loading settings:', err)
      // Use current user data as fallback
      const currentUser = AuthService.getCurrentUser()
      setUser(currentUser)
      setSettings(prev => ({
        ...prev,
        email: currentUser?.email || '',
        first_name: currentUser?.first_name || '',
        last_name: currentUser?.last_name || ''
      }))
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)

      await api.put('/user/profile', {
        first_name: settings.first_name,
        last_name: settings.last_name,
        phone: settings.phone,
        address: settings.address
      })

      setSuccess('Perfil actualizado exitosamente')
      setTimeout(() => setSuccess(null), 3000)

    } catch (err) {
      console.error('Error saving profile:', err)
      setError('Error al guardar el perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleSavePreferences = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)

      await api.put('/user/preferences', {
        communication_preferences: {
          email_notifications: settings.email_notifications,
          sms_notifications: settings.sms_notifications,
          monthly_reports: settings.monthly_reports
        },
        privacy_settings: {
          show_donations_publicly: settings.show_donations_publicly,
          allow_contact: settings.allow_contact
        }
      })

      setSuccess('Preferencias guardadas exitosamente')
      setTimeout(() => setSuccess(null), 3000)

    } catch (err) {
      console.error('Error saving preferences:', err)
      setError('Error al guardar las preferencias')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSystemSettings = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)

      await api.put('/admin/settings', {
        system_name: settings.system_name,
        contact_email: settings.contact_email,
        maintenance_mode: settings.maintenance_mode,
        max_donation_amount: settings.max_donation_amount,
        min_donation_amount: settings.min_donation_amount
      })

      setSuccess('Configuración del sistema guardada exitosamente')
      setTimeout(() => setSuccess(null), 3000)

    } catch (err) {
      console.error('Error saving system settings:', err)
      setError('Error al guardar la configuración del sistema')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }

    if (passwordData.new_password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    try {
      setSaving(true)
      setError(null)

      await api.post('/user/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      })

      setShowPasswordModal(false)
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' })
      setSuccess('Contraseña cambiada exitosamente')
      setTimeout(() => setSuccess(null), 3000)

    } catch (err) {
      console.error('Error changing password:', err)
      setError('Error al cambiar la contraseña')
    } finally {
      setSaving(false)
    }
  }

  const isAdmin = user?.roles?.includes('ADMIN')

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-settings">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">Configuración del Sistema</h1>
          <p className="text-muted mb-0">Gestiona tu perfil y las configuraciones del sistema</p>
        </div>
        <Button variant="outline-primary" onClick={loadSettings}>
          <i className="bi bi-arrow-clockwise me-1"></i>
          Actualizar
        </Button>
      </div>

      {/* Success/Error Alerts */}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          <i className="bi bi-check-circle me-2"></i>
          {success}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Settings Tabs */}
      <Tabs defaultActiveKey="profile" className="mb-4">
        {/* Profile Settings */}
        <Tab eventKey="profile" title="Perfil Personal">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Información Personal</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSaveProfile}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        value={settings.first_name}
                        onChange={(e) => setSettings({...settings, first_name: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control
                        type="text"
                        value={settings.last_name}
                        onChange={(e) => setSettings({...settings, last_name: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    required
                    disabled
                  />
                  <Form.Text className="text-muted">
                    El email no se puede cambiar desde aquí. Contacta al administrador si necesitas actualizarlo.
                  </Form.Text>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => setSettings({...settings, phone: e.target.value})}
                        placeholder="+502 1234 5678"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dirección</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={settings.address}
                        onChange={(e) => setSettings({...settings, address: e.target.value})}
                        placeholder="Dirección completa"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary" disabled={saving}>
                    {saving ? <Spinner animation="border" size="sm" /> : null}
                    Guardar Perfil
                  </Button>
                  <Button variant="outline-secondary" onClick={() => setShowPasswordModal(true)}>
                    <i className="bi bi-key me-1"></i>
                    Cambiar Contraseña
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        {/* Communication Preferences */}
        <Tab eventKey="preferences" title="Preferencias">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Preferencias de Comunicación</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSavePreferences}>
                <h6 className="mb-3">Notificaciones</h6>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="email-notifications"
                    label="Notificaciones por email"
                    checked={settings.email_notifications}
                    onChange={(e) => setSettings({...settings, email_notifications: e.target.checked})}
                  />
                  <Form.Text className="text-muted">
                    Recibe notificaciones sobre el estado de tus donaciones y actualizaciones del sistema.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="sms-notifications"
                    label="Notificaciones por SMS"
                    checked={settings.sms_notifications}
                    onChange={(e) => setSettings({...settings, sms_notifications: e.target.checked})}
                  />
                  <Form.Text className="text-muted">
                    Recibe confirmaciones importantes por mensaje de texto.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="monthly-reports"
                    label="Reportes mensuales"
                    checked={settings.monthly_reports}
                    onChange={(e) => setSettings({...settings, monthly_reports: e.target.checked})}
                  />
                  <Form.Text className="text-muted">
                    Recibe un resumen mensual de tu actividad de donaciones.
                  </Form.Text>
                </Form.Group>

                <hr className="my-4" />

                <h6 className="mb-3">Privacidad</h6>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="public-donations"
                    label="Mostrar donaciones públicamente"
                    checked={settings.show_donations_publicly}
                    onChange={(e) => setSettings({...settings, show_donations_publicly: e.target.checked})}
                  />
                  <Form.Text className="text-muted">
                    Permitir que tus donaciones aparezcan en listados públicos y reportes.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="allow-contact"
                    label="Permitir contacto"
                    checked={settings.allow_contact}
                    onChange={(e) => setSettings({...settings, allow_contact: e.target.checked})}
                  />
                  <Form.Text className="text-muted">
                    Permitir que la organización te contacte para actualizaciones importantes.
                  </Form.Text>
                </Form.Group>

                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? <Spinner animation="border" size="sm" /> : null}
                  Guardar Preferencias
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        {/* System Settings (Admin Only) */}
        {isAdmin && (
          <Tab eventKey="system" title="Sistema">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Configuración del Sistema</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSaveSystemSettings}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre del Sistema</Form.Label>
                        <Form.Control
                          type="text"
                          value={settings.system_name}
                          onChange={(e) => setSettings({...settings, system_name: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email de Contacto</Form.Label>
                        <Form.Control
                          type="email"
                          value={settings.contact_email}
                          onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="maintenance-mode"
                      label="Modo de mantenimiento"
                      checked={settings.maintenance_mode}
                      onChange={(e) => setSettings({...settings, maintenance_mode: e.target.checked})}
                    />
                    <Form.Text className="text-muted">
                      Activar modo de mantenimiento para realizar actualizaciones del sistema.
                    </Form.Text>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Monto Mínimo de Donación (Q)</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          value={settings.min_donation_amount}
                          onChange={(e) => setSettings({...settings, min_donation_amount: parseInt(e.target.value)})}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Monto Máximo de Donación (Q)</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          value={settings.max_donation_amount}
                          onChange={(e) => setSettings({...settings, max_donation_amount: parseInt(e.target.value)})}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2">
                    <Button type="submit" variant="primary" disabled={saving}>
                      {saving ? <Spinner animation="border" size="sm" /> : null}
                      Guardar Configuración
                    </Button>
                    <Button variant="outline-info" onClick={() => window.location.reload()}>
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Aplicar Cambios
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Tab>
        )}
      </Tabs>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Contraseña</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleChangePassword}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña Actual</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña Nueva</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                required
                minLength={8}
              />
              <Form.Text className="text-muted">
                Debe tener al menos 8 caracteres.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar Contraseña Nueva</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                required
                minLength={8}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? <Spinner animation="border" size="sm" /> : null}
              Cambiar Contraseña
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}
