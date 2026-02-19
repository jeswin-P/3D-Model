import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/Global.css';

// Global Error Handler
window.onerror = function (message, source, lineno, colno, error) {
  console.error(`RUNTIME ERROR: ${message}\nAt: ${source}:${lineno}`);
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error("CRITICAL: Root element not found.");
}
