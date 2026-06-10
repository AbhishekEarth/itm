import { Component } from 'react';

/**
 * ErrorBoundary — catches render errors in a subtree and shows a graceful
 * fallback instead of a blank section. Also logs to console so devs can see
 * what's failing (fixes the "empty console" problem).
 *
 * Usage:
 *   <ErrorBoundary name="Hero">
 *     <Hero />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    const section = this.props.name || 'Unknown section';
    // Always log — this is why the console was empty before
    console.error(`[ErrorBoundary] ${section} crashed:`, error);
    console.error(`[ErrorBoundary] Component stack:`, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Minimal, non-intrusive fallback — doesn't break page layout
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          style={{
            padding: '1rem',
            margin: '0.5rem 0',
            borderRadius: '0.75rem',
            background: 'rgba(128,0,0,0.04)',
            border: '1px dashed rgba(128,0,0,0.15)',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#9ca3af',
          }}
        >
          {this.props.name
            ? `${this.props.name} section is temporarily unavailable.`
            : 'This section is temporarily unavailable.'}
        </div>
      );
    }

    return this.props.children;
  }
}
