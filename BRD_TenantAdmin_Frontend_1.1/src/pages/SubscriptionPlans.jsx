import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tenantSubscriptionService from "../services/tenantSubscriptionService";

/* ─── Static free plan ───────────────────────────────────────────────────── */
const FREE_PLAN = {
  id: "free",
  subscription_name: "Starter",
  subscription_amount: 0,
  no_of_borrowers: 10,
  no_of_users: 2,
  subscription_type: null,
  isStatic: true,
};

const CYCLE_LABEL  = { MONTHLY: "Monthly", QUARTERLY: "Quarterly", ANNUAL: "Annual" };
const CYCLE_SUFFIX = { MONTHLY: "/mo",     QUARTERLY: "/qtr",      ANNUAL: "/yr"    };
const CYCLE_SAVE   = { MONTHLY: null,       QUARTERLY: "10% off",   ANNUAL: "20% off" };

/* ─── Per-tier config (light theme) ─────────────────────────────────────── */
const TIERS = [
  {
    /* Free / Starter – neutral slate */
    topBar    : "linear-gradient(90deg,#e2e8f0,#cbd5e1)",
    accent    : "#64748b",
    accentBg  : "#f1f5f9",
    accentText: "#475569",
    ring      : "#e2e8f0",
    shadow    : "0 4px 24px rgba(100,116,139,0.10)",
    hoverShadow:"0 16px 48px rgba(100,116,139,0.18)",
    icon      : "✦",
    ctaStyle  : "outline",
  },
  {
    /* Plan 1 – indigo/violet */
    topBar    : "linear-gradient(90deg,#6366f1,#8b5cf6)",
    accent    : "#6366f1",
    accentBg  : "#eef2ff",
    accentText: "#4f46e5",
    ring      : "#c7d2fe",
    shadow    : "0 4px 24px rgba(99,102,241,0.10)",
    hoverShadow:"0 16px 52px rgba(99,102,241,0.22)",
    icon      : "◈",
    ctaStyle  : "fill",
    popular   : true,
  },
  {
    /* Plan 2 – sky */
    topBar    : "linear-gradient(90deg,#0ea5e9,#06b6d4)",
    accent    : "#0ea5e9",
    accentBg  : "#f0f9ff",
    accentText: "#0284c7",
    ring      : "#bae6fd",
    shadow    : "0 4px 24px rgba(14,165,233,0.10)",
    hoverShadow:"0 16px 52px rgba(14,165,233,0.20)",
    icon      : "⬡",
    ctaStyle  : "outline",
  },
  {
    /* Plan 3 – emerald */
    topBar    : "linear-gradient(90deg,#10b981,#34d399)",
    accent    : "#10b981",
    accentBg  : "#ecfdf5",
    accentText: "#059669",
    ring      : "#a7f3d0",
    shadow    : "0 4px 24px rgba(16,185,129,0.10)",
    hoverShadow:"0 16px 52px rgba(16,185,129,0.20)",
    icon      : "❋",
    ctaStyle  : "outline",
  },
];

function fmt(n) {
  if (n >= 999999) return "Unlimited";
  return Number(n).toLocaleString("en-IN");
}

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("MONTHLY");
  const [rawPlans, setRawPlans]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [paying, setPaying]             = useState(false);
  const [selectedId, setSelectedId]     = useState(null);

  useEffect(() => {
    tenantSubscriptionService.getPlans().then((data) => {
      setRawPlans(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const cycleFiltered   = rawPlans.filter((p) => p.subscription_type === billingCycle);
  const availableCycles = ["MONTHLY","QUARTERLY","ANNUAL"].filter((c) =>
    rawPlans.some((p) => p.subscription_type === c)
  );
  const visiblePlans = [FREE_PLAN, ...cycleFiltered];
  const popularIdx   = Math.floor(cycleFiltered.length / 2);
  const popularId    = cycleFiltered[popularIdx]?.id ?? null;

  const openRazorpay = (plan) =>
    new Promise((resolve, reject) => {
      if (!window.Razorpay) return reject();
      new window.Razorpay({
        key        : import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount     : Number(plan.subscription_amount) * 100,
        currency   : "INR",
        name       : import.meta.env.VITE_APP_NAME || "LendOS",
        description: `${plan.subscription_name} Plan`,
        theme      : { color: "#6366f1" },
        handler    : resolve,
        modal      : { ondismiss: reject },
      }).open();
    });

  const handleSelect = async (plan) => {
    if (paying) return;
    setPaying(true);
    setSelectedId(plan.id);
    if (plan.subscription_amount === 0) {
      localStorage.setItem("tenant_subscription", plan.id);
      return navigate("/dashboard");
    }
    try {
      const res = await openRazorpay(plan);
      localStorage.setItem("razorpay_payment_id", res.razorpay_payment_id);
      localStorage.setItem("tenant_subscription", plan.id);
      navigate("/dashboard");
    } catch {
      setPaying(false);
      setSelectedId(null);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .sp-root *, .sp-root *::before, .sp-root *::after { box-sizing: border-box; }

        .sp-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #ffffff;
          min-height: 100vh;
          color: #1e293b;
          position: relative;
          overflow-x: hidden;
        }

        /* subtle dot-grid texture */
        .sp-root::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: radial-gradient(circle, #d1d9e6 1px, transparent 1px);
          background-size: 26px 26px;
          opacity: 0.5;
        }

        /* soft colour washes */
        .sp-wash {
          position: fixed; border-radius: 50%;
          filter: blur(110px); pointer-events: none; z-index: 0;
        }
        .sp-wash-1 { width:520px; height:400px; background:rgba(99,102,241,0.07);  top:-100px;  left:-140px; }
        .sp-wash-2 { width:440px; height:360px; background:rgba(14,165,233,0.06);  bottom:-80px; right:-100px; }
        .sp-wash-3 { width:360px; height:320px; background:rgba(16,185,129,0.045); top:45%;     left:48%;    transform:translateX(-50%); }

        .sp-inner {
          position: relative; z-index: 1;
          max-width: 1180px; margin: 0 auto;
          padding: 72px 24px 96px;
        }

        /* eyebrow */
        .sp-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          background: #eef2ff; border: 1px solid #c7d2fe;
          color: #4f46e5; font-size: 11px; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 999px; margin-bottom: 20px;
        }
        .sp-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #6366f1;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

        /* headline */
        .sp-headline {
          font-size: clamp(2rem,4.5vw,3.5rem);
          font-weight: 800; line-height: 1.1;
          letter-spacing: -.035em; margin: 0 0 14px; color: #0f172a;
        }
        .sp-headline em {
          font-style: normal;
          background: linear-gradient(115deg,#6366f1 0%,#8b5cf6 45%,#0ea5e9 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .sp-sub { color: #64748b; font-size: 1.05rem; font-weight: 400; margin: 0; }

        /* billing toggle */
        .sp-toggle-wrap {
          display: inline-flex;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 18px; padding: 5px; gap: 4px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.06);
        }
        .sp-toggle-btn {
          padding: 9px 22px; border-radius: 13px; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: .875rem; font-weight: 600;
          transition: all .2s cubic-bezier(.22,1,.36,1);
          background: transparent; color: #94a3b8;
          display: flex; align-items: center; gap: 8px; white-space: nowrap;
        }
        .sp-toggle-btn.active {
          background: #6366f1; color: #fff;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
        }
        .sp-toggle-btn:hover:not(.active) { color: #475569; background: #ffffff; }
        .sp-save-badge {
          font-size: 10px; font-weight: 800; letter-spacing: .04em;
          background: linear-gradient(135deg,#16a34a,#15803d);
          color: #fff; padding: 2px 8px; border-radius: 999px;
        }

        /* grid */
        .sp-grid {
          display: grid; gap: 22px;
          grid-template-columns: repeat(auto-fit, minmax(255px, 1fr));
        }
        @media(min-width:900px) {
          .sp-grid-4 { grid-template-columns: repeat(4,1fr); }
          .sp-grid-3 { grid-template-columns: repeat(3,1fr); }
          .sp-grid-2 { grid-template-columns: repeat(2,minmax(0,440px)); justify-content:center; }
          .sp-grid-1 { grid-template-columns: minmax(0,440px); justify-content:center; }
        }

        /* card */
        .sp-card {
          position: relative; border-radius: 22px; overflow: hidden;
          background: #ffffff;
          border: 1.5px solid #edf0f4;
          transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease, border-color .3s;
        }
        .sp-card:hover { transform: translateY(-7px); }
        .sp-card-popular {
          border-color: #c7d2fe !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.10), 0 20px 52px rgba(99,102,241,0.18) !important;
        }
        .sp-card-popular:hover {
          box-shadow: 0 0 0 3px rgba(99,102,241,0.16), 0 28px 64px rgba(99,102,241,0.24) !important;
        }

        /* coloured top bar */
        .sp-card-topbar { height: 5px; width: 100%; }

        /* popular pill */
        .sp-popular-pill {
          position: absolute; top: 20px; right: 18px;
          background: linear-gradient(135deg,#6366f1,#8b5cf6);
          color: #fff; font-size: 9px; font-weight: 800;
          letter-spacing: .09em; text-transform: uppercase;
          padding: 4px 11px; border-radius: 999px;
          box-shadow: 0 4px 12px rgba(99,102,241,0.38);
        }

        .sp-card-body {
          padding: 28px 26px 24px;
          display: flex; flex-direction: column; height: calc(100% - 5px);
        }

        /* icon */
        .sp-icon {
          width: 46px; height: 46px; border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          font-size: 19px; margin-bottom: 18px;
          border: 1px solid rgba(0,0,0,0.05);
        }

        /* name */
        .sp-plan-name { font-size: 1.22rem; font-weight: 800; margin: 0 0 7px; color: #0f172a; letter-spacing: -.02em; }

        /* cycle tag */
        .sp-plan-tag {
          display: inline-block; font-size: 10px; font-weight: 700;
          letter-spacing: .09em; text-transform: uppercase;
          padding: 3px 10px; border-radius: 7px; margin-bottom: 22px;
        }

        /* price */
        .sp-price-block { margin-bottom: 22px; }
        .sp-price-free  { font-size: 2.6rem; font-weight: 800; letter-spacing: -.04em; color: #0f172a; }
        .sp-price-row   { display: flex; align-items: baseline; gap: 2px; }
        .sp-price-sym   { font-size: 1.25rem; font-weight: 700; padding-bottom: 3px; line-height: 1; }
        .sp-price-num   { font-size: 2.6rem; font-weight: 800; letter-spacing: -.04em; color: #0f172a; }
        .sp-price-per   { font-size: .82rem; color: #94a3b8; font-weight: 500; margin-left: 3px; }

        /* divider */
        .sp-divider { height: 1px; background: #f1f5f9; margin: 0 0 20px; }

        /* features */
        .sp-features { list-style:none; margin:0 0 26px; padding:0; flex:1; display:flex; flex-direction:column; gap:12px; }
        .sp-feature   { display:flex; align-items:center; gap:11px; font-size:.88rem; color:#475569; font-weight:500; }
        .sp-feat-check {
          width:20px; height:20px; border-radius:6px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          font-size:10px; font-weight:800;
        }
        .sp-feature strong { color:#1e293b; font-weight:700; }

        /* CTA */
        .sp-cta {
          width:100%; padding:13px 0; border-radius:13px; cursor:pointer;
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:.92rem; font-weight:700; letter-spacing:.01em;
          transition:all .22s cubic-bezier(.22,1,.36,1);
          border: none;
        }
        .sp-cta:hover:not(:disabled) { transform:translateY(-1px); filter:brightness(1.07); }
        .sp-cta:active:not(:disabled) { transform:translateY(0); filter:brightness(.96); }
        .sp-cta:disabled { opacity:.55; cursor:not-allowed; }
        .sp-cta-fill {
          background: linear-gradient(135deg,#6366f1,#8b5cf6);
          color: #fff;
          box-shadow: 0 6px 22px rgba(99,102,241,0.38);
        }

        /* skeletons */
        .sp-skel-card { border-radius:22px; overflow:hidden; background:#fff; border:1.5px solid #edf0f4; }
        @keyframes shim { 0%{background-position:-500px 0} 100%{background-position:500px 0} }
        .sp-skel-line {
          border-radius:8px; margin-bottom:12px;
          background:linear-gradient(90deg,#f1f5f9 25%,#e8edf4 50%,#f1f5f9 75%);
          background-size:1000px 100%; animation:shim 1.5s infinite linear;
        }

        /* trust row */
        .sp-trust { display:flex; justify-content:center; align-items:center; gap:32px; flex-wrap:wrap; }
        .sp-trust-item { display:flex; align-items:center; gap:7px; font-size:.8rem; color:#94a3b8; font-weight:500; }

        /* fade-in */
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        .sp-fade { animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both; }

        @media(max-width:640px) {
          .sp-inner    { padding:52px 16px 72px; }
          .sp-headline { font-size:1.9rem; }
          .sp-card-body{ padding:22px 18px 18px; }
          .sp-toggle-btn{ padding:8px 14px; font-size:.8rem; }
        }
      `}</style>

      <div className="sp-root">
        <div className="sp-wash sp-wash-1" />
        <div className="sp-wash sp-wash-2" />
        <div className="sp-wash sp-wash-3" />

        <div className="sp-inner">

          {/* ── Header ────────────────────────────────────────── */}
          <div style={{ textAlign:"center", marginBottom:52 }} className="sp-fade">
            <div className="sp-eyebrow">
              <span className="sp-eyebrow-dot" />
              Pricing Plans
            </div>
            <h1 className="sp-headline">
              Find the right plan<br />
              <em>for your business</em>
            </h1>
            <p className="sp-sub">
              Start free. Upgrade when ready. No contracts, no surprises.
            </p>
          </div>

          {/* ── Billing toggle ────────────────────────────────── */}
          {availableCycles.length > 1 && (
            <div className="sp-fade" style={{ textAlign:"center", marginBottom:48, animationDelay:".1s" }}>
              <div className="sp-toggle-wrap">
                {availableCycles.map((c) => (
                  <button
                    key={c}
                    className={`sp-toggle-btn${billingCycle===c?" active":""}`}
                    onClick={() => setBillingCycle(c)}
                  >
                    {CYCLE_LABEL[c]}
                    {CYCLE_SAVE[c] && (
                      billingCycle===c
                        ? <span className="sp-save-badge">{CYCLE_SAVE[c]}</span>
                        : <span style={{ fontSize:"10px", color:"#16a34a", fontWeight:700 }}>{CYCLE_SAVE[c]}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Cards ─────────────────────────────────────────── */}
          {loading ? (
            <div className={`sp-grid sp-grid-3`}>
              {[0,1,2].map((i) => (
                <div key={i} className="sp-skel-card sp-fade" style={{ animationDelay:`${i*.1}s` }}>
                  <div style={{ height:5, background:"#e2e8f0" }} />
                  <div style={{ padding:"28px 26px" }}>
                    <div className="sp-skel-line" style={{ height:46,width:46,borderRadius:13,marginBottom:18 }} />
                    <div className="sp-skel-line" style={{ height:20,width:"55%" }} />
                    <div className="sp-skel-line" style={{ height:12,width:"32%" }} />
                    <div className="sp-skel-line" style={{ height:46,width:"62%",marginTop:6 }} />
                    <div style={{ height:1,background:"#f1f5f9",margin:"20px 0" }} />
                    {[80,65,50].map((w,j) => (
                      <div key={j} className="sp-skel-line" style={{ height:13,width:`${w}%` }} />
                    ))}
                    <div className="sp-skel-line" style={{ height:44,borderRadius:13,marginTop:24 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`sp-grid sp-grid-${Math.min(4, visiblePlans.length)}`}>
              {visiblePlans.map((plan, idx) => {
                const isPopular    = plan.id === popularId;
                const isFree       = plan.isStatic;
                const tier         = isFree ? TIERS[0] : TIERS[Math.min(idx, TIERS.length - 1)];
                const isProcessing = paying && selectedId === plan.id;

                return (
                  <div
                    key={plan.id}
                    className={`sp-card sp-fade${isPopular ? " sp-card-popular" : ""}`}
                    style={{
                      boxShadow    : tier.shadow,
                      animationDelay: `${idx * 0.09 + 0.15}s`,
                    }}
                    onMouseEnter={(e) => { if(!isPopular) e.currentTarget.style.boxShadow = tier.hoverShadow; }}
                    onMouseLeave={(e) => { if(!isPopular) e.currentTarget.style.boxShadow = tier.shadow; }}
                  >
                    <div className="sp-card-topbar" style={{ background: tier.topBar }} />

                    {isPopular && <div className="sp-popular-pill">★ Most Popular</div>}

                    <div className="sp-card-body">

                      <div className="sp-icon" style={{ background: tier.accentBg, color: tier.accent }}>
                        {tier.icon}
                      </div>

                      <h3 className="sp-plan-name">{plan.subscription_name}</h3>

                      {!isFree ? (
                        <span className="sp-plan-tag" style={{ background: tier.accentBg, color: tier.accentText }}>
                          {CYCLE_LABEL[plan.subscription_type]}
                        </span>
                      ) : (
                        <span className="sp-plan-tag" style={{ background:"#f1f5f9", color:"#64748b" }}>
                          Forever Free
                        </span>
                      )}

                      <div className="sp-price-block">
                        {plan.subscription_amount === 0 ? (
                          <div className="sp-price-free" style={{ color: tier.accent }}>₹ 0</div>
                        ) : (
                          <div className="sp-price-row">
                            <span className="sp-price-sym" style={{ color: tier.accent }}>₹</span>
                            <span className="sp-price-num">
                              {Number(plan.subscription_amount).toLocaleString("en-IN")}
                            </span>
                            <span className="sp-price-per">{CYCLE_SUFFIX[plan.subscription_type]}</span>
                          </div>
                        )}
                      </div>

                      <div className="sp-divider" />

                      <ul className="sp-features">
                        <li className="sp-feature">
                          <span className="sp-feat-check" style={{ background: tier.accentBg, color: tier.accent }}>✓</span>
                          <span><strong>{fmt(plan.no_of_borrowers)}</strong> borrowers</span>
                        </li>
                        <li className="sp-feature">
                          <span className="sp-feat-check" style={{ background: tier.accentBg, color: tier.accent }}>✓</span>
                          <span><strong>{fmt(plan.no_of_users)}</strong> team members</span>
                        </li>
                        <li className="sp-feature">
                          <span className="sp-feat-check" style={{ background: tier.accentBg, color: tier.accent }}>✓</span>
                          <span>{isFree ? "Core dashboard" : "Full platform access"}</span>
                        </li>
                        {!isFree && (
                          <li className="sp-feature">
                            <span className="sp-feat-check" style={{ background: tier.accentBg, color: tier.accent }}>✓</span>
                            <span>Priority support</span>
                          </li>
                        )}
                      </ul>

                      <button
                        className={`sp-cta${tier.ctaStyle === "fill" ? " sp-cta-fill" : ""}`}
                        onClick={() => handleSelect(plan)}
                        disabled={paying}
                        style={tier.ctaStyle === "outline" ? {
                          background: tier.accentBg,
                          color      : tier.accentText,
                          border     : `1.5px solid ${tier.ring}`,
                        } : {}}
                      >
                        {isProcessing ? "Processing…" : isFree ? "Get Started Free →" : "Choose This Plan →"}
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* empty state */}
          {!loading && cycleFiltered.length === 0 && availableCycles.length > 0 && (
            <div style={{ textAlign:"center", padding:"64px 0", color:"#94a3b8" }}>
              No {CYCLE_LABEL[billingCycle].toLowerCase()} plans configured yet.
            </div>
          )}

          {/* ── Trust strip ───────────────────────────────────── */}
          <div style={{ marginTop:60 }} className="sp-fade">
            <div style={{ textAlign:"center", marginBottom:18 }}>
              <span style={{
                display:"inline-block", height:1, width:40,
                background:"#e2e8f0", verticalAlign:"middle", marginRight:12,
              }}/>
              <span style={{ fontSize:".75rem", color:"#cbd5e1", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase" }}>
                Included in every plan
              </span>
              <span style={{
                display:"inline-block", height:1, width:40,
                background:"#e2e8f0", verticalAlign:"middle", marginLeft:12,
              }}/>
            </div>
            <div className="sp-trust">
              {[["🔒","Bank-grade SSL"],["☁","Automatic backups"],["⚡","99.9% uptime"],["↩","Cancel anytime"]].map(([ic,lb]) => (
                <div key={lb} className="sp-trust-item">
                  <span style={{ fontSize:13 }}>{ic}</span>{lb}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}



// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import tenantSubscriptionService from "../services/tenantSubscriptionService";

// /* ─── Static free plan ───────────────────────────────────────────────────── */
// const FREE_PLAN = {
//   id: "free",
//   subscription_name: "Starter",
//   subscription_amount: 0,
//   no_of_borrowers: 10,
//   no_of_users: 2,
//   subscription_type: null,
//   isStatic: true,
// };

// const CYCLE_LABEL  = { MONTHLY: "Monthly",  QUARTERLY: "Quarterly", ANNUAL: "Annual"  };
// const CYCLE_SUFFIX = { MONTHLY: "/ month",  QUARTERLY: "/ quarter", ANNUAL: "/ year"  };
// const CYCLE_SAVE   = { MONTHLY: null,        QUARTERLY: "Save 10%",  ANNUAL: "Save 20%" };

// /* ─── Per-tier visual config ─────────────────────────────────────────────── */
// const TIERS = [
//   {
//     gradient : "linear-gradient(135deg,#1e293b 0%,#0f172a 100%)",
//     ring     : "rgba(148,163,184,0.25)",
//     glow     : "rgba(148,163,184,0.08)",
//     accent   : "#94a3b8",
//     pill     : "rgba(148,163,184,0.12)",
//     pillText : "#cbd5e1",
//     icon     : "✦",
//     cta      : { bg: "rgba(148,163,184,0.15)", text: "#e2e8f0", border: "rgba(148,163,184,0.3)" },
//   },
//   {
//     gradient : "linear-gradient(135deg,#1a1040 0%,#0d0620 100%)",
//     ring     : "rgba(139,92,246,0.5)",
//     glow     : "rgba(139,92,246,0.18)",
//     accent   : "#a78bfa",
//     pill     : "rgba(139,92,246,0.18)",
//     pillText : "#c4b5fd",
//     icon     : "◈",
//     cta      : { bg: "linear-gradient(135deg,#7c3aed,#6d28d9)", text: "#fff", border: "transparent" },
//     popular  : true,
//   },
//   {
//     gradient : "linear-gradient(135deg,#0c1a30 0%,#060e1e 100%)",
//     ring     : "rgba(56,189,248,0.35)",
//     glow     : "rgba(56,189,248,0.12)",
//     accent   : "#38bdf8",
//     pill     : "rgba(56,189,248,0.12)",
//     pillText : "#7dd3fc",
//     icon     : "⬡",
//     cta      : { bg: "rgba(56,189,248,0.15)", text: "#e0f2fe", border: "rgba(56,189,248,0.35)" },
//   },
//   {
//     gradient : "linear-gradient(135deg,#0f1f1a 0%,#071410 100%)",
//     ring     : "rgba(52,211,153,0.35)",
//     glow     : "rgba(52,211,153,0.12)",
//     accent   : "#34d399",
//     pill     : "rgba(52,211,153,0.12)",
//     pillText : "#6ee7b7",
//     icon     : "❋",
//     cta      : { bg: "rgba(52,211,153,0.15)", text: "#d1fae5", border: "rgba(52,211,153,0.35)" },
//   },
// ];

// function fmt(n) {
//   if (n >= 999999) return "Unlimited";
//   return Number(n).toLocaleString("en-IN");
// }

// export default function SubscriptionPlans() {
//   const navigate = useNavigate();
//   const [billingCycle, setBillingCycle] = useState("MONTHLY");
//   const [rawPlans, setRawPlans]         = useState([]);
//   const [loading, setLoading]           = useState(true);
//   const [paying, setPaying]             = useState(false);
//   const [selectedId, setSelectedId]     = useState(null);
//   const [hovered, setHovered]           = useState(null);

//   useEffect(() => {
//     tenantSubscriptionService.getPlans().then((data) => {
//       setRawPlans(Array.isArray(data) ? data : []);
//       setLoading(false);
//     });
//   }, []);

//   const cycleFiltered   = rawPlans.filter((p) => p.subscription_type === billingCycle);
//   const availableCycles = ["MONTHLY","QUARTERLY","ANNUAL"].filter((c) =>
//     rawPlans.some((p) => p.subscription_type === c)
//   );
//   const visiblePlans = [FREE_PLAN, ...cycleFiltered];
//   const popularIdx   = Math.floor(cycleFiltered.length / 2);
//   const popularId    = cycleFiltered[popularIdx]?.id ?? null;

//   /* ── payment ── */
//   const openRazorpay = (plan) =>
//     new Promise((resolve, reject) => {
//       if (!window.Razorpay) return reject();
//       new window.Razorpay({
//         key        : import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount     : Number(plan.subscription_amount) * 100,
//         currency   : "INR",
//         name       : import.meta.env.VITE_APP_NAME || "LendOS",
//         description: `${plan.subscription_name} Plan`,
//         theme      : { color: "#7c3aed" },
//         handler    : resolve,
//         modal      : { ondismiss: reject },
//       }).open();
//     });

//   const handleSelect = async (plan) => {
//     if (paying) return;
//     setPaying(true);
//     setSelectedId(plan.id);
//     if (plan.subscription_amount === 0) {
//       localStorage.setItem("tenant_subscription", plan.id);
//       return navigate("/dashboard");
//     }
//     try {
//       const res = await openRazorpay(plan);
//       localStorage.setItem("razorpay_payment_id", res.razorpay_payment_id);
//       localStorage.setItem("tenant_subscription", plan.id);
//       navigate("/dashboard");
//     } catch {
//       setPaying(false);
//       setSelectedId(null);
//     }
//   };

//   /* ─────────────────────────────── RENDER ─────────────────────────────── */
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

//         .sp-root *  { box-sizing:border-box; }
//         .sp-root    { font-family:'Outfit',sans-serif; background:#06080f; min-height:100vh; color:#e2e8f0; }

//         /* ── noise overlay ── */
//         .sp-root::before {
//           content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
//           background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
//           opacity:.4;
//         }

//         /* ── ambient orbs ── */
//         .sp-orb {
//           position:fixed; border-radius:50%; filter:blur(120px); pointer-events:none; z-index:0;
//         }
//         .sp-orb-1 { width:600px; height:600px; background:rgba(124,58,237,0.12); top:-150px; left:-150px; }
//         .sp-orb-2 { width:500px; height:500px; background:rgba(56,189,248,0.08); bottom:-100px; right:-100px; }

//         /* ── layout ── */
//         .sp-inner { position:relative; z-index:1; max-width:1200px; margin:0 auto; padding:80px 24px 100px; }

//         /* ── header ── */
//         .sp-eyebrow {
//           display:inline-flex; align-items:center; gap:8px;
//           background:rgba(124,58,237,0.15); border:1px solid rgba(124,58,237,0.3);
//           color:#c4b5fd; font-size:11px; font-weight:700; letter-spacing:.12em;
//           text-transform:uppercase; padding:6px 16px; border-radius:999px; margin-bottom:24px;
//         }
//         .sp-eyebrow-dot { width:6px; height:6px; border-radius:50%; background:#7c3aed; animation:pulse 2s ease-in-out infinite; }
//         @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }

//         .sp-headline {
//           font-size:clamp(2.2rem,5vw,3.8rem); font-weight:800; line-height:1.1;
//           letter-spacing:-.03em; margin:0 0 16px;
//           background:linear-gradient(135deg,#f8fafc 0%,#94a3b8 100%);
//           -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
//         }
//         .sp-headline em {
//           font-style:normal;
//           background:linear-gradient(135deg,#a78bfa,#38bdf8);
//           -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
//         }
//         .sp-sub { color:#64748b; font-size:1.05rem; font-weight:400; margin:0; }

//         /* ── billing toggle ── */
//         .sp-toggle-wrap {
//           display:inline-flex; background:rgba(255,255,255,0.04);
//           border:1px solid rgba(255,255,255,0.09); border-radius:16px; padding:4px; gap:4px;
//         }
//         .sp-toggle-btn {
//           padding:9px 22px; border-radius:12px; border:none; cursor:pointer;
//           font-family:'Outfit',sans-serif; font-size:.875rem; font-weight:600;
//           transition:all .2s cubic-bezier(.22,1,.36,1); background:transparent; color:#64748b;
//           display:flex; align-items:center; gap:8px;
//         }
//         .sp-toggle-btn.active { background:rgba(124,58,237,0.25); color:#c4b5fd; box-shadow:0 0 0 1px rgba(124,58,237,0.4); }
//         .sp-toggle-btn:hover:not(.active) { color:#94a3b8; background:rgba(255,255,255,0.04); }
//         .sp-save-badge {
//           font-size:10px; font-weight:700; background:linear-gradient(135deg,#16a34a,#15803d);
//           color:#fff; padding:2px 8px; border-radius:999px; letter-spacing:.04em;
//         }

//         /* ── grid ── */
//         .sp-grid {
//           display:grid; gap:20px;
//           grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
//         }
//         @media(min-width:900px) {
//           .sp-grid-4 { grid-template-columns: repeat(4,1fr); }
//           .sp-grid-3 { grid-template-columns: repeat(3,1fr); }
//           .sp-grid-2 { grid-template-columns: repeat(2,minmax(0,460px)); justify-content:center; }
//           .sp-grid-1 { grid-template-columns: minmax(0,460px); justify-content:center; }
//         }

//         /* ── card ── */
//         .sp-card {
//           position:relative; border-radius:24px; overflow:hidden;
//           border:1px solid rgba(255,255,255,0.07);
//           transition:transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease;
//           cursor:default;
//         }
//         .sp-card:hover { transform:translateY(-8px); }
//         .sp-card-inner { padding:32px 28px 28px; position:relative; z-index:1; height:100%; display:flex; flex-direction:column; }

//         /* glow layer */
//         .sp-card-glow {
//           position:absolute; inset:0; z-index:0; opacity:0;
//           transition:opacity .35s ease; pointer-events:none; border-radius:24px;
//         }
//         .sp-card:hover .sp-card-glow { opacity:1; }

//         /* popular ribbon */
//         .sp-ribbon {
//           position:absolute; top:18px; right:-30px; width:130px;
//           background:linear-gradient(135deg,#7c3aed,#6d28d9);
//           color:#fff; font-size:9px; font-weight:800; text-align:center;
//           letter-spacing:.1em; text-transform:uppercase; padding:5px 0;
//           transform:rotate(40deg); box-shadow:0 4px 12px rgba(124,58,237,0.5);
//         }

//         /* icon badge */
//         .sp-icon {
//           width:48px; height:48px; border-radius:14px; display:flex;
//           align-items:center; justify-content:center; font-size:20px; margin-bottom:20px;
//           border:1px solid rgba(255,255,255,0.1);
//         }

//         /* plan name */
//         .sp-plan-name { font-size:1.3rem; font-weight:700; color:#f1f5f9; margin:0 0 6px; letter-spacing:-.02em; }
//         .sp-plan-type {
//           display:inline-block; font-size:10px; font-weight:700; letter-spacing:.1em;
//           text-transform:uppercase; padding:3px 10px; border-radius:6px; margin-bottom:24px;
//         }

//         /* price */
//         .sp-price-wrap { margin-bottom:28px; }
//         .sp-price-free { font-size:2.6rem; font-weight:800; color:#f8fafc; letter-spacing:-.04em; }
//         .sp-price-amount { font-size:2.6rem; font-weight:800; color:#f8fafc; letter-spacing:-.04em; font-family:'Outfit',sans-serif; }
//         .sp-price-currency { font-size:1.3rem; font-weight:600; color:#94a3b8; vertical-align:super; margin-right:2px; }
//         .sp-price-period { font-size:.85rem; color:#64748b; font-weight:500; margin-left:4px; }

//         /* divider */
//         .sp-divider { height:1px; background:rgba(255,255,255,0.07); margin:0 0 24px; }

//         /* features */
//         .sp-features { list-style:none; margin:0 0 28px; padding:0; flex:1; display:flex; flex-direction:column; gap:12px; }
//         .sp-feature { display:flex; align-items:center; gap:12px; font-size:.9rem; color:#94a3b8; font-weight:400; }
//         .sp-feature-dot {
//           width:20px; height:20px; border-radius:6px; display:flex; align-items:center;
//           justify-content:center; font-size:10px; font-weight:800; flex-shrink:0;
//         }
//         .sp-feature strong { color:#cbd5e1; font-weight:600; }

//         /* CTA button */
//         .sp-cta {
//           width:100%; padding:13px 0; border-radius:14px; border:none; cursor:pointer;
//           font-family:'Outfit',sans-serif; font-size:.95rem; font-weight:700;
//           letter-spacing:.01em; transition:all .2s cubic-bezier(.22,1,.36,1);
//           position:relative; overflow:hidden;
//         }
//         .sp-cta:hover:not(:disabled) { transform:translateY(-1px); filter:brightness(1.15); }
//         .sp-cta:active:not(:disabled) { transform:translateY(0); filter:brightness(.95); }
//         .sp-cta:disabled { opacity:.5; cursor:not-allowed; }
//         .sp-cta-popular {
//           background:linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%);
//           color:#fff; box-shadow:0 8px 24px rgba(124,58,237,0.4);
//         }

//         /* loading skeleton */
//         .sp-skeleton { border-radius:24px; overflow:hidden; }
//         .sp-skel-inner { padding:32px 28px; }
//         @keyframes shimmer {
//           0%   { background-position: -400px 0 }
//           100% { background-position:  400px 0 }
//         }
//         .sp-skel-line {
//           border-radius:8px; margin-bottom:14px;
//           background:linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%);
//           background-size:800px 100%; animation:shimmer 1.6s infinite linear;
//         }

//         /* stagger fade */
//         @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
//         .sp-fade { animation:fadeUp .55s cubic-bezier(.22,1,.36,1) both; }

//         /* footer trust row */
//         .sp-trust { display:flex; justify-content:center; align-items:center; gap:28px; flex-wrap:wrap; }
//         .sp-trust-item { display:flex; align-items:center; gap:7px; font-size:.8rem; color:#475569; font-weight:500; }
//         .sp-trust-icon { font-size:14px; }

//         /* responsive */
//         @media(max-width:640px) {
//           .sp-inner { padding:60px 16px 80px; }
//           .sp-headline { font-size:2rem; }
//           .sp-card-inner { padding:24px 20px 20px; }
//           .sp-toggle-btn { padding:8px 14px; font-size:.8rem; }
//         }
//       `}</style>

//       <div className="sp-root">
//         {/* ambient orbs */}
//         <div className="sp-orb sp-orb-1" />
//         <div className="sp-orb sp-orb-2" />

//         <div className="sp-inner">

//           {/* ── Header ─────────────────────────────────────────────── */}
//           <div style={{ textAlign:"center", marginBottom:56 }} className="sp-fade">
//             <div className="sp-eyebrow" style={{ display:"inline-flex" }}>
//               <span className="sp-eyebrow-dot" />
//               Subscription Plans
//             </div>
//             <h1 className="sp-headline">
//               Scale your lending.<br />
//               <em>Pick your plan.</em>
//             </h1>
//             <p className="sp-sub">Transparent pricing. No hidden fees. Cancel anytime.</p>
//           </div>

//           {/* ── Billing toggle ─────────────────────────────────────── */}
//           {availableCycles.length > 1 && (
//             <div style={{ textAlign:"center", marginBottom:52 }}
//                  className="sp-fade" data-style="animation-delay:.1s">
//               <div className="sp-toggle-wrap">
//                 {availableCycles.map((c) => (
//                   <button
//                     key={c}
//                     className={`sp-toggle-btn${billingCycle===c?" active":""}`}
//                     onClick={() => setBillingCycle(c)}
//                   >
//                     {CYCLE_LABEL[c]}
//                     {CYCLE_SAVE[c] && billingCycle===c && (
//                       <span className="sp-save-badge">{CYCLE_SAVE[c]}</span>
//                     )}
//                     {CYCLE_SAVE[c] && billingCycle!==c && (
//                       <span style={{ fontSize:"10px", color:"#16a34a", fontWeight:700 }}>{CYCLE_SAVE[c]}</span>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* ── Cards ──────────────────────────────────────────────── */}
//           {loading ? (
//             /* skeleton */
//             <div className={`sp-grid sp-grid-${Math.min(4, visiblePlans.length)}`}>
//               {[0,1,2].map((i) => (
//                 <div key={i} className="sp-skeleton sp-fade"
//                      style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", animationDelay:`${i*.1}s` }}>
//                   <div className="sp-skel-inner">
//                     <div className="sp-skel-line" style={{ height:48, width:48, borderRadius:14, marginBottom:20 }} />
//                     <div className="sp-skel-line" style={{ height:20, width:"55%" }} />
//                     <div className="sp-skel-line" style={{ height:14, width:"35%" }} />
//                     <div className="sp-skel-line" style={{ height:48, width:"70%", marginTop:8 }} />
//                     <div style={{ height:1, background:"rgba(255,255,255,0.06)", margin:"24px 0" }} />
//                     {[0,1,2].map((j) => (
//                       <div key={j} className="sp-skel-line" style={{ height:14, width:`${75-j*10}%` }} />
//                     ))}
//                     <div className="sp-skel-line" style={{ height:46, borderRadius:14, marginTop:28 }} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className={`sp-grid sp-grid-${Math.min(4, visiblePlans.length)}`}>
//               {visiblePlans.map((plan, idx) => {
//                 const isPopular    = plan.id === popularId;
//                 const isFree       = plan.isStatic;
//                 const tier         = isFree ? TIERS[0] : TIERS[Math.min(idx, TIERS.length-1)];
//                 const isProcessing = paying && selectedId === plan.id;

//                 return (
//                   <div
//                     key={plan.id}
//                     className="sp-card sp-fade"
//                     style={{
//                       background    : tier.gradient,
//                       borderColor   : isPopular ? tier.ring : "rgba(255,255,255,0.07)",
//                       boxShadow     : isPopular
//                                        ? `0 0 0 1px ${tier.ring}, 0 24px 60px ${tier.glow}`
//                                        : "0 8px 32px rgba(0,0,0,0.4)",
//                       animationDelay: `${idx * 0.09 + 0.15}s`,
//                     }}
//                     onMouseEnter={() => setHovered(plan.id)}
//                     onMouseLeave={() => setHovered(null)}
//                   >
//                     {/* glow on hover */}
//                     <div className="sp-card-glow"
//                          style={{ background:`radial-gradient(ellipse at 50% 0%,${tier.glow} 0%,transparent 70%)` }} />

//                     {/* popular ribbon */}
//                     {isPopular && <div className="sp-ribbon">Popular</div>}

//                     <div className="sp-card-inner">

//                       {/* icon */}
//                       <div className="sp-icon" style={{ background: tier.pill, color: tier.accent }}>
//                         {tier.icon}
//                       </div>

//                       {/* name + type */}
//                       <h3 className="sp-plan-name">{plan.subscription_name}</h3>
//                       {!isFree ? (
//                         <span className="sp-plan-type"
//                               style={{ background: tier.pill, color: tier.pillText }}>
//                           {CYCLE_LABEL[plan.subscription_type]}
//                         </span>
//                       ) : (
//                         <span className="sp-plan-type"
//                               style={{ background:"rgba(148,163,184,0.1)", color:"#64748b" }}>
//                           Forever Free
//                         </span>
//                       )}

//                       {/* price */}
//                       <div className="sp-price-wrap">
//                         {plan.subscription_amount === 0 ? (
//                           <div className="sp-price-free" style={{ color: tier.accent }}>₹ 0</div>
//                         ) : (
//                           <div>
//                             <span className="sp-price-currency" style={{ color: tier.accent }}>₹</span>
//                             <span className="sp-price-amount">
//                               {Number(plan.subscription_amount).toLocaleString("en-IN")}
//                             </span>
//                             <span className="sp-price-period">
//                               {CYCLE_SUFFIX[plan.subscription_type]}
//                             </span>
//                           </div>
//                         )}
//                       </div>

//                       <div className="sp-divider" />

//                       {/* features */}
//                       <ul className="sp-features">
//                         <li className="sp-feature">
//                           <span className="sp-feature-dot"
//                                 style={{ background: tier.pill, color: tier.accent }}>
//                             ✓
//                           </span>
//                           <span>
//                             <strong>{fmt(plan.no_of_borrowers)}</strong> borrowers
//                           </span>
//                         </li>
//                         <li className="sp-feature">
//                           <span className="sp-feature-dot"
//                                 style={{ background: tier.pill, color: tier.accent }}>
//                             ✓
//                           </span>
//                           <span>
//                             <strong>{fmt(plan.no_of_users)}</strong> team members
//                           </span>
//                         </li>
//                         <li className="sp-feature">
//                           <span className="sp-feature-dot"
//                                 style={{ background: tier.pill, color: tier.accent }}>
//                             ✓
//                           </span>
//                           <span>{isFree ? "Core dashboard" : "Full platform access"}</span>
//                         </li>
//                         {!isFree && (
//                           <li className="sp-feature">
//                             <span className="sp-feature-dot"
//                                   style={{ background: tier.pill, color: tier.accent }}>
//                               ✓
//                             </span>
//                             <span>Priority support</span>
//                           </li>
//                         )}
//                       </ul>

//                       {/* CTA */}
//                       <button
//                         className={`sp-cta ${isPopular ? "sp-cta-popular" : ""}`}
//                         onClick={() => handleSelect(plan)}
//                         disabled={paying}
//                         style={!isPopular ? {
//                           background : tier.cta.bg,
//                           color      : tier.cta.text,
//                           border     : `1px solid ${tier.cta.border}`,
//                         } : {}}
//                       >
//                         {isProcessing
//                           ? "Processing…"
//                           : isFree
//                             ? "Get Started Free"
//                             : "Choose Plan →"}
//                       </button>

//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {/* ── empty state ── */}
//           {!loading && cycleFiltered.length === 0 && availableCycles.length > 0 && (
//             <div style={{ textAlign:"center", padding:"64px 0", color:"#475569" }}>
//               No {CYCLE_LABEL[billingCycle].toLowerCase()} plans configured yet.
//             </div>
//           )}

//           {/* ── Trust row ──────────────────────────────────────────── */}
//           <div style={{ marginTop:60 }} className="sp-fade">
//             <div className="sp-trust">
//               {[
//                 ["🔒", "Bank-grade SSL"],
//                 ["♾", "Automatic backups"],
//                 ["⚡", "99.9% uptime SLA"],
//                 ["↩", "Cancel anytime"],
//               ].map(([icon, label]) => (
//                 <div className="sp-trust-item" key={label}>
//                   <span className="sp-trust-icon">{icon}</span>
//                   {label}
//                 </div>
//               ))}
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }
