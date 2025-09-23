/**
 * Home Page Component
 * Landing page for Más Generosidad donation platform
 */
import { Link } from 'react-router-dom'
import { Card, Container, Row, Col, Button, Badge } from 'react-bootstrap'

export default function HomePage() {
  // Información específica de Más Generosidad
  const impactStats = [
    { icon: 'bi-heart-fill', value: 'Q45,250', label: 'Donado este mes', color: 'text-danger' },
    { icon: 'bi-people-fill', value: '500+', label: 'Niños evangelizados/año', color: 'text-primary' },
    { icon: 'bi-mortarboard-fill', value: '3+', label: 'Escuelas beneficiadas', color: 'text-success' },
    { icon: 'bi-award-fill', value: 'Becas', label: 'Programa en desarrollo', color: 'text-warning' }
  ]

  const programs = [
    {
      id: 1,
      name: 'Evangelización Infantil',
      description: 'Enseñamos valores religiosos a niños, impactando positivamente su desarrollo integral.',
      impact: 'Más de 500 niños al año',
      icon: 'bi-book',
      color: 'primary'
    },
    {
      id: 2,
      name: 'Programa de Alimentación',
      description: 'Proporcionamos alimentos nutritivos a escuelas para combatir la desnutrición infantil.',
      impact: 'Más de 3 escuelas por año',
      icon: 'bi-egg-fried',
      color: 'success'
    },
    {
      id: 3,
      name: 'Becas Escolares',
      description: 'Otorgamos becas educativas a niños necesitados para garantizar su acceso a la educación.',
      impact: 'Programa en desarrollo',
      icon: 'bi-mortarboard',
      color: 'info'
    }
  ]

  const partners = [
    { name: 'Dos Pinos', logo: '/api/placeholder/120/60' },
    { name: 'Bimbo', logo: '/api/placeholder/120/60' },
    { name: 'Waterlife', logo: '/api/placeholder/120/60' },
    { name: 'Colgate', logo: '/api/placeholder/120/60' }
  ]

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="bg-primary text-white py-5 mb-5 rounded">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3">
                Ayudar sin esperar nada a cambiosss
              </h1>
              <p className="lead mb-4">
                Fomentamos la generosidad en la sociedad en beneficio de los niños de Guatemala. 
                Tu apoyo puede ser la fuerza detrás de un cambio significativo.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button 
                  as={Link}
                  to="/donate"
                  variant="light"
                  size="lg"
                  className="d-flex align-items-center fw-semibold"
                >
                  <i className="bi bi-heart-fill me-2"></i>
                  Donar ahora
                </Button>
                <Button 
                  as={Link}
                  to="/donations"
                  variant="outline-light"
                  size="lg"
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-list-ul me-2"></i>
                  Ver donaciones
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="position-relative">
                <div className="bg-white bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '250px', height: '250px' }}>
                  <i className="bi bi-heart-fill text-white" style={{ fontSize: '6rem' }}></i>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Impact Stats */}
      <section className="mb-5">
        <Container>
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-3">Nuestro impacto</h2>
            <p className="text-muted">Números que reflejan el cambio que estamos generando</p>
          </div>
          <Row className="g-4">
            {impactStats.map((stat, index) => (
              <Col key={index} sm={6} lg={3}>
                <Card className="border-0 shadow-sm h-100 text-center">
                  <Card.Body className="py-4">
                    <i className={`${stat.icon} ${stat.color} mb-3`} style={{ fontSize: '2.5rem' }}></i>
                    <h3 className="fw-bold mb-1">{stat.value}</h3>
                    <p className="text-muted mb-0 small">{stat.label}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* About Más Generosidad */}
      <section className="mb-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h2 className="fw-bold mb-4">¿Quiénes somos?</h2>
              <p className="text-muted mb-4">
                Somos una organización comprometida con fomentar la generosidad en Guatemala. 
                Creemos firmemente que la generosidad puede ser la fuerza detrás de un cambio 
                significativo en la vida de los niños y adolescentes de escasos recursos.
              </p>
              <div className="mb-4">
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-check-circle-fill text-success me-3 mt-1"></i>
                  <div>
                    <h6 className="fw-bold mb-1">Misión clara</h6>
                    <p className="text-muted mb-0 small">
                      Hacer un poco más dulce la vida de los niños y adolescentes de escasos recursos.
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-check-circle-fill text-success me-3 mt-1"></i>
                  <div>
                    <h6 className="fw-bold mb-1">Transparencia</h6>
                    <p className="text-muted mb-0 small">
                      Cada donación se utiliza directamente para beneficio de los niños.
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <i className="bi bi-check-circle-fill text-success me-3 mt-1"></i>
                  <div>
                    <h6 className="fw-bold mb-1">Impacto medible</h6>
                    <p className="text-muted mb-0 small">
                      Reportamos constantemente sobre el progreso y resultados alcanzados.
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                as={Link}
                to="/donate"
                variant="primary"
                size="lg"
                className="fw-semibold"
              >
                <i className="bi bi-heart-fill me-2"></i>
                Únete a nuestra causa
              </Button>
            </Col>
            <Col lg={6}>
              <div className="position-relative">
                <img 
                  src="/api/placeholder/500/400" 
                  alt="Niños beneficiados por Más Generosidad"
                  className="img-fluid rounded shadow"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Programs */}
      <section className="bg-light py-5 mb-5 rounded">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Nuestros programas</h2>
            <p className="lead text-muted">
              Conoce las formas en que estamos transformando vidas
            </p>
          </div>
          
          <Row className="g-4">
            {programs.map((program) => (
              <Col key={program.id} lg={4} md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="text-center p-4">
                    <div className={`bg-${program.color} rounded-circle d-inline-flex align-items-center justify-content-center mb-3`} 
                         style={{ width: '80px', height: '80px' }}>
                      <i className={`${program.icon} text-white`} style={{ fontSize: '2rem' }}></i>
                    </div>
                    <h5 className="fw-bold mb-3">{program.name}</h5>
                    <p className="text-muted mb-3">{program.description}</p>
                    <Badge bg={program.color} className="mb-3">
                      {program.impact}
                    </Badge>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Partners */}
      <section className="mb-5">
        <Container>
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-3">Empresas que nos apoyan</h2>
            <p className="text-muted">Organizaciones generosas que hacen posible nuestro trabajo</p>
          </div>
          <Row className="align-items-center justify-content-center g-4">
            {partners.map((partner, index) => (
              <Col key={index} xs={6} md={3} className="text-center">
                <div className="bg-white rounded shadow-sm p-3">
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="img-fluid"
                    style={{ maxHeight: '60px', filter: 'grayscale(100%)', opacity: '0.7' }}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* How to Help */}
      <section className="mb-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">¿Cómo puedes ayudar?</h2>
            <p className="lead text-muted">
              Múltiples formas de contribuir al bienestar de los niños
            </p>
          </div>
          
          <Row className="g-4">
            <Col md={4} className="text-center">
              <div className="bg-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-currency-dollar text-white" style={{ fontSize: '2rem' }}></i>
              </div>
              <h5 className="fw-bold mb-3">Donación monetaria</h5>
              <p className="text-muted mb-3">
                Tu contribución económica nos permite comprar alimentos, materiales educativos y recursos necesarios.
              </p>
              <Button 
                as={Link}
                to="/donate"
                variant="primary"
                className="fw-semibold"
              >
                Donar dinero
              </Button>
            </Col>
            
            <Col md={4} className="text-center">
              <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-clock text-white" style={{ fontSize: '2rem' }}></i>
              </div>
              <h5 className="fw-bold mb-3">Voluntariado</h5>
              <p className="text-muted mb-3">
                Comparte tu tiempo y habilidades ayudando directamente en nuestras actividades y programas.
              </p>
              <Button 
                variant="outline-success"
                className="fw-semibold"
                disabled
              >
                Próximamente
              </Button>
            </Col>
            
            <Col md={4} className="text-center">
              <div className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-box text-white" style={{ fontSize: '2rem' }}></i>
              </div>
              <h5 className="fw-bold mb-3">Donación en especie</h5>
              <p className="text-muted mb-3">
                Dona alimentos, útiles escolares, juguetes y otros artículos que beneficien a los niños.
              </p>
              <Button 
                variant="outline-info"
                className="fw-semibold"
                disabled
              >
                Próximamente
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Information */}
      <section className="text-center">
        <Container>
          <Card className="border-0 bg-primary text-white">
            <Card.Body className="py-5">
              <h2 className="fw-bold mb-3">¿Tienes preguntas?</h2>
              <p className="lead mb-4">
                Estamos aquí para ayudarte. Contáctanos para cualquier duda o consulta.
              </p>
              <div className="d-flex justify-content-center gap-4 mb-4">
                <div className="d-flex align-items-center">
                  <i className="bi bi-telephone-fill me-2"></i>
                  <span>+(502) 5468 3386</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-envelope-fill me-2"></i>
                  <span>info@masgenerosidad.org</span>
                </div>
              </div>
              <div className="d-flex justify-content-center gap-3">
                <Button 
                  as={Link}
                  to="/donate"
                  variant="light"
                  size="lg"
                  className="fw-semibold"
                >
                  <i className="bi bi-heart-fill me-2"></i>
                  Hacer donación
                </Button>
                <Button 
                  variant="outline-light"
                  size="lg"
                  onClick={() => window.open('tel:+50254683386')}
                >
                  <i className="bi bi-telephone me-2"></i>
                  Llamar ahora
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>
    </div>
  )
}