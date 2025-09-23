/**
 * Authentication Layout Component
 * Provides a centered, minimalist layout for auth pages
 */
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="auth-container min-vh-100 d-flex align-items-center bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4} xl={4}>
            <div className="auth-card bg-white rounded shadow-sm p-4 p-md-5">
              {/* Logo */}
              <div className="text-center mb-4">
                <Link to="/" className="text-decoration-none">
                  <div className="auth-logo mb-3">
                    <i className="bi bi-heart-fill text-danger" style={{fontSize: '2.5rem'}}></i>
                  </div>
                  <div className="auth-brand">
                    <span className="fw-bold text-dark">Plataforma de donaciones</span>
                  </div>
                </Link>
              </div>

              {/* Title and subtitle */}
              {title && (
                <div className="text-center mb-4">
                  <h1 className="auth-title h3 fw-bold text-dark mb-2">{title}</h1>
                  {subtitle && (
                    <p className="auth-subtitle text-muted small mb-0">{subtitle}</p>
                  )}
                </div>
              )}

              {/* Form content */}
              <div className="auth-content">
                {children}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}