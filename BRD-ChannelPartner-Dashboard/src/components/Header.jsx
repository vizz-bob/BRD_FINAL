import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Header.css";

const tenants = ["All Tenants", "Tenant — Mumbai", "Tenant — Delhi", "Tenant — Bangalore", "Tenant — Hyderabad"];

const notifications = [
  { id: 1, text: "Agent Rahul Verma completed onboarding", time: "2m ago", unread: true },
  { id: 2, text: "Payout of ₹45,000 processed for DSA batch", time: "18m ago", unread: true },
  { id: 3, text: "New promotional offer approved", time: "1h ago", unread: false },
  { id: 4, text: "Performance review due for 12 agents", time: "3h ago", unread: false },
];

export default function Header({ activeId, onMenuToggle }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState("All Tenants");
  const [tenantOpen, setTenantOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const tenantRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const pageTitles = {
    "update-agent": "Update Agent",
    "update-payout": "Update Payout",
    "update-repayment": "Update Repayment Recovery",
    "agent-performance": "Agent Performance",
    "performance-template": "Performance Template",
    "manage-tenants": "Manage Tenants",
    "promotional-offers": "Promotional Offers",
  };

  const breadcrumb = pageTitles[activeId] || "Dashboard";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (tenantRef.current && !tenantRef.current.contains(e.target)) setTenantOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <header className="header">
        {/* Left — Hamburger (mobile) + Breadcrumb */}
        <div className="header-left">
          <button
            className="header-hamburger"
            onClick={onMenuToggle}
            aria-label="Toggle sidebar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div>
            <div className="breadcrumb">
              <span className="breadcrumb-root">Channel Partner</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="breadcrumb-sep">
                <path d="M9 18l6-6-6-6"/>
              </svg>
              <span className="breadcrumb-active">{breadcrumb}</span>
            </div>
          </div>
        </div>

        {/* Right — Controls */}
        <div className="header-right">

          {/* Search */}
          <div className="header-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15" className="search-icon">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Search agents, payouts…" />
          </div>

          {/* Tenant Dropdown — desktop only */}
          <div className="dropdown-wrap" ref={tenantRef}>
            <button
              className="tenant-btn"
              onClick={() => { setTenantOpen(!tenantOpen); setNotifOpen(false); setProfileOpen(false); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>{tenant}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" className={`chevron ${tenantOpen ? "open" : ""}`}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            {tenantOpen && (
              <div className="dropdown-menu tenant-menu">
                {tenants.map((t) => (
                  <button
                    key={t}
                    className={`dropdown-item ${tenant === t ? "selected" : ""}`}
                    onClick={() => { setTenant(t); setTenantOpen(false); }}
                  >
                    {tenant === t && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="dropdown-wrap" ref={notifRef}>
            <button
              className="icon-btn"
              onClick={() => { setNotifOpen(!notifOpen); setTenantOpen(false); setProfileOpen(false); }}
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {notifOpen && (
              <div className="dropdown-menu notif-menu">
                <div className="notif-header">
                  <span>Notifications</span>
                  <button className="mark-read">Mark all read</button>
                </div>
                <div className="notif-list">
                  {notifications.map((n) => (
                    <div key={n.id} className={`notif-item ${n.unread ? "unread" : ""}`}>
                      <div className={`notif-dot ${n.unread ? "active" : ""}`} />
                      <div className="notif-content">
                        <p>{n.text}</p>
                        <span>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="notif-footer">
                  <button>View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="dropdown-wrap" ref={profileRef}>
            <button
              className="profile-btn"
              onClick={() => { setProfileOpen(!profileOpen); setTenantOpen(false); setNotifOpen(false); }}
            >
              <div className="profile-avatar">AK</div>
              <div className="profile-info">
                <span className="profile-name">Amit Kumar</span>
                <span className="profile-role">Admin</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" className={`chevron ${profileOpen ? "open" : ""}`}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {profileOpen && (
              <div className="dropdown-menu profile-menu">
                <div className="profile-menu-top">
                  <div className="profile-avatar lg">AK</div>
                  <div>
                    <p className="pm-name">Amit Kumar</p>
                    <p className="pm-email">amit.kumar@channelos.in</p>
                  </div>
                </div>
                <div className="profile-menu-divider" />
                {[
                  { icon: "👤", label: "My Profile" },
                  { icon: "⚙️", label: "Settings" },
                  { icon: "🔐", label: "Change Password" },
                ].map((item) => (
                  <button key={item.label} className="dropdown-item">
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}
                <div className="profile-menu-divider" />
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ── MOBILE TENANT FILTER BAR ── */}
      <div className="mobile-tenant-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13" className="mobile-tenant-icon">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <div className="mobile-tenant-scroll">
          {tenants.map((t) => (
            <button
              key={t}
              className={`mobile-tenant-chip ${tenant === t ? "active" : ""}`}
              onClick={() => setTenant(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}