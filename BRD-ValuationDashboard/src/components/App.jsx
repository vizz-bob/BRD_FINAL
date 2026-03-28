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

// Valuation Pages
import ValuationDashboard from './pages/valuation/Dashboard';
import FieldVerifications from './pages/valuation/FieldVerifications';
import PropertyChecks from './pages/valuation/PropertyChecks';

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
      { index: true, element: <ValuationDashboard /> },
      { path: 'profile', element: <ProfilePage /> },
      // Valuation
      { path: 'valuation', element: <ValuationDashboard /> },
      { path: 'valuation/field-verifications', element: <FieldVerifications /> },
      { path: 'valuation/property-checks', element: <PropertyChecks /> },
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