import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const { FallbackComponent } = this.props;
      if (FallbackComponent) {
        return <FallbackComponent errorInfo={this.state.errorInfo} />;
      }
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Упс... Что-то пошло не так.</h2>
          <p>Попробуйте обновить страницу.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
