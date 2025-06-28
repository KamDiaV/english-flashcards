import React from 'react'
import ErrorBoundary from './ErrorBoundary'
import GenericErrorPage from './GenericErrorPage'

const ErrorBoundaryWrapper = ({
  children,
  title,
  message,
  linkPath,
  buttonText
}) => (
  <ErrorBoundary
    FallbackComponent={props => (
      <GenericErrorPage
        title={title}
        message={message}
        linkPath={linkPath}
        buttonText={buttonText}
        errorInfo={props.errorInfo}
      />
    )}
  >
    {children}
  </ErrorBoundary>
)

export default ErrorBoundaryWrapper
