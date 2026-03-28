import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";



import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";

// ✅ 1. Import the Dispatcher for Role-Based Routing
import DashboardDispatcher from "./components/DashboardDispatcher.jsx";

// Core Pages
import Dashboard from "./pages/Dashboard.jsx"; // Generic Dashboard (Admin view)
import Branches from "./pages/Branches.jsx";
import Loans from "./pages/Loans.jsx"; // Loan Products
import LoanApplications from "./pages/LoanApplications.jsx";
import PersonalLoanApplicationWizard from "./pages/PersonalLoanApplicationWizard.jsx";
import AddBusiness from "./pages/AddBusiness.jsx";

// ⭐ PHASE 5: CRM & LEADS
import Leads from "./pages/Leads.jsx";
import Campaigns from "./pages/Campaigns.jsx";
import AddLead from "./pages/AddLead.jsx";

// ⭐ PHASE 4: RISK ENGINE
import RiskEngine from "./pages/RiskEngine.jsx";

// ⭐ PHASE 7: GOVERNANCE & DISBURSEMENT
import EscalationRules from "./pages/EscalationRules.jsx";
import MandateManagement from "./pages/MandateManagement.jsx";
import DisbursementQueue from "./pages/DisbursementQueue.jsx";

// ⭐ PHASE 8: COLLECTIONS & LMS
import Collections from "./pages/Collections.jsx";
import LoanAccount from "./pages/LoanAccountDetails.jsx"; // ✅ Added Loan Account View
import LoanAccountsList from "./pages/LoanAccountList.jsx";

// ⭐ PHASE 9: SUPPORT & TRAINING
import Support from "./pages/SupportTickets.jsx"; // ✅ Added Support
import Training from "./pages/Training.jsx"; // ✅ Added Training

// Admin & Settings Pages
import Logs from "./pages/Logs.jsx";
import Calendar from "./pages/Calendar.jsx";
import RolesPermissions from "./pages/RolesPermissions.jsx";
import Users from "./pages/Users.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";
import Notifications from "./pages/Notifications.jsx";
import InternalTeamDashboards from "./pages/InternalTeamDashboards.jsx";
import Rules from "./pages/Rules.jsx";
import Categories from "./pages/Categories.jsx";
import Reports from "./pages/Reports.jsx";
import ChannelPartners from "./pages/ChannelPartners.jsx";
import ApiProviders from "./pages/ApiProviders.jsx"; // ✅ NEW: API Providers
import MySubscription from "./pages/MySubscription.jsx";
import ThirdPartyUsers from "./pages/ThirdPartyUsers.jsx";

// Auth Pages
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import SendLink from "./pages/SendLink.jsx";
import LoanAccountDetails from "./pages/LoanAccountDetails.jsx";
import SubscriptionPlans from "./pages/SubscriptionPlans.jsx";

// ------------------------------------------------------
// MAIN CONTENT WRAPPER
// ------------------------------------------------------
function AppContent() {
  const location = useLocation();
  // Basic auth check logic
  const isLoggedIn = () => !!localStorage.getItem("access");
  
  // Routes that don't show sidebar/header
  const noLayoutRoutes = [
    "/login", 
    "/signup", 
    "/forgot_password", 
    "/sendlink",
    "/subscription-plans" // ✅ Added subscription plans to no-layout routes
  ];
  
  const shouldShowLayout =
    isLoggedIn() && !noLayoutRoutes.includes(location.pathname);

  return (
    <div className="h-full bg-gray-50 flex text-gray-900">
      {shouldShowLayout && (
        <>
          <Sidebar />
          <Header />
        </>
      )}

      <main className={shouldShowLayout ? "lg:ml-64 pt-28 lg:pt-16 w-full min-h-screen" : "w-full min-h-screen"}>
        <Routes>
          {/* ---------------- AUTH ROUTES ---------------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/sendlink" element={<SendLink />} />

          {/* ✅ SUBSCRIPTION PLANS ROUTE (No Sidebar/Header) */}
          <Route 
            path="/subscription-plans" 
            element={
              isLoggedIn() ? <SubscriptionPlans /> : <Navigate to="/login" />
            } 
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* ---------------- PROTECTED ROUTES ---------------- */}

          {/* ✅ 2. REPLACED: Original hardcoded Dashboard with Dispatcher 
              This allows the URL '/dashboard' to render different views based on role 
          */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn() ? <DashboardDispatcher /> : <Navigate to="/login" />
            }
          />

          {/* ⭐ PHASE 5: CRM (LEADS & CAMPAIGNS) */}
          <Route
            path="/leads"
            element={isLoggedIn() ? <Leads /> : <Navigate to="/login" />}
          />
          <Route
            path="/leads/new"
            element={isLoggedIn() ? <AddLead /> : <Navigate to="/login" />}
          />
          <Route
            path="/campaigns"
            element={isLoggedIn() ? <Campaigns /> : <Navigate to="/login" />}
          />

          {/* ⭐ PHASE 4: RISK ENGINE */}
          <Route
            path="/risk-engine"
            element={isLoggedIn() ? <RiskEngine /> : <Navigate to="/login" />}
          />

          {/* ⭐ PHASE 7: GOVERNANCE & MANDATES */}
          <Route
            path="/escalation-rules"
            element={
              isLoggedIn() ? <EscalationRules /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/mandates"
            element={
              isLoggedIn() ? <MandateManagement /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/loan-accounts"
            element={
              isLoggedIn() ? <LoanAccountsList /> : <Navigate to="/login" />
            }
          />

          {/* ⭐ EXISTING: LOAN APPLICATIONS (LOS) */}
          <Route
            path="/loan-applications"
            element={
              isLoggedIn() ? <LoanApplications /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/loan-applications/new-personal-loan"
            element={
              isLoggedIn() ? (
                <PersonalLoanApplicationWizard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          <Route
            path="/loan-applications/new/:productId"
            element={
              isLoggedIn() ? (
                <PersonalLoanApplicationWizard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* ⭐ PHASE 7a: DISBURSEMENT QUEUE */}
          <Route
            path="/disbursements"
            element={
              isLoggedIn() ? <DisbursementQueue /> : <Navigate to="/login" />
            }
          />

          {/* ⭐ PHASE 8: COLLECTIONS & LMS */}
          <Route
            path="/collections"
            element={isLoggedIn() ? <Collections /> : <Navigate to="/login" />}
          />
          {/* Dynamic route for specific loan account details */}
          <Route
            path="/loan-account/:id"
            element={
              isLoggedIn() ? <LoanAccountDetails /> : <Navigate to="/login" />
            }
          />
          {/* Temporary list view for Loan Accounts (can reuse Loans or a new page) */}

          {/* ⭐ PHASE 9: SUPPORT & TRAINING */}
          <Route
            path="/support"
            element={isLoggedIn() ? <Support /> : <Navigate to="/login" />}
          />
          <Route
            path="/training"
            element={isLoggedIn() ? <Training /> : <Navigate to="/login" />}
          />

          {/* --- Other Tenant Modules --- */}
          <Route
            path="/add-business"
            element={isLoggedIn() ? <AddBusiness /> : <Navigate to="/login" />}
          />

          <Route
            path="/my-subscription"
            element={
              isLoggedIn() ? <MySubscription /> : <Navigate to="/login" />
            }
          />

          {/* ⭐ CHANNEL PARTNERS - Updated Routes */}
          <Route
            path="/channel-partners"
            element={<Navigate to="/channel-partners/sales" replace />}
          />
          <Route
            path="/channel-partners/sales"
            element={
              isLoggedIn() ? <ChannelPartners /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/channel-partners/api-providers"
            element={
              isLoggedIn() ? <ApiProviders /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/third-party-users"
            element={
              isLoggedIn() ? <ThirdPartyUsers /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/branches"
            element={isLoggedIn() ? <Branches /> : <Navigate to="/login" />}
          />

          <Route
            path="/loans"
            element={isLoggedIn() ? <Loans /> : <Navigate to="/login" />}
          />

          <Route
            path="/logs"
            element={isLoggedIn() ? <Logs /> : <Navigate to="/login" />}
          />

          <Route
            path="/calendar"
            element={isLoggedIn() ? <Calendar /> : <Navigate to="/login" />}
          />

          <Route
            path="/roles_permissions"
            element={
              isLoggedIn() ? <RolesPermissions /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/users"
            element={isLoggedIn() ? <Users /> : <Navigate to="/login" />}
          />

          <Route
            path="/settings"
            element={isLoggedIn() ? <Settings /> : <Navigate to="/login" />}
          />

          <Route
            path="/profile"
            element={isLoggedIn() ? <Profile /> : <Navigate to="/login" />}
          />

          <Route
            path="/notifications"
            element={
              isLoggedIn() ? <Notifications /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/internal-team-dashboards"
            element={
              isLoggedIn() ? (
                <InternalTeamDashboards />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/rules-config"
            element={isLoggedIn() ? <Rules /> : <Navigate to="/login" />}
          />

          <Route
            path="/categories"
            element={isLoggedIn() ? <Categories /> : <Navigate to="/login" />}
          />

          <Route
            path="/reports"
            element={isLoggedIn() ? <Reports /> : <Navigate to="/login" />}
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
