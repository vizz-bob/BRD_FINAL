// /Users/ayushpc/Desktop/Finance-team/src/components/SignupPage.jsx
import { useState } from 'react'

const SignupPage = ({ onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }
      localStorage.setItem('authToken', 'mock-token')
      localStorage.setItem('userEmail', formData.email)
      onSignup()
      setLoading(false)
    }, 500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="w-full max-w-md rounded-3xl border border-brand-border bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M12 3l8 4v5c0 5-3 7-8 9-5-2-8-4-8-9V7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-brand-text">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Sign up to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-brand-text">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
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
          <div>
            <label className="mb-2 block text-sm font-semibold text-brand-text">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Re-enter your password"
              required
              className="w-full rounded-lg border border-brand-border px-4 py-3 text-sm text-brand-text focus:border-brand-accent focus:outline-none"
            />
          </div>

          {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-accent px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          <button type="button" onClick={onSwitchToLogin} className="text-indigo-600 hover:underline">
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignupPage