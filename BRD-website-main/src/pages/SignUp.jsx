import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ─── Shared Design Tokens ────────────────────────────────────────────────── */
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
  radius:       "10px",
  radiusLg:     "16px",
  shadow:       "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd:     "0 4px 16px rgba(0,0,0,0.08)",
  shadowLg:     "0 20px 40px rgba(0,0,0,0.10)",
};

const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  .auth-root * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }
  .auth-root input, .auth-root select, .auth-root textarea { font-family: 'DM Sans', sans-serif; }
  .auth-input:focus { border-color: ${T.primary} !important; box-shadow: 0 0 0 3px rgba(26,86,219,0.12) !important; outline: none; }
  .auth-input:hover:not(:focus) { border-color: ${T.borderHover} !important; }
  .auth-select:focus { border-color: ${T.primary} !important; box-shadow: 0 0 0 3px rgba(26,86,219,0.12) !important; outline: none; }
  .auth-btn-primary { transition: all 0.18s ease; }
  .auth-btn-primary:hover:not(:disabled) { background: ${T.primaryDark} !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,86,219,0.30) !important; }
  .auth-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .auth-btn-ghost:hover { background: ${T.bg} !important; border-color: ${T.borderHover} !important; color: ${T.text} !important; }
  .auth-step-dot { transition: all 0.3s ease; }
  .auth-dropdown-item:hover { background: ${T.primaryLight} !important; color: ${T.primary} !important; }
  @keyframes fadeSlide { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .auth-step-panel { animation: fadeSlide 0.25s ease both; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .otp-send-btn { transition: all 0.15s ease; }
  .otp-send-btn:hover:not(:disabled) { background: ${T.primaryLight} !important; }
`;

const inp = {
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

const lbl = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: "600",
  color: T.textSub,
  marginBottom: "0.4rem",
  letterSpacing: "0.01em",
};

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "", email: "", phone_number: "", password: "", confirm_password: "",
    company_name: "", company_type: "", organisation_type: "",
    company_pan: "", owner_pan: "", gst_number: "",
    number_of_users: "", current_aum: "", loan_products: [],
    address_line1: "", address_line2: "", city: "", state: "",
    pincode: "", country: "", require_branches: "", number_of_branches: "",
  });

  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [currentStep, setCurrentStep]   = useState(1);
  const [emailOtp, setEmailOtp]         = useState("");
  const [phoneOtp, setPhoneOtp]         = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  /* ── OTP Timer State ── */
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailTimer, setEmailTimer]     = useState(0);
  const [phoneTimer, setPhoneTimer]     = useState(0);
  const emailIntervalRef = useRef(null);
  const phoneIntervalRef = useRef(null);

  const loanOptions = [
    "Working Capital","Equipment Financing","Line of Credit",
    "Merchant Cash Advance","Term Loan","Invoice Financing",
  ];

  useEffect(() => {
    const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* Clear timers on unmount */
  useEffect(() => {
    return () => {
      if (emailIntervalRef.current) clearInterval(emailIntervalRef.current);
      if (phoneIntervalRef.current) clearInterval(phoneIntervalRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const v = ["company_pan","owner_pan","gst_number"].includes(name) ? value.toUpperCase() : value;
    setFormData(p => ({ ...p, [name]: v }));
    if (error) setError("");
  };

  const toggleProduct = (p) => {
    setFormData(prev => {
      const arr = [...prev.loan_products];
      const i = arr.indexOf(p);
      if (i > -1) arr.splice(i,1); else arr.push(p);
      return { ...prev, loan_products: arr };
    });
  };

  /* ── OTP Timer Logic ── */
  const startOtpTimer = (type) => {
    if (type === "email") {
      setEmailOtpSent(true);
      setEmailTimer(45);
      if (emailIntervalRef.current) clearInterval(emailIntervalRef.current);
      emailIntervalRef.current = setInterval(() => {
        setEmailTimer(prev => {
          if (prev <= 1) {
            clearInterval(emailIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setPhoneOtpSent(true);
      setPhoneTimer(45);
      if (phoneIntervalRef.current) clearInterval(phoneIntervalRef.current);
      phoneIntervalRef.current = setInterval(() => {
        setPhoneTimer(prev => {
          if (prev <= 1) {
            clearInterval(phoneIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  /* Validations */
  const v1 = () => {
    const e = [];
    if (!formData.full_name.trim()) e.push("Full name is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.push("Valid email required.");
    if (!/^\d{10}$|^\+\d{10,}$|^\+91\d{10}$/.test(formData.phone_number.replace(/\s+/g,"")))
      e.push("Valid phone number required.");
    return e;
  };
  const v2 = () => {
    const e = [];
    if (!emailOtp.trim()) e.push("Email OTP required.");
    if (!phoneOtp.trim()) e.push("Phone OTP required.");
    return e;
  };
  const v3 = () => {
    const e = [];
    if (formData.password.length < 8) e.push("Password must be at least 8 characters.");
    if (formData.password !== formData.confirm_password) e.push("Passwords do not match.");
    return e;
  };
  const v4 = () => {
    const e = [];
    const pan = /^[A-Z]{5}[0-9]{4}[A-Z]$/i;
    const gst = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/i;
    if (!formData.company_name.trim()) e.push("Company name required.");
    if (!formData.company_type)        e.push("Company type required.");
    if (!formData.organisation_type)   e.push("Organisation type required.");
    if (formData.organisation_type === "Proprietorship") {
      if (!pan.test(formData.owner_pan)) e.push("Valid Owner PAN required.");
    } else {
      if (!pan.test(formData.company_pan)) e.push("Valid Company PAN required.");
    }
    if (!gst.test(formData.gst_number)) e.push("Valid GST number required.");
    if (!formData.number_of_users) e.push("Number of users required.");
    if (!formData.current_aum.trim()) e.push("Current AUM required.");
    if (!formData.loan_products.length) e.push("Select at least one loan product.");
    if (!formData.address_line1.trim()) e.push("Address required.");
    if (!formData.city.trim()) e.push("City required.");
    if (!formData.state.trim()) e.push("State required.");
    if (!formData.pincode.trim()) e.push("Pincode required.");
    if (!formData.country.trim()) e.push("Country required.");
    if (!formData.require_branches) e.push("Branch requirement needed.");
    if (formData.require_branches === "Yes" && !formData.number_of_branches) e.push("Number of branches required.");
    return e;
  };

  const fmtPhone = (p) => {
    let f = p.replace(/\s+/g,"").replace(/[^+\d]/g,"");
    if (!f.startsWith("+")) f = f.length === 10 ? `+91${f}` : `+${f}`;
    return f;
  };

  /* Step handlers */

  // 🚧 TEMP: OTP sending bypassed — no API call made, goes directly to Step 2
  const step1 = (e) => {
    e.preventDefault(); setError("");
    const err = v1(); if (err.length) { setError(err.join(" ")); return; }
    setCurrentStep(2);
  };

  // 🚧 TEMP: OTP verification bypassed — any OTP value works, no API call made
  const step2 = (e) => {
    e.preventDefault(); setError("");
    const err = v2(); if (err.length) { setError(err.join(" ")); return; }
    setCurrentStep(3);
  };

  const step3 = (e) => {
    e.preventDefault(); setError("");
    const err = v3(); if (err.length) { setError(err.join(" ")); return; }
    setCurrentStep(4);
  };

  const step4 = async (e) => {
    e.preventDefault(); setError("");
    const err = v4(); if (err.length) { setError(err.join(" ")); return; }
    setLoading(true);
    try {
      const payload = {
        contact_person: formData.full_name, email: formData.email,
        mobile_no: fmtPhone(formData.phone_number),
        business_name: formData.company_name, business_type: formData.organisation_type,
        business_pan: formData.organisation_type !== "Proprietorship" ? formData.company_pan : "",
        owner_pan: formData.organisation_type === "Proprietorship" ? formData.owner_pan : "",
        gst_number: formData.gst_number, password: formData.password,
        address_line1: formData.address_line1, address_line2: formData.address_line2,
        city: formData.city, state: formData.state, pincode: formData.pincode, country: formData.country,
        loan_product: formData.loan_products, status: "Active",
        company_type: formData.company_type, number_of_users: formData.number_of_users,
        current_aum: formData.current_aum, require_branches: formData.require_branches,
        number_of_branches: formData.require_branches === "Yes" ? formData.number_of_branches : "0",
      };
      const res = await fetch("http://localhost:8000/auth/register/", {
        method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Registration failed");
      navigate("/subscription", {
        state: {
          number_of_users: formData.number_of_users,
          require_branches: formData.require_branches,
          number_of_branches: formData.require_branches === "Yes" ? formData.number_of_branches : "0",
          loan_products: formData.loan_products,
          company_name: formData.company_name,
        }
      });
    } catch(err) { setError(err.message); } finally { setLoading(false); }
  };

  const steps = ["Contact","Verify","Password","Details"];

  return (
    <>
      <style>{globalCss}</style>
      <div className="auth-root" style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, #f0f7ff 0%, #e8f0fe 50%, #f0f4ff 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem", paddingTop: "calc(1.5rem + 65px)",
      }}>
        <div style={{
          width: "100%", maxWidth: "560px",
          background: T.white, borderRadius: "20px",
          border: `1px solid ${T.border}`,
          boxShadow: T.shadowLg,
          overflow: "hidden",
        }}>

          {/* Top accent bar */}
          <div style={{ height: "3px", background: `linear-gradient(90deg, ${T.primary}, #6366f1)` }} />

          <div style={{ padding: "2rem 2.25rem" }}>

            {/* Header */}
            <div style={{ marginBottom: "1.75rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"0.5rem" }}>
                <div style={{
                  width:"34px", height:"34px", borderRadius:"9px",
                  background: `linear-gradient(135deg, ${T.primary}, #6366f1)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize:"0.78rem", fontWeight:"700", color: T.primary, letterSpacing:"0.08em", textTransform:"uppercase" }}>
                  LoanOS
                </span>
              </div>
              <h1 style={{ fontSize:"1.5rem", fontWeight:"700", color: T.text, margin:0, letterSpacing:"-0.02em" }}>
                Create account
              </h1>
              <p style={{ color: T.textMuted, fontSize:"0.875rem", margin:"0.3rem 0 0", fontWeight:"400" }}>
                Register your organization to get started
              </p>
            </div>

            {/* Step Progress */}
            <div style={{ display:"flex", alignItems:"center", marginBottom:"2rem", gap:"0" }}>
              {steps.map((label, i) => {
                const s = i + 1;
                const done    = currentStep > s;
                const active  = currentStep === s;
                return (
                  <React.Fragment key={s}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:"0 0 auto" }}>
                      <div className="auth-step-dot" style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: done ? T.primary : active ? T.white : T.white,
                        border: `2px solid ${done || active ? T.primary : T.border}`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color: done ? T.white : active ? T.primary : T.textMuted,
                        fontSize: "0.78rem", fontWeight:"700",
                        boxShadow: active ? `0 0 0 4px rgba(26,86,219,0.12)` : "none",
                      }}>
                        {done
                          ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          : s}
                      </div>
                      <span style={{
                        fontSize:"0.7rem", marginTop:"0.35rem",
                        color: active ? T.primary : done ? T.textSub : T.textMuted,
                        fontWeight: active ? "700" : "500",
                        whiteSpace:"nowrap",
                      }}>{label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div style={{
                        flex:1, height:"2px", margin:"0 4px", marginBottom:"20px",
                        background: currentStep > s ? T.primary : T.border,
                        transition:"background 0.3s ease",
                      }}/>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: T.errorBg, border:`1px solid ${T.errorBorder}`,
                color: T.error, borderRadius: T.radius,
                padding:"0.75rem 1rem", marginBottom:"1.25rem",
                fontSize:"0.85rem", fontWeight:"500", lineHeight:"1.5",
                display:"flex", gap:"0.625rem", alignItems:"flex-start",
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink:0, marginTop:"1px"}}>
                  <circle cx="8" cy="8" r="7" stroke="#dc2626" strokeWidth="1.5"/>
                  <path d="M8 5v3.5M8 11h.01" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            {/* ── STEP 1 ── */}
            {currentStep === 1 && (
              <form onSubmit={step1} className="auth-step-panel">
                <SectionLabel icon="👤">Basic Contact Information</SectionLabel>
                <Field label="Full Name">
                  <input className="auth-input" type="text" name="full_name" value={formData.full_name}
                    onChange={handleChange} placeholder="Enter your full name" required style={inp}/>
                </Field>
                <Field label="Email Address">
                  <input className="auth-input" type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="you@company.com" required style={inp}/>
                </Field>
                <Field label="Phone Number">
                  <input className="auth-input" type="tel" name="phone_number" value={formData.phone_number}
                    onChange={handleChange} placeholder="+91 98765 43210" required style={inp}/>
                </Field>
                <PrimaryBtn loading={loading} label="Continue" loadingLabel="Sending OTP…"/>
                <div style={{ textAlign:"center", marginTop:"1.25rem" }}>
                  <span style={{ fontSize:"0.85rem", color: T.textMuted }}>Already have an account? </span>
                  <Link to="/login" style={{ fontSize:"0.85rem", color: T.primary, fontWeight:"600", textDecoration:"none" }}>Sign In</Link>
                </div>
              </form>
            )}

            {/* ── STEP 2 ── */}
            {currentStep === 2 && (
              <form onSubmit={step2} className="auth-step-panel">
                <SectionLabel icon="🔐">Verify Your Contact</SectionLabel>
                <p style={{ fontSize:"0.875rem", color: T.textSub, margin:"-0.25rem 0 1.25rem", lineHeight:"1.6" }}>
                  Click "Send OTP" to receive verification codes on your email and phone.
                </p>

                {/* 🚧 Temp bypass notice */}
                <div style={{
                  background:"#fffbeb", border:"1px solid #fcd34d", borderRadius: T.radius,
                  padding:"0.65rem 0.875rem", marginBottom:"1.25rem",
                  fontSize:"0.8rem", color:"#92400e", fontWeight:"500",
                  display:"flex", gap:"0.5rem", alignItems:"center",
                }}>
                  <span>⚠️</span>
                  <span>Dev mode: OTP verification bypassed. Enter any value to continue.</span>
                </div>

                {/* Email OTP */}
                <div style={{ marginBottom:"0.875rem" }}>
                  <label style={lbl}>Email OTP <Req/></label>
                  <div style={{ display:"flex", gap:"8px" }}>
                    <input
                      className="auth-input"
                      type="text"
                      value={emailOtp}
                      onChange={e => setEmailOtp(e.target.value)}
                      placeholder="• • • • • •"
                      maxLength={6}
                      required
                      style={{
                        ...inp,
                        textAlign:"center",
                        letterSpacing:"0.5rem",
                        fontFamily:"'DM Mono', monospace",
                        fontWeight:"500",
                      }}
                    />
                    <button
                      type="button"
                      className="otp-send-btn"
                      disabled={emailTimer > 0}
                      onClick={() => startOtpTimer("email")}
                      style={{
                        flexShrink: 0,
                        padding: "0 1rem",
                        height: "46px",
                        borderRadius: T.radius,
                        border: `1.5px solid ${emailTimer > 0 ? T.border : T.primary}`,
                        background: "transparent",
                        color: emailTimer > 0 ? T.textMuted : T.primary,
                        fontSize: "0.82rem",
                        fontWeight: "600",
                        cursor: emailTimer > 0 ? "not-allowed" : "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 0.15s",
                        minWidth: "110px",
                      }}
                    >
                      {emailOtpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"0.35rem" }}>
                    <div style={{ fontSize:"0.78rem", color: T.textMuted }}>
                      Sent to <strong style={{color:T.primary}}>{formData.email}</strong>
                    </div>
                    {emailTimer > 0 && (
                      <div style={{ fontSize:"0.78rem", color: T.primary, fontWeight:"600" }}>
                        Resend in {emailTimer}s
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone OTP */}
                <div style={{ marginBottom:"1.25rem" }}>
                  <label style={lbl}>Phone OTP <Req/></label>
                  <div style={{ display:"flex", gap:"8px" }}>
                    <input
                      className="auth-input"
                      type="text"
                      value={phoneOtp}
                      onChange={e => setPhoneOtp(e.target.value)}
                      placeholder="• • • • • •"
                      maxLength={6}
                      required
                      style={{
                        ...inp,
                        textAlign:"center",
                        letterSpacing:"0.5rem",
                        fontFamily:"'DM Mono', monospace",
                        fontWeight:"500",
                      }}
                    />
                    <button
                      type="button"
                      className="otp-send-btn"
                      disabled={phoneTimer > 0}
                      onClick={() => startOtpTimer("phone")}
                      style={{
                        flexShrink: 0,
                        padding: "0 1rem",
                        height: "46px",
                        borderRadius: T.radius,
                        border: `1.5px solid ${phoneTimer > 0 ? T.border : T.primary}`,
                        background: "transparent",
                        color: phoneTimer > 0 ? T.textMuted : T.primary,
                        fontSize: "0.82rem",
                        fontWeight: "600",
                        cursor: phoneTimer > 0 ? "not-allowed" : "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 0.15s",
                        minWidth: "110px",
                      }}
                    >
                      {phoneOtpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"0.35rem" }}>
                    <div style={{ fontSize:"0.78rem", color: T.textMuted }}>
                      Sent to <strong style={{color:T.primary}}>{formData.phone_number}</strong>
                    </div>
                    {phoneTimer > 0 && (
                      <div style={{ fontSize:"0.78rem", color: T.primary, fontWeight:"600" }}>
                        Resend in {phoneTimer}s
                      </div>
                    )}
                  </div>
                </div>

                <BtnRow onBack={() => setCurrentStep(1)} loading={loading} label="Verify & Continue" loadingLabel="Verifying…"/>
              </form>
            )}

            {/* ── STEP 3 ── */}
            {currentStep === 3 && (
              <form onSubmit={step3} className="auth-step-panel">
                <SectionLabel icon="🔑">Create Password</SectionLabel>
                <Field label="Password">
                  <input className="auth-input" type="password" name="password" value={formData.password}
                    onChange={handleChange} placeholder="Minimum 8 characters" required style={inp}/>
                </Field>
                <Field label="Confirm Password">
                  <input className="auth-input" type="password" name="confirm_password" value={formData.confirm_password}
                    onChange={handleChange} placeholder="Re-enter your password" required style={inp}/>
                </Field>
                <BtnRow onBack={() => setCurrentStep(2)} loading={loading} label="Continue to Details" loadingLabel="…"/>
              </form>
            )}

            {/* ── STEP 4 ── */}
            {currentStep === 4 && (
              <form onSubmit={step4} className="auth-step-panel">
                <div style={{ maxHeight:"440px", overflowY:"auto", paddingRight:"6px", marginRight:"-6px" }}>
                  <SectionLabel icon="🏢">Company Details</SectionLabel>

                  <Field label="Company Name">
                    <input className="auth-input" type="text" name="company_name" value={formData.company_name}
                      onChange={handleChange} placeholder="Your company name" required style={inp}/>
                  </Field>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.875rem", marginBottom:"0.875rem" }}>
                    <Field label="Company Type" noMargin>
                      <select className="auth-select auth-input" name="company_type" value={formData.company_type}
                        onChange={handleChange} required style={{ ...inp, cursor:"pointer" }}>
                        <option value="">Select…</option>
                        {["NBFC","Bank","Fintech","Other"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </Field>
                    <Field label="Organisation Type" noMargin>
                      <select className="auth-select auth-input" name="organisation_type" value={formData.organisation_type}
                        onChange={handleChange} required style={{ ...inp, cursor:"pointer" }}>
                        <option value="">Select…</option>
                        {["Private Limited","LLP","Proprietorship","Partnership"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </Field>
                  </div>

                  {formData.organisation_type === "Proprietorship" ? (
                    <Field label="Owner PAN">
                      <input className="auth-input" type="text" name="owner_pan" value={formData.owner_pan}
                        onChange={handleChange} placeholder="ABCDE1234F" maxLength={10} required
                        style={{ ...inp, fontFamily:"'DM Mono', monospace", letterSpacing:"0.08em" }}/>
                    </Field>
                  ) : (
                    <Field label="Company PAN">
                      <input className="auth-input" type="text" name="company_pan" value={formData.company_pan}
                        onChange={handleChange} placeholder="ABCDE1234F" maxLength={10} required
                        style={{ ...inp, fontFamily:"'DM Mono', monospace", letterSpacing:"0.08em" }}/>
                    </Field>
                  )}

                  <Field label="GST Number">
                    <input className="auth-input" type="text" name="gst_number" value={formData.gst_number}
                      onChange={handleChange} placeholder="27AAAAA0000A1Z5" maxLength={15} required
                      style={{ ...inp, fontFamily:"'DM Mono', monospace", letterSpacing:"0.05em" }}/>
                  </Field>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.875rem", marginBottom:"0.875rem" }}>
                    <Field label="Number of Users" noMargin>
                      <input className="auth-input" type="number" name="number_of_users" value={formData.number_of_users}
                        onChange={handleChange} placeholder="e.g. 10" min="1" required style={inp}/>
                    </Field>
                    <Field label="Current AUM" noMargin>
                      <input className="auth-input" type="text" name="current_aum" value={formData.current_aum}
                        onChange={handleChange} placeholder="e.g. 50 Crores" required style={inp}/>
                    </Field>
                  </div>

                  {/* Loan Products Dropdown */}
                  <div style={{ marginBottom:"0.875rem" }} ref={dropdownRef}>
                    <label style={lbl}>Loan Products <Req/></label>
                    <div style={{ position:"relative" }}>
                      <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{
                        ...inp, cursor:"pointer", display:"flex", alignItems:"center",
                        flexWrap:"wrap", gap:"0.375rem", minHeight:"44px",
                      }}>
                        {formData.loan_products.length > 0
                          ? formData.loan_products.map((p,i) => (
                            <span key={i} style={{
                              background: T.primaryLight, color: T.primary, border:`1px solid ${T.primaryBorder}`,
                              borderRadius:"6px", padding:"0.2rem 0.6rem", fontSize:"0.78rem", fontWeight:"600",
                              display:"flex", alignItems:"center", gap:"0.375rem",
                            }}>
                              {p}
                              <span onClick={ev => { ev.stopPropagation(); toggleProduct(p); }}
                                style={{ cursor:"pointer", opacity:0.7, fontSize:"0.75rem", lineHeight:1 }}>✕</span>
                            </span>
                          ))
                          : <span style={{ color: T.textMuted, fontSize:"0.875rem" }}>Select products…</span>
                        }
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position:"absolute", right:"0.875rem", flexShrink:0, color: T.textMuted }}>
                          <path d={dropdownOpen ? "M2 9l5-5 5 5" : "M2 5l5 5 5-5"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      {dropdownOpen && (
                        <div style={{
                          position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:20,
                          background: T.white, border:`1.5px solid ${T.border}`,
                          borderRadius: T.radius, boxShadow: T.shadowMd,
                          overflow:"hidden",
                        }}>
                          {loanOptions.map((p,i) => {
                            const sel = formData.loan_products.includes(p);
                            return (
                              <div key={i} className="auth-dropdown-item" onClick={() => toggleProduct(p)} style={{
                                padding:"0.6rem 0.875rem", cursor:"pointer", fontSize:"0.875rem",
                                display:"flex", justifyContent:"space-between", alignItems:"center",
                                background: sel ? T.primaryLight : "transparent",
                                color: sel ? T.primary : T.text,
                                fontWeight: sel ? "600" : "400",
                                borderBottom: i < loanOptions.length-1 ? `1px solid ${T.border}` : "none",
                                transition:"background 0.12s",
                              }}>
                                {p}
                                {sel && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3.5 3.5 6-6" stroke={T.primary} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <Divider label="Business Address" icon="📍"/>
                  <Field label="Address Line 1">
                    <input className="auth-input" type="text" name="address_line1" value={formData.address_line1}
                      onChange={handleChange} placeholder="Street address" required style={inp}/>
                  </Field>
                  <Field label="Address Line 2 (optional)">
                    <input className="auth-input" type="text" name="address_line2" value={formData.address_line2}
                      onChange={handleChange} placeholder="Apartment, suite, etc." style={inp}/>
                  </Field>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.875rem", marginBottom:"0.875rem" }}>
                    <Field label="City" noMargin>
                      <input className="auth-input" type="text" name="city" value={formData.city}
                        onChange={handleChange} placeholder="City" required style={inp}/>
                    </Field>
                    <Field label="State" noMargin>
                      <input className="auth-input" type="text" name="state" value={formData.state}
                        onChange={handleChange} placeholder="State" required style={inp}/>
                    </Field>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.875rem", marginBottom:"0.875rem" }}>
                    <Field label="Pincode" noMargin>
                      <input className="auth-input" type="text" name="pincode" value={formData.pincode}
                        onChange={handleChange} placeholder="Pincode" required style={inp}/>
                    </Field>
                    <Field label="Country" noMargin>
                      <input className="auth-input" type="text" name="country" value={formData.country}
                        onChange={handleChange} placeholder="Country" required style={inp}/>
                    </Field>
                  </div>

                  {/* Branches */}
                  <Divider label="Branch Requirements" icon="🏗️"/>
                  <Field label="Do you require branches?">
                    <select className="auth-select auth-input" name="require_branches" value={formData.require_branches}
                      onChange={handleChange} required style={{ ...inp, cursor:"pointer" }}>
                      <option value="">Select…</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </Field>
                  {formData.require_branches === "Yes" && (
                    <Field label="Number of Branches">
                      <input className="auth-input" type="number" name="number_of_branches" value={formData.number_of_branches}
                        onChange={handleChange} placeholder="e.g. 5" min="1" required style={inp}/>
                    </Field>
                  )}
                </div>

                <div style={{ paddingTop:"1rem", borderTop:`1px solid ${T.border}`, marginTop:"1rem" }}>
                  <BtnRow onBack={() => setCurrentStep(3)} loading={loading} label="Create Account" loadingLabel="Creating account…"/>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Shared Sub-components ──────────────────────────────────────────────── */
const Req = () => <span style={{ color:"#ef4444", marginLeft:"2px" }}>*</span>;

const Field = ({ label, children, noMargin }) => (
  <div style={{ marginBottom: noMargin ? 0 : "0.875rem" }}>
    <label style={lbl}>{label} <Req/></label>
    {children}
  </div>
);

const HintText = ({ children }) => (
  <div style={{ fontSize:"0.78rem", color: T.textMuted, marginTop:"0.35rem" }}>{children}</div>
);

const SectionLabel = ({ icon, children }) => (
  <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.25rem" }}>
    <span style={{ fontSize:"1rem" }}>{icon}</span>
    <span style={{ fontSize:"0.95rem", fontWeight:"700", color: T.text }}>{children}</span>
  </div>
);

const Divider = ({ label, icon }) => (
  <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", margin:"1.25rem 0 0.875rem" }}>
    <span style={{ fontSize:"0.85rem" }}>{icon}</span>
    <span style={{ fontSize:"0.8rem", fontWeight:"700", color: T.textSub, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</span>
    <div style={{ flex:1, height:"1px", background: T.border }}/>
  </div>
);

const PrimaryBtn = ({ loading, label, loadingLabel, style }) => (
  <button type="submit" disabled={loading} className="auth-btn-primary" style={{
    width:"100%", padding:"0.8rem 1rem",
    background: T.primary, color: T.white, border:"none",
    borderRadius: T.radius, fontSize:"0.9rem", fontWeight:"600",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
    boxShadow:`0 2px 8px rgba(26,86,219,0.25)`,
    display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
    ...style,
  }}>
    {loading && <span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }}/>}
    {loading ? loadingLabel : label}
  </button>
);

const BtnRow = ({ onBack, loading, label, loadingLabel }) => (
  <div style={{ display:"flex", gap:"0.75rem" }}>
    <button type="button" onClick={onBack} className="auth-btn-ghost" style={{
      flex:"0 0 100px", padding:"0.8rem 1rem",
      background: T.white, color: T.textSub,
      border:`1.5px solid ${T.border}`, borderRadius: T.radius,
      fontSize:"0.9rem", fontWeight:"600", cursor:"pointer", transition:"all 0.15s ease",
    }}>
      Back
    </button>
    <div style={{ flex:1 }}>
      <PrimaryBtn loading={loading} label={label} loadingLabel={loadingLabel}/>
    </div>
  </div>
);