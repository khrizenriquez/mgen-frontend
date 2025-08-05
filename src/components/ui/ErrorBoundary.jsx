/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */
import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Log error to monitoring service
    console.error('Error Boundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 bg-light d-flex flex-column justify-content-center py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card shadow-sm">
                  <div className="card-body p-4">
                    <div className="text-center">
                      <i className="bi bi-exclamation-triangle text-danger" style={{fontSize: '3rem'}}></i>
                      <h2 className="mt-3 h4 fw-medium text-dark">
                        Something went wrong
                      </h2>
                      <p className="text-muted small">
                        We're sorry, but something unexpected happened. Please try refreshing the page.
                      </p>
                      
                      {process.env.NODE_ENV === 'development' && (
                        <details className="mt-4 text-start">
                          <summary className="cursor-pointer small text-muted">
                            Error Details (Development)
                          </summary>
                          <div className="mt-2 p-3 bg-light rounded small font-monospace text-dark">
                            <div className="fw-bold">Error:</div>
                            <pre className="small">{this.state.error && this.state.error.toString()}</pre>
                            <div className="fw-bold mt-2">Stack Trace:</div>
                            <pre className="small">{this.state.errorInfo.componentStack}</pre>
                          </div>
                        </details>
                      )}
                      
                      <div className="mt-4 d-flex flex-column flex-sm-row gap-2">
                        <button
                          onClick={this.handleReset}
                          className="btn btn-primary d-flex align-items-center justify-content-center"
                        >
                          <i className="bi bi-arrow-clockwise me-2"></i>
                          Try Again
                        </button>
                        <button
                          onClick={() => window.location.reload()}
                          className="btn btn-outline-secondary"
                        >
                          Refresh Page
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary