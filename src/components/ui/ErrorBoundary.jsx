/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */
import { Component } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

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
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                <h2 className="mt-4 text-lg font-medium text-gray-900">
                  Something went wrong
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  We're sorry, but something unexpected happened. Please try refreshing the page.
                </p>
                
                {process.env.NODE_ENV === 'development' && (
                  <details className="mt-4 text-left">
                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                      Error Details (Development)
                    </summary>
                    <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto">
                      <div className="font-bold">Error:</div>
                      <pre>{this.state.error && this.state.error.toString()}</pre>
                      <div className="font-bold mt-2">Stack Trace:</div>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </div>
                  </details>
                )}
                
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={this.handleReset}
                    className="btn-primary flex-1 flex items-center justify-center"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Again
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-outline flex-1"
                  >
                    Refresh Page
                  </button>
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