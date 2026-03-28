import React, { useState } from 'react';
import AuthPage from './pages/AuthPage';
import OperationsDashboard from './pages/OperationsDashboard';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleSignIn = (formData) => {
    // Simulate authentication
    setUser({ 
      name: formData.email.split('@')[0], 
      email: formData.email, 
      role: 'verifier' 
    });
    setIsAuthenticated(true);
  };

  const handleSignUp = (formData) => {
    // Simulate registration
    setUser({ 
      name: formData.name, 
      email: formData.email, 
      role: formData.role 
    });
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthPage onSignIn={handleSignIn} onSignUp={handleSignUp} />;
  }

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return <OperationsDashboard user={user} onLogout={handleLogout} />;
};

export default App;