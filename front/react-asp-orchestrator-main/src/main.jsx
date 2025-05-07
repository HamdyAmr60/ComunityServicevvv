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
  root.render(<App />);
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error during app initialization:', error);
}
