import { useState } from 'react'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const submit = () => {
    setError(null);
    setStatus(null);

    if (!email) {
      setError('Enter your email to reset password');
      return;
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));

    try {
      sessionStorage.setItem('fp_email', email);
      sessionStorage.setItem('fp_otp_code', code);
      sessionStorage.setItem('fp_opt_in', 'false');
    } catch {}

    navigate("/sendlink");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-sm sm:max-w-md rounded-2xl border border-primary-200 bg-white shadow-lg p-6 sm:p-8">

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-900">
            Forgot Password
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mt-4 bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}
        {status && (
          <div className="mt-4 bg-primary-50 text-primary-700 border border-primary-200 rounded-lg p-3 text-sm">
            {status}
          </div>
        )}

        {/* Email */}
        <label className="block mt-6">
          <div className="text-sm font-medium text-gray-700 mb-1">Email</div>
          <input
            type="email"
            placeholder="admin@los.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="w-full h-11 rounded-xl border border-primary-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
          />
        </label>

        {/* Submit */}
        <button
          className="mt-5 h-11 w-full rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-[0.98] transition-all text-white text-sm font-semibold"
          onClick={submit}
        >
          Send Reset Link
        </button>

        {/* Back */}
        <div className="mt-4 text-center text-sm">
          <button
            onClick={() => navigate("/login")}
            className="text-primary-600 hover:text-primary-700 font-medium transition"
          >
            ← Back to Login
          </button>
        </div>

      </div>
    </div>
  );
}
