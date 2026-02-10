import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './hypertrophy-app-expanded.jsx';
import ErrorBoundary from './src/components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
