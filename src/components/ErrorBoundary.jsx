import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

/**
 * React Error Boundary to catch rendering errors gracefully.
 * Displays a user-friendly fallback UI instead of a white screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log to console in development
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleFullReset = () => {
    try {
      localStorage.removeItem('hypertrophy_state_v3');
    } catch (e) {
      // Ignore storage errors
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 text-sm mb-6">
              The app encountered an unexpected error. You can try reloading or resetting the app data.
            </p>
            {this.state.error && (
              <p className="text-xs text-red-500 bg-red-50 rounded-lg p-3 mb-4 font-mono text-left break-all">
                {this.state.error.toString()}
              </p>
            )}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-600 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button
                onClick={this.handleFullReset}
                className="w-full bg-red-50 text-red-600 font-semibold py-3 rounded-xl border border-red-200 hover:bg-red-100"
              >
                Reset App Data & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
