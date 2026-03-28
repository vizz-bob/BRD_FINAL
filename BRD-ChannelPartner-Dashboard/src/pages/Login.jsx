import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { AuthAPI } from "../services/DashboardService";
import "./Login.css";

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [form,   setForm]   = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [loading,setLoading]= useState(false);
  const [shake,  setShake]  = useState(false);

  const from = location.state?.from?.pathname || "/dashboard/dashboard";

  const validate = () => {
    const e = {};
    if (!form.email.trim())                     e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email    = "Enter a valid email address";
    if (!form.password.trim())                  e.password = "Password is required";
    else if (form.password.length < 4)          e.password = "Password must be at least 4 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setLoading(true);
    setErrors({});
    
    try {
      // Call backend API
      const response = await AuthAPI.signIn({
        email: form.email,
        password: form.password,
        rememeber_me: form.remember,
        sign_in: true,
        create_account: false
      });
      
      // On success, log in the user
      login(form.email);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: error.message || "Login failed. Please try again." });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const f = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: undefined }));
  };

  return (
    <div className="lg-bg">
      <div className="lg-wrapper">

        {/* ── LEFT PANEL ── */}
        <div className="lg-left">
          <div className="lg-logo">
            <div className="lg-logo-icon">
              <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                <path d="M17 20H7a3 3 0 01-3-3V9a3 3 0 013-3h1V5a4 4 0 018 0v1h1a3 3 0 013 3v8a3 3 0 01-3 3zM10 6h4V5a2 2 0 00-4 0v1z"/>
              </svg>
            </div>
            <span>ChannelOS</span>
          </div>

          <div className="lg-left-body">
            <div className="lg-hero-tag"><span className="lg-tag-dot" />Partner Management Portal</div>

            <h1 className="lg-hero-title">
              Manage Your<br />
              <em>Referral Network</em><br />
              with Ease
            </h1>

            <p className="lg-hero-sub">
              Track DSAs, brokers &amp; lead partners, configure payout models,
              and drive performance — all from one unified platform.
            </p>

            <div className="lg-features">
              <div className="lg-feature">
                <div className="lg-feature-dot green" />
                <div>
                  <div className="lg-feature-label">Real-time Agent Tracking</div>
                  <div className="lg-feature-sub">Live performance dashboards</div>
                </div>
              </div>
              <div className="lg-feature">
                <div className="lg-feature-dot blue" />
                <div>
                  <div className="lg-feature-label">Automated Payout Engine</div>
                  <div className="lg-feature-sub">Commission & bonus management</div>
                </div>
              </div>
              <div className="lg-feature">
                <div className="lg-feature-dot orange" />
                <div>
                  <div className="lg-feature-label">Multi-Tenant Support</div>
                  <div className="lg-feature-sub">Manage all orgs from one place</div>
                </div>
              </div>
            </div>

            <div className="lg-deco-card">
              <div className="lg-deco-avatars">
                {["R","P","A","K"].map(l => <div key={l} className="lg-deco-av">{l}</div>)}
                <div className="lg-deco-more">+48</div>
              </div>
              <div className="lg-deco-text">
                <div className="lg-deco-val">52 partners</div>
                <div className="lg-deco-lbl">already on the platform</div>
              </div>
            </div>

            <div className="lg-status-pill">
              <span className="lg-status-dot" />
              All Systems Operational
            </div>
          </div>
        </div>

        {/* ── RIGHT CARD ── */}
        <div className={`lg-card ${shake ? "shake" : ""}`}>
          <div className="lg-card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your partner management dashboard</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* General Error */}
            {errors.general && (
              <div className="lg-alert-error" style={{ marginBottom: "1rem", padding: "0.75rem", background: "#fee", border: "1px solid #fcc", borderRadius: "6px", color: "#c33" }}>
                ⚠ {errors.general}
              </div>
            )}

            {/* Email */}
            <div className={`lg-field ${errors.email ? "has-error" : ""}`}>
              <label>Email Address <span className="lg-req">*</span></label>
              <div className="lg-input-wrap">
                <svg className="lg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
                </svg>
                <input
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  value={form.email}
                  onChange={e => f("email", e.target.value)}
                  disabled={loading}
                />
              </div>
              {errors.email && <span className="lg-err">⚠ {errors.email}</span>}
            </div>

            {/* Password */}
            <div className={`lg-field ${errors.password ? "has-error" : ""}`}>
              <label>Password <span className="lg-req">*</span></label>
              <div className="lg-input-wrap">
                <svg className="lg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => f("password", e.target.value)}
                  disabled={loading}
                />
                <button type="button" className="lg-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.password && <span className="lg-err">⚠ {errors.password}</span>}
            </div>

            {/* Remember + Forgot */}
            <div className="lg-row">
              <label className="lg-remember">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={e => f("remember", e.target.checked)}
                  disabled={loading}
                />
                Remember me
              </label>
              <a href="#" className="lg-forgot">Forgot password?</a>
            </div>

            <button className={`lg-btn-submit ${loading ? "loading" : ""}`} type="submit" disabled={loading}>
              {loading ? <><span className="lg-spinner" /> Signing in...</> : "Sign In"}
            </button>

            <div className="lg-divider"><span>or</span></div>

            <div className="lg-footer">
              Don't have an account? <Link to="/signup">Create Account</Link>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}