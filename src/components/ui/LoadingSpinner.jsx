/**
 * Loading Spinner Component
 */
export default function LoadingSpinner({ 
  className = '', 
  size = 'default',
  text = 'Loading...' 
}) {
  const sizeClasses = {
    small: 'spinner-border-sm',
    default: '',
    large: 'spinner-border-lg',
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <div 
        className={`spinner-border text-primary ${sizeClasses[size]} ${className}`}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && (
        <p className="mt-2 text-muted small">{text}</p>
      )}
    </div>
  )
}