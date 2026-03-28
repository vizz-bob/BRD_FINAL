import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ─── Design Tokens ─────────────────────────────────────────────────────── */
const T = {
  primary:      "#1a56db",
  primaryDark:  "#1347c4",
  primaryLight: "#eff6ff",
  primaryBorder:"#bfdbfe",
  text:         "#0f172a",
  textSub:      "#475569",
  textMuted:    "#94a3b8",
  border:       "#e2e8f0",
  borderHover:  "#94a3b8",
  bg:           "#f8fafc",
  white:        "#ffffff",
  error:        "#dc2626",
  errorBg:      "#fef2f2",
  errorBorder:  "#fecaca",
  success:      "#16a34a",
  successBg:    "#f0fdf4",
  successBorder:"#bbf7d0",
  radius:       "12px",
  shadowLg:     "0 24px 60px rgba(0,0,0,0.10), 0 8px 24px rgba(26,86,219,0.07)",
};

const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  .auth-root * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }
  .auth-root input { font-family: 'DM Sans', sans-serif; }

  .auth-input:focus {
    border-color: ${T.primary} !important;
    box-shadow: 0 0 0 3.5px rgba(26,86,219,0.13) !important;
    outline: none;
  }
  .auth-input:hover:not(:focus) { border-color: ${T.borderHover} !important; }

  .auth-btn-primary { transition: all 0.18s ease; }
  .auth-btn-primary:hover:not(:disabled) {
    background: ${T.primaryDark} !important;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(26,86,219,0.32) !important;
  }
  .auth-btn-primary:active:not(:disabled) { transform: translateY(0); }

  .auth-ghost-btn {
    transition: all 0.15s ease;
  }
  .auth-ghost-btn:hover {
    border-color: ${T.borderHover} !important;
    color: ${T.text} !important;
    background: ${T.bg} !important;
  }

  .auth-text-link:hover {
    text-decoration: underline !important;
    text-underline-offset: 2px;
  }

  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .auth-panel { animation: fadeSlide 0.28s ease both; }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Responsive card width ── */
  .auth-card {
    width: 100%;
    max-width: 420px;
    background: ${T.white};
    border-radius: 20px;
    border: 1px solid ${T.border};
    box-shadow: ${T.shadowLg};
    overflow: hidden;
  }
  .auth-card-inner {
    padding: 2rem 2.25rem;
  }
  .auth-input-base {
    width: 100%;
    padding: 0.75rem 0.875rem;
    border: 1.5px solid ${T.border};
    border-radius: ${T.radius};
    font-size: 0.9rem;
    color: ${T.text};
    background: ${T.white};
    transition: border-color 0.15s, box-shadow 0.15s;
    outline: none;
  }

  /* ── Desktop / Laptop: bigger card, more padding, larger type ── */
  @media (min-width: 1024px) {
    .auth-card {
      max-width: 520px;
      border-radius: 24px;
    }
    .auth-card-inner {
      padding: 2.75rem 3rem;
    }
    .auth-input-base {
      padding: 0.875rem 1rem;
      font-size: 0.95rem;
      border-radius: 12px;
    }
    .auth-heading {
      font-size: 1.85rem !important;
    }
    .auth-sub {
      font-size: 0.95rem !important;
    }
    .auth-label {
      font-size: 0.83rem !important;
    }
    .auth-btn-lg {
      padding: 0.95rem 1rem !important;
      font-size: 0.95rem !important;
      border-radius: 12px !important;
    }
    .auth-brand-logo {
      width: 42px !important;
      height: 42px !important;
      border-radius: 11px !important;
    }
    .auth-brand-logo svg {
      width: 20px !important;
      height: 20px !important;
    }
    .auth-brand-name {
      font-size: 0.85rem !important;
    }
    .auth-brand-wrap {
      margin-bottom: 2rem !important;
    }
    .auth-heading-wrap {
      margin-bottom: 2.25rem !important;
    }
    .auth-field-gap {
      margin-bottom: 1.1rem !important;
    }
    .auth-remember-wrap {
      margin: 1.1rem 0 1.75rem !important;
    }
    .auth-divider {
      margin-top: 1.75rem !important;
      padding-top: 1.75rem !important;
    }
    .auth-hint {
      font-size: 0.78rem !important;
    }
    .auth-accent-bar {
      height: 4px !important;
    }
  }

  /* ── Mobile: tighter ── */
  @media (max-width: 480px) {
    .auth-card {
      border-radius: 16px;
    }
    .auth-card-inner {
      padding: 1.5rem 1.375rem;
    }
    .auth-heading {
      font-size: 1.35rem !important;
    }
  }
`;

const Spinner = () => (
  <span style={{
    width: 14, height: 14, flexShrink: 0,
    border: "2px solid rgba(255,255,255,0.35)",
    borderTopColor: "#fff", borderRadius: "50%",
    display: "inline-block", animation: "spin 0.7s linear infinite",
  }}/>
);

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData]         = useState({ orgId: "", email: "", password: "" });
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [view, setView]             = useState("login");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp]     = useState("");
  const [newPwd, setNewPwd]         = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (error) setError("");
  };

  const switchView = (v) => { setView(v); setError(""); setSuccess(""); };

  /* ── Login submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!formData.orgId.trim())    { setError("Organization ID is required."); return; }
    if (!formData.email.trim())    { setError("Email address is required."); return; }
    if (!formData.password.trim()) { setError("Password is required."); return; }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org_id:   formData.orgId,
          email:    formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "Invalid credentials. Please try again.");
      if (data.access)  localStorage.setItem("accessToken",  data.access);
      if (data.refresh) localStorage.setItem("refreshToken", data.refresh);
      navigate("/tenants");
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Forgot password ── */
  const handleForgotSend = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) { setError("Enter a valid email address."); return; }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/forgot-password/", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to send reset OTP.");
      setSuccess("OTP sent to your email.");
      setView("reset");
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  /* ── Reset password ── */
  const handleReset = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!resetOtp.trim())      { setError("OTP is required."); return; }
    if (newPwd.length < 8)     { setError("Password must be at least 8 characters."); return; }
    if (newPwd !== confirmPwd) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/reset-password/", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp: resetOtp, new_password: newPwd }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Password reset failed.");
      setSuccess("Password reset successful! Redirecting…");
      setTimeout(() => {
        switchView("login");
        setResetOtp(""); setNewPwd(""); setConfirmPwd("");
      }, 2000);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  /* ── Shared inline styles (responsive overrides via CSS classes) ── */
  const inputStyle = {
    width: "100%",
    padding: "0.75rem 0.875rem",
    border: `1.5px solid ${T.border}`,
    borderRadius: T.radius,
    fontSize: "0.9rem",
    color: T.text,
    background: T.white,
    transition: "border-color 0.15s, box-shadow 0.15s",
    outline: "none",
  };

  const primaryBtnStyle = {
    width: "100%", padding: "0.8rem 1rem",
    background: T.primary, color: T.white,
    border: "none", borderRadius: T.radius,
    fontSize: "0.9rem", fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
    boxShadow: "0 2px 8px rgba(26,86,219,0.25)",
    display: "flex", alignItems: "center",
    justifyContent: "center", gap: "0.5rem",
    letterSpacing: "0.01em",
  };

  const ghostBtnStyle = {
    width: "100%", padding: "0.8rem 1rem",
    background: T.white, color: T.textSub,
    border: `1.5px solid ${T.border}`, borderRadius: T.radius,
    fontSize: "0.9rem", fontWeight: "600",
    cursor: "pointer",
  };

  const lbl = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: T.textSub,
    marginBottom: "0.4rem",
    letterSpacing: "0.01em",
  };

  return (
    <>
      <style>{globalCss}</style>
      <div
        className="auth-root"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #f0f7ff 0%, #e8f0fe 50%, #f0f4ff 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1.5rem",
          paddingTop: "calc(1.5rem + 65px)",
        }}
      >
        <div className="auth-card">

          {/* Accent bar */}
          <div className="auth-accent-bar" style={{
            height: "3px",
            background: `linear-gradient(90deg, ${T.primary}, #6366f1)`,
          }}/>

          <div className="auth-card-inner">

            {/* Brand */}
            <div className="auth-brand-wrap" style={{ display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"1.5rem" }}>
              <div className="auth-brand-logo" style={{
                width:"36px", height:"36px", borderRadius:"10px", flexShrink:0,
                background:`linear-gradient(135deg, ${T.primary}, #6366f1)`,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="auth-brand-name" style={{
                fontSize:"0.78rem", fontWeight:"700", color:T.primary,
                letterSpacing:"0.08em", textTransform:"uppercase",
              }}>
                LoanOS
              </span>
            </div>

            {/* Heading */}
            <div className="auth-heading-wrap" style={{ marginBottom:"1.75rem" }}>
              {view === "login"  && <>
                <h1 className="auth-heading" style={{ fontSize:"1.5rem", fontWeight:"700", color:"#0f172a", margin:"0 0 0.3rem", letterSpacing:"-0.02em" }}>Welcome back</h1>
                <p className="auth-sub" style={{ color:T.textMuted, fontSize:"0.875rem", margin:0 }}>Sign in to your account to continue</p>
              </>}
              {view === "forgot" && <>
                <h1 className="auth-heading" style={{ fontSize:"1.5rem", fontWeight:"700", color:"#0f172a", margin:"0 0 0.3rem", letterSpacing:"-0.02em" }}>Forgot password?</h1>
                <p className="auth-sub" style={{ color:T.textMuted, fontSize:"0.875rem", margin:0 }}>We'll send a reset OTP to your email</p>
              </>}
              {view === "reset"  && <>
                <h1 className="auth-heading" style={{ fontSize:"1.5rem", fontWeight:"700", color:"#0f172a", margin:"0 0 0.3rem", letterSpacing:"-0.02em" }}>Reset password</h1>
                <p className="auth-sub" style={{ color:T.textMuted, fontSize:"0.875rem", margin:0 }}>
                  OTP sent to <strong style={{ color:T.primary }}>{resetEmail}</strong>
                </p>
              </>}
            </div>

            {/* Error banner */}
            {error && (
              <div style={{
                background:T.errorBg, border:`1px solid ${T.errorBorder}`,
                color:T.error, borderRadius:T.radius,
                padding:"0.75rem 1rem", marginBottom:"1.25rem",
                fontSize:"0.85rem", fontWeight:"500", lineHeight:"1.5",
                display:"flex", gap:"0.625rem", alignItems:"flex-start",
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0, marginTop:"1px" }}>
                  <circle cx="8" cy="8" r="7" stroke="#dc2626" strokeWidth="1.5"/>
                  <path d="M8 5v3.5M8 11h.01" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            {/* Success banner */}
            {success && (
              <div style={{
                background:T.successBg, border:`1px solid ${T.successBorder}`,
                color:T.success, borderRadius:T.radius,
                padding:"0.75rem 1rem", marginBottom:"1.25rem",
                fontSize:"0.85rem", fontWeight:"500",
                display:"flex", gap:"0.625rem", alignItems:"center",
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0 }}>
                  <circle cx="8" cy="8" r="7" stroke="#16a34a" strokeWidth="1.5"/>
                  <path d="M5 8l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {success}
              </div>
            )}

            {/* ══ LOGIN FORM ══ */}
            {view === "login" && (
              <form onSubmit={handleSubmit} className="auth-panel">

                <div className="auth-field-gap" style={{ marginBottom:"0.875rem" }}>
                  <label className="auth-label" style={lbl}>Organization ID</label>
                  <input
                    className="auth-input auth-input-base"
                    type="text" name="orgId"
                    value={formData.orgId} onChange={handleChange}
                    placeholder="Enter your organization ID"
                    required style={inputStyle}
                  />
                  <div className="auth-hint" style={{ fontSize:"0.75rem", color:T.textMuted, marginTop:"0.35rem" }}>
                    Provided in your welcome email after sign-up
                  </div>
                </div>

                <div className="auth-field-gap" style={{ marginBottom:"0.875rem" }}>
                  <label className="auth-label" style={lbl}>Email Address</label>
                  <input
                    className="auth-input auth-input-base"
                    type="email" name="email"
                    value={formData.email} onChange={handleChange}
                    placeholder="you@company.com"
                    required autoComplete="email" style={inputStyle}
                  />
                </div>

                <div className="auth-field-gap" style={{ marginBottom:"0.375rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.4rem" }}>
                    <label className="auth-label" style={{ ...lbl, marginBottom:0 }}>Password</label>
                    <button
                      type="button" onClick={() => switchView("forgot")}
                      className="auth-text-link"
                      style={{
                        background:"none", border:"none", cursor:"pointer",
                        color:T.primary, fontSize:"0.78rem", fontWeight:"600",
                        padding:0, textDecoration:"none", transition:"color 0.15s",
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position:"relative" }}>
                    <input
                      className="auth-input auth-input-base"
                      type={showPassword ? "text" : "password"}
                      name="password" value={formData.password} onChange={handleChange}
                      placeholder="Enter your password"
                      required autoComplete="current-password"
                      style={{ ...inputStyle, paddingRight:"2.75rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      style={{
                        position:"absolute", right:"0.75rem", top:"50%",
                        transform:"translateY(-50%)", background:"none",
                        border:"none", cursor:"pointer", padding:0,
                        display:"flex", alignItems:"center", color:T.textMuted,
                      }}
                    >
                      {showPassword
                        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
                              stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        : <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                              stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75"/>
                          </svg>
                      }
                    </button>
                  </div>
                </div>

                <div className="auth-remember-wrap" style={{ display:"flex", alignItems:"center", gap:"0.5rem", margin:"0.875rem 0 1.5rem" }}>
                  <input
                    type="checkbox" id="remember"
                    style={{ width:"15px", height:"15px", cursor:"pointer", accentColor:T.primary }}
                  />
                  <label htmlFor="remember" style={{ fontSize:"0.82rem", color:T.textSub, cursor:"pointer", userSelect:"none" }}>
                    Keep me signed in
                  </label>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="auth-btn-primary auth-btn-lg"
                  style={primaryBtnStyle}
                >
                  {loading && <Spinner/>}
                  {loading ? "Signing in…" : "Sign In"}
                </button>

                <div
                  className="auth-divider"
                  style={{
                    marginTop:"1.5rem", paddingTop:"1.5rem",
                    borderTop:`1px solid ${T.border}`, textAlign:"center",
                  }}
                >
                  <span style={{ fontSize:"0.85rem", color:T.textMuted }}>Don't have an account? </span>
                  <Link
                    to="/signup" className="auth-text-link"
                    style={{ fontSize:"0.85rem", color:T.primary, fontWeight:"600", textDecoration:"none" }}
                  >
                    Create account
                  </Link>
                </div>
              </form>
            )}

            {/* ══ FORGOT FORM ══ */}
            {view === "forgot" && (
              <form onSubmit={handleForgotSend} className="auth-panel">
                <div className="auth-field-gap" style={{ marginBottom:"1.25rem" }}>
                  <label className="auth-label" style={lbl}>Email Address</label>
                  <input
                    className="auth-input auth-input-base"
                    type="email" value={resetEmail}
                    onChange={e => { setResetEmail(e.target.value); if (error) setError(""); }}
                    placeholder="you@company.com" required style={inputStyle}
                  />
                </div>
                <button
                  type="submit" disabled={loading}
                  className="auth-btn-primary auth-btn-lg"
                  style={{ ...primaryBtnStyle, marginBottom:"0.75rem" }}
                >
                  {loading && <Spinner/>}
                  {loading ? "Sending OTP…" : "Send Reset OTP"}
                </button>
                <button
                  type="button" onClick={() => switchView("login")}
                  className="auth-ghost-btn auth-btn-lg"
                  style={ghostBtnStyle}
                >
                  ← Back to Sign In
                </button>
              </form>
            )}

            {/* ══ RESET FORM ══ */}
            {view === "reset" && (
              <form onSubmit={handleReset} className="auth-panel">
                <div className="auth-field-gap" style={{ marginBottom:"0.875rem" }}>
                  <label className="auth-label" style={lbl}>OTP Code</label>
                  <input
                    className="auth-input auth-input-base"
                    type="text" value={resetOtp}
                    onChange={e => { setResetOtp(e.target.value); if (error) setError(""); }}
                    placeholder="• • • • • •" maxLength={6} required
                    style={{
                      ...inputStyle,
                      textAlign:"center", letterSpacing:"0.5rem",
                      fontFamily:"'DM Mono', monospace", fontWeight:"500",
                    }}
                  />
                </div>
                <div className="auth-field-gap" style={{ marginBottom:"0.875rem" }}>
                  <label className="auth-label" style={lbl}>New Password</label>
                  <input
                    className="auth-input auth-input-base"
                    type="password" value={newPwd}
                    onChange={e => { setNewPwd(e.target.value); if (error) setError(""); }}
                    placeholder="Minimum 8 characters" required style={inputStyle}
                  />
                </div>
                <div className="auth-field-gap" style={{ marginBottom:"1.25rem" }}>
                  <label className="auth-label" style={lbl}>Confirm Password</label>
                  <input
                    className="auth-input auth-input-base"
                    type="password" value={confirmPwd}
                    onChange={e => { setConfirmPwd(e.target.value); if (error) setError(""); }}
                    placeholder="Re-enter new password" required style={inputStyle}
                  />
                </div>
                <div style={{ display:"flex", gap:"0.75rem" }}>
                  <button
                    type="button" onClick={() => switchView("forgot")}
                    className="auth-ghost-btn auth-btn-lg"
                    style={{ ...ghostBtnStyle, flex:"0 0 90px" }}
                  >
                    Back
                  </button>
                  <button
                    type="submit" disabled={loading}
                    className="auth-btn-primary auth-btn-lg"
                    style={{ ...primaryBtnStyle, flex:1 }}
                  >
                    {loading && <Spinner/>}
                    {loading ? "Resetting…" : "Reset Password"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;