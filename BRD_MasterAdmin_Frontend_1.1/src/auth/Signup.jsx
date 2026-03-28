import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authServices";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // <-- new state
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setGlobalError("");
    setSuccessMessage(""); // clear previous success message when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setSuccessMessage("");

    if (!validate()) return;

    setLoading(true);

    try {
      await authService.signup({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      setSuccessMessage("Master Admin account created successfully. Please login."); // <-- show message
      // Optionally, clear the form
      setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
    } catch (error) {
      const msg =
        error.response?.data?.email?.[0] ||
        error.response?.data?.detail ||
        "Signup failed";

      setGlobalError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

        {/* Header */}
        <h2 className="text-3xl font-semibold text-blue-600 mb-1">Create account</h2>
        <p className="text-gray-500 mb-6">Make the most of your professional life</p>

        {/* Global Error */}
        {globalError && (
          <div className="mb-4 text-red-600 font-medium text-center">{globalError}</div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 text-green-600 font-medium text-center">{successMessage}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block mb-1 font-medium">First name</label>
            <input
              type="text"
              name="firstName"
              className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 outline-none ${
                errors.firstName ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block mb-1 font-medium">Last name</label>
            <input
              type="text"
              name="lastName"
              className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 outline-none ${
                errors.lastName ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 outline-none ${
                errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password (8+ chars)</label>
            <input
              type="password"
              name="password"
              className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 outline-none ${
                errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 outline-none ${
                errors.confirmPassword ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Creating account..." : "Agree and create account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>

      </div>
    </div>
  );
};

export default Signup;
