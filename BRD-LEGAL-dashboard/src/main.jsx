import React from 'react';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from "./context/AuthContext.jsx";
import { MessageProvider } from './context/MessageContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  Modal.setAppElement(rootElement);
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <MessageProvider>
          <App />
        </MessageProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);