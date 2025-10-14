/**
 * Home Page Component
 * Landing page for Más Generosidad donation platform
 */
import { Link } from 'react-router-dom'
import { Card, Container, Row, Col, Button, Badge } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const { t } = useTranslation()

  // Información específica de Más Generosidad
  const impactStats = [
    { icon: 'bi-heart-fill', value: 'Q45,250', label: t('home.impact.stats.donatedThisMonth'), color: 'text-danger' },
    { icon: 'bi-people-fill', value: '500+', label: t('home.impact.stats.childrenEvangelized'), color: 'text-primary' },
    { icon: 'bi-mortarboard-fill', value: '3+', label: t('home.impact.stats.schoolsBenefited'), color: 'text-success' },
    { icon: 'bi-award-fill', value: t('home.impact.stats.scholarships'), label: t('home.impact.stats.scholarships'), color: 'text-warning' }
  ]

  const programs = [
    {
      id: 1,
      name: t('home.programs.evangelization.name'),
      description: t('home.programs.evangelization.description'),
      impact: t('home.programs.evangelization.impact'),
      icon: 'bi-book',
      color: 'primary'
    },
    {
      id: 2,
      name: t('home.programs.nutrition.name'),
      description: t('home.programs.nutrition.description'),
      impact: t('home.programs.nutrition.impact'),
      icon: 'bi-egg-fried',
      color: 'success'
    },
    {
      id: 3,
      name: t('home.programs.scholarships.name'),
      description: t('home.programs.scholarships.description'),
      impact: t('home.programs.scholarships.impact'),
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
                {t('home.hero.title')}
              </h1>
              <p className="lead mb-4">
                {t('home.hero.subtitle')}
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
                  {t('home.hero.donateNow')}
                </Button>
                <Button
                  as={Link}
                  to="/donations"
                  variant="outline-light"
                  size="lg"
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-list-ul me-2"></i>
                  {t('home.hero.viewDonations')}
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
            <h2 className="fw-bold mb-3">{t('home.impact.title')}</h2>
            <p className="text-muted">{t('home.impact.subtitle')}</p>
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
              <h2 className="fw-bold mb-4">{t('home.about.title')}</h2>
              <p className="text-muted mb-4">
                {t('home.about.description')}
              </p>
              <div className="mb-4">
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-check-circle-fill text-success me-3 mt-1"></i>
                  <div>
                    <h6 className="fw-bold mb-1">{t('home.about.mission.title')}</h6>
                    <p className="text-muted mb-0 small">
                      {t('home.about.mission.description')}
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-check-circle-fill text-success me-3 mt-1"></i>
                  <div>
                    <h6 className="fw-bold mb-1">{t('home.about.transparency.title')}</h6>
                    <p className="text-muted mb-0 small">
                      {t('home.about.transparency.description')}
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <i className="bi bi-check-circle-fill text-success me-3 mt-1"></i>
                  <div>
                    <h6 className="fw-bold mb-1">{t('home.about.impact.title')}</h6>
                    <p className="text-muted mb-0 small">
                      {t('home.about.impact.description')}
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
                {t('home.about.joinCause')}
              </Button>
            </Col>
            <Col lg={6}>
              <div className="position-relative">
                <img 
                  src="/api/placeholder/500/400" 
                  alt={t('home.about.imageAlt')}
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
            <h2 className="fw-bold mb-3">{t('home.programs.title')}</h2>
            <p className="lead text-muted">
              {t('home.programs.subtitle')}
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
            <h2 className="fw-bold mb-3">{t('home.partners.title')}</h2>
            <p className="text-muted">{t('home.partners.subtitle')}</p>
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
            <h2 className="fw-bold mb-3">{t('home.help.title')}</h2>
            <p className="lead text-muted">
              {t('home.help.subtitle')}
            </p>
          </div>

          <Row className="g-4">
            <Col md={4} className="text-center">
              <div className="bg-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-currency-dollar text-white" style={{ fontSize: '2rem' }}></i>
              </div>
              <h5 className="fw-bold mb-3">{t('home.help.monetary.title')}</h5>
              <p className="text-muted mb-3">
                {t('home.help.monetary.description')}
              </p>
              <Button
                as={Link}
                to="/donate"
                variant="primary"
                className="fw-semibold"
              >
                {t('home.help.monetary.button')}
              </Button>
            </Col>

            <Col md={4} className="text-center">
              <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-clock text-white" style={{ fontSize: '2rem' }}></i>
              </div>
              <h5 className="fw-bold mb-3">{t('home.help.volunteer.title')}</h5>
              <p className="text-muted mb-3">
                {t('home.help.volunteer.description')}
              </p>
              <Button
                variant="outline-success"
                className="fw-semibold"
                disabled
              >
                {t('common.buttons.comingSoon')}
              </Button>
            </Col>

            <Col md={4} className="text-center">
              <div className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-box text-white" style={{ fontSize: '2rem' }}></i>
              </div>
              <h5 className="fw-bold mb-3">{t('home.help.inKind.title')}</h5>
              <p className="text-muted mb-3">
                {t('home.help.inKind.description')}
              </p>
              <Button
                variant="outline-info"
                className="fw-semibold"
                disabled
              >
                {t('common.buttons.comingSoon')}
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
              <h2 className="fw-bold mb-3">{t('home.contact.title')}</h2>
              <p className="lead mb-4">
                {t('home.contact.subtitle')}
              </p>
              <div className="d-flex justify-content-center gap-4 mb-4">
                <div className="d-flex align-items-center">
                  <i className="bi bi-telephone-fill me-2"></i>
                  <span>{t('home.contact.phone')}</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-envelope-fill me-2"></i>
                  <span>{t('home.contact.email')}</span>
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
                  {t('common.buttons.makeDonation')}
                </Button>
                <Button
                  variant="outline-light"
                  size="lg"
                  onClick={() => window.open('tel:+50254683386')}
                >
                  <i className="bi bi-telephone me-2"></i>
                  {t('common.buttons.callNow')}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>
    </div>
  )
}