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
  CalendarDaysIcon,
  DocumentTextIcon,
  TicketIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  DocumentDuplicateIcon,
  CalculatorIcon,
} from "@heroicons/react/24/outline";

// Unified Menu Items
const items = [
  // --- TENANT SECTIONS ---
  { section: "Main Navigation" },
  { path: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { path: "/leads", label: "Leads (CRM)", icon: FunnelIcon },
  { path: "/loans", label: "Loan Products", icon: BanknotesIcon },
  { path: "/add-business", label: "Add Business", icon: BuildingOfficeIcon },
  { path: "/branches", label: "Branches", icon: ServerStackIcon },
  { path: "/internal-team-dashboards", label: "Internal Dashboards", icon: Squares2X2Icon },

  { section: "Loans & Applications" },
  { path: "/loan-applications", label: "Loan Applications", icon: ClipboardDocumentCheckIcon },
  { path: "/active-loans", label: "Active Loans", icon: BanknotesIcon },
  { path: "/disbursements", label: "Disbursements", icon: ArrowsRightLeftIcon },
  { path: "/mandates", label: "Mandate Management", icon: DocumentDuplicateIcon },
  { path: "/risk-engine", label: "Rules Management", icon: ShieldCheckIcon },
  { path: "/rules-config", label: "Rules", icon: Cog6ToothIcon },
  { path: "/escalation-rules", label: "Escalation Matrix", icon: BellAlertIcon },

  { section: "Operations" },
  { path: "/collections", label: "Collections", icon: ExclamationTriangleIcon },
  { path: "/support", label: "Support Tickets", icon: TicketIcon },
  { path: "/knowledge-base", label: "Knowledge Base", icon: AcademicCapIcon },
  { path: "/training", label: "Training Academy", icon: AcademicCapIcon },
  { path: "/calendar", label: "Calendar", icon: CalendarDaysIcon },

  { section: "User Management" },
  { path: "/users", label: "Tenant Users", icon: UserCircleIcon },
  { path: "/roles", label: "Manage Roles", icon: KeyIcon },
  { path: "/roles_permissions", label: "Roles & Permissions", icon: ShieldCheckIcon },
  {
    path: "/channel-partners",
    label: "Channel Partners",
    icon: ArrowsRightLeftIcon,
    submenu: [
      { path: "/channel-partners/sales", label: "Sales Partners", icon: ArrowsRightLeftIcon },
      { path: "/channel-partners/api-providers", label: "API Providers", icon: GlobeAltIcon },
    ],
  },
  { path: "/third-party-users", label: "Third Party Users", icon: DocumentMagnifyingGlassIcon },

  { section: "System & Governance" },
  { path: "/categories", label: "Categories", icon: Squares2X2Icon },
  { path: "/my-subscription", label: "My Subscription", icon: CreditCardIcon },
  { path: "/subscription-plans", label: "Subscription Plans", icon: TicketIcon },

  // --- MASTER ADMIN SECTIONS ---
  {
    label: "Approval Master",
    icon: CheckCircleIcon,
    submenu: [
      { path: "/approvals", label: "Approvals" },
      { path: "/manage-approvals", label: "Manage Approvals" },
      { path: "/escalation", label: "Escalation" },
    ],
  },
  {
    label: "Product & Revenue",
    icon: BriefcaseIcon,
    submenu: [
      { path: "/product-management/list", label: "Product Management" },
      { path: "/product-mix/list", label: "Product Mix Management" },
      { path: "/fees/list", label: "Fees Management" },
      { path: "/charges/list", label: "Charges Management" },
      { path: "/interest/list", label: "Interest Management" },
      { path: "/repayment/list", label: "Repayment Management" },
      { path: "/penalties", label: "Penalties Management" },
      { path: "/moratorium", label: "Moratorium Management" },
    ],
  },
  { path: "/loan-improvement", label: "Loan Improvement", icon: ArrowLeftOnRectangleIcon },
  { path: "/currency-management", label: "Currency Management", icon: CurrencyRupeeIcon },
  { path: "/concession-management", label: "Concession Management", icon: ArrowsRightLeftIcon },
  {
    label: "Eligibility & Score",
    icon: ClipboardDocumentCheckIcon,
    submenu: [
      { path: "/eligibility", label: "Eligibility Management" },
      { path: "/banking", label: "Banking Management" },
      { path: "/obligation", label: "Obligation Management" },
      { path: "/score-card", label: "Score Card Management" },
    ],
  },
  {
    label: "Template Management",
    icon: DocumentTextIcon,
    submenu: [
      { path: "/predefine-template", label: "Predefine Template" },
      { path: "/customize-template", label: "Customize Template" },
    ],
  },
  {
    label: "Bank & Fund",
    icon: BuildingOfficeIcon,
    submenu: [
      { label: "Bank Management", path: "/bank-management" },
      { label: "Fund Management", path: "/fund-management" },
      { label: "Portfolio Management", path: "/portfolio-management" },
      { label: "Mode Of Bank", path: "/mode-of-bank" },
      { label: "Taxation Management", path: "/taxation-management" },
      { label: "Business Model", path: "/business-model" },
    ],
  },
  { section: "Advanced Tools" },
  {
    label: "Profile Management",
    icon: UserCircleIcon,
    submenu: [
      { label: "Vendor Profile", path: "/profile-management/vendor" },
      { label: "Agent Profile", path: "/profile-management/agent" },
      { label: "Client Profile", path: "/profile-management/client" },
    ],
  },
  {
    label: "Agent Master",
    icon: UserCircleIcon,
    submenu: [
      { label: "Channel Partners", path: "/channel-partners" },
      { label: "Verification Agency", path: "/verification-agency" },
      { label: "Collection Agent", path: "/collection-agent" },
      { label: "Legal Agent", path: "/legal-agent" },
    ],
  },
  {
    label: "Controls Management",
    icon: Cog6ToothIcon,
    submenu: [
      { label: "Manage Language", path: "/controls/language" },
      { label: "Geo Location", path: "/controls/geo" },
      { label: "Login Authentication", path: "/controls/login-auth" },
      { label: "CoApplicant", path: "/controls/co-applicant" },
      { label: "Login Fee", path: "/controls/login-fees" },
      { label: "Joint Applicant", path: "/controls/joint-applicant" },
      { label: "References", path: "/controls/references" },
      { label: "Application Process", path: "/controls/application-process" },
      { label: "Score Card Rating", path: "/controls/score-card" },
      { label: "Verification", path: "/controls/verification" },
    ],
  },
  {
    label: "Rule Management",
    icon: DocumentDuplicateIcon,
    submenu: [
      { label: "Rule Master", path: "/rule-management/rule-master" },
      { label: "Impact Values", path: "/rule-management/impact-values" },
      { label: "Client Profile Rules", path: "/rule-management/client-profile" },
      { label: "Collateral Quality", path: "/rule-management/collateral-quality" },
      { label: "Financial Eligibility", path: "/rule-management/financial-eligibility" },
      { label: "Score Card", path: "/rule-management/scorecard" },
      { label: "Risk & Mitigation", path: "/rule-management/risk-mitigation" },
      { label: "Verification Rules", path: "/rule-management/verification" },
    ],
  },
];

function NavContent({ activePath, expandedMenus, toggleSubmenu, handleLogout, onNavClick }) {
  const isActive = (path) => {
    if (path === "/") return activePath === "/";
    return activePath.startsWith(path);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Brand */}
      <div className="h-16 flex items-center px-4 gap-3 border-b border-gray-100 flex-shrink-0">
        <div className="h-9 w-9 rounded-xl bg-blue-600 grid place-items-center text-white flex-shrink-0">
          <BuildingOfficeIcon className="h-5 w-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-base font-semibold text-slate-800 truncate">TenantMaster</div>
          <div className="text-xs text-gray-500">Unified Platform</div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {items.map((item, idx) => (
          item.section ? (
            <p key={idx} className="mt-4 mb-2 px-3 text-xs font-semibold uppercase text-gray-500">
              {item.section}
            </p>
          ) : (
            <div key={item.path || item.label}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(item.path || "")
                      ? "text-blue-700 bg-blue-50 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive(item.path || "") ? "text-blue-600" : "text-slate-400"}`} />
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {expandedMenus[item.label]
                      ? <ChevronDownIcon className="h-4 w-4 flex-shrink-0" />
                      : <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />}
                  </button>

                  {expandedMenus[item.label] && (
                    <div className="ml-4 mt-0.5 space-y-0.5">
                      {item.submenu.map(({ path: subPath, label: subLabel, icon: SubIcon }) => (
                        <Link
                          key={subPath}
                          to={subPath}
                          onClick={onNavClick}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${activePath === subPath
                            ? "text-blue-700 bg-blue-50 shadow-sm"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        >
                          {SubIcon ? <SubIcon className={`h-4 w-4 flex-shrink-0 ${activePath === subPath ? "text-blue-600" : "text-slate-400"}`} /> : <div className="w-4" />}
                          <span className="truncate">{subLabel}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  onClick={onNavClick}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(item.path)
                    ? "text-blue-700 bg-blue-50 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive(item.path) ? "text-blue-600" : "text-slate-400"}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              )}
            </div>
          )))}
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

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;

  const [expandedMenus, setExpandedMenus] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleSubmenu = (label) => {
    setExpandedMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    localStorage.clear();
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
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex-col z-40">
        <NavContent {...sharedProps} />
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3">
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-slate-100 transition flex-shrink-0">
          <Bars3Icon className="h-5 w-5 text-slate-600" />
        </button>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-blue-600 grid place-items-center text-white flex-shrink-0">
            <BuildingOfficeIcon className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-slate-800 truncate">TenantMaster</span>
        </div>
      </header>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-3.5 right-3 p-2 rounded-lg hover:bg-slate-100 transition z-10">
          <XMarkIcon className="h-5 w-5 text-slate-500" />
        </button>
        <NavContent {...sharedProps} />
      </div>
    </>
  );
}