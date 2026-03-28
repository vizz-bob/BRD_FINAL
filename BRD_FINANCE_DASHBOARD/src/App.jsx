import { useState, useEffect } from 'react'
import FinanceDashboard from './components/FinanceDashboard'
import LoginPage from './components/LoginPage'
import SignupPage from './components/signupPage'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authView, setAuthView] = useState('login')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken')
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userEmail')
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-brand-text">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} />
    ) : (
      <SignupPage onSignup={handleLogin} onSwitchToLogin={() => setAuthView('login')} />
    )
  }

  return <FinanceDashboard onLogout={handleLogout} />
}

export default App
