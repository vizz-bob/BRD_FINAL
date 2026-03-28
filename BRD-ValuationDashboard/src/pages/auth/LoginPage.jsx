// src/pages/auth/LoginPage.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheckIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const primary = {
    50: "#eff6ff",
    200: "#bfdbfe",
    300: "#93c5fd",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const usersRaw = localStorage.getItem("mock_users");
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const found = users.find((u) => u.email === email);
    if (!found) {
      setError("No account found for this email. Please sign up.");
      return;
    }
    if (found.password !== password) {
      setError("Incorrect password.");
      return;
    }

    if (rememberMe) {
      localStorage.setItem("remember_email", email);
    } else {
      localStorage.removeItem("remember_email");
    }

    login({ email: found.email, role: found.role, name: found.name });
    navigate(`/${found.role}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-white grid place-items-center">
      <div
        className="w-full max-w-md rounded-2xl shadow-card p-6 border bg-white"
        style={{ borderColor: primary[200] }}
      >
        <div className="grid place-items-center">
          <div
            className="h-12 w-12 rounded-full grid place-items-center"
            style={{ background: primary[50], color: primary[600] }}
          >
            <ShieldCheckIcon className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-3xl font-semibold text-gray-900 text-center">
            Valuation Dashboard
          </h2>

          <p className="mt-1 text-sm text-gray-600 text-center">
            Sign in to access your dashboard
          </p>
        </div>

        {error && (
          <div
            className="mt-3 rounded-lg p-3 text-sm"
            style={{
              background: primary[50],
              color: primary[700],
              border: `1px solid ${primary[200]}`,
            }}
          >
            {error}
          </div>
        )}

        {/* Email */}
        <label className="block mt-6">
          <span className="text-sm text-gray-900">Email</span>
          <div className="mt-1 relative">
            <input
              type="email"
              placeholder="admin@valuation.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-xl px-3 pr-10 border focus:outline-none"
              style={{
                borderColor: primary[200],
                boxShadow: `0 0 0 0px`,
              }}
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: primary[500] }}
            >
              <EnvelopeIcon className="h-5 w-5" />
            </div>
          </div>
        </label>

        {/* Password */}
        <label className="block mt-4">
          <span className="text-sm text-gray-900">Password</span>
          <div className="mt-1 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 rounded-xl px-3 pr-20 border focus:outline-none"
              style={{ borderColor: primary[200] }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium"
              style={{ color: primary[600] }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        {/* Remember + Forgot */}
        <div className="mt-3 flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span>Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            style={{ color: primary[600] }}
            className="text-sm"
          >
            Forgot password?
          </Link>
        </div>

        {/* Button */}
        <div className="mt-6">
          <button
            type="submit"
            onClick={handleSubmit}
            className="h-11 w-full rounded-xl text-white shadow transition"
            style={{ background: primary[600] }}
          >
            Sign In
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Demo: Use any email and password to log in
        </p>

        <p className="mt-2 text-center text-sm">
          <span className="text-gray-700">Don't have an account? </span>
          <Link to="/signup" style={{ color: primary[600] }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
