/**
 * 404 Not Found Page Component
 */
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-vh-60 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="mb-5">
          <h1 className="display-1 fw-bold text-black-50">404</h1>
          <h2 className="h3 fw-bold text-dark mt-4">Page Not Found</h2>
          <p className="text-muted mt-3 mx-auto" style={{maxWidth: '400px'}}>
            Sorry, we couldn't find the page you're looking for. 
            The page might have been moved, deleted, or doesn't exist.
          </p>
        </div>
        
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <Link
            to="/"
            className="btn btn-primary d-flex align-items-center justify-content-center"
          >
            <i className="bi bi-house me-2"></i>
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Go Back
          </button>
        </div>
        
        <div className="mt-5">
          <p className="small text-muted">
            If you think this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  )
}