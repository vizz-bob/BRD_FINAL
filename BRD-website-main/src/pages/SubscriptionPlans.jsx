import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ─── Pricing config ─────────────────────────────────────────────────────── */
const BASE_PRICE_PER_USER    = 499;   // ₹ per user/month
const BASE_PRICE_PER_BRANCH  = 299;   // ₹ per branch/month
const BASE_PRICE_PER_PRODUCT = 199;   // ₹ per loan product/month
const TRIAL_DAYS             = 14;

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const location = useLocation();

  // Data passed from SignUp after registration
  const {
    number_of_users    = "1",
    require_branches   = "No",
    number_of_branches = "0",
    loan_products      = [],
    company_name       = "Your Company",
  } = location.state || {};

  const users    = Math.max(1, parseInt(number_of_users)    || 1);
  const branches = require_branches === "Yes" ? Math.max(0, parseInt(number_of_branches) || 0) : 0;
  const products = Array.isArray(loan_products) ? loan_products.length : 0;

  // Dynamic price calculation
  const userCost    = users    * BASE_PRICE_PER_USER;
  const branchCost  = branches * BASE_PRICE_PER_BRANCH;
  const productCost = products * BASE_PRICE_PER_PRODUCT;
  const customPrice = userCost + branchCost + productCost;

  const [selecting, setSelecting] = useState(null);

  const handleTrial = () => {
    setSelecting("trial");
    setTimeout(() => navigate("/login"), 800);
  };

  const handleCustom = () => {
    setSelecting("custom");
    // Integrate Razorpay or your payment flow here
    // For now navigate to login after "payment"
    setTimeout(() => navigate("/login"), 800);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .sub-root *, .sub-root *::before, .sub-root *::after { box-sizing: border-box; }

        .sub-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #ffffff;
          min-height: 100vh;
          color: #1e293b;
          position: relative;
          overflow-x: hidden;
        }

        /* colour washes */
        .sub-wash {
          position: fixed; border-radius: 50%;
          filter: blur(120px); pointer-events: none; z-index: 0;
        }
        .sub-wash-1 { width:500px; height:420px; background:rgba(99,102,241,0.07);  top:-80px;   left:-120px; }
        .sub-wash-2 { width:420px; height:360px; background:rgba(16,185,129,0.06);  bottom:-60px; right:-80px; }
        .sub-wash-3 { width:340px; height:300px; background:rgba(14,165,233,0.05);  top:40%;     left:50%;    transform:translateX(-50%); }

        .sub-inner {
          position: relative; z-index: 1;
          max-width: 920px; margin: 0 auto;
          padding: 72px 24px 96px;
        }

        /* eyebrow */
        .sub-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          color: #15803d; font-size: 11px; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 999px; margin-bottom: 20px;
        }
        .sub-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #22c55e;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

        .sub-headline {
          font-size: clamp(1.9rem, 4vw, 3rem);
          font-weight: 800; line-height: 1.15;
          letter-spacing: -.03em; margin: 0 0 12px; color: #0f172a;
        }
        .sub-headline em {
          font-style: normal;
          background: linear-gradient(115deg,#6366f1 0%,#8b5cf6 50%,#0ea5e9 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .sub-sub { color: #64748b; font-size: 1rem; font-weight: 400; margin: 0; }

        /* grid */
        .sub-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 52px;
        }
        @media(max-width: 640px) {
          .sub-grid { grid-template-columns: 1fr; }
        }

        /* card */
        .sub-card {
          border-radius: 24px;
          border: 1.5px solid #edf0f4;
          background: #ffffff;
          overflow: hidden;
          transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease;
          display: flex; flex-direction: column;
        }
        .sub-card:hover { transform: translateY(-6px); }

        .sub-card-topbar { height: 5px; width: 100%; }

        .sub-card-body { padding: 30px 28px 26px; flex: 1; display: flex; flex-direction: column; }

        /* badge */
        .sub-badge {
          display: inline-block; font-size: 10px; font-weight: 800;
          letter-spacing: .1em; text-transform: uppercase;
          padding: 4px 12px; border-radius: 999px; margin-bottom: 6px;
        }

        /* plan name */
        .sub-plan-name { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0 0 6px; letter-spacing: -.02em; }
        .sub-plan-desc { font-size: .9rem; color: #64748b; font-weight: 400; margin: 0 0 24px; line-height: 1.55; }

        /* price */
        .sub-price-block { margin-bottom: 24px; }
        .sub-price-free  { font-size: 2.8rem; font-weight: 800; letter-spacing: -.04em; }
        .sub-price-row   { display: flex; align-items: baseline; gap: 2px; }
        .sub-price-sym   { font-size: 1.3rem; font-weight: 700; padding-bottom: 2px; line-height: 1; }
        .sub-price-num   { font-size: 2.8rem; font-weight: 800; letter-spacing: -.04em; color: #0f172a; }
        .sub-price-per   { font-size: .82rem; color: #94a3b8; font-weight: 500; margin-left: 4px; }

        /* breakdown */
        .sub-breakdown {
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 14px; padding: 16px 18px; margin-bottom: 22px;
        }
        .sub-breakdown-title { font-size: .75rem; font-weight: 700; color: #94a3b8; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 12px; }
        .sub-breakdown-row { display: flex; justify-content: space-between; align-items: center; font-size: .875rem; padding: 5px 0; }
        .sub-breakdown-label { color: #64748b; font-weight: 500; }
        .sub-breakdown-val   { color: #1e293b; font-weight: 700; }
        .sub-breakdown-divider { height: 1px; background: #e2e8f0; margin: 8px 0; }
        .sub-breakdown-total-row { display: flex; justify-content: space-between; align-items: center; font-size: .95rem; padding-top: 4px; }
        .sub-breakdown-total-label { color: #374151; font-weight: 700; }
        .sub-breakdown-total-val   { font-weight: 800; font-size: 1.05rem; }

        /* features */
        .sub-features { list-style: none; margin: 0 0 28px; padding: 0; flex: 1; display: flex; flex-direction: column; gap: 11px; }
        .sub-feature  { display: flex; align-items: flex-start; gap: 10px; font-size: .875rem; color: #475569; font-weight: 500; line-height: 1.45; }
        .sub-feat-check {
          width: 20px; height: 20px; border-radius: 6px; flex-shrink: 0; margin-top: 1px;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800;
        }
        .sub-feature strong { color: #1e293b; }

        /* CTA */
        .sub-cta {
          width: 100%; padding: 14px 0; border-radius: 14px; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: .95rem; font-weight: 700; letter-spacing: .01em;
          transition: all .22s cubic-bezier(.22,1,.36,1);
          border: none; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .sub-cta:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.06); }
        .sub-cta:disabled { opacity: .6; cursor: not-allowed; }

        /* popular pill */
        .sub-popular-pill {
          position: absolute; top: 20px; right: 20px;
          background: linear-gradient(135deg,#6366f1,#8b5cf6);
          color: #fff; font-size: 9px; font-weight: 800;
          letter-spacing: .08em; text-transform: uppercase;
          padding: 4px 11px; border-radius: 999px;
          box-shadow: 0 4px 12px rgba(99,102,241,0.38);
        }

        /* info strip */
        .sub-info-strip {
          background: #fefce8; border: 1px solid #fef08a;
          border-radius: 12px; padding: 12px 16px;
          display: flex; align-items: flex-start; gap: 10px;
          margin-bottom: 20px; font-size: .85rem; color: #854d0e;
          font-weight: 500; line-height: 1.5;
        }

        /* trust */
        .sub-trust { display: flex; justify-content: center; align-items: center; gap: 28px; flex-wrap: wrap; }
        .sub-trust-item { display: flex; align-items: center; gap: 7px; font-size: .8rem; color: #94a3b8; font-weight: 500; }

        /* fade in */
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .sub-fade { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both; }

        @media(max-width: 640px) {
          .sub-inner    { padding: 52px 16px 72px; }
          .sub-card-body{ padding: 22px 18px 18px; }
          .sub-headline { font-size: 1.8rem; }
        }
      `}</style>

      <div className="sub-root">
        <div className="sub-wash sub-wash-1" />
        <div className="sub-wash sub-wash-2" />
        <div className="sub-wash sub-wash-3" />

        <div className="sub-inner">

          {/* ── Header ── */}
          <div style={{ textAlign: "center", marginBottom: 8 }} className="sub-fade">
            <div className="sub-eyebrow">
              <span className="sub-eyebrow-dot" />
              Almost There!
            </div>
            <h1 className="sub-headline">
              Choose your plan,<br />
              <em>{company_name}</em>
            </h1>
            <p className="sub-sub">
              Start with a free trial or jump straight into your custom plan — built around your setup.
            </p>
          </div>

          {/* ── Cards ── */}
          <div className="sub-grid">

            {/* ── TRIAL CARD ── */}
            <div
              className="sub-card sub-fade"
              style={{
                boxShadow: "0 4px 24px rgba(100,116,139,0.10)",
                animationDelay: ".1s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 16px 48px rgba(100,116,139,0.18)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 24px rgba(100,116,139,0.10)"; }}
            >
              <div className="sub-card-topbar" style={{ background: "linear-gradient(90deg,#e2e8f0,#cbd5e1)" }} />
              <div className="sub-card-body">

                <span className="sub-badge" style={{ background: "#f0fdf4", color: "#15803d" }}>
                  🎉 Free Trial
                </span>
                <h3 className="sub-plan-name">Trial Plan</h3>
                <p className="sub-plan-desc">
                  Explore the full platform for {TRIAL_DAYS} days at zero cost. No credit card needed.
                </p>

                <div className="sub-price-block">
                  <div className="sub-price-free" style={{ color: "#22c55e" }}>₹ 0</div>
                  <div style={{ fontSize: ".85rem", color: "#64748b", marginTop: 4 }}>
                    for {TRIAL_DAYS} days, then upgrade anytime
                  </div>
                </div>

                <div className="sub-info-strip">
                  <span style={{ fontSize: "1rem" }}>ℹ️</span>
                  <span>After your trial ends, you can switch to your custom plan or choose any available plan — no data lost.</span>
                </div>

                <ul className="sub-features" style={{ marginBottom: "auto" }}>
                  {[
                    "Full platform access for 14 days",
                    `Up to ${users} user${users > 1 ? "s" : ""}`,
                    branches > 0 ? `Up to ${branches} branch${branches > 1 ? "es" : ""}` : "Single branch",
                    `${products > 0 ? products : "All"} loan product${products !== 1 ? "s" : ""}`,
                    "Email & phone support",
                    "No credit card required",
                  ].map((f, i) => (
                    <li key={i} className="sub-feature">
                      <span className="sub-feat-check" style={{ background: "#f0fdf4", color: "#22c55e" }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: 24 }}>
                  <button
                    className="sub-cta"
                    onClick={handleTrial}
                    disabled={!!selecting}
                    style={{
                      background: selecting === "trial" ? "#22c55e" : "#f0fdf4",
                      color: selecting === "trial" ? "#fff" : "#15803d",
                      border: "1.5px solid #bbf7d0",
                      boxShadow: selecting === "trial" ? "0 6px 20px rgba(34,197,94,0.35)" : "none",
                    }}
                  >
                    {selecting === "trial" ? (
                      <>
                        <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.5)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                        Activating Trial…
                      </>
                    ) : "Start Free Trial →"}
                  </button>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              </div>
            </div>

            {/* ── CUSTOM PLAN CARD ── */}
            <div
              className="sub-card sub-fade"
              style={{
                boxShadow: "0 4px 24px rgba(99,102,241,0.12)",
                border: "1.5px solid #c7d2fe",
                position: "relative",
                animationDelay: ".2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 16px 52px rgba(99,102,241,0.22)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 24px rgba(99,102,241,0.12)"; }}
            >
              <div className="sub-card-topbar" style={{ background: "linear-gradient(90deg,#6366f1,#8b5cf6)" }} />
              <div className="sub-popular-pill">⭐ Recommended</div>
              <div className="sub-card-body">

                <span className="sub-badge" style={{ background: "#eef2ff", color: "#4f46e5" }}>
                  ✦ Custom Plan
                </span>
                <h3 className="sub-plan-name">Your Plan</h3>
                <p className="sub-plan-desc">
                  Priced exactly for your setup — {users} user{users > 1 ? "s" : ""}{branches > 0 ? `, ${branches} branch${branches > 1 ? "es" : ""}` : ""}{products > 0 ? `, ${products} product${products > 1 ? "s" : ""}` : ""}.
                </p>

                <div className="sub-price-block">
                  <div className="sub-price-row">
                    <span className="sub-price-sym" style={{ color: "#6366f1" }}>₹</span>
                    <span className="sub-price-num">{customPrice.toLocaleString("en-IN")}</span>
                    <span className="sub-price-per">/month</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="sub-breakdown">
                  <div className="sub-breakdown-title">Price Breakdown</div>
                  <div className="sub-breakdown-row">
                    <span className="sub-breakdown-label">👤 {users} User{users > 1 ? "s" : ""} × ₹{BASE_PRICE_PER_USER}</span>
                    <span className="sub-breakdown-val">₹{userCost.toLocaleString("en-IN")}</span>
                  </div>
                  {branches > 0 && (
                    <div className="sub-breakdown-row">
                      <span className="sub-breakdown-label">🏢 {branches} Branch{branches > 1 ? "es" : ""} × ₹{BASE_PRICE_PER_BRANCH}</span>
                      <span className="sub-breakdown-val">₹{branchCost.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {products > 0 && (
                    <div className="sub-breakdown-row">
                      <span className="sub-breakdown-label">📦 {products} Product{products > 1 ? "s" : ""} × ₹{BASE_PRICE_PER_PRODUCT}</span>
                      <span className="sub-breakdown-val">₹{productCost.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="sub-breakdown-divider" />
                  <div className="sub-breakdown-total-row">
                    <span className="sub-breakdown-total-label">Total / month</span>
                    <span className="sub-breakdown-total-val" style={{ color: "#6366f1" }}>
                      ₹{customPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <ul className="sub-features">
                  {[
                    <span><strong>{users}</strong> team member{users > 1 ? "s" : ""}</span>,
                    branches > 0
                      ? <span><strong>{branches}</strong> branch{branches > 1 ? "es" : ""} included</span>
                      : <span>Single branch setup</span>,
                    products > 0
                      ? <span><strong>{products}</strong> loan product{products > 1 ? "s" : ""}: {Array.isArray(loan_products) ? loan_products.join(", ") : ""}</span>
                      : <span>All loan products</span>,
                    "Full platform access",
                    "Priority support",
                    "Scale up or down anytime",
                  ].map((f, i) => (
                    <li key={i} className="sub-feature">
                      <span className="sub-feat-check" style={{ background: "#eef2ff", color: "#6366f1" }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className="sub-cta"
                  onClick={handleCustom}
                  disabled={!!selecting}
                  style={{
                    background: selecting === "custom"
                      ? "linear-gradient(135deg,#4f46e5,#6366f1)"
                      : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    color: "#fff",
                    boxShadow: "0 6px 22px rgba(99,102,241,0.38)",
                  }}
                >
                  {selecting === "custom" ? (
                    <>
                      <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.5)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                      Processing…
                    </>
                  ) : `Get This Plan — ₹${customPrice.toLocaleString("en-IN")}/mo →`}
                </button>

              </div>
            </div>

          </div>

          {/* ── Already have account link ── */}
          <div className="sub-fade" style={{ textAlign: "center", marginTop: 32, animationDelay: ".3s" }}>
            <p style={{ fontSize: ".9rem", color: "#94a3b8" }}>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                style={{ color: "#6366f1", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
              >
                Sign In
              </span>
            </p>
          </div>

          {/* ── Trust strip ── */}
          <div style={{ marginTop: 56 }} className="sub-fade">
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <span style={{ display: "inline-block", height: 1, width: 40, background: "#e2e8f0", verticalAlign: "middle", marginRight: 12 }} />
              <span style={{ fontSize: ".75rem", color: "#cbd5e1", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>
                Included in every plan
              </span>
              <span style={{ display: "inline-block", height: 1, width: 40, background: "#e2e8f0", verticalAlign: "middle", marginLeft: 12 }} />
            </div>
            <div className="sub-trust">
              {[["🔒","Bank-grade SSL"],["☁","Automatic backups"],["⚡","99.9% uptime"],["↩","Cancel anytime"]].map(([ic, lb]) => (
                <div key={lb} className="sub-trust-item">
                  <span style={{ fontSize: 13 }}>{ic}</span>{lb}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}