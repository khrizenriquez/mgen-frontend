import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Container, Row, Col, Badge, Button } from 'react-bootstrap'

const OrganizationsPage = () => {
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)

  // Datos de ejemplo inspirados en organizaciones reales
  const sampleOrganizations = [
    {
      id: 1,
      name: 'Propuesta Urbana - Reciclemos.GT',
      category: 'Medio ambiente',
      description: 'Organización sin fines de lucro que busca transformar la cultura actual respecto al manejo y disposición final de los residuos sólidos urbanos.',
      phone: '+502 4220-2210',
      website: 'www.reciclemos.gt',
      achievements: [
        'Más de 2,500 personas impactadas directamente',
        'Más de 550 familias participando en nuestro servicio',
        '582,036 lbs recicladas en nuestro primer año'
      ],
      mission: 'Ofrecer los mejores sistemas de manejo de residuos sólidos urbanos; cómodo, responsable y efectivo.',
      vision: 'Todos los centros urbanos en Guatemala practicando una cultura de Cero Desechos.',
      suggestedAmounts: [185, 75, 35, 15],
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      name: 'Fundación Esperanza',
      category: 'Educación',
      description: 'Dedicados a brindar educación de calidad a niños en comunidades rurales de Guatemala.',
      phone: '+502 2234-5678',
      website: 'www.fundacionesperanza.org',
      achievements: [
        '1,200 niños beneficiados',
        '15 escuelas construidas',
        '50 maestros capacitados'
      ],
      mission: 'Garantizar el acceso a educación de calidad para todos los niños.',
      vision: 'Un Guatemala donde cada niño tenga oportunidades educativas.',
      suggestedAmounts: [250, 100, 50, 25],
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      name: 'Salud Para Todos',
      category: 'Salud',
      description: 'Proporcionamos atención médica básica y medicamentos a comunidades de escasos recursos.',
      phone: '+502 2345-6789',
      website: 'www.saludparatodos.org',
      achievements: [
        '5,000 consultas médicas anuales',
        '25 jornadas médicas realizadas',
        '3 clínicas móviles en operación'
      ],
      mission: 'Brindar atención médica accesible y de calidad.',
      vision: 'Comunidades saludables y empoderadas.',
      suggestedAmounts: [300, 150, 75, 30],
      image: '/api/placeholder/300/200'
    }
  ]

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setOrganizations(sampleOrganizations)
      setLoading(false)
    }, 1000)
  }, [])

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
            <span className="visually-hidden">Cargando organizaciones...</span>
          </div>
          <p className="mt-3 text-muted">Cargando organizaciones...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">Organizaciones</h1>
        <p className="lead text-muted">
          Descubre organizaciones que están transformando Guatemala. 
          Tu donación puede hacer la diferencia.
        </p>
      </div>

      <Row>
        {organizations.map((org) => (
          <Col key={org.id} lg={4} md={6} className="mb-4">
            <Card className="h-100 shadow-sm border-0 organization-card">
              <div className="position-relative">
                <Card.Img 
                  variant="top" 
                  src={org.image} 
                  style={{ height: '200px', objectFit: 'cover' }}
                  className="placeholder-image"
                />
                <Badge 
                  bg={getCategoryColor(org.category)}
                  className="position-absolute top-0 end-0 m-2"
                >
                  {org.category}
                </Badge>
              </div>
              
              <Card.Body className="d-flex flex-column">
                <Card.Title className="h5 mb-3">{org.name}</Card.Title>
                <Card.Text className="text-muted mb-3 flex-grow-1">
                  {org.description}
                </Card.Text>
                
                <div className="mb-3">
                  <h6 className="text-primary mb-2">
                    <i className="bi bi-trophy-fill me-2"></i>
                    Algunos logros:
                  </h6>
                  <ul className="list-unstyled small">
                    {org.achievements.slice(0, 2).map((achievement, index) => (
                      <li key={index} className="text-muted mb-1">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <small className="text-muted d-block mb-1">
                    <i className="bi bi-telephone me-1"></i>
                    {org.phone}
                  </small>
                  <small className="text-muted d-block">
                    <i className="bi bi-globe me-1"></i>
                    {org.website}
                  </small>
                </div>

                <div className="mt-auto">
                  <Row className="g-2">
                    <Col>
                      <Button 
                        as={Link}
                        to={`/organizations/${org.id}`}
                        variant="outline-primary"
                        size="sm"
                        className="w-100"
                      >
                        <i className="bi bi-info-circle me-1"></i>
                        Ver más
                      </Button>
                    </Col>
                    <Col>
                      <Button 
                        as={Link}
                        to={`/donate/${org.id}`}
                        variant="primary"
                        size="sm"
                        className="w-100"
                      >
                        <i className="bi bi-heart-fill me-1"></i>
                        Donar
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-5">
        <Card className="bg-light border-0">
          <Card.Body className="py-4">
            <h4 className="text-primary mb-3">
              <i className="bi bi-question-circle me-2"></i>
              ¿Tienes una organización?
            </h4>
            <p className="text-muted mb-3">
              Únete a nuestra plataforma y conecta con donantes comprometidos con el cambio social.
            </p>
            <Button variant="outline-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Registrar organización
            </Button>
          </Card.Body>
        </Card>
      </div>
    </Container>
  )
}

export default OrganizationsPage