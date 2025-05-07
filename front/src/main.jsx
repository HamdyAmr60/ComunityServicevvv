import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

console.log('Starting app initialization...');

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  console.log('Root element found, creating root...');
  const root = createRoot(rootElement);
  console.log('Root created, rendering App...');
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error during app initialization:', error);
  // Create a visible error message on the page
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #ff4444;
    color: white;
    padding: 20px;
    font-family: Arial, sans-serif;
    z-index: 9999;
  `;
  errorDiv.innerHTML = `
    <h2>Application Error</h2>
    <p>${error.message}</p>
    <p>Please check the console for more details.</p>
  `;
  document.body.appendChild(errorDiv);
}
