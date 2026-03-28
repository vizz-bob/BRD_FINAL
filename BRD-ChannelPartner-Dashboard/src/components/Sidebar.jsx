import React, { useState, useRef, useEffect } from "react";
import "./Sidebar.css";

const navItems = [
  {
    section: null,
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: "Agent Management",
    items: [
      {
        id: "update-agent",
        label: "Update Agent",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        ),
      },
      {
        id: "update-payout",
        label: "Update Payout",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <path d="M2 10h20"/>
          </svg>
        ),
      },
      {
        id: "update-repayment",
        label: "Update Repayment Recovery",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
            <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0"/>
            <path d="M3 12h4l3 3 4-6 3 3h4"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: "Performance",
    items: [
      {
        id: "agent-performance",
        label: "Agent Performance",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
            <path d="M18 20V10M12 20V4M6 20v-6"/>
          </svg>
        ),
      },
      {
        id: "performance-template",
        label: "Performance Template",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <path d="M9 12h6M9 16h4"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: "Configuration",
    items: [
      {
        id: "manage-tenants",
        label: "Manage Tenants",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        ),
      },
      {
        id: "promotional-offers",
        label: "Promotional Offers",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar({ activeId, onSelect, mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, label: "", y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Collapse sidebar by default on mobile
  useEffect(() => {
    if (isMobile) setCollapsed(false); // on mobile, collapsed state is irrelevant (drawer handles it)
  }, [isMobile]);

  const handleMouseEnter = (e, label) => {
    if (!collapsed || isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ visible: true, label, y: rect.top + rect.height / 2 });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, label: "", y: 0 });
  };

  const handleNavSelect = (id) => {
    onSelect(id);
    if (isMobile && onMobileClose) onMobileClose(); // close drawer on nav select (mobile)
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && mobileOpen && (
        <div className="sidebar-overlay" onClick={onMobileClose} />
      )}

      <aside className={`sidebar ${!isMobile && collapsed ? "collapsed" : ""} ${isMobile && mobileOpen ? "mobile-open" : ""}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
              <path d="M17 20H7a3 3 0 01-3-3V9a3 3 0 013-3h1V5a4 4 0 018 0v1h1a3 3 0 013 3v8a3 3 0 01-3 3zM10 6h4V5a2 2 0 00-4 0v1z"/>
            </svg>
          </div>
          {(!collapsed || isMobile) && <span className="logo-text">ChannelOS</span>}
          <button
            className="collapse-btn"
            onClick={() => {
              if (isMobile) {
                onMobileClose && onMobileClose();
              } else {
                setCollapsed(!collapsed);
              }
            }}
            aria-label="Toggle sidebar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              {(!isMobile && collapsed)
                ? <path d="M9 18l6-6-6-6"/>
                : <path d="M15 18l-6-6 6-6"/>}
            </svg>
          </button>
        </div>

        {/* Module Label */}
        {(!collapsed || isMobile) && (
          <div className="module-label">
            <span>Channel Partner</span>
          </div>
        )}

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map((group, gi) => (
            <div className="nav-group" key={gi}>
              {(!collapsed || isMobile) && group.section && (
                <p className="nav-section-title">{group.section}</p>
              )}
              {collapsed && !isMobile && gi > 0 && <div className="nav-group-divider" />}

              {group.items.map((item) => (
                <button
                  key={item.id}
                  className={`nav-item ${activeId === item.id ? "active" : ""}`}
                  onClick={() => handleNavSelect(item.id)}
                  onMouseEnter={(e) => handleMouseEnter(e, item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {(!collapsed || isMobile) && (
                    <span className="nav-label">{item.label}</span>
                  )}
                  {activeId === item.id && <span className="active-bar" />}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom User */}
        <div
          className="sidebar-user"
          onMouseEnter={(e) => collapsed && !isMobile && handleMouseEnter(e, "Amit Kumar · Admin")}
          onMouseLeave={handleMouseLeave}
        >
          <div className="user-avatar">AK</div>
          {(!collapsed || isMobile) && (
            <div className="user-info">
              <span className="user-name">Amit Kumar</span>
              <span className="user-role">Admin</span>
            </div>
          )}
        </div>

      </aside>

      {!isMobile && tooltip.visible && (
        <div className="sidebar-tooltip" style={{ top: tooltip.y }}>
          {tooltip.label}
        </div>
      )}
    </>
  );
}