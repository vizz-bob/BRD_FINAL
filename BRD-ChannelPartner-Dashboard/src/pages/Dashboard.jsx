import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AgentPerformance.css";
import { DashboardAPI, RecentAgentsAPI } from "../services/DashboardService";


// ─── Fallback color maps ───────────────────────────────────────────────────
const typeColors = {
  DSA:            { bg: "#dbeafe", color: "#2563eb" },
  Broker:         { bg: "#fef9c3", color: "#b45309" },
  "Lead Partner": { bg: "#dcfce7", color: "#16a34a" },
};

// ─── Skeleton loader for cards ────────────────────────────────────────────
function Skeleton({ width = "100%", height = 20, style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 6,
        background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
        ...style,
      }}
    />
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  // ─── State ──────────────────────────────────────────────────────────────
  const [snapshot, setSnapshot]       = useState(null);   // latest dashboard snapshot
  const [agents, setAgents]           = useState([]);      // recent agents list
  const [loadingStats, setLoadingStats]   = useState(true);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [error, setError]             = useState(null);

  // ─── Fetch dashboard snapshot (latest = first item) ─────────────────────
  useEffect(() => {
    DashboardAPI.getAll()
      .then((data) => {
        // API returns a list; pick the most recent entry
        const latest = Array.isArray(data) ? data[0] : data;
        setSnapshot(latest || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingStats(false));
  }, []);

  // ─── Fetch recent agents ─────────────────────────────────────────────────
  useEffect(() => {
    RecentAgentsAPI.getAll()
      .then((data) => setAgents(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingAgents(false));
  }, []);

  // ─── Debug: log raw snapshot to console so you can verify field names ──────
  // Remove this once everything is working
  useEffect(() => {
    if (snapshot) console.log("📊 Dashboard snapshot from API:", snapshot);
  }, [snapshot]);

  // ─── Derived stat cards from snapshot ────────────────────────────────────
  // DRF lowercases ALL field names in JSON — Active_Agents → active_agents
  // Also show raw number for payouts (not divided) since values are small integers
  const statsData = snapshot
    ? [
        {
          label: "Total Agents",
          value: (snapshot.total_agents ?? snapshot.Total_agents ?? "—").toLocaleString?.() ?? (snapshot.total_agents ?? "—"),
          color: "blue",
          icon: "👥",
        },
        {
          label: "Active Agents",
          // Django model field is Active_Agents → DRF sends active_agents
          value: (snapshot.active_agents ?? snapshot.Active_Agents ?? "—").toLocaleString?.() ?? (snapshot.active_agents ?? "—"),
          color: "green",
          icon: "✅",
        },
        {
          label: "Total Payouts",
          // Show as ₹X.XL only if value > 100000, else show as ₹X
          value: (() => {
            const v = snapshot.total_payouts ?? snapshot.Total_payouts;
            if (v == null) return "—";
            return v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${Number(v).toLocaleString("en-IN")}`;
          })(),
          color: "purple",
          icon: "💳",
        },
        {
          label: "Leads Generated",
          value: (snapshot.lead_generated ?? "—").toLocaleString?.() ?? (snapshot.lead_generated ?? "—"),
          color: "orange",
          icon: "📈",
        },
      ]
    : [];

  // ─── Quick stats from snapshot ────────────────────────────────────────────
  const quickStats = snapshot
    ? [
        {
          label: "Payouts This Month",
          value: (() => {
            const v = snapshot.payouts_this_month;
            if (v == null) return "—";
            return v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${Number(v).toLocaleString("en-IN")}`;
          })(),
          sub: "This month",
        },
        {
          label: "Pending Approvals",
          value: snapshot.pending_approvals ?? "—",
          sub: "Needs review",
        },
        {
          label: "Offers Active",
          value: snapshot.offers_active ?? "—",
          sub: "Currently live",
        },
        {
          label: "Avg Conversion Rate",
          // Django model: Avg_Conversion_Rate → DRF: avg_conversion_rate
          value: (snapshot.avg_conversion_rate ?? snapshot.Avg_Conversion_Rate) != null
            ? `${snapshot.avg_conversion_rate ?? snapshot.Avg_Conversion_Rate}%`
            : "—",
          sub: "Industry avg: 22%",
        },
      ]
    : [];

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="ap-root">

      {/* Shimmer keyframe injected inline once */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Header */}
      <div className="ap-page-header">
        <div>
          <h1 className="ap-title">Dashboard</h1>
          <p className="ap-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="ap-header-actions">
          <button className="ap-btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {snapshot?.date ?? "—"}
          </button>
        </div>
      </div>

      {/* Global error banner */}
      {error && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
          borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontSize: 13,
        }}>
          ⚠️ Failed to load data: {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="ap-stats">
        {loadingStats
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="ap-card" style={{ padding: 20 }}>
                <Skeleton height={14} width="60%" style={{ marginBottom: 12 }} />
                <Skeleton height={28} width="40%" style={{ marginBottom: 8 }} />
                <Skeleton height={12} width="50%" />
              </div>
            ))
          : statsData.map((s) => (
              <div key={s.label} className={`ap-stat-card ap-stat-${s.color}`}>
                <div className="ap-stat-top">
                  <div className={`ap-stat-icon ap-icon-${s.color}`} style={{ fontSize: 18 }}>
                    {s.icon}
                  </div>
                </div>
                <div className="ap-stat-value">{s.value}</div>
                <div className="ap-stat-label">{s.label}</div>
              </div>
            ))}
      </div>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {loadingStats
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="ap-card" style={{ padding: "16px 20px" }}>
                <Skeleton height={11} width="70%" style={{ marginBottom: 8 }} />
                <Skeleton height={22} width="45%" style={{ marginBottom: 6 }} />
                <Skeleton height={11} width="55%" />
              </div>
            ))
          : quickStats.map((q) => (
              <div key={q.label} className="ap-card" style={{ padding: "16px 20px" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {q.label}
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: 2 }}>
                  {q.value}
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{q.sub}</div>
              </div>
            ))}
      </div>

      {/* Recent Agents Table */}
      <div className="ap-card ap-table-card">
        <div className="ap-card-header">
          <div>
            <h3>Recent Agents</h3>
            <p>Latest onboarded agents</p>
          </div>
          <button
            className="ap-btn-outline"
            style={{ fontSize: 12 }}
            onClick={() => navigate("/dashboard/agent-performance")}
          >
            View All →
          </button>
        </div>

        <div className="ap-table-wrap">
          {loadingAgents ? (
            // Table skeleton
            <table className="ap-table">
              <thead>
                <tr>
                  {["Agent ID", "Name", "Type", "Payout", "Status"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j}><Skeleton height={14} width="80%" /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : agents.length === 0 ? (
            <p style={{ textAlign: "center", color: "#94a3b8", padding: "32px 0", fontSize: 14 }}>
              No agents found.
            </p>
          ) : (
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Agent ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Payout</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((a) => (
                  <tr key={a.agent_id}>
                    <td className="ap-agent-id">{a.agent_id}</td>
                    <td className="ap-agent-name">
                      <div className="ap-avatar">{a.name?.charAt(0)}</div>
                      {a.name}
                    </td>
                    <td>
                      <span
                        className="ap-type-badge"
                        style={{
                          background: typeColors[a.agent_type]?.bg ?? "#f1f5f9",
                          color:      typeColors[a.agent_type]?.color ?? "#475569",
                        }}
                      >
                        {a.agent_type}
                      </span>
                    </td>
                    <td className="ap-payout">
                      {a.payout != null ? `₹${Number(a.payout).toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td>
                      <span className={`ap-status-badge ${a.status === "active" ? "active" : "inactive"}`}>
                        {a.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
