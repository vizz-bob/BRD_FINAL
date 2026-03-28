import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authServices.js";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ global: "", email: "", password: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: "", global: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({ global: "", email: "", password: "" });

    // Basic frontend validation
    let hasError = false;
    const newErrors = { email: "", password: "", global: "" };
    if (!formData.email) {
      newErrors.email = "Email is required";
      hasError = true;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      hasError = true;
    }
    if (hasError) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(
        formData.email.trim().toLowerCase(),
        formData.password,
        formData.rememberMe // pass rememberMe to backend or handle storage
      );

      // Example: store token based on rememberMe
      if (response?.data?.access) {
        if (formData.rememberMe) {
          localStorage.setItem("accessToken", response.data.access);
          localStorage.setItem("refreshToken", response.data.refresh);
        } else {
          sessionStorage.setItem("accessToken", response.data.access);
          sessionStorage.setItem("refreshToken", response.data.refresh);
        }
      }

      navigate("/dashboard");
    } catch (error) {
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        "Invalid credentials";
      setErrors({ ...errors, global: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        {/* Header */}
        <div className="mb-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        {/* Global Error */}
        {errors.global && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-center font-medium">
            {errors.global}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Email
            </label>
            <div className="flex items-center border rounded-lg px-3 bg-gray-50">
              <FiMail className="text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-2 ml-2 bg-transparent outline-none"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Password
            </label>
            <div className="flex items-center border rounded-lg px-3 bg-gray-50 relative">
              <FiLock className="text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full py-2 ml-2 bg-transparent outline-none"
              />
              <span
                className="absolute right-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          {/* Password + Forgot + Remember Me */}
          <div className="flex items-center justify-between mt-1">
            {/* Remember Me */}
            <label className="flex items-center space-x-2 text-gray-700 font-medium">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span>Remember Me</span>
            </label>

            {/* Forgot Password */}
            <p
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-blue-600 hover:underline cursor-pointer"
            >
              Forgot Password?
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-5 text-gray-600 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 cursor-pointer hover:underline font-semibold"
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
