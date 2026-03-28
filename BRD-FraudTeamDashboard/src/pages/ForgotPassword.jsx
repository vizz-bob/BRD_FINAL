import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineCheckCircle } from "react-icons/ai";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Email is required");
      return;
    }

    if (email !== "admin@example.com") {
      alert("Email not found");
      return;
    }

    setSubmitted(true);

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Enter your email to receive a password reset link
          </p>
        </div>

        {!submitted ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
              >
                Send Reset Link
              </button>
            </form>

            <div className="text-center mt-4 sm:mt-6">
              <Link
                to="/login"
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                ← Back to Login
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-4 sm:py-6">
            <AiOutlineCheckCircle className="text-5xl sm:text-6xl text-green-500 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-800 font-semibold text-base sm:text-lg mb-1 sm:mb-2">
              Reset Link Sent!
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              Check your email for password reset instructions.
              <br />
              Redirecting to login...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}