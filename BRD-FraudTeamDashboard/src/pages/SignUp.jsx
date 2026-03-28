import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

const SignUp = ({ onSwitch, onSignUp }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "REVIEWER",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setErrorMessage("");

    if (formData.password !== formData.confirm_password) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    if (formData.full_name && formData.email && formData.password) {
      setIsLoading(true);
      try {
        const response = await authApi.register(formData);
        console.log("Signup success", response);

        if (response.tokens) {
          localStorage.setItem("accessToken", response.tokens.access);
          localStorage.setItem("refreshToken", response.tokens.refresh);
          localStorage.setItem("user", JSON.stringify(response.user));
          navigate("/home");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Signup error:", error);
        if (error.response && error.response.data) {
          const data = error.response.data;
          let message = "Signup failed. Please check your data.";

          if (typeof data === "string") {
            message = data;
          } else if (data.detail) {
            message = data.detail;
          } else if (typeof data === "object") {
            const errorDetails = Object.entries(data)
              .map(([key, value]) => {
                const field = key.replace("_", " ");
                const msg = Array.isArray(value) ? value[0] : value;
                return `${field}: ${msg}`;
              })
              .join(" ");
            message = errorDetails || message;
          }

          setErrorMessage(message);
        } else {
          setErrorMessage("Network error. Could not reach the server.");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage("Please fill all required fields");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Account</h2>
        </div>

        {/* Form */}
        <div className="space-y-4 sm:space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Role
            </label>
            <div className="relative">
              <select
                className="w-full px-3 sm:px-4 py-2 pr-10 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="REVIEWER">Reviewer</option>
                <option value="UNDERWRITER">Underwriter</option>
                <option value="ANALYST">Analyst</option>
              </select>
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 text-xs">
                ▼
              </span>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-600 text-xs sm:text-sm text-center font-medium">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white rounded-lg transition-colors font-medium ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-800"
            }`}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </div>

        {/* Switch to Login */}
        <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;