import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import DepartmentLayout from './components/DepartmentLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// General Pages
import ProfilePage from './pages/ProfilePage';


// Legal Pages
import LegalDashboard from './pages/legal/Dashboard';
import DocumentValidation from './pages/legal/DocumentValidation';
import AgreementApprovals from './pages/legal/AgreementApprovals';


const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }
  return user ? children : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <DepartmentLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <LegalDashboard /> },
      { path: 'profile', element: <ProfilePage /> },
      
      // Legal
      { path: 'legal', element: <LegalDashboard /> },
      { path: 'legal/documents', element: <DocumentValidation /> },
      { path: 'legal/agreements', element: <AgreementApprovals /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;