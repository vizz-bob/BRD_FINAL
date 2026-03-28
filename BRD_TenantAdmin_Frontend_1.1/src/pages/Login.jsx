import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import authService from "../services/authService";
import {
  ShieldCheckIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- VALIDATORS ---------------- */
  const validators = {
    email: (v) => {
      if (!v) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
        return "Enter a valid email address";
      return null;
    },
    password: (v) => {
      if (!v) return "Password is required";
      if (v.length < 8) return "Password must be at least 8 characters";
      return null;
    },
  };

  const FieldError = ({ error }) =>
    error ? <div className="mt-1 text-sm text-red-600">{error}</div> : null;

  /* ---------------- LOGIN HANDLER ---------------- */
  const doLogin = async () => {
    setFormErrors({});
    setGlobalError(null);

    // Validate fields
    const errors = {
      email: validators.email(email.trim()),
      password: validators.password(password),
    };
    Object.keys(errors).forEach((k) => errors[k] === null && delete errors[k]);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // Send login request
      const res = await axios.post(`${BASE_URL}/api/token/`, {
        email: email.trim(), // keep exact casing from input
        password,
      });

      console.log("Login response:", res.data);

      // Save tokens correctly for remember/sessions
      authService.saveTokens(res.data.access, res.data.refresh, remember);

      sessionStorage.setItem("tenant_id", res.data.tenant_id ?? 1); // TODO: Fallback 1 is not recommended for production, using here only for testing purpose for users modules
      sessionStorage.setItem("tenant_uuid", res.data.tenant_uuid);
      sessionStorage.setItem("tenant_name", res.data.tenant_name);

      
      // Navigate to dashboard
      // navigate("/dashboard");
      navigate("/subscription-plans")
    } catch (err) {
      console.error("Login error:", err.response?.data);
      setGlobalError(
        err?.response?.data?.detail || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-white grid place-items-center">
      <div className="w-full max-w-md rounded-2xl border bg-white shadow-card p-6">
        {/* Header */}
        <div className="grid place-items-center">
          <div className="h-12 w-12 rounded-full bg-primary-50 grid place-items-center text-primary-600">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>
          <div className="mt-4 text-3xl font-semibold text-gray-900">
            Tenant Login
          </div>
          <div className="mt-1 text-sm text-gray-600">Log in to continue</div>
        </div>

        {/* Global error */}
        {globalError && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
            {globalError}
          </div>
        )}

        {/* Form */}
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) doLogin();
          }}
        >
          {/* Email */}
          <label className="block">
            <div className="text-sm text-gray-900">Email</div>
            <div className="mt-1 relative">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-xl border px-3 pr-10 focus:ring-2 focus:ring-primary-300"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500">
                <EnvelopeIcon className="h-5 w-5" />
              </div>
            </div>
            <FieldError error={formErrors.email} />
          </label>

          {/* Password */}
          <label className="block mt-4">
            <div className="text-sm text-gray-900">Password</div>
            <div className="mt-1 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 rounded-xl border px-3 pr-10 focus:ring-2 focus:ring-primary-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <FieldError error={formErrors.password} />
          </label>

          {/* Remember / Forgot */}
          <div className="mt-4 flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={() => navigate("/forgot_password")}
              className="text-sm text-primary-600"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-6 h-11 w-full rounded-xl text-white shadow
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700"
              }
            `}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Signup */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-700">Don't have an account? </span>
          <button
            onClick={() => navigate("/signup")}
            className="text-primary-600"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}