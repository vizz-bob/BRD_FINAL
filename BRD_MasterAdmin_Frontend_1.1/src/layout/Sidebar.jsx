import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as Icons from "react-icons/fi";
import { HiCurrencyRupee } from "react-icons/hi2";

// --- Utility to get logged-in user's permissions ---
const getUserPermissions = () => {
  const raw = localStorage.getItem("permissions");
  if (!raw) return [];

  return raw
    .split(",")
    .map(p => p.trim().toLowerCase());
};


const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const userPermissions = getUserPermissions();

  const closeMobile = () => {
    if (window.innerWidth < 768) setOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  const menuItemStyle = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
      isActive(path)
        ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
        : "text-gray-700 hover:bg-gray-100"
    } md:static md:pointer-events-auto`;

  // --- RBAC Helper ---
 const hasPermission = (permission) => {
  if (!permission) return true;
  return userPermissions.includes(permission.toLowerCase());
};


  // --- MENU CONFIG ---
  const MENU = [
    { title: "Home", icon: <Icons.FiHome size={18} />, path: "/dashboard", permission: "dashboard.view" },
    { title: "Organizations", icon: <Icons.FiGrid size={18} />, path: "/organizations", permission: "organizations.view" },
    { title: "Users", icon: <Icons.FiUsers size={18} />, path: "/users", permission: "users.view" },
    { title: "Roles", icon: <Icons.FiKey size={18} />, path: "/roles", permission: "roles.view" },
    { title: "Subscription", icon: <Icons.FiCreditCard size={18} />, path: "/subscriptions", permission: "subscriptions.view" },

    {
      section: "Master Data & Governance",
    },

    {
      title: "Approval Master",
      icon: <Icons.FiThumbsUp size={18} />,
      permission: "approval.view",
      submenu: [
        { title: "Approvals", path: "/approvals", permission: "approval.view" },
        { title: "Manage Approvals", path: "/manage-approvals", permission: "approval.assign" },
        { title: "Escalation", path: "/escalation", permission: "approval.escalation" },
      ],
    },

    {
      title: "Product & Revenue",
      icon: <Icons.FiBox size={18} />,
      permission: "product.view",
      submenu: [
        { title: "Product Management", path: "/product-management/list", permission: "product.view" },
        { title: "Product Mix Management", path: "/product-mix/list", permission: "product_mix.view" },
        { title: "Fees Management", path: "/fees/list", permission: "fees.view" },
        { title: "Charges Management", path: "/charges/list", permission: "charges.view" },
        { title: "Interest Management", path: "/interest/list", permission: "interest.view" },
        { title: "Repayment Management", path: "/repayment/list", permission: "repayment.view" },
        { title: "Penalties Management", path: "/penalties", permission: "penalties.view" },
        { title: "Moratorium Management", path: "/moratorium", permission: "moratorium.view" },
      ],
    },

    { title: "Loan Improvement", icon: <Icons.FiRefreshCcw size={18} />, path: "/loan-improvement", permission: "loan_improvement.view" },
    { title: "Currency Management", icon: <HiCurrencyRupee size={18} />, path: "/currency-management", permission: "currency.view" },
    { title: "Concession Management", icon: <Icons.FiTag size={18} />, path: "/concession-management", permission: "concession.view" },

    {
      title: "Eligibility & Score",
      icon: <Icons.FiClipboard size={18} />,
      permission: "eligibility.view",
      submenu: [
        { title: "Eligibility Management", path: "/eligibility", permission: "eligibility.view" },
        { title: "Banking Management", path: "/banking", permission: "banking.view" },
        { title: "Obligation Management", path: "/obligation", permission: "obligation.view" },
        { title: "Score Card Management", path: "/score-card", permission: "score.view" },
      ],
    },

    {
      title: "Template Management",
      icon: <Icons.FiFileText size={18} />,
      permission: "template.view",
      submenu: [
        { title: "Predefine Template", path: "/predefine-template", permission: "template.predefine" },
        { title: "Customize Template", path: "/customize-template", permission: "template.customize" },
      ],
    },

    {
      title: "Bank & Fund",
      icon: <Icons.FiBriefcase size={18} />,
      permission: "bankfund.view",
      submenu: [
        { title: "Bank Management", path: "/bank-management", permission: "bank.view" },
        { title: "Fund Management", path: "/fund-management", permission: "fund.view" },
        { title: "Portfolio Management", path: "/portfolio-management", permission: "portfolio.view" },
        { title: "Mode Of Bank", path: "/mode-of-bank", permission: "mode.view" },
        { title: "Taxation Management", path: "/taxation-management", permission: "tax.view" },
        { title: "Business Model", path: "/business-model", permission: "business.view" },
      ],
    },

    {
      title: "Profile Management",
      icon: <Icons.FiUser size={18} />,
      permission: "profile_management.view",
      submenu: [
        { title: "Vendor Profile", path: "/vendor", permission: "vendor.view" },
        { title: "Agent Profile", path: "/profile-management/agent", permission: "agent.view" },
        { title: "Client Profile", path: "/profile-management/client", permission: "client.view" },
      ],
    },

    {
      title: "Agent Management",
      icon: <Icons.FiUsers size={18} />,
      permission: "agent.view",
      submenu: [
        { title: "Channel Partners", path: "/channel-partners", permission: "channel_partners.view" },
        { title: "Verification Agency", path: "/verification-agency", permission: "verification_agency.view" },
        { title: "Collection Agent", path: "/collection-agent", permission: "collection_agent.view" },
        { title: "Legal Agent", path: "/legal-agent", permission: "legal_agent.view" },
      ],
    },

    {
      title: "Controls Management",
      icon: <Icons.FiSettings size={18} />,
      permission: "controls.view",
      submenu: [
        { title: "Manage Language", path: "/controls/language", permission: "language.view" },
        { title: "Geo Location", path: "/controls/geo", permission: "geo.view" },
        { title: "Login Authentication", path: "/controls/login-auth", permission: "login_auth.view" },
        { title: "CoApplicant", path: "/controls/co-applicant", permission: "coapplicant.view" },
        { title: "Login Fee", path: "/controls/login-fees", permission: "loginfee.view" },
        { title: "Joint Applicant", path: "/controls/joint-applicant", permission: "joint_applicant.view" },
        { title: "References", path: "/controls/references", permission: "references.view" },
        { title: "Application Process", path: "/controls/application-process", permission: "application.view" },
        { title: "Score Card Rating", path: "/controls/score-card", permission: "scorecard.view" },
        { title: "Verification", path: "/controls/verification", permission: "verification.view" },
      ],
    },

    {
      title: "Rule Management",
      icon: <Icons.FiGitBranch size={18} />,
      permission: "rules.view",
      submenu: [
        { title: "Rule Master", path: "/rule-management/rule-master", permission: "rules.master" },
        { title: "Impact Values", path: "/rule-management/impact-values", permission: "rules.impact" },
        { title: "Client Profile Rules", path: "/rule-management/client-profile", permission: "rules.client" },
        { title: "Collateral Quality", path: "/rule-management/collateral-quality", permission: "rules.collateral" },
        { title: "Financial Eligibility", path: "/rule-management/financial-eligibility", permission: "rules.financial" },
        { title: "Score Card", path: "/rule-management/scorecard", permission: "rules.scorecard" },
        { title: "Risk & Mitigation", path: "/rule-management/risk-mitigation", permission: "rules.risk" },
        { title: "Verification Rules", path: "/rule-management/verification", permission: "rules.verification" },
      ],
    },

    // Add more menus (Documents, Risk, Disbursement, Collection, Provisioning) in the same format
    { title: "Audit & Security", icon: <Icons.FiShield size={18} />, path: "/audits", permission: "audit.view" },
    { title: "Reports & Analytics", icon: <Icons.FiBarChart2 size={18} />, path: "/reports", permission: "reports.view" },
    
  ];

  // --- State for open submenus dynamically ---
  const [openMenus, setOpenMenus] = useState(
    MENU.reduce((acc, item) => {
      if (item.submenu) {
        acc[item.title] = item.submenu.some((sub) => isActive(sub.path));
      }
      return acc;
    }, {})
  );

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // --- Filter menus by permissions ---
  const filteredMenu = MENU.filter(
    (item) =>
      !item.permission || hasPermission(item.permission) ||
      (item.submenu && item.submenu.some((sub) => hasPermission(sub.permission)))
  );

  return (
    <div
      className={`fixed md:static z-50 md:z-auto top-0 left-0 h-screen w-64 bg-white border-r transform transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } flex flex-col justify-between overflow-y-auto`}
    >
      {/* Overlay */}
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden" />}

      {/* TOP */}
      <div>
        <div className="p-6">
          <span className="text-xl font-semibold text-gray-900">Master Admin</span>
        </div>

        <nav className="px-3 space-y-1">
          {filteredMenu.map((item, idx) =>
            item.section ? (
              <p
                key={idx}
                className="mt-4 mb-2 px-3 text-xs font-semibold uppercase text-gray-500"
              >
                {item.section}
              </p>
            ) : item.submenu ? (
              <div key={idx}>
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${
                    openMenus[item.title]
                      ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-3">{item.icon} {item.title}</span>
                  {openMenus[item.title] ? <Icons.FiChevronUp /> : <Icons.FiChevronDown />}
                </button>
                {openMenus[item.title] && (
                  <div className="ml-6 space-y-1">
                    {item.submenu
                      .filter((sub) => hasPermission(sub.permission))
                      .map((sub, subIdx) => (
                        <Link
                          key={subIdx}
                          to={sub.path}
                          onClick={closeMobile}
                          className={menuItemStyle(sub.path)}
                        >
                          {sub.title}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={idx}
                to={item.path}
                onClick={closeMobile}
                className={menuItemStyle(item.path)}
              >
                {item.icon} {item.title}
              </Link>
            )
          )}
        </nav>
      </div>

      {/* LOGOUT */}
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition"
        >
          <Icons.FiLogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;



// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import * as Icons from "react-icons/fi";
// import { HiCurrencyRupee } from "react-icons/hi2";

// const Sidebar = ({ open, setOpen }) => {
//   const location = useLocation();

//   const closeMobile = () => {
//     if (window.innerWidth < 768) setOpen(false);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     window.location.href = "/login";
//   };

//   const isActive = (path) =>
//     location.pathname === path || location.pathname.startsWith(path);

//   const menuItemStyle = (path, isOpen = false) =>
//     `flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-all ${
//       isOpen || isActive(path)
//         ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
//         : "text-gray-700 hover:bg-gray-100"
//     } md:static md:pointer-events-auto`;

//   // ---------------- MENU CONFIG ----------------
//   const MENU = [
//     {
//       title: "Home",
//       icon: <Icons.FiHome size={18} />,
//       path: "/dashboard",
//     },
//     {
//       title: "Organizations",
//       icon: <Icons.FiGrid size={18} />,
//       path: "/organizations",
//     },
//     {
//       title: "Users",
//       icon: <Icons.FiUsers size={18} />,
//       path: "/users",
//     },
//     {
//       title: "Roles",
//       icon: <Icons.FiKey size={18} />,
//       path: "/roles",
//     },
//     {
//       title: "Subscription",
//       icon: <Icons.FiCreditCard size={18} />,
//       path: "/subscriptions",
//     },
//     {
//       section: "Master Data & Governance",
//     },
//     {
//       title: "Approval Master",
//       icon: <Icons.FiThumbsUp size={18} />,
//       submenu: [
//         { title: "Approvals", path: "/approvals" },
//         { title: "Manage Approvals", path: "/manage-approvals" },
//         { title: "Escalation", path: "/escalation" },
//       ],
//     },
//     {
//       title: "Product & Revenue",
//       icon: <Icons.FiBox size={18} />,
//       submenu: [
//         { title: "Product Management", path: "/product-management/list" },
//         { title: "Product Mix Management", path: "/product-mix/list" },
//         { title: "Fees Management", path: "/fees/list" },
//         { title: "Charges Management", path: "/charges/list" },
//         { title: "Interest Management", path: "/interest/list" },
//         { title: "Repayment Management", path: "/repayment/list" },
//         { title: "Penalties Management", path: "/penalties" },
//         { title: "Moratorium Management", path: "/moratorium" },
//       ],
//     },
//     {
//       title: "Loan Improvement",
//       icon: <Icons.FiRefreshCcw size={18} />,
//       path: "/loan-improvement",
//     },
//     {
//       title: "Currency Management",
//       icon: <HiCurrencyRupee size={18} />,
//       path: "/currency-management",
//     },
//     {
//       title: "Concession Management",
//       icon: <Icons.FiTag size={18} />,
//       path: "/concession-management",
//     },
//     {
//       title: "Eligibility & Score",
//       icon: <Icons.FiClipboard size={18} />,
//       submenu: [
//         { title: "Eligibility Management", path: "/eligibility" },
//         { title: "Banking Management", path: "/banking" },
//         { title: "Obligation Management", path: "/obligation" },
//         { title: "Score Card Management", path: "/score-card" },
//       ],
//     },
//     // ... Add all other sections similarly
//   ];

//   // State for all submenus
//   const [openSubmenus, setOpenSubmenus] = useState(() =>
//     MENU.map((item) => !!item.submenu && MENU.some((i) => location.pathname.startsWith(i.path)))
//   );

//   const toggleSubmenu = (index) => {
//     setOpenSubmenus((prev) => prev.map((v, i) => (i === index ? !v : v)));
//   };

//   // ---------------- RENDER ----------------
//   return (
//     <>
//       {open && (
//         <div
//           onClick={() => setOpen(false)}
//           className="fixed inset-0 bg-black/40 z-40 md:hidden"
//         />
//       )}

//       <div
//         className={`fixed md:static z-50 md:z-auto top-0 left-0 h-screen w-64 bg-white border-r transform transition-transform duration-300 ease-in-out ${
//           open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//         } flex flex-col justify-between overflow-y-auto`}
//       >
//         {/* TOP */}
//         <div>
//           <div className="p-6">
//             <span className="text-xl font-semibold text-gray-900">
//               Master Admin
//             </span>
//           </div>

//           <nav className="px-3 space-y-1">
//             {MENU.map((item, idx) =>
//               item.section ? (
//                 <p
//                   key={idx}
//                   className="mt-4 mb-2 px-3 text-xs font-semibold uppercase text-gray-500"
//                 >
//                   {item.section}
//                 </p>
//               ) : item.submenu ? (
//                 <div key={idx}>
//                   <button
//                     onClick={() => toggleSubmenu(idx)}
//                     className={menuItemStyle(item.path, openSubmenus[idx])}
//                   >
//                     <span className="flex items-center gap-3">
//                       {item.icon} {item.title}
//                     </span>
//                     {openSubmenus[idx] ? <Icons.FiChevronUp /> : <Icons.FiChevronDown />}
//                   </button>
//                   {openSubmenus[idx] && (
//                     <div className="ml-6 space-y-1">
//                       {item.submenu.map((sub, subIdx) => (
//                         <Link
//                           key={subIdx}
//                           to={sub.path}
//                           onClick={closeMobile}
//                           className={menuItemStyle(sub.path)}
//                         >
//                           {sub.title}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <Link
//                   key={idx}
//                   to={item.path}
//                   onClick={closeMobile}
//                   className={menuItemStyle(item.path)}
//                 >
//                   {item.icon} {item.title}
//                 </Link>
//               )
//             )}
//           </nav>
//         </div>

//         {/* LOGOUT */}
//         <div className="border-t p-4">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition"
//           >
//             <Icons.FiLogOut size={18} /> Logout
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;


// // import React, { useState } from "react";
// // import { Link, useLocation } from "react-router-dom";
// // import {
// //   FiHome,
// //   FiGrid,
// //   FiUsers,
// //   FiKey,
// //   FiBarChart2,
// //   FiShield,
// //   FiCreditCard,
// //   FiUserCheck,
// //   FiBriefcase,
// //   FiChevronDown,
// //   FiChevronUp,
// //   FiLogOut,
// //   FiBox,
// //   FiThumbsUp,
// //   FiLayers,
// //   FiClipboard,
// //   FiRefreshCcw,
// //   FiFolder,
// //   FiFileText,
// //   FiUser,
// //   FiUserX,
// //   FiDollarSign,
// //   FiSettings,
// //   FiTag,
// //   FiGitBranch,
// // } from "react-icons/fi";
// // import { HiCurrencyRupee } from "react-icons/hi2";

// // const Sidebar = ({ open, setOpen }) => {

// //   {open && (
// //   <div
// //     onClick={() => setOpen(false)}
// //     className="fixed inset-0 bg-black/40 z-40 md:hidden"
// //   />
// // )}

// // const closeMobile = () => {
// //   if (window.innerWidth < 768) setOpen(false);
// // };

// //   const location = useLocation();

// //   /* ---------------- STATE ---------------- */
// //   const [openApprovalMaster, setOpenApprovalMaster] = useState(
// //     location.pathname.startsWith("/approvals") ||
// //     location.pathname.startsWith("/manage-approvals") ||
// //     location.pathname.startsWith("/escalation")
// //   );

// //   const [openProductRevenue, setOpenProductRevenue] = useState(
// //     location.pathname.startsWith("/product") ||
// //     location.pathname.startsWith("/fees") ||
// //     location.pathname.startsWith("/charges") ||
// //     location.pathname.startsWith("/interest") ||
// //     location.pathname.startsWith("/repayment") ||
// //     location.pathname.startsWith("/penalties") ||
// //     location.pathname.startsWith("/moratorium")
// //   );

// //   const [openLoanImprovement, setOpenLoanImprovement] = useState(
// //     location.pathname.startsWith("/loan-improvement")
// //   );

// //   const [openEligibilityAndScore, setEligibilityAndScore] = useState(
// //     location.pathname.startsWith("/eligibility") ||
// //     location.pathname.startsWith("/banking") ||
// //     location.pathname.startsWith("/obligation") ||
// //     location.pathname.startsWith("/score-card")
// //   );

// //   const [openTemplateManagement, setTemplateManagement] = useState(
// //     location.pathname.startsWith("/predefined-template") ||
// //     location.pathname.startsWith("/customized-template")
// //   );

// //   const [openBankAndFundManagemnet, setBankAndFundManagement] = useState(
// //     location.pathname.startsWith("/bank-management") ||
// //     location.pathname.startsWith("/fund-management") ||
// //     location.pathname.startsWith("/portfolio-management") ||
// //     location.pathname.startsWith("/mode-of-bank") ||
// //     location.pathname.startsWith("/taxation-management") ||
// //     location.pathname.startsWith("/business-model")
// //   );

// //   const [openAgentManagement, setAgentManagement] = useState(
// //     location.pathname.startsWith("/channel-partners") ||
// //     location.pathname.startsWith("/verification-agency") ||
// //     location.pathname.startsWith("/collection-agent") ||
// //     location.pathname.startsWith("/legal-agent")
// //   );



// //   const PROFILE_MANAGEMENT_ROUTES = [
// //     "/profile-management",
// //     "/fund-management",
// //     "/portfolio-management",
// //     "/mode-of-bank",
// //     "/taxation-management",
// //     "/business-model",
// //   ];

// //   const [openProfileManagement, setProfileManagement] = useState(
// //     PROFILE_MANAGEMENT_ROUTES.some((route) =>
// //       location.pathname.startsWith(route)
// //     )
// //   );

// //   const CONTROL_MANAGEMENT_ROUTES = [
// //     "/controls/language",
// //     "/controls/geo",
// //     "/controls/login-auth",
// //     "/controls/co-applicant",
// //     "/controls/login-fees",
// //     "/controls/joint-applicant",
// //     "/controls/references",
// //     "/controls/application-process",
// //     "/controls/score-card",
// //     "/controls/verification",
// //   ];

// //   const [openControlManagement, setControlManagement] = useState(
// //     CONTROL_MANAGEMENT_ROUTES.some((route) =>
// //       location.pathname.startsWith(route)
// //     )
// //   );

// //   const RULE_MANAGEMENT_ROUTES = [
// //     "/rule-management",
// //     "/rule-management/rule-master",
// //     "/rule-management/impact-values",
// //     "/rule-management/client-profile",
// //     "/rule-management/collateral-quality",
// //     "/rule-management/financial-eligibility",
// //     "/rule-management/scorecard",
// //     "/rule-management/risk-mitigation",
// //     "/rule-management/verification",
// //   ];

// //   const [openRuleManagement, setOpenRuleManagement] = useState(
// //     RULE_MANAGEMENT_ROUTES.some((route) =>
// //       location.pathname.startsWith(route)
// //     )
// //   );



// //   /* ---------------- HELPERS ---------------- */
// //   const handleLogout = () => {
// //     localStorage.clear();
// //     sessionStorage.clear();
// //     window.location.href = "/login";
// //   };

// //   const isActive = (path) =>
// //     location.pathname === path || location.pathname.startsWith(path);

// // const menuItemStyle = (path) =>
// //   `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
// //     isActive(path)
// //       ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
// //       : "text-gray-700 hover:bg-gray-100"
// //   } md:static` + " md:pointer-events-auto";


// //   const productRevenueActive =
// //     location.pathname.startsWith("/product") ||
// //     location.pathname.startsWith("/fees") ||
// //     location.pathname.startsWith("/charges") ||
// //     location.pathname.startsWith("/interest") ||
// //     location.pathname.startsWith("/repayment") ||
// //     location.pathname.startsWith("/penalties") ||
// //     location.pathname.startsWith("/moratorium");

// //   const loanImprovementActive =
// //     location.pathname.startsWith("/loan-improvement");

// //   const currencyManagementActive =
// //     location.pathname.startsWith("/currency-management");

// //   const concessionManagementActive =
// //     location.pathname.startsWith("/concession-management");

// //   const [openDocumentManagement, setOpenDocumentManagement] = useState(
// //     location.pathname.startsWith("/documents")
// //   );

// //   const [openRiskMitigation, setOpenRiskMitigation] = useState(
// //     location.pathname.startsWith("/risk-management")
// //   );

// //   /* ---------------- DISBURSEMENT MANAGEMENT ---------------- */
// //   const [openDisbursementManagement, setOpenDisbursementManagement] = useState(
// //     location.pathname.startsWith("/disbursement-management")
// //   );
// //   /* ---------------- COLLECTION MANAGEMENT ---------------- */
// //   const [openCollectionManagement, setOpenCollectionManagement] = useState(
// //     location.pathname.startsWith("/collection-management")
// //   );

// //   // /* ---------------- PROVISIONING & CLASSIFICATION ---------------- */
// //   const [openProvisioning, setOpenProvisioning] = useState(
// //     location.pathname.startsWith("/provisioning-classification")
// //   );



// //   /* ---------------- RENDER ---------------- */
// //   return (
// // <div className={`
// //   fixed md:static z-50 md:z-auto
// //   top-0 left-0 h-screen w-64 bg-white border-r
// //   transform transition-transform duration-300 ease-in-out
// //   ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
// //   flex flex-col justify-between overflow-y-auto
// // `}>

// //       {/* TOP */}
// //       <div>
// //         {/* TITLE */}
// //         <div className="p-6">
// //           <span className="text-xl font-semibold text-gray-900">
// //             Master Admin
// //           </span>
// //         </div>

// //         {/* MENU */}
// //         <nav className="px-3 space-y-1">
// //           {/* MAIN */}
// //           <Link to="/dashboard" onClick={closeMobile} className={menuItemStyle("/dashboard")}>
// //             <FiHome size={18} /> Home
// //           </Link>

// //           <Link to="/organizations" className={menuItemStyle("/organizations")}>
// //             <FiGrid size={18} /> Organizations
// //           </Link>

// //           <Link to="/users" className={menuItemStyle("/users")}>
// //             <FiUsers size={18} /> Users
// //           </Link>

// //           <Link to="/roles" className={menuItemStyle("/roles")}>
// //             <FiKey size={18} /> Roles
// //           </Link>

// //           <Link to="/subscriptions" className={menuItemStyle("/subscriptions")}>
// //             <FiCreditCard size={18} /> Subscription
// //           </Link>

// //           {/* SECTION */}
// //           <p className="mt-4 mb-2 px-3 text-xs font-semibold uppercase text-gray-500">
// //             Master Data & Governance
// //           </p>



// //           {/* APPROVAL MASTER */}
// //           <button
// //             onClick={() => setOpenApprovalMaster((p) => !p)}
// //             className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${openApprovalMaster
// //               ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
// //               : "text-gray-700 hover:bg-gray-100"
// //               }`}
// //           >
// //             <span className="flex items-center gap-3">
// //               <FiThumbsUp size={18} /> Approval Master
// //             </span>
// //             {openApprovalMaster ? <FiChevronUp /> : <FiChevronDown />}
// //           </button>

// //           {openApprovalMaster && (
// //             <div className="ml-6 space-y-1">
// //               <Link to="/approvals" className={menuItemStyle("/approvals")}>
// //                 Approvals
// //               </Link>
// //               <Link
// //                 to="/manage-approvals"
// //                 className={menuItemStyle("/manage-approvals")}
// //               >
// //                 Manage Approvals
// //               </Link>
// //               <Link to="/escalation" className={menuItemStyle("/escalation")}>
// //                 Escalation
// //               </Link>
// //             </div>
// //           )}

// //           {/* PRODUCT & REVENUE */}
// //           <button
// //             onClick={() => setOpenProductRevenue((p) => !p)}
// //             className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${productRevenueActive
// //               ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
// //               : "text-gray-700 hover:bg-gray-100"
// //               }`}
// //           >
// //             <span className="flex items-center gap-3">
// //               <FiBox size={18} /> Product & Revenue
// //             </span>
// //             {openProductRevenue ? <FiChevronUp /> : <FiChevronDown />}
// //           </button>

// //           {openProductRevenue && (
// //             <div className="ml-6 space-y-1">
// //               <Link
// //                 to="/product-management/list"
// //                 className={menuItemStyle("/product-management")}
// //               >
// //                 Product Management
// //               </Link>
// //               <Link
// //                 to="/product-mix/list"
// //                 className={menuItemStyle("/product-mix")}
// //               >
// //                 Product Mix Management
// //               </Link>
// //               <Link to="/fees/list" className={menuItemStyle("/fees")}>
// //                 Fees Management
// //               </Link>
// //               <Link to="/charges/list" className={menuItemStyle("/charges")}>
// //                 Charges Management
// //               </Link>
// //               <Link to="/interest/list" className={menuItemStyle("/interest")}>
// //                 Interest Management
// //               </Link>
// //               <Link
// //                 to="/repayment/list"
// //                 className={menuItemStyle("/repayment")}
// //               >
// //                 Repayment Management
// //               </Link>
// //               <Link to="/penalties" className={menuItemStyle("/penalties")}>
// //                 Penalties Management
// //               </Link>
// //               <Link to="/moratorium" className={menuItemStyle("/moratorium")}>
// //                 Moratorium Management
// //               </Link>
// //             </div>
// //           )}

// //           {/* LOAN IMPROVEMENT */}
// //           <Link
// //             to="/loan-improvement"
// //             className={menuItemStyle("/loan-improvement")}
// //           >
// //             <FiRefreshCcw size={18} /> Loan Improvement
// //           </Link>

// //           {/* CURRENCY MANAGEMENT */}
// //           <Link
// //             to="/currency-management"
// //             className={menuItemStyle("/currency-management")}
// //           >
// //             <HiCurrencyRupee size={18} /> Currency Management
// //           </Link>

// //           {/* CONCESSION MANAGEMENT */}
// //           <Link
// //             to="/concession-management"
// //             className={menuItemStyle("/concession-management")}
// //           >
// //             <FiTag size={18} /> Concession Management
// //           </Link>

// //           {/* ELIGIBILITY & SCORE */}
// //           <button
// //             onClick={() => setEligibilityAndScore((p) => !p)}
// //             className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${openEligibilityAndScore
// //               ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
// //               : "text-gray-700 hover:bg-gray-100"
// //               }`}
// //           >
// //             <span className="flex items-center gap-3">
// //               <FiClipboard size={18} /> Eligibility & Score
// //             </span>
// //             {openEligibilityAndScore ? <FiChevronUp /> : <FiChevronDown />}
// //           </button>

// //           {openEligibilityAndScore && (
// //             <div className="ml-6 space-y-1">
// //               <Link to="/eligibility" className={menuItemStyle("/eligibility")}>
// //                 Eligibility Management
// //               </Link>
// //               <Link to="/banking" className={menuItemStyle("/banking")}>
// //                 Banking Management
// //               </Link>
// //               <Link to="/obligation" className={menuItemStyle("/obligation")}>
// //                 Obligation Management
// //               </Link>
// //               <Link to="/score-card" className={menuItemStyle("/score-card")}>
// //                 Score Card Management
// //               </Link>
// //             </div>
// //           )}

// //           {/* TEMPLATE */}
// //           <button
// //             onClick={() => setTemplateManagement((p) => !p)}
// //             className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${openTemplateManagement
// //               ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
// //               : "text-gray-700 hover:bg-gray-100"
// //               }`}
// //           >
// //             <span className="flex items-center gap-3">
// //               <FiFileText size={18} /> Template Management
// //             </span>
// //             {openTemplateManagement ? <FiChevronUp /> : <FiChevronDown />}
// //           </button>

// //           {openTemplateManagement && (
// //             <div className="ml-6 space-y-1">
// //               <Link
// //                 to="/predefine-template"
// //                 className={menuItemStyle("/predefine-template")}
// //               >
// //                 Predefine Template
// //               </Link>
// //               <Link
// //                 to="/customize-template"
// //                 className={menuItemStyle("/customize-template")}
// //               >
// //                 Customize Template
// //               </Link>
// //             </div>
// //           )}

// //           {/* Bank&Fund */}
// //           <button
// //             onClick={() => setBankAndFundManagement((p) => !p)}
// //             className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${openBankAndFundManagemnet
// //               ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
// //               : "text-gray-700 hover:bg-gray-100"
// //               }`}
// //           >
// //             <span className="flex items-center gap-3">
// //               <FiBriefcase size={18} /> Bank & Fund
// //             </span>
// //             {openBankAndFundManagemnet ? <FiChevronUp /> : <FiChevronDown />}
// //           </button>

// //           {openBankAndFundManagemnet && (
// //             <div className="ml-6 space-y-1">
// //               <Link
// //                 to="/bank-management"
// //                 className={menuItemStyle("/bank-management")}
// //               >
// //                 Bank Management
// //               </Link>
// //               <Link
// //                 to="/fund-management"
// //                 className={menuItemStyle("/fund-management")}
// //               >
// //                 Fund Management
// //               </Link>
// //               <Link
// //                 to="/portfolio-management"
// //                 className={menuItemStyle("/portfolio-management")}
// //               >
// //                 Portfolio Management
// //               </Link>
// //               <Link
// //                 to="/mode-of-bank"
// //                 className={menuItemStyle("/mode-of-bank")}
// //               >
// //                 Mode Of Bank
// //               </Link>
// //               <Link
// //                 to="/taxation-management"
// //                 className={menuItemStyle("/taxation-management")}
// //               >
// //                 Taxation Management
// //               </Link>
// //               <Link
// //                 to="/business-model"
// //                 className={menuItemStyle("/business-model")}
// //               >
// //                 Business Model
// //               </Link>
// //             </div>
// //           )}

// //           {/* Profile Management */}
// //           <button
// //             onClick={() => setProfileManagement((p) => !p)}
// //             className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${openProfileManagement
// //               ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
// //               : "text-gray-700 hover:bg-gray-100"
// //               }`}
// //           >
// //             <span className="flex items-center gap-3">
// //               <FiUser size={18} /> Profile Management
// //             </span>
// //             {openProfileManagement ? <FiChevronUp /> : <FiChevronDown />}
// //           </button>

// //           {openProfileManagement && (
// //             <div className="ml-6 space-y-1">
// //               {/* Vendor / Agent / Client */}
// //               <Link
// //                 to="/profile-management/vendor"
// //                 className={menuItemStyle("/profile-management/vendor")}
// //               >
// //                 Vendor Profile
// //               </Link>

// //               <Link
// //                 to="/profile-management/agent"
// //                 className={menuItemStyle("/profile-management/agent")}
// //               >
// //                 Agent Profile
// //               </Link>

// //               <Link
// //                 to="/profile-management/client"
// //                 className={menuItemStyle("/profile-management/client")}
// //               >
// //                 Client Profile
// //               </Link>

// //             </div>
// //           )}


// //           {/* Agent Management */}
// //           <button
// //             onClick={() => setAgentManagement((p) => !p)}
// //             className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${openAgentManagement
// //               ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
// //               : "text-gray-700 hover:bg-gray-100"
// //               }`}
// //           >
// //             <span className="flex items-center gap-3">
// //               <FiUsers size={18} /> Agent Management
// //             </span>
// //             {openAgentManagement ? <FiChevronUp /> : <FiChevronDown />}
// //           </button>

// //           {openAgentManagement && (
// //             <div className="ml-6 space-y-1">
// //               {/* Vendor / Agent / Client */}
// //               <Link
// //                 to="/channel-partners"
// //                 className={menuItemStyle("/channel-partners")}
// //               >
// //                 Channel Partners
// //               </Link>

// //               <Link
// //                 to="/verification-agency"
// //                 className={menuItemStyle("/verification-agency")}
// //               >
// //                 Verification Agency
// //               </Link>

// //               <Link
// //                 to="/collection-agent"
// //                 className={menuItemStyle("/collection-agent")}
// //               >
// //                 Collection Agent
// //               </Link>

// //               <Link
// //                 to="/legal-agent"
// //                 className={menuItemStyle("/legal-agent")}
// //               >
// //                 Legal Agent
// //               </Link>

// //             </div>
// //           )}

// //           {/* Controls Management */}
// //           <button
// //             onClick={() => setControlManagement((p) => !p)}
// //             className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${openControlManagement
// //               ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
// //               : "text-gray-700 hover:bg-gray-100"
// //               }`}
// //           >
// //             <span className="flex items-center gap-3">
// //               <FiSettings size={18} /> Controls Management
// //             </span>
// //             {openControlManagement ? <FiChevronUp /> : <FiChevronDown />}
// //           </button>

// //           {openControlManagement && (
// //             <div className="ml-6 space-y-1">

// //               <Link
// //                 to="/controls/language"
// //                 className={menuItemStyle("/controls/language")}
// //               >
// //                 Manage Language
// //               </Link>

// //               <Link
// //                 to="/controls/geo"
// //                 className={menuItemStyle("/controls/geo")}
// //               >
// //                 Geo Location
// //               </Link>

// //               <Link
// //                 to="/controls/login-auth"
// //                 className={menuItemStyle("/controls/login-auth")}
// //               >
// //                 Login Authentication
// //               </Link>


// //               <Link
// //                 to="/controls/co-applicant"
// //                 className={menuItemStyle("/controls/co-applicant")}
// //               >
// //                 CoApplicant
// //               </Link>

// //               <Link
// //                 to="/controls/login-fees"
// //                 className={menuItemStyle("/controls/login-fees")}
// //               >
// //                 Login Fee
// //               </Link>

// //               <Link
// //                 to="/controls/joint-applicant"
// //                 className={menuItemStyle("/controls/joint-applicant")}
// //               >
// //                 Joint Applicant
// //               </Link>

// //               <Link
// //                 to="/controls/references"
// //                 className={menuItemStyle("/controls/references")}
// //               >
// //                 References
// //               </Link>

// //               <Link
// //                 to="/controls/application-process"
// //                 className={menuItemStyle("/controls/application-process")}
// //               >
// //                 Application Process
// //               </Link>

// //               <Link
// //                 to="/controls/score-card"
// //                 className={menuItemStyle("/controls/score-card")}
// //               >
// //                 Score Card Rating
// //               </Link>

// //               <Link
// //                 to="/controls/verification"
// //                 className={menuItemStyle("/controls/verification")}
// //               >
// //                 Verification
// //               </Link>

// //             </div>
// //           )}

// //           {/* Rule Management */}
// //           <button
// //             onClick={() => setOpenRuleManagement((p) => !p)}
// //             className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${openRuleManagement
// //               ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
// //               : "text-gray-700 hover:bg-gray-100"
// //               }`}
// //           >
// //             <span className="flex items-center gap-3">
// //               <FiGitBranch size={18} /> Rule Management
// //             </span>
// //             {openRuleManagement ? <FiChevronUp /> : <FiChevronDown />}
// //           </button>

// //           {openRuleManagement && (
// //             <div className="ml-6 space-y-1">

// //               <Link
// //                 to="/rule-management/rule-master"
// //                 className={menuItemStyle("/rule-management/rule-master")}
// //               >
// //                 Rule Master
// //               </Link>

// //               <Link
// //                 to="/rule-management/impact-values"
// //                 className={menuItemStyle("/rule-management/impact-values")}
// //               >
// //                 Impact Values
// //               </Link>

// //               <Link
// //                 to="/rule-management/client-profile"
// //                 className={menuItemStyle("/rule-management/client-profile")}
// //               >
// //                 Client Profile Rules
// //               </Link>

// //               <Link
// //                 to="/rule-management/collateral-quality"
// //                 className={menuItemStyle("/rule-management/collateral-quality")}
// //               >
// //                 Collateral Quality
// //               </Link>

// //               <Link
// //                 to="/rule-management/financial-eligibility"
// //                 className={menuItemStyle("/rule-management/financial-eligibility")}
// //               >
// //                 Financial Eligibility
// //               </Link>

// //               <Link
// //                 to="/rule-management/scorecard"
// //                 className={menuItemStyle("/rule-management/scorecard")}
// //               >
// //                 Score Card
// //               </Link>

// //               <Link
// //                 to="/rule-management/risk-mitigation"
// //                 className={menuItemStyle("/rule-management/risk-mitigation")}
// //               >
// //                 Risk & Mitigation
// //               </Link>

// //               <Link
// //                 to="/rule-management/verification"
// //                 className={menuItemStyle("/rule-management/verification")}
// //               >
// //                 Verification Rules
// //               </Link>

// //             </div>
// //           )}



// //           {/* DOCUMENT MANAGEMENT */}
// //           <button
// //             onClick={() => setOpenDocumentManagement((p) => !p)}
// //             className={`
// //     flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all
// //     ${location.pathname.startsWith("/documents")
// //                 ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
// //                 : "text-gray-700 hover:bg-gray-100"
// //               }
// //   `}
// //           >
// //             <span className="flex items-center gap-3">
// //               <FiFolder size={18} />
// //               Document
// //             </span>
// //             {openDocumentManagement ? <FiChevronUp /> : <FiChevronDown />}
// //           </button>

// //           {openDocumentManagement && (
// //             <div className="ml-6 mt-1 space-y-1">
// //               <Link
// //                 to="/documents/sanction"
// //                 className={menuItemStyle("/documents/sanction")}
// //               >
// //                 Sanction Documents
// //               </Link>

// //               <Link
// //                 to="/documents/loan"
// //                 className={menuItemStyle("/documents/loan")}
// //               >
// //                 Loan Documents
// //               </Link>

// //               <Link
// //                 to="/documents/collateral"
// //                 className={menuItemStyle("/documents/collateral")}
// //               >
// //                 Collateral Documents
// //               </Link>
// //             </div>
// //           )}
// //           {/* RISK & MITIGATION */}
// //           <button
// //             onClick={() => setOpenRiskMitigation((p) => !p)}
// //             className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${location.pathname.startsWith("/risk-management")
// //               ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
// //               : "text-gray-700 hover:bg-gray-100"
// //               }`}
// //           >
// //             <span className="flex items-center gap-3">
// //               <FiShield size={18} /> Risk & Mitigation
// //             </span>
// //             {openRiskMitigation ? <FiChevronUp /> : <FiChevronDown />}
// //           </button>

// //           {openRiskMitigation && (
// //             <div className="ml-6 space-y-1">
// //               <Link
// //                 to="/risk-management/risks"
// //                 className={menuItemStyle("/risk-management/risks")}
// //               >
// //                 Risk Management
// //               </Link>

// //               <Link
// //                 to="/risk-management/mitigation"
// //                 className={menuItemStyle("/risk-management/mitigation")}
// //               >
// //                 Risk Mitigation
// //               </Link>

// //               <Link
// //                 to="/risk-management/deviations"
// //                 className={menuItemStyle("/risk-management/deviations")}
// //               >
// //                 Deviation Management
// //               </Link>

// //               <Link
// //                 to="/risk-management/rcu"
// //                 className={menuItemStyle("/risk-management/rcu")}
// //               >
// //                 Risk Containment Unit (RCU)
// //               </Link>

// //               <Link
// //                 to="/risk-management/fraud"
// //                 className={menuItemStyle("/risk-management/fraud")}
// //               >
// //                 Fraud Management
// //               </Link>

// //               <Link
// //                 to="/risk-management/portfolio-limits"
// //                 className={menuItemStyle("/risk-management/portfolio-limits")}
// //               >
// //                 Portfolio Limits
// //               </Link>

// //               <Link
// //                 to="/risk-management/default-limits"
// //                 className={menuItemStyle("/risk-management/default-limits")}
// //               >
// //                 Default Limits
// //               </Link>

// //               <Link
// //                 to="/risk-management/others"
// //                 className={menuItemStyle("/risk-management/others")}
// //               >
// //                 Others (Custom Rules)
// //               </Link>
// //             </div>
// //           )}

// //           {/* DISBURSEMENT MANAGEMENT */}
// //           <button
// //             onClick={() => setOpenDisbursementManagement(p => !p)}
// //             className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${location.pathname.startsWith("/disbursement-management")
// //               ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
// //               : "text-gray-700 hover:bg-gray-100"
// //               }`}
// //           >
// //             <span className="flex items-center gap-3">
// //               <FiDollarSign size={18} /> Disbursement
// //             </span>
// //             {openDisbursementManagement ? <FiChevronUp /> : <FiChevronDown />}
// //           </button>

// //           {openDisbursementManagement && (
// //             <div className="ml-6 space-y-1">
// //               <Link to="/disbursement-management/disbursement" className={menuItemStyle("/disbursement-management/disbursement")}>
// //                 Disbursement Master
// //               </Link>
// //               <Link to="/disbursement-management/agency" className={menuItemStyle("/disbursement-management/agency")}>
// //                 Agency Master
// //               </Link>
// //               <Link to="/disbursement-management/document" className={menuItemStyle("/disbursement-management/document")}>
// //                 Documents Master
// //               </Link>
// //               <Link to="/disbursement-management/frequency" className={menuItemStyle("/disbursement-management/frequency")}>
// //                 Frequency Master
// //               </Link>
// //               <Link to="/disbursement-management/down-payment" className={menuItemStyle("/disbursement-management/down-payment")}>
// //                 Down Payment Master
// //               </Link>
// //               <Link to="/disbursement-management/stage" className={menuItemStyle("/disbursement-management/stage")}>
// //                 Stage Master
// //               </Link>
// //               <Link to="/disbursement-management/third-party" className={menuItemStyle("/disbursement-management/third-party")}>
// //                 Third Party Master
// //               </Link>
// //             </div>
// //           )}

// //           {/* COLLECTION MANAGEMENT */}
// //           <button
// //             onClick={() => setOpenCollectionManagement(p => !p)}
// //             className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${location.pathname.startsWith("/collection-management")
// //               ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
// //               : "text-gray-700 hover:bg-gray-100"
// //               }`}
// //           >
// //             <span className="flex items-center gap-3">
// //               <FiLayers size={18} /> Collection Management
// //             </span>
// //             {openCollectionManagement ? <FiChevronUp /> : <FiChevronDown />}
// //           </button>

// //           {openCollectionManagement && (
// //             <div className="ml-6 space-y-1">
// //               <Link to="/collection-management/payment-gateways" className={menuItemStyle("/collection-management/payment-gateways")}>
// //                 Payment Gateways
// //               </Link>
// //               <Link to="/collection-management/controls" className={menuItemStyle("/collection-management/controls")}>
// //                 Collection Controls
// //               </Link>
// //               <Link to="/collection-management/client-team-mapping/add" className={menuItemStyle("/collection-management/client-team-mapping")}>
// //                 Client–Team Mapping
// //               </Link>
// //               <Link to="/collection-management/client-agent-mapping/add" className={menuItemStyle("/collection-management/client-agent-mapping")}>
// //                 Client–Agent Mapping
// //               </Link>
// //               <Link to="/collection-management/payouts/add" className={menuItemStyle("/collection-management/payouts")}>
// //                 Payout Management
// //               </Link>
// //             </div>
// //           )}

// //           <button
// //             onClick={() => setOpenProvisioning(p => !p)}
// //             className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-all ${location.pathname.startsWith("/provisioning-classification")
// //               ? "bg-[#E8F1FF] text-[#0A66FF] font-medium"
// //               : "text-gray-700 hover:bg-gray-100"
// //               }`}
// //           >
// //             <span className="flex items-center gap-3">
// //               <FiLayers size={18} /> Provisioning & Classification
// //             </span>
// //             {openProvisioning ? <FiChevronUp /> : <FiChevronDown />}
// //           </button>

// //           {openProvisioning && (
// //             <div className="ml-6 mt-1 space-y-1">

// //               <Link
// //                 to="/provisioning-classification/loan-classification"
// //                 className={menuItemStyle("/provisioning-classification/loan-classification")}
// //               >
// //                 Loan Classification
// //               </Link>

// //               <Link
// //                 to="/provisioning-classification/writeoff"
// //                 className={menuItemStyle("/provisioning-classification/writeoff")}
// //               >
// //                 Write-off Rules
// //               </Link>

// //               <Link
// //                 to="/provisioning-classification/settlement"
// //                 className={menuItemStyle("/provisioning-classification/settlement")}
// //               >
// //                 Settlement Rules
// //               </Link>

// //               <Link
// //                 to="/provisioning-classification/provisioning-npa"
// //                 className={menuItemStyle("/provisioning-classification/provisioning-npa")}
// //               >
// //                 Provisioning & NPA
// //               </Link>

// //               <Link
// //                 to="/provisioning-classification/incentive-management"
// //                 className={menuItemStyle("/provisioning-classification/incentive-management")}
// //               >
// //                 Incentive Management
// //               </Link>

// //             </div>
// //           )}



// //           <Link to="/audits" className={menuItemStyle("/audits")}>
// //             <FiShield size={18} /> Audit & Security
// //           </Link>

// //           <Link to="/reports" className={menuItemStyle("/reports")}>
// //             <FiBarChart2 size={18} /> Reports & Analytics
// //           </Link>

// //           {/* USER MASTER */}
// //           <p className="mt-4 mb-2 px-3 text-xs font-semibold uppercase text-gray-500">
// //             User Master
// //           </p>

// //           <Link
// //             to="/employment-types"
// //             className={menuItemStyle("/employment-types")}
// //           >
// //             <FiUserCheck size={18} /> Employment Types
// //           </Link>

// //           <Link
// //             to="/occupation-types"
// //             className={menuItemStyle("/occupation-types")}
// //           >
// //             <FiBriefcase size={18} /> Occupation Types
// //           </Link>
// //         </nav>
// //       </div>

// //       {/* LOGOUT */}
// //       <div className="border-t p-4">
// //         <button
// //           onClick={handleLogout}
// //           className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition"
// //         >
// //           <FiLogOut size={18} /> Logout
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Sidebar;
