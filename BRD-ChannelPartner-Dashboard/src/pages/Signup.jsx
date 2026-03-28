import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { AccountsAPI } from "../services/DashboardService";
import "./Signup.css";

export default function Signup() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword]  = useState(false);
  const [showConfirm,  setShowConfirm]   = useState(false);
  const [form,   setForm]   = useState({ name: "", email: "", phone: "", role: "DSA Manager", password: "", confirm: "", agree: false });
  const [errors, setErrors] = useState({});
  const [loading,setLoading]= useState(false);
  const [shake,  setShake]  = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())                      e.name    = "Full name is required";
    if (!form.email.trim())                     e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email   = "Enter a valid email address";
    if (!form.password)                         e.password= "Password is required";
    else if (form.password.length < 6)          e.password= "Password must be at least 6 characters";
    if (!form.confirm)                          e.confirm = "Please confirm your password";
    else if (form.confirm !== form.password)    e.confirm = "Passwords do not match";
    if (!form.agree)                            e.agree   = "You must accept the terms";
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
      // Map role to backend format
      const roleMap = {
        "DSA Manager": "DSA_MANAGER",
        "Broker Admin": "BROKER_ADMIN",
        "Lead Manager": "LEAD_MANAGER",
        "Finance Team": "FINANCE_TEAM",
        "Other": "OTHER"
      };
      
      // Call backend API
      const response = await AccountsAPI.register({
        full_name: form.name,
        email: form.email,
        phone: form.phone || "",
        password: form.password,
        confirm_password: form.confirm,
        role: roleMap[form.role] || "OTHER",
        agree_terms: form.agree,
        create_account: true,
        sign_in: false
      });
      
      // On success, log in the user and redirect
      login(form.email, form.name);
      navigate("/dashboard/dashboard", { replace: true });
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ general: error.message || "Registration failed. Please try again." });
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

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)  s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][strength] || "";
  const strengthColor = ["", "#ef4444","#f97316","#eab308","#22c55e","#16a34a"][strength] || "";

  return (
    <div className="su-bg">
      <div className="su-wrapper">

        {/* LEFT */}
        <div className="su-left">
          <div className="su-logo">
            <div className="su-logo-icon">
              <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                <path d="M17 20H7a3 3 0 01-3-3V9a3 3 0 013-3h1V5a4 4 0 018 0v1h1a3 3 0 013 3v8a3 3 0 01-3 3zM10 6h4V5a2 2 0 00-4 0v1z"/>
              </svg>
            </div>
            <span>ChannelOS</span>
          </div>

          <div className="su-left-body">
            <div className="su-hero-tag"><span className="su-tag-dot" />New Account</div>
            <h1 className="su-hero-title">Join the<br /><em>Partner Network</em><br />Today</h1>
            <p className="su-hero-sub">Get access to your full channel partner dashboard and start managing agents, payouts and performance from day one.</p>

            <div className="su-steps">
              {[
                { n:"1", label:"Create your account", sub:"Set up your credentials" },
                { n:"2", label:"Access Dashboard",     sub:"All modules unlocked instantly" },
                { n:"3", label:"Invite & Manage",      sub:"Onboard your agents" },
              ].map(s => (
                <div key={s.n} className="su-step">
                  <div className="su-step-num">{s.n}</div>
                  <div>
                    <div className="su-step-label">{s.label}</div>
                    <div className="su-step-sub">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="su-deco-card">
              <div className="su-deco-avatars">
                {["R","P","A","K"].map(l => <div key={l} className="su-deco-av">{l}</div>)}
                <div className="su-deco-more">+48</div>
              </div>
              <div className="su-deco-text">
                <div className="su-deco-val">52 partners</div>
                <div className="su-deco-lbl">already on the platform</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className={`su-card ${shake ? "shake" : ""}`}>
          <div className="su-card-header">
            <h2>Create Account</h2>
            <p>Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* General Error */}
            {errors.general && (
              <div className="su-alert-error" style={{ marginBottom: "1rem", padding: "0.75rem", background: "#fee", border: "1px solid #fcc", borderRadius: "6px", color: "#c33" }}>
                ⚠ {errors.general}
              </div>
            )}

            {/* Name */}
            <div className={`su-field ${errors.name ? "has-error" : ""}`}>
              <label>Full Name <span className="su-req">*</span></label>
              <div className="su-input-wrap">
                <svg className="su-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input value={form.name} onChange={e => f("name", e.target.value)} placeholder="Amit Kumar" disabled={loading} />
              </div>
              {errors.name && <span className="su-err">⚠ {errors.name}</span>}
            </div>

            {/* Email */}
            <div className={`su-field ${errors.email ? "has-error" : ""}`}>
              <label>Email Address <span className="su-req">*</span></label>
              <div className="su-input-wrap">
                <svg className="su-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
                <input type="email" value={form.email} onChange={e => f("email", e.target.value)} placeholder="you@company.com" disabled={loading} />
              </div>
              {errors.email && <span className="su-err">⚠ {errors.email}</span>}
            </div>

            {/* Phone + Role row */}
            <div className="su-2col">
              <div className="su-field">
                <label>Phone <span className="su-opt">(optional)</span></label>
                <div className="su-input-wrap">
                  <svg className="su-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.07 9.81 2 2 0 015 8h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 15.91"/></svg>
                  <input value={form.phone} onChange={e => f("phone", e.target.value)} placeholder="9876543210" maxLength={10} disabled={loading} />
                </div>
              </div>
              <div className="su-field">
                <label>Your Role</label>
                <div className="su-input-wrap su-select-wrap">
                  <svg className="su-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" strokeWidth="1.8"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"/></svg>
                  <select value={form.role} onChange={e => f("role", e.target.value)} disabled={loading}>
                    <option>DSA Manager</option>
                    <option>Broker Admin</option>
                    <option>Lead Manager</option>
                    <option>Finance Team</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className={`su-field ${errors.password ? "has-error" : ""}`}>
              <label>Password <span className="su-req">*</span></label>
              <div className="su-input-wrap">
                <svg className="su-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => f("password", e.target.value)} placeholder="Min 6 characters" disabled={loading} />
                <button type="button" className="su-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
              {form.password && (
                <div className="su-strength">
                  <div className="su-strength-bars">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="su-bar" style={{ background: i <= strength ? strengthColor : "#e2e8f0", transition:"background 0.3s" }} />
                    ))}
                  </div>
                  <span className="su-strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
              {errors.password && <span className="su-err">⚠ {errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className={`su-field ${errors.confirm ? "has-error" : ""}`}>
              <label>Confirm Password <span className="su-req">*</span></label>
              <div className="su-input-wrap">
                <svg className="su-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" strokeWidth="1.8"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <input type={showConfirm ? "text" : "password"} value={form.confirm} onChange={e => f("confirm", e.target.value)} placeholder="Re-enter password" disabled={loading} />
                <button type="button" className="su-eye" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
              {form.confirm && form.confirm === form.password && !errors.confirm && (
                <span className="su-match">✓ Passwords match</span>
              )}
              {errors.confirm && <span className="su-err">⚠ {errors.confirm}</span>}
            </div>

            {/* Terms */}
            <div className={`su-terms ${errors.agree ? "has-error" : ""}`}>
              <label className="su-check-label">
                <input type="checkbox" checked={form.agree} onChange={e => f("agree", e.target.checked)} disabled={loading} />
                <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
              </label>
              {errors.agree && <span className="su-err">⚠ {errors.agree}</span>}
            </div>

            <button className={`su-btn-submit ${loading ? "loading" : ""}`} type="submit" disabled={loading}>
              {loading ? <><span className="su-spinner" /> Creating Account...</> : "Create Account"}
            </button>

            <div className="su-divider"><span>or</span></div>
            <div className="su-footer">Already have an account? <Link to="/login">Sign In</Link></div>

          </form>
        </div>

      </div>
    </div>
  );
}