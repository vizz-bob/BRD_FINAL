import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  HomeIcon,
  ServerStackIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  BanknotesIcon,
  UserCircleIcon,
  CreditCardIcon,
  KeyIcon,
  ArrowsRightLeftIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentCheckIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  CurrencyRupeeIcon,
  Squares2X2Icon,
  FunnelIcon,
  ShieldCheckIcon,
  BellAlertIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  TicketIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CloudIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const items = [
  { path: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { path: "/leads", label: "Leads (CRM)", icon: FunnelIcon },
  { path: "/add-business", label: "Add Business", icon: BuildingOfficeIcon },
  { path: "/branches", label: "Branches", icon: ServerStackIcon },
  { path: "/risk-engine", label: "Risk Engine", icon: ShieldCheckIcon },
  { path: "/escalation-rules", label: "Escalation Matrix", icon: BellAlertIcon },
  { path: "/loans", label: "Loan Products", icon: BanknotesIcon },
  { path: "/rules-config", label: "Rules", icon: DocumentTextIcon },
  { path: "/loan-applications", label: "Loan Applications", icon: ClipboardDocumentCheckIcon },
  { path: "/mandates", label: "Mandate Management", icon: BuildingLibraryIcon },
  { path: "/disbursements", label: "Disbursement Queue", icon: CurrencyRupeeIcon },
  { path: "/loan-accounts", label: "Loan Accounts (LMS)", icon: BanknotesIcon },
  { path: "/collections", label: "Collections", icon: ExclamationTriangleIcon },
  { path: "/support", label: "Support Tickets", icon: TicketIcon },
  { path: "/training", label: "Training Academy", icon: AcademicCapIcon },
  { path: "/my-subscription", label: "My Subscription", icon: CreditCardIcon },
  { path: "/users", label: "Users", icon: UserCircleIcon },
  {
    path: "/channel-partners",
    label: "Channel Partners",
    icon: ArrowsRightLeftIcon,
    submenu: [
      { path: "/channel-partners/sales", label: "Sales Partners", icon: ArrowsRightLeftIcon },
      { path: "/channel-partners/api-providers", label: "API Providers", icon: CloudIcon },
    ],
  },
  { path: "/third-party-users", label: "Third Party Users", icon: DocumentMagnifyingGlassIcon },
  { path: "/roles_permissions", label: "Roles & Permissions", icon: KeyIcon },
  { path: "/internal-team-dashboards", label: "Internal Dashboards", icon: Squares2X2Icon },
  { path: "/calendar", label: "Calendar", icon: CalendarDaysIcon },
  { path: "/settings", label: "System Settings", icon: Cog6ToothIcon },
];

// ─── Shared nav content (used in both desktop sidebar & mobile drawer) ────────
function NavContent({ activePath, expandedMenus, toggleSubmenu, handleLogout, onNavClick }) {
  const isActive = (path) => {
    if (path === "/") return activePath === "/";
    return activePath.startsWith(path);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="h-16 flex items-center px-4 gap-3 border-b border-gray-100 flex-shrink-0">
        <div className="h-9 w-9 rounded-xl bg-primary-600 grid place-items-center text-white flex-shrink-0">
          <BuildingOfficeIcon className="h-5 w-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-base font-semibold text-slate-800 truncate">Tenant Admin</div>
          <div className="text-xs text-gray-500">LOS Platform</div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {items.map(({ path, label, icon: Icon, submenu }) => (
          <div key={path}>
            {submenu ? (
              <>
                <button
                  onClick={() => toggleSubmenu(path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive(path)
                      ? "text-primary-700 bg-primary-50 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isActive(path) ? "text-primary-600" : "text-slate-400"}`} />
                  <span className="flex-1 text-left truncate">{label}</span>
                  {expandedMenus[path]
                    ? <ChevronDownIcon className="h-4 w-4 flex-shrink-0" />
                    : <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />}
                </button>

                {expandedMenus[path] && (
                  <div className="ml-4 mt-0.5 space-y-0.5">
                    {submenu.map(({ path: subPath, label: subLabel, icon: SubIcon }) => (
                      <Link
                        key={subPath}
                        to={subPath}
                        onClick={onNavClick}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                          activePath === subPath
                            ? "text-primary-700 bg-primary-50 shadow-sm"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <SubIcon className={`h-4 w-4 flex-shrink-0 ${activePath === subPath ? "text-primary-600" : "text-slate-400"}`} />
                        <span className="truncate">{subLabel}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={path}
                onClick={onNavClick}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(path)
                    ? "text-primary-700 bg-primary-50 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive(path) ? "text-primary-600" : "text-slate-400"}`} />
                <span className="truncate">{label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Sidebar component ────────────────────────────────────────────────────
export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;

  const [expandedMenus, setExpandedMenus] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleSubmenu = (path) => {
    setExpandedMenus((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  const sharedProps = {
    activePath,
    expandedMenus,
    toggleSubmenu,
    handleLogout,
    onNavClick: () => setMobileOpen(false),
  };

  return (
    <>
      {/* ── DESKTOP SIDEBAR (lg+) ─────────────────────────────────────────── */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex-col z-40">
        <NavContent {...sharedProps} />
      </aside>

      {/* ── MOBILE TOPBAR (below lg) ──────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3">
        {/* Hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-100 transition flex-shrink-0"
          aria-label="Open menu"
        >
          <Bars3Icon className="h-5 w-5 text-slate-600" />
        </button>

        {/* Brand mark */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-primary-600 grid place-items-center text-white flex-shrink-0">
            <BuildingOfficeIcon className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-slate-800 truncate">Tenant Admin</span>
        </div>

        {/* Active route label — right side */}
        <span className="ml-auto text-xs font-medium text-slate-400 truncate max-w-[140px]">
          {items.find((i) => activePath.startsWith(i.path))?.label || ""}
        </span>
      </header>

      {/* ── MOBILE DRAWER OVERLAY ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER PANEL ───────────────────────────────────────────── */}
      <div
        className={`
          lg:hidden fixed inset-y-0 left-0 z-50
          w-72 bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close button inside drawer */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-3.5 right-3 p-2 rounded-lg hover:bg-slate-100 transition z-10"
          aria-label="Close menu"
        >
          <XMarkIcon className="h-5 w-5 text-slate-500" />
        </button>

        <NavContent {...sharedProps} />
      </div>
    </>
  );
}