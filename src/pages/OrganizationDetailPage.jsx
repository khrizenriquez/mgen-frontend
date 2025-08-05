import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Badge, Alert, Tabs, Tab } from 'react-bootstrap'

const OrganizationDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)

  // Datos de ejemplo expandidos
  const sampleOrganizations = {
    1: {
      id: 1,
      name: 'Propuesta Urbana - Reciclemos.GT',
      category: 'Medio ambiente',
      description: 'Organización sin fines de lucro que busca transformar la cultura actual respecto al manejo y disposición final de los residuos sólidos urbanos, realizando cambios desde el origen: generando conciencia y transformación de hábitos, segregación en el origen, recolección de residuos segregados, dignificar y profesionalizar el trabajo de los recolectores y separadores de residuos, tratamiento adecuado de los residuos reciclables segregados.',
      phone: '+502 4220-2210',
      email: 'info@reciclemos.gt',
      website: 'www.reciclemos.gt',
      address: 'Ciudad de Guatemala, Guatemala',
      foundedYear: 2017,
      achievements: [
        'Más de 2,500 personas impactadas directamente',
        'Más de 550 familias participando en nuestro servicio de recolección a domicilio',
        '582,036 lbs recicladas en nuestro primer año',
        '15 comunidades atendidas',
        '8 puntos de recolección establecidos'
      ],
      mission: 'Ofrecer los mejores sistemas de manejo de residuos sólidos urbanos; cómodo, responsable y efectivo. Desde la educación, recolección, manejo y disposición final.',
      vision: 'Todos los centros urbanos en Guatemala practicando una cultura de Cero Desechos.',
      team: [
        { name: 'Kike Godoy Forno', role: 'Cofundador y Director General' },
        { name: 'Helen Carmí', role: 'Cofundadora y Directora de Operaciones' },
        { name: 'Joe Mérida', role: 'Cofundador y Director de Mercadeo' }
      ],
      projects: [
        {
          title: 'Recolección a Domicilio',
          description: 'Servicio de recolección de materiales reciclables directamente en los hogares.',
          status: 'Activo',
          impact: '550+ familias atendidas'
        },
        {
          title: 'Educación Ambiental',
          description: 'Talleres y charlas sobre manejo responsable de residuos.',
          status: 'Activo',
          impact: '2,500+ personas capacitadas'
        },
        {
          title: 'Puntos de Acopio',
          description: 'Establecimiento de centros de recolección en comunidades.',
          status: 'En expansión',
          impact: '8 puntos establecidos'
        }
      ],
      suggestedAmounts: [185, 75, 35, 15],
      currency: 'Q',
      images: [
        '/api/placeholder/600/400',
        '/api/placeholder/600/400',
        '/api/placeholder/600/400'
      ],
      socialMedia: {
        facebook: '/reciclemos.gt',
        instagram: '@reciclemosgt',
        twitter: '@reciclemosgt'
      }
    },
    2: {
      id: 2,
      name: 'Fundación Esperanza',
      category: 'Educación',
      description: 'Dedicados a brindar educación de calidad a niños en comunidades rurales de Guatemala, construyendo escuelas y capacitando maestros.',
      phone: '+502 2234-5678',
      email: 'contacto@fundacionesperanza.org',
      website: 'www.fundacionesperanza.org',
      address: 'Antigua Guatemala, Sacatepéquez',
      foundedYear: 2010,
      achievements: [
        '1,200 niños beneficiados directamente',
        '15 escuelas construidas y equipadas',
        '50 maestros capacitados',
        '25 becas universitarias otorgadas',
        '5 bibliotecas comunitarias establecidas'
      ],
      mission: 'Garantizar el acceso a educación de calidad para todos los niños y jóvenes de Guatemala, especialmente en áreas rurales.',
      vision: 'Un Guatemala donde cada niño tenga las oportunidades educativas necesarias para desarrollar su máximo potencial.',
      team: [
        { name: 'María González', role: 'Directora Ejecutiva' },
        { name: 'Carlos Morales', role: 'Coordinador de Proyectos' },
        { name: 'Ana Rodríguez', role: 'Responsable de Educación' }
      ],
      projects: [
        {
          title: 'Construcción de Escuelas',
          description: 'Construcción y equipamiento de centros educativos en comunidades rurales.',
          status: 'Activo',
          impact: '15 escuelas construidas'
        },
        {
          title: 'Capacitación Docente',
          description: 'Formación continua para maestros rurales en metodologías modernas.',
          status: 'Activo',
          impact: '50 maestros capacitados'
        },
        {
          title: 'Programa de Becas',
          description: 'Becas de estudio para jóvenes destacados de escasos recursos.',
          status: 'Activo',
          impact: '25 becas otorgadas'
        }
      ],
      suggestedAmounts: [250, 100, 50, 25],
      currency: 'Q',
      images: [
        '/api/placeholder/600/400',
        '/api/placeholder/600/400'
      ]
    },
    3: {
      id: 3,
      name: 'Salud Para Todos',
      category: 'Salud',
      description: 'Proporcionamos atención médica básica y medicamentos a comunidades de escasos recursos a través de clínicas móviles y jornadas médicas.',
      phone: '+502 2345-6789',
      email: 'info@saludparatodos.org',
      website: 'www.saludparatodos.org',
      address: 'Quetzaltenango, Guatemala',
      foundedYear: 2015,
      achievements: [
        '5,000 consultas médicas anuales',
        '25 jornadas médicas realizadas',
        '3 clínicas móviles en operación',
        '1,500 medicamentos distribuidos',
        '12 comunidades rurales atendidas'
      ],
      mission: 'Brindar atención médica accesible y de calidad a comunidades rurales y urbano-marginales de Guatemala.',
      vision: 'Comunidades saludables y empoderadas con acceso universal a servicios de salud básica.',
      team: [
        { name: 'Dr. Roberto Pérez', role: 'Director Médico' },
        { name: 'Licda. Carmen López', role: 'Coordinadora de Enfermería' },
        { name: 'Ing. Miguel Santos', role: 'Administrador' }
      ],
      projects: [
        {
          title: 'Clínicas Móviles',
          description: 'Unidades médicas que se desplazan a comunidades remotas.',
          status: 'Activo',
          impact: '3 clínicas operando'
        },
        {
          title: 'Jornadas Médicas',
          description: 'Eventos de atención médica gratuita en comunidades.',
          status: 'Mensual',
          impact: '25 jornadas realizadas'
        },
        {
          title: 'Farmacia Comunitaria',
          description: 'Distribución de medicamentos básicos a precios accesibles.',
          status: 'Activo',
          impact: '1,500 medicamentos distribuidos'
        }
      ],
      suggestedAmounts: [300, 150, 75, 30],
      currency: 'Q',
      images: [
        '/api/placeholder/600/400',
        '/api/placeholder/600/400',
        '/api/placeholder/600/400'
      ]
    }
  }

  useEffect(() => {
    const org = sampleOrganizations[id]
    if (org) {
      setTimeout(() => {
        setOrganization(org)
        setLoading(false)
      }, 800)
    } else {
      navigate('/organizations')
    }
  }, [id, navigate])

  const getCategoryColor = (category) => {
    const colors = {
      'Medio ambiente': 'success',
      'Educación': 'primary',
      'Salud': 'danger',
      'Social': 'warning',
      'Cultural': 'info'
    }
    return colors[category] || 'secondary'
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando organización...</span>
          </div>
          <p className="mt-3 text-muted">Cargando información...</p>
        </div>
      </Container>
    )
  }

  if (!organization) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Organización no encontrada
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/organizations" className="text-decoration-none">
              <i className="bi bi-building me-1"></i>
              Organizaciones
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {organization.name}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col lg={8}>
                  <div className="d-flex align-items-start mb-3">
                    <div className="flex-grow-1">
                      <h1 className="h2 mb-2">{organization.name}</h1>
                      <div className="mb-2">
                        <Badge bg={getCategoryColor(organization.category)} className="me-2">
                          {organization.category}
                        </Badge>
                        <small className="text-muted">
                          Fundada en {organization.foundedYear}
                        </small>
                      </div>
                      <p className="text-muted mb-3">{organization.description}</p>
                    </div>
                  </div>
                  
                  <Row className="g-3">
                    <Col sm={6}>
                      <div className="d-flex align-items-center text-muted">
                        <i className="bi bi-telephone me-2"></i>
                        <span>{organization.phone}</span>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="d-flex align-items-center text-muted">
                        <i className="bi bi-envelope me-2"></i>
                        <span>{organization.email}</span>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="d-flex align-items-center text-muted">
                        <i className="bi bi-globe me-2"></i>
                        <span>{organization.website}</span>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="d-flex align-items-center text-muted">
                        <i className="bi bi-geo-alt me-2"></i>
                        <span>{organization.address}</span>
                      </div>
                    </Col>
                  </Row>
                </Col>
                
                <Col lg={4} className="text-lg-end">
                  <div className="d-grid gap-2">
                    <Button 
                      as={Link}
                      to={`/donate/${organization.id}`}
                      variant="primary"
                      size="lg"
                    >
                      <i className="bi bi-heart-fill me-2"></i>
                      Hacer donación
                    </Button>
                    <div className="d-flex gap-2">
                      <Button variant="outline-secondary" size="sm" className="flex-fill">
                        <i className="bi bi-share me-1"></i>
                        Compartir
                      </Button>
                      <Button variant="outline-secondary" size="sm" className="flex-fill">
                        <i className="bi bi-bookmark me-1"></i>
                        Guardar
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Content Tabs */}
      <Tabs defaultActiveKey="about" className="mb-4">
        <Tab eventKey="about" title={<><i className="bi bi-info-circle me-2"></i>Acerca de</>}>
          <Row>
            <Col lg={8} className="mb-4">
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-transparent">
                  <h5 className="mb-0">
                    <i className="bi bi-bullseye me-2 text-primary"></i>
                    Misión
                  </h5>
                </Card.Header>
                <Card.Body>
                  <p className="mb-0">{organization.mission}</p>
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-transparent">
                  <h5 className="mb-0">
                    <i className="bi bi-eye me-2 text-primary"></i>
                    Visión
                  </h5>
                </Card.Header>
                <Card.Body>
                  <p className="mb-0">{organization.vision}</p>
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent">
                  <h5 className="mb-0">
                    <i className="bi bi-people me-2 text-primary"></i>
                    Equipo
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {organization.team.map((member, index) => (
                      <Col md={6} key={index} className="mb-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style={{ width: '50px', height: '50px' }}>
                            <i className="bi bi-person text-white"></i>
                          </div>
                          <div>
                            <h6 className="mb-0">{member.name}</h6>
                            <small className="text-muted">{member.role}</small>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent">
                  <h5 className="mb-0">
                    <i className="bi bi-trophy me-2 text-success"></i>
                    Logros destacados
                  </h5>
                </Card.Header>
                <Card.Body>
                  {organization.achievements.map((achievement, index) => (
                    <div key={index} className="d-flex align-items-start mb-3">
                      <i className="bi bi-check-circle text-success me-2 mt-1"></i>
                      <span className="small">{achievement}</span>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="projects" title={<><i className="bi bi-diagram-3 me-2"></i>Proyectos</>}>
          <Row>
            {organization.projects.map((project, index) => (
              <Col lg={4} key={index} className="mb-4">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h6 className="mb-0">{project.title}</h6>
                      <Badge 
                        bg={project.status === 'Activo' ? 'success' : project.status === 'En expansión' ? 'warning' : 'info'}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-muted small mb-3">{project.description}</p>
                    <div className="bg-light p-2 rounded">
                      <small className="text-muted d-block">Impacto:</small>
                      <strong className="text-primary">{project.impact}</strong>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>

        <Tab eventKey="contact" title={<><i className="bi bi-envelope me-2"></i>Contacto</>}>
          <Row>
            <Col lg={6} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent">
                  <h5 className="mb-0">Información de contacto</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Teléfono</h6>
                    <p className="mb-0">
                      <i className="bi bi-telephone me-2"></i>
                      {organization.phone}
                    </p>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Email</h6>
                    <p className="mb-0">
                      <i className="bi bi-envelope me-2"></i>
                      {organization.email}
                    </p>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Sitio web</h6>
                    <p className="mb-0">
                      <i className="bi bi-globe me-2"></i>
                      {organization.website}
                    </p>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Dirección</h6>
                    <p className="mb-0">
                      <i className="bi bi-geo-alt me-2"></i>
                      {organization.address}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-transparent">
                  <h5 className="mb-0">¿Cómo puedes ayudar?</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-3">
                    <Button 
                      as={Link}
                      to={`/donate/${organization.id}`}
                      variant="primary"
                    >
                      <i className="bi bi-cash-coin me-2"></i>
                      Hacer una donación
                    </Button>
                    <Button variant="outline-success">
                      <i className="bi bi-people me-2"></i>
                      Ser voluntario
                    </Button>
                    <Button variant="outline-warning">
                      <i className="bi bi-box-seam me-2"></i>
                      Donar en especie
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  )
}

export default OrganizationDetailPage