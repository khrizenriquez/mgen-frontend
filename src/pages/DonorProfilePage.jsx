/**
 * Donor Profile Page
 * Profile management page for registered donors
 */
import { useState } from 'react'
import { Card, Row, Col, Button, Form, Alert, Tab, Tabs, Badge } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import AuthService from '../core/services/AuthService'

// Validation schemas for different sections
const personalInfoSchema = yup.object({
  name: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .required('El nombre es requerido'),
  email: yup
    .string()
    .email('Ingresa un correo electrónico válido')
    .required('El correo electrónico es requerido'),
})

const contactInfoSchema = yup.object({
  phoneNumber: yup
    .string()
    .matches(/^(\+502\s?)?[0-9\s\-\(\)]{8,}$/, 'Ingresa un número de teléfono válido para Guatemala')
    .nullable(),
  address: yup
    .string()
    .max(255, 'La dirección no puede tener más de 255 caracteres')
    .nullable(),
  contactPreference: yup
    .string()
    .oneOf(['email', 'phone', 'mail'], 'Selecciona una preferencia de contacto válida')
    .required('La preferencia de contacto es requerida'),
})

const passwordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('La contraseña actual es requerida'),
  newPassword: yup
    .string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número')
    .required('La nueva contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden')
    .required('Confirma la nueva contraseña'),
})

export default function DonorProfilePage() {
  const [activeTab, setActiveTab] = useState('personal')
  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState('')
  const [saveError, setSaveError] = useState('')

  // Mock current user data - will be replaced with real API call
  const currentUser = {
    name: 'María González',
    email: 'maria@example.com',
    phoneNumber: '+502 5555 1234',
    address: 'Zona 10, Ciudad de Guatemala',
    contactPreference: 'email',
    emailVerified: true,
    memberSince: '2023-03-10',
    totalDonations: 28,
    totalAmount: 8750.00
  }

  // Form hooks for different sections
  const personalForm = useForm({
    resolver: yupResolver(personalInfoSchema),
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email
    },
    mode: 'onBlur'
  })

  const contactForm = useForm({
    resolver: yupResolver(contactInfoSchema),
    defaultValues: {
      phoneNumber: currentUser.phoneNumber || '',
      address: currentUser.address || '',
      contactPreference: currentUser.contactPreference
    },
    mode: 'onBlur'
  })

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
    mode: 'onBlur'
  })

  const handleSavePersonalInfo = async (data) => {
    setIsLoading(true)
    setSaveSuccess('')
    setSaveError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // TODO: Replace with real API call
      console.log('Updating personal info:', data)

      setSaveSuccess('Información personal actualizada exitosamente')
      setTimeout(() => setSaveSuccess(''), 3000)
    } catch (error) {
      setSaveError(error.message || 'Error al actualizar la información personal')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveContactInfo = async (data) => {
    setIsLoading(true)
    setSaveSuccess('')
    setSaveError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // TODO: Replace with real API call
      console.log('Updating contact info:', data)

      setSaveSuccess('Información de contacto actualizada exitosamente')
      setTimeout(() => setSaveSuccess(''), 3000)
    } catch (error) {
      setSaveError(error.message || 'Error al actualizar la información de contacto')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (data) => {
    setIsLoading(true)
    setSaveSuccess('')
    setSaveError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200))

      // TODO: Replace with real API call
      console.log('Changing password:', data)

      setSaveSuccess('Contraseña cambiada exitosamente')
      passwordForm.reset()
      setTimeout(() => setSaveSuccess(''), 3000)
    } catch (error) {
      setSaveError(error.message || 'Error al cambiar la contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="donor-profile">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-1">Mi Perfil</h1>
            <p className="text-muted mb-0">Gestiona tu información personal y preferencias</p>
          </div>
          <Badge bg="success" className="fs-6 px-3 py-2">
            Donante Oro
          </Badge>
        </div>

        {/* Success/Error Messages */}
        {saveSuccess && (
          <Alert variant="success" className="mb-4">
            <i className="bi bi-check-circle me-2"></i>
            {saveSuccess}
          </Alert>
        )}

        {saveError && (
          <Alert variant="danger" className="mb-4">
            <i className="bi bi-exclamation-circle me-2"></i>
            {saveError}
          </Alert>
        )}

        {/* Profile Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          {/* Personal Information Tab */}
          <Tab eventKey="personal" title="Información Personal">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Datos Personales</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={personalForm.handleSubmit(handleSavePersonalInfo)} noValidate>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Tu nombre completo"
                          {...personalForm.register('name')}
                          isInvalid={!!personalForm.formState.errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {personalForm.formState.errors.name?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="tu@email.com"
                          {...personalForm.register('email')}
                          isInvalid={!!personalForm.formState.errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {personalForm.formState.errors.email?.message}
                        </Form.Control.Feedback>
                        {currentUser.emailVerified && (
                          <Form.Text className="text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Correo verificado
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="small" text="" className="me-2" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save me-1"></i>
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Tab>

          {/* Contact Information Tab */}
          <Tab eventKey="contact" title="Información de Contacto">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Datos de Contacto</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={contactForm.handleSubmit(handleSaveContactInfo)} noValidate>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Número de Teléfono</Form.Label>
                        <Form.Control
                          type="tel"
                          placeholder="+502 5555 1234"
                          {...contactForm.register('phoneNumber')}
                          isInvalid={!!contactForm.formState.errors.phoneNumber}
                        />
                        <Form.Control.Feedback type="invalid">
                          {contactForm.formState.errors.phoneNumber?.message}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Opcional. Incluye código de país (+502)
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Tu dirección completa"
                          {...contactForm.register('address')}
                          isInvalid={!!contactForm.formState.errors.address}
                        />
                        <Form.Control.Feedback type="invalid">
                          {contactForm.formState.errors.address?.message}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Opcional. Para envío de comprobantes físicos
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="g-3 mt-1">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Preferencia de Contacto</Form.Label>
                        <Form.Select
                          {...contactForm.register('contactPreference')}
                          isInvalid={!!contactForm.formState.errors.contactPreference}
                        >
                          <option value="email">Correo electrónico</option>
                          <option value="phone">Teléfono</option>
                          <option value="mail">Correo postal</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {contactForm.formState.errors.contactPreference?.message}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Cómo prefieres que te contactemos
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="small" text="" className="me-2" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save me-1"></i>
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Tab>

          {/* Security Tab */}
          <Tab eventKey="security" title="Seguridad">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Cambiar Contraseña</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={passwordForm.handleSubmit(handleChangePassword)} noValidate>
                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Contraseña Actual</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Ingresa tu contraseña actual"
                          {...passwordForm.register('currentPassword')}
                          isInvalid={!!passwordForm.formState.errors.currentPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                          {passwordForm.formState.errors.currentPassword?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Nueva Contraseña</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Nueva contraseña"
                          {...passwordForm.register('newPassword')}
                          isInvalid={!!passwordForm.formState.errors.newPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                          {passwordForm.formState.errors.newPassword?.message}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Mínimo 8 caracteres, con mayúscula, minúscula y número
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Confirma la nueva contraseña"
                          {...passwordForm.register('confirmPassword')}
                          isInvalid={!!passwordForm.formState.errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                          {passwordForm.formState.errors.confirmPassword?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="mt-4">
                    <Button
                      type="submit"
                      variant="warning"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="small" text="" className="me-2" />
                          Cambiando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-shield-lock me-1"></i>
                          Cambiar Contraseña
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Tab>

          {/* Account Summary Tab */}
          <Tab eventKey="summary" title="Resumen de Cuenta">
            <Row className="g-4">
              <Col lg={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Estadísticas de Donante</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Total Donado:</span>
                      <strong className="text-success">Q{currentUser.totalAmount.toLocaleString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Donaciones Realizadas:</span>
                      <strong>{currentUser.totalDonations}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Miembro Desde:</span>
                      <strong>{new Date(currentUser.memberSince).toLocaleDateString('es-GT')}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Nivel Actual:</span>
                      <Badge bg="success">Donante Oro</Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={6}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Estado de la Cuenta</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-envelope-check text-success me-2 fs-5"></i>
                      <div>
                        <div className="fw-medium">Correo Verificado</div>
                        <small className="text-muted">Tu cuenta está completamente verificada</small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-shield-check text-success me-2 fs-5"></i>
                      <div>
                        <div className="fw-medium">Cuenta Activa</div>
                        <small className="text-muted">Tienes acceso completo a todas las funciones</small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-bell text-info me-2 fs-5"></i>
                      <div>
                        <div className="fw-medium">Notificaciones Activas</div>
                        <small className="text-muted">Recibirás actualizaciones sobre tus donaciones</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </div>
  )
}