import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  Building2,
  Briefcase,
  AlertCircle,
} from "lucide-react";

export default function SignInPage({ onSignIn }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Sales Executive",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await onSignIn({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (result.success) {
        // If sign-in is successful, navigate to the dashboard
        navigate("/");
      } else {
        // If sign-in fails, display the error message from the API/context
        setError(result.error || "An unknown error occurred.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      value: "Sales Executive",
      label: "Sales Executive",
      icon: Briefcase,
      description: "Field sales operations and lead management",
    },
    {
      value: "Relationship Manager",
      label: "Relationship Manager",
      icon: Building2,
      description: "Client relationships and portfolio management",
    },
    {
      value: "Team Lead",
      label: "Team Lead",
      icon: UserPlus,
      description: "Supervise teams, approve payouts, view consolidated KPIs",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue/10 via-brand-sand to-brand-emerald/10 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-brand-blue text-white flex items-center justify-center font-semibold text-2xl mx-auto mb-4">
              ST
            </div>
            <h1 className="text-3xl font-semibold text-brand-navy mb-2">
              Create Account
            </h1>
            <p className="text-slate-500">Join the Sales Team Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Full Name
              </label>
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Role
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = formData.role === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleChange("role", role.value)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left h-full ${
                        isSelected
                          ? "border-brand-blue bg-brand-blue/10"
                          : "border-slate-200 hover:border-brand-blue/50"
                      }`}
                    >
                      <div className="flex flex-col gap-3">
                        <div
                          className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? "bg-brand-blue text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p
                            className={`font-semibold text-base leading-tight ${
                              isSelected ? "text-brand-blue" : "text-slate-700"
                            }`}
                          >
                            {role.label}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 leading-snug">
                            {role.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-blue text-white rounded-xl py-3 font-semibold shadow-lg hover:bg-brand-navy transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                "Creating Account..."
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-brand-blue font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
