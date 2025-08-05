/**
 * Home Page Component
 * Landing page for donation platform
 */
import { Link } from 'react-router-dom'
import { Card, Container, Row, Col, Button, Badge } from 'react-bootstrap'

export default function HomePage() {
  const featuredOrganizations = [
    {
      id: 1,
      name: 'Propuesta Urbana',
      category: 'Medio ambiente',
      description: 'Transformando la cultura del manejo de residuos sólidos urbanos.',
      impact: '582,036 lbs recicladas',
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      name: 'Fundación Esperanza',
      category: 'Educación',
      description: 'Educación de calidad para niños en comunidades rurales.',
      impact: '1,200 niños beneficiados',
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      name: 'Salud Para Todos',
      category: 'Salud',
      description: 'Atención médica básica en comunidades de escasos recursos.',
      impact: '5,000 consultas anuales',
      image: '/api/placeholder/300/200'
    }
  ]

  const impactStats = [
    { icon: 'bi-heart-fill', value: 'Q45,250', label: 'Donado este mes', color: 'text-danger' },
    { icon: 'bi-people-fill', value: '1,245', label: 'Donantes activos', color: 'text-primary' },
    { icon: 'bi-building', value: '25', label: 'Organizaciones', color: 'text-success' },
    { icon: 'bi-graph-up', value: '89%', label: 'Impacto positivo', color: 'text-info' }
  ]

  const getCategoryColor = (category) => {
    const colors = {
      'Medio ambiente': 'success',
      'Educación': 'primary',
      'Salud': 'danger'
    }
    return colors[category] || 'secondary'
  }

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="bg-primary text-white py-5 mb-5 rounded">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3">
                Tu donación puede cambiar vidas
              </h1>
              <p className="lead mb-4">
                Conectamos personas generosas con organizaciones que están 
                transformando Guatemala. Tu apoyo hace la diferencia.
              </p>
              <div className="d-flex gap-3">
                <Button 
                  as={Link}
                  to="/organizations"
                  variant="light"
                  size="lg"
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-building me-2"></i>
                  Explorar organizaciones
                </Button>
                <Button 
                  as={Link}
                  to="/donate/1"
                  variant="outline-light"
                  size="lg"
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-heart-fill me-2"></i>
                  Donar ahora
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="position-relative">
                <i className="bi bi-heart-circle display-1 text-white opacity-75"></i>
                <div className="position-absolute top-50 start-50 translate-middle">
                  <i className="bi bi-people-fill" style={{ fontSize: '3rem' }}></i>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Impact Stats */}
      <section className="mb-5">
        <Container>
          <Row className="g-4">
            {impactStats.map((stat, index) => (
              <Col key={index} sm={6} lg={3}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="text-center py-4">
                    <i className={`${stat.icon} ${stat.color} mb-3`} style={{ fontSize: '2.5rem' }}></i>
                    <h3 className="fw-bold mb-1">{stat.value}</h3>
                    <p className="text-muted mb-0">{stat.label}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Organizations */}
      <section className="mb-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Organizaciones destacadas</h2>
            <p className="lead text-muted">
              Conoce algunas de las organizaciones que están creando un impacto positivo
            </p>
          </div>
          
          <Row className="g-4 mb-4">
            {featuredOrganizations.map((org) => (
              <Col key={org.id} lg={4} md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Img 
                    variant="top" 
                    src={org.image} 
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <div className="mb-3">
                      <Badge bg={getCategoryColor(org.category)} className="mb-2">
                        {org.category}
                      </Badge>
                      <Card.Title className="h5">{org.name}</Card.Title>
                    </div>
                    <Card.Text className="text-muted flex-grow-1">
                      {org.description}
                    </Card.Text>
                    <div className="mb-3">
                      <small className="text-success fw-bold">
                        <i className="bi bi-graph-up me-1"></i>
                        {org.impact}
                      </small>
                    </div>
                    <div className="d-grid gap-2">
                      <Button 
                        as={Link}
                        to={`/organizations/${org.id}`}
                        variant="outline-primary"
                        size="sm"
                      >
                        Ver más
                      </Button>
                      <Button 
                        as={Link}
                        to={`/donate/${org.id}`}
                        variant="primary"
                        size="sm"
                      >
                        <i className="bi bi-heart-fill me-1"></i>
                        Donar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          
          <div className="text-center">
            <Button 
              as={Link}
              to="/organizations"
              variant="outline-primary"
              size="lg"
            >
              Ver todas las organizaciones
              <i className="bi bi-arrow-right ms-2"></i>
            </Button>
          </div>
        </Container>
      </section>

      {/* How it Works */}
      <section className="bg-light py-5 mb-5 rounded">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">¿Cómo funciona?</h2>
            <p className="lead text-muted">
              Es fácil y seguro hacer una diferencia
            </p>
          </div>
          
          <Row className="g-4">
            <Col md={4} className="text-center">
              <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-search text-white" style={{ fontSize: '2rem' }}></i>
              </div>
              <h5 className="fw-bold mb-3">1. Explora organizaciones</h5>
              <p className="text-muted">
                Descubre organizaciones que están haciendo un impacto real en Guatemala.
              </p>
            </Col>
            
            <Col md={4} className="text-center">
              <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-heart-fill text-white" style={{ fontSize: '2rem' }}></i>
              </div>
              <h5 className="fw-bold mb-3">2. Elige cómo ayudar</h5>
              <p className="text-muted">
                Dona dinero, ofrece tu tiempo como voluntario o dona artículos necesarios.
              </p>
            </Col>
            
            <Col md={4} className="text-center">
              <div className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-graph-up text-white" style={{ fontSize: '2rem' }}></i>
              </div>
              <h5 className="fw-bold mb-3">3. Ve el impacto</h5>
              <p className="text-muted">
                Recibe actualizaciones sobre cómo tu contribución está generando cambios.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <Container>
          <Card className="border-0 bg-primary text-white">
            <Card.Body className="py-5">
              <h2 className="fw-bold mb-3">¿Listo para hacer la diferencia?</h2>
              <p className="lead mb-4">
                Miles de personas ya están contribuyendo al cambio. Únete a esta comunidad.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button 
                  as={Link}
                  to="/organizations"
                  variant="light"
                  size="lg"
                >
                  <i className="bi bi-building me-2"></i>
                  Explorar organizaciones
                </Button>
                <Button 
                  variant="outline-light"
                  size="lg"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Registrar mi organización
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>
    </div>
  )
}