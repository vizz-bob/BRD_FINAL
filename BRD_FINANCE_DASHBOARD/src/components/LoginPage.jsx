import { useState } from 'react'

const LoginPage = ({ onLogin, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotMessage, setForgotMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      if (formData.email && formData.password) {
        localStorage.setItem('authToken', 'mock-token')
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('rememberMe', rememberMe ? '1' : '0')
        onLogin()
      } else {
        setError('Please enter both email and password')
      }
      setLoading(false)
    }, 500)
  }

  const handleForgotSubmit = (e) => {
    e.preventDefault()
    setForgotMessage('')
    setForgotLoading(true)
    setTimeout(() => {
      setForgotLoading(false)
      setForgotMessage('If the email exists, a reset link has been sent.')
    }, 600)
  }

  return (
    <>
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="w-full max-w-md rounded-3xl border border-brand-border bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M12 3l8 4v5c0 5-3 7-8 9-5-2-8-4-8-9V7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-brand-text">Finance Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-brand-text">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@los.com"
              required
              className="w-full rounded-lg border border-brand-border px-4 py-3 text-sm text-brand-text focus:border-brand-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-brand-text">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-brand-border px-4 py-3 text-sm text-brand-text focus:border-brand-accent focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-brand-text">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => { setForgotEmail(formData.email); setShowForgot(true) }}
              className="text-xs text-indigo-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-accent px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          <p>Demo: Use any email and password to login</p>
          <button type="button" onClick={onSwitchToSignup} className="mt-2 text-indigo-600 hover:underline">
            Don't have an account? Sign Up
          </button>
        </div>
      </div>
    </div>
    {showForgot && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowForgot(false)}>
        <div className="w-full max-w-sm rounded-2xl border border-brand-border bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-brand-border px-6 py-4">
            <h2 className="text-lg font-semibold text-brand-text">Reset Password</h2>
            <button onClick={() => setShowForgot(false)} className="rounded-full p-1 text-brand-text/60 transition hover:bg-brand-border hover:text-brand-text">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <form onSubmit={handleForgotSubmit} className="space-y-4 px-6 py-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-brand-text">Email</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-brand-border px-4 py-2 text-sm text-brand-text focus:border-brand-accent focus:outline-none"
              />
            </div>
            {forgotMessage && <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{forgotMessage}</div>}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForgot(false)} className="rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-brand-text">Cancel</button>
              <button type="submit" disabled={forgotLoading} className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50">{forgotLoading ? 'Sending…' : 'Send Reset Link'}</button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  )
}

export default LoginPage

