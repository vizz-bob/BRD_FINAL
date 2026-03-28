import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EnvelopeIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "valuation",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Inline primary colors
  // const primary = {
  //   50: "#eff6ff",
  //   200: "#bfdbfe",
  //   300: "#93c5fd",
  //   500: "#3b82f6",
  //   600: "#2563eb",
  //   700: "#1d4ed8",
  // };

  const primary = {
    50: "#eff6ff",
    200: "#bfdbfe",
    300: "#93c5fd",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword)
      return setError("Passwords do not match.");

    if (formData.password.length < 8)
      return setError("Password must be at least 8 characters.");

    setLoading(true);

    try {
      const usersRaw = localStorage.getItem("mock_users");
      const users = usersRaw ? JSON.parse(usersRaw) : [];

      if (users.find((u) => u.email === formData.email)) {
        setError("Email already exists.");
        setLoading(false);
        return;
      }

      users.push(formData);
      localStorage.setItem("mock_users", JSON.stringify(users));

      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-white">
      <div
        className="w-full max-w-md rounded-2xl shadow-card p-6"
        style={{ border: `1px solid ${primary[200]}`, background: "#fff" }}
      >
        {/* ICON */}
        <div className="grid place-items-center">
          <div
            className="h-12 w-12 rounded-full grid place-items-center"
            style={{ background: primary[50], color: primary[600] }}
          >
            <ShieldCheckIcon className="h-6 w-6" />
          </div>

          <div className="mt-4 text-3xl font-semibold text-gray-900 text-center">
            Create your account
          </div>

          <div className="mt-1 text-sm text-gray-600 text-center">
            Sign up to join the Valuation Dashboard
          </div>
        </div>

        {/* Errors */}
        {error && (
          <div
            className="mt-3 rounded-lg p-3 text-sm"
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="mt-3 rounded-lg p-3 text-sm"
            style={{
              background: primary[50],
              color: primary[700],
              border: `1px solid ${primary[200]}`,
            }}
          >
            {success}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Full Name */}
          <label className="block">
            <div className="text-sm text-gray-900">Full Name</div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="mt-1 w-full h-11 rounded-xl px-3 focus:outline-none"
              style={{ border: `1px solid ${primary[200]}` }}
            />
          </label>

          {/* Email */}
          <label className="block">
            <div className="text-sm text-gray-900">Email</div>
            <div className="mt-1 relative">
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-11 rounded-xl px-3 pr-10 focus:outline-none"
                style={{ border: `1px solid ${primary[200]}` }}
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
          <label className="block">
            <div className="text-sm text-gray-900">Password</div>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full h-11 rounded-xl px-3 focus:outline-none"
              style={{ border: `1px solid ${primary[200]}` }}
            />
          </label>

          {/* Confirm Password */}
          <label className="block">
            <div className="text-sm text-gray-900">Confirm Password</div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full h-11 rounded-xl px-3 focus:outline-none"
              style={{ border: `1px solid ${primary[200]}` }}
            />
          </label>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl text-white shadow transition"
            style={{
              background: primary[600],
              color: "#fff",
              border: "none",
            }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Bottom Link */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-700">Already have an account? </span>
          <Link
            to="/login"
            style={{ color: primary[600] }}
            className="font-medium hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
