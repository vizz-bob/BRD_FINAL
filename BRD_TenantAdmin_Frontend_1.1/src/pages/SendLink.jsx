import { useEffect, useState } from 'react'
import { ShieldCheckIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export default function SendLink() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [optIn, setOptIn] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpInput, setOtpInput] = useState('')

  useEffect(() => {
    try {
      const e = sessionStorage.getItem('fp_email') || ''
      const c = sessionStorage.getItem('fp_otp_code') || ''
      const oi = sessionStorage.getItem('fp_opt_in') === 'true'
      setEmail(e)
      setOtpCode(c)
      setOptIn(oi)
      if (e) setStatus(`Reset OTP sent. Check your inbox. (demo OTP: ${c})`)
    } catch {}
  }, [])

  const submit = () => {
    setError(null)
    setStatus(null)
    if (!email) { setError('Enter your email to reset password'); return }
    const code = String(Math.floor(100000 + Math.random() * 900000))
    setOtpCode(code)
    try {
      sessionStorage.setItem('fp_email', email)
      sessionStorage.setItem('fp_otp_code', code)
      sessionStorage.setItem('fp_opt_in', String(optIn))
    } catch {}
    setStatus(`Reset OTP sent. Check your inbox. (demo OTP: ${code})`)
  }

  const verify = () => {
    setError(null)
    if (!otpInput) { setError('Enter the 6-digit OTP'); return }
    if (otpInput === otpCode) {
      setStatus('OTP verified. Reset link sent to your email')
    } else {
      setError('Invalid OTP. Please try again')
    }
  }

  return (
    // Added px-4 py-8 so the card never touches screen edges on mobile
    <div className="min-h-screen bg-white grid place-items-center px-4 py-8">

      {/* Card: full-width on mobile, capped at max-w-md on larger screens */}
      <div className="w-full max-w-md rounded-2xl border border-primary-200 bg-white shadow-card p-5 sm:p-8">

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary-50 grid place-items-center text-primary-600 shrink-0">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>
          {/* Scales from text-xl on mobile to text-2xl on sm+ */}
          <div className="mt-4 text-xl sm:text-2xl font-semibold text-gray-900">Forgot Password</div>
          <div className="mt-1 text-sm text-gray-600">Enter your email to receive a password reset link</div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mt-4 bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}
        {status && (
          // break-words prevents long OTP demo strings from overflowing on narrow screens
          <div className="mt-4 bg-primary-50 text-primary-700 border border-primary-200 rounded-lg p-3 text-sm break-words">
            {status}
          </div>
        )}

        {/* Email */}
        <label className="block mt-6">
          <div className="text-sm font-medium text-gray-900 mb-1">Email Address</div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <EnvelopeIcon className="h-5 w-5" />
            </span>
            <input
              type="email"
              placeholder="admin@los.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-xl border border-primary-200 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        </label>

        {/* Opt-in */}
        <label className="mt-3 flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 accent-primary-600 shrink-0"
            checked={optIn}
            onChange={(e) => setOptIn(e.target.checked)}
          />
          <span>Opt-in to product updates and emails</span>
        </label>

        {/* OTP */}
        <div className="mt-5">
          <label className="block">
            <div className="text-sm font-medium text-gray-900 mb-1">Enter OTP</div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="Enter the 6-digit code"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
              className="w-full h-11 rounded-xl border border-primary-200 px-3 text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </label>
          <button
            className="mt-3 h-11 w-full rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium shadow-sm transition"
            onClick={verify}
          >
            Verify OTP
          </button>
        </div>

        {/* Bottom row: wraps gracefully on very narrow screens */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            className="h-11 px-6 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium shadow-sm transition whitespace-nowrap"
            onClick={submit}
          >
            Send reset link
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'login' }))}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium transition whitespace-nowrap"
          >
            ← Back to sign in
          </button>
        </div>

      </div>
    </div>
  )
}