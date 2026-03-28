import React, { useState } from "react";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) return alert("Please enter your email");

    // Future: call backend for OTP or reset link
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-2xl p-8">

        {/* Back button */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="mr-2" /> Back to Login
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
        <p className="text-gray-600 text-sm mb-6">
          Enter your registered email and we'll send you instructions to reset your password.
        </p>

        {/* Form */}
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Email</label>
              <div className="flex items-center border rounded-lg px-3 bg-gray-50">
                <FiMail className="text-gray-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full py-2 ml-2 bg-transparent outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-green-600 font-medium">
              ✔ Reset link sent to <span className="font-semibold">{email}</span>
            </div>

            <p className="text-gray-600 text-sm">
              Check your email inbox and follow the instructions to reset your password.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
