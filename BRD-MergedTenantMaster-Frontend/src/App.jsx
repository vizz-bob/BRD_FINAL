import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute";

// Layout Components
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";

// --- TENANT PAGES ---
import TenantDashboard from "./pages/tenant/Dashboard.jsx";
import Branches from "./pages/tenant/Branches.jsx";
import Loans from "./pages/tenant/Loans.jsx";
import LoanApplications from "./pages/tenant/LoanApplications.jsx";
import PersonalLoanApplicationWizard from "./pages/tenant/PersonalLoanApplicationWizard.jsx";
import AddBusiness from "./pages/tenant/AddBusiness.jsx";
import Leads from "./pages/tenant/Leads.jsx";
import Campaigns from "./pages/tenant/Campaigns.jsx";
import AddLead from "./pages/tenant/AddLead.jsx";
import RiskEngine from "./pages/tenant/RiskEngine.jsx";
import EscalationRules from "./pages/tenant/EscalationRules.jsx";
import MandateManagement from "./pages/tenant/MandateManagement.jsx";
import DisbursementQueue from "./pages/tenant/DisbursementQueue.jsx";
import Collections from "./pages/tenant/Collections.jsx";
import Support from "./pages/tenant/SupportTickets.jsx";
import Training from "./pages/tenant/Training.jsx";
import Calendar from "./pages/tenant/Calendar.jsx";
import RolesPermissions from "./pages/tenant/RolesPermissions.jsx";
import Users from "./pages/tenant/Users.jsx";
import Profile from "./pages/tenant/Profile.jsx";
import InternalTeamDashboards from "./pages/tenant/InternalTeamDashboards.jsx";
import Rules from "./pages/tenant/Rules.jsx";
import Categories from "./pages/tenant/Categories.jsx";
import ChannelPartners from "./pages/tenant/ChannelPartners.jsx";
import ApiProviders from "./pages/tenant/ApiProviders.jsx";
import MySubscription from "./pages/tenant/MySubscription.jsx";
import ThirdPartyUsers from "./pages/tenant/ThirdPartyUsers.jsx";
import ActiveLoans from "./pages/tenant/ActiveLoans.jsx";
import KnowledgeBase from "./pages/tenant/KnowledgeBase.jsx";
import SubscriptionPlans from "./pages/tenant/SubscriptionPlans.jsx";
import TenantRoles from "./pages/tenant/Roles.jsx";

// --- MASTER PAGES (Restored) ---
import MasterDashboard from "./pages/master/Dashboard.jsx";
import OrganizationList from "./pages/master/organization/OrganizationList.jsx";
import MasterUserList from "./pages/master/Users/UserList.jsx";
import MasterRoleList from "./pages/master/roles/RoleList.jsx";

// --- MASTER PAGES ---
import MasterSubscriptionPage from "./pages/master/subscription/SubscriptionPage";
import ApprovalList from "./pages/master/approvalMaster/ApprovalList";
import AddApproval from "./pages/master/approvalMaster/AddApproval";
import EditApproval from "./pages/master/approvalMaster/EditApproval";
import ApprovalView from "./pages/master/approvalMaster/ApprovalView";
import { ManageApprovalPage } from "./pages/master/approvalMaster/ManageApprovalPage";
import { EscalationPage } from "./pages/master/approvalMaster/EscalationPage";

import ProductList from "./pages/master/productManagement/product/ProductList";
import AddProduct from "./pages/master/productManagement/product/AddProduct";
import EditProduct from "./pages/master/productManagement/product/EditProduct";
import ViewProduct from "./pages/master/productManagement/product/ViewProduct";

import ProductMixList from "./pages/master/productManagement/productMixer/ProductMixList";
import AddProductMix from "./pages/master/productManagement/productMixer/AddProductMix";
import EditProductMix from "./pages/master/productManagement/productMixer/EditProductMix";

import FeeList from "./pages/master/productManagement/fees/FeeList";
import AddFees from "./pages/master/productManagement/fees/AddFees";
import EditFees from "./pages/master/productManagement/fees/EditFees";

import ChargeList from "./pages/master/productManagement/chargeManagement/ChargeList";
import AddCharge from "./pages/master/productManagement/chargeManagement/AddCharge";
import EditCharge from "./pages/master/productManagement/chargeManagement/EditCharge";
import ChargeDetail from "./pages/master/productManagement/chargeManagement/ChargeDetail";

import InterestList from "./pages/master/productManagement/interestManagement/InterestList";
import AddInterest from "./pages/master/productManagement/interestManagement/AddInterest";
import EditInterest from "./pages/master/productManagement/interestManagement/EditInterest";
import InterestDetail from "./pages/master/productManagement/interestManagement/InterestDetail";

import RepaymentList from "./pages/master/productManagement/repaymentManagement/RepaymentList";
import AddRepayment from "./pages/master/productManagement/repaymentManagement/AddRepayment";
import EditRepayment from "./pages/master/productManagement/repaymentManagement/EditRepayment";
import RepaymentDetail from "./pages/master/productManagement/repaymentManagement/RepaymentDetail";

import PenaltyList from "./pages/master/productManagement/penaltyManagement/PenaltyList";
import AddPenalty from "./pages/master/productManagement/penaltyManagement/AddPenalty";
import EditPenalty from "./pages/master/productManagement/penaltyManagement/EditPenalty";
import PenaltyDetail from "./pages/master/productManagement/penaltyManagement/PenaltyDetail";

import MoratoriumList from "./pages/master/productManagement/moratiumManagment/MoratoriumList";
import AddMoratorium from "./pages/master/productManagement/moratiumManagment/AddMoratorium";
import EditMoratorium from "./pages/master/productManagement/moratiumManagment/EditMoratorium";
import MoratoriumDetail from "./pages/master/productManagement/moratiumManagment/MoratoriumDetail";

import LoanImprovementDashboard from "./pages/master/loanImproveManagement/LoanImprovementDashboard";
import LoanImprovementList from "./pages/master/loanImproveManagement/LoanImprovementList";
import ChangeInterestRate from "./pages/master/loanImproveManagement/ChangeInterestRate";
import ChangeRepaymentPeriod from "./pages/master/loanImproveManagement/ChangeRepaymentPeriod";
import ChangeRepaymentAmount from "./pages/master/loanImproveManagement/ChangeRepaymentAmount";
import ChangeLoanProduct from "./pages/master/loanImproveManagement/ChangeLoanProduct";
import ChangeFeesCharges from "./pages/master/loanImproveManagement/ChangeFeesCharges";
import ChangeCollateral from "./pages/master/loanImproveManagement/ChangeCollateral";
import RepaymentRationalisation from "./pages/master/loanImproveManagement/RepaymentRationalisation";
import MoratoriumInterest from "./pages/master/loanImproveManagement/MoratoriumInterest";
import TopUpManagement from "./pages/master/loanImproveManagement/TopUpManagement";

import CurrencyList from "./pages/master/currency-management/CurrencyList";
import CurrencyForm from "./pages/master/currency-management/CurrencyForm";
import CurrencyView from "./pages/master/currency-management/CurrencyView";

import ConcessionList from "./pages/master/concession-management/ConcessionList";
import ConcessionView from "./pages/master/concession-management/ConcessionView";
import ConcessionTypeForm from "./pages/master/concession-management/ConcessionTypeForm";
import ConcessionCategoryForm from "./pages/master/concession-management/ConcessionCategoryForm";

import EligibilityList from "./pages/master/Eligibilty&ScoreManagement/EligibilityManagement/EligibilityList";
import EligibilityView from "./pages/master/Eligibilty&ScoreManagement/EligibilityManagement/EligibilityView";
import EligibilityForm from "./pages/master/Eligibilty&ScoreManagement/EligibilityManagement/EligibilityForm";

import BankingList from "./pages/master/Eligibilty&ScoreManagement/BankingManagement/BankingList";
import BankingView from "./pages/master/Eligibilty&ScoreManagement/BankingManagement/BankingView";
import BankingForm from "./pages/master/Eligibilty&ScoreManagement/BankingManagement/BankingForm";

import ExistingObligationList from "./pages/master/Eligibilty&ScoreManagement/ExistingObligationManagement/ExistingObligationList";
import ExistingObligationView from "./pages/master/Eligibilty&ScoreManagement/ExistingObligationManagement/ExistingObligationView";
import ExistingObligationForm from "./pages/master/Eligibilty&ScoreManagement/ExistingObligationManagement/ExistingObligationForm";

import ScoreCardList from "./pages/master/Eligibilty&ScoreManagement/ScoreCardManagement/ScoreCardList";
import ScoreCardView from "./pages/master/Eligibilty&ScoreManagement/ScoreCardManagement/ScoreCardView";
import ScoreCardForm from "./pages/master/Eligibilty&ScoreManagement/ScoreCardManagement/ScoreCardForm";

import PredefinedTemplateList from "./pages/master/templateManagement/predefineTemplate/PredefinedTemplateList";
import AddTemplate from "./pages/master/templateManagement/predefineTemplate/AddTemplate";
import ViewTemplate from "./pages/master/templateManagement/predefineTemplate/ViewTemplate";
import EditTemplate from "./pages/master/templateManagement/predefineTemplate/EditTemplate";

import CustomizeTemplateList from "./pages/master/templateManagement/customizeTemplate/CustomizeTemplateList";
import CustomizeTemplateView from "./pages/master/templateManagement/customizeTemplate/CustomizeTemplateView";
import CustomizeTemplateEdit from "./pages/master/templateManagement/customizeTemplate/CustomizeTemplateEdit";

import BankManagement from "./pages/master/bank-funds/BankManagement";
import AddBank from "./pages/master/bank-funds/AddBank";
import EditBank from "./pages/master/bank-funds/EditBank";
import FundManagement from "./pages/master/bank-funds/FundManagement";
import AddFund from "./pages/master/bank-funds/AddFund";
import EditFund from "./pages/master/bank-funds/EditFund";
import ViewFund from "./pages/master/bank-funds/ViewFund";
import PortfolioManagement from "./pages/master/bank-funds/PortfolioManagement";
import AddPortfolio from "./pages/master/bank-funds/AddPortfolio";
import EditPortfolio from "./pages/master/bank-funds/EditPortfolio";
import ViewPortfolio from "./pages/master/bank-funds/ViewPortfolio";
import ModeOfBank from "./pages/master/bank-funds/ModeOfBank";
import TaxationManagement from "./pages/master/bank-funds/TaxationManagement";
import BusinessModel from "./pages/master/bank-funds/BusinessModel";
import BusinessModelFormPage from "./pages/master/bank-funds/BusinessModelFormPage";
import BusinessModelViewPage from "./pages/master/bank-funds/BusinessModelViewPage";

// ✅ FIXED: Vendor imports — added Add, View, Edit
import VendorList from "./pages/master/profile-management/vendor/VendorList";
import VendorAdd  from "./pages/master/profile-management/vendor/VendorAdd";
import VendorView from "./pages/master/profile-management/vendor/VendorView";
import VendorEdit from "./pages/master/profile-management/vendor/VendorEdit";

import AgentList from "./pages/master/profile-management/agent/AgentList";
import ClientList from "./pages/master/profile-management/client/ClientList";

// Rule Management
import RuleNameList from "./pages/master/rule-management/rule-master/RuleNameList";
import AddRuleName from "./pages/master/rule-management/rule-master/AddRuleName";
import EditRuleName from "./pages/master/rule-management/rule-master/EditRuleName";
import ViewRuleName from "./pages/master/rule-management/rule-master/ViewRuleName";

import ImpactValueList from "./pages/master/rule-management/impact-values/ImpactValueList";
import AddImpactValue from "./pages/master/rule-management/impact-values/AddImpactValue";
import EditImpactValue from "./pages/master/rule-management/impact-values/EditImpactValue";
import ViewImpactValue from "./pages/master/rule-management/impact-values/ViewImpactValue";

import ClientProfileRuleList from "./pages/master/rule-management/client-profile/ClientProfileRuleList";
import AddClientProfileRule from "./pages/master/rule-management/client-profile/AddClientProfileRule";
import EditClientProfileRule from "./pages/master/rule-management/client-profile/EditClientProfileRule";
import ViewClientProfileRule from "./pages/master/rule-management/client-profile/ViewClientProfileRule";

import CollateralRuleList from "./pages/master/rule-management/collateral-quality/CollateralRuleList";
import AddCollateralRule from "./pages/master/rule-management/collateral-quality/AddCollateralRule";
import EditCollateralRule from "./pages/master/rule-management/collateral-quality/EditCollateralRule";
import ViewCollateralRule from "./pages/master/rule-management/collateral-quality/ViewCollateralRule";

import FinancialRuleList from "./pages/master/rule-management/financial-eligibility/FinancialRuleList";
import AddFinancialRule from "./pages/master/rule-management/financial-eligibility/AddFinancialRule";
import EditFinancialRule from "./pages/master/rule-management/financial-eligibility/EditFinancialRule";
import ViewFinancialRule from "./pages/master/rule-management/financial-eligibility/ViewFinancialRule";

import ScorecardHome from "./pages/master/rule-management/scorecard/ScorecardHome";
import InternalScoreRuleList from "./pages/master/rule-management/scorecard/InternalScoreRuleList";
import AddInternalScoreRule from "./pages/master/rule-management/scorecard/AddInternalScoreRule";
import EditInternalScoreRule from "./pages/master/rule-management/scorecard/EditInternalScoreRule";
import ViewInternalScoreRule from "./pages/master/rule-management/scorecard/ViewInternalScoreRule";
import AddCreditHistoryRule from "./pages/master/rule-management/scorecard/AddCreditHistoryRule";
import AddGeoLocationRule from "./pages/master/rule-management/scorecard/AddGeoLocationRule";
import EditGeoLocationRule from "./pages/master/rule-management/scorecard/EditGeoLocationRule";
import ViewGeoLocationRule from "./pages/master/rule-management/scorecard/ViewGeoLocationRule";

import RiskMitigationRuleList from "./pages/master/rule-management/risk-mitigation/RiskMitigationRuleList";
import AddRiskMitigationRule from "./pages/master/rule-management/risk-mitigation/AddRiskMitigationRule";
import EditRiskMitigationRule from "./pages/master/rule-management/risk-mitigation/EditRiskMitigationRule";
import ViewRiskMitigationRule from "./pages/master/rule-management/risk-mitigation/ViewRiskMitigationRule";

import VerificationRuleHome from "./pages/master/rule-management/verification/VerificationRuleHome";
import InternalVerificationRule from "./pages/master/rule-management/verification/InternalVerificationRule";
import AddInternalVerificationRule from "./pages/master/rule-management/verification/AddInternalVerificationRule";
import EditInternalVerificationRule from "./pages/master/rule-management/verification/EditInternalVerificationRule";
import ViewInternalVerificationRule from "./pages/master/rule-management/verification/ViewInternalVerificationRule";
import AgencyVerificationRule from "./pages/master/rule-management/verification/AgencyVerificationRule";
import AddAgencyVerificationRule from "./pages/master/rule-management/verification/AddAgencyVerificationRule";
import EditAgencyVerificationRule from "./pages/master/rule-management/verification/EditAgencyVerificationRule";
import ViewAgencyVerificationRule from "./pages/master/rule-management/verification/ViewAgencyVerificationRule";

// Controls Management
import LanguageList from "./pages/master/ControlsManagement/ManageLanguage/LanguageList";
import LanguageAdd from "./pages/master/ControlsManagement/ManageLanguage/AddLanguage";
import LanguageEdit from "./pages/master/ControlsManagement/ManageLanguage/EditLanguage";
import LanguageView from "./pages/master/ControlsManagement/ManageLanguage/ViewLanguage";

import GeoLocationList from "./pages/master/ControlsManagement/ManageGeoLocation/GeoLocationList";
import CountryList from "./pages/master/ControlsManagement/ManageGeoLocation/CountryList";
import AddCountry from "./pages/master/ControlsManagement/ManageGeoLocation/AddCountry";
import StateList from "./pages/master/ControlsManagement/ManageGeoLocation/StateList";
import AddState from "./pages/master/ControlsManagement/ManageGeoLocation/AddState";
import CityList from "./pages/master/ControlsManagement/ManageGeoLocation/CityList";
import AddCity from "./pages/master/ControlsManagement/ManageGeoLocation/AddCity";
import AreaList from "./pages/master/ControlsManagement/ManageGeoLocation/AreaList";
import AddArea from "./pages/master/ControlsManagement/ManageGeoLocation/AddArea";

import LoginAuthList from "./pages/master/ControlsManagement/ManageLoginAuthentication/LoginAuthList";
import AddLoginAuth from "./pages/master/ControlsManagement/ManageLoginAuthentication/AddLoginAuth";
import EditLoginAuth from "./pages/master/ControlsManagement/ManageLoginAuthentication/EditLoginAuth";
import ViewLoginAuth from "./pages/master/ControlsManagement/ManageLoginAuthentication/ViewLoginAuth";

import CoApplicantList from "./pages/master/ControlsManagement/ManageCoApplicant/CoApplicantList";
import AddCoApplicant from "./pages/master/ControlsManagement/ManageCoApplicant/AddCoApplicant";
import EditCoApplicant from "./pages/master/ControlsManagement/ManageCoApplicant/EditCoApplicant";
import ViewCoApplicant from "./pages/master/ControlsManagement/ManageCoApplicant/ViewCoApplicant";

import LoginFeeList from "./pages/master/ControlsManagement/ManageLoginFees/LoginFeeList";
import AddLoginFee from "./pages/master/ControlsManagement/ManageLoginFees/AddLoginFee";
import EditLoginFee from "./pages/master/ControlsManagement/ManageLoginFees/EditLoginFee";
import ViewLoginFee from "./pages/master/ControlsManagement/ManageLoginFees/ViewLoginFee";

import JointApplicantList from "./pages/master/ControlsManagement/ManageJointApplicant/JointApplicantList";
import AddJointApplicant from "./pages/master/ControlsManagement/ManageJointApplicant/AddJointApplicant";
import EditJointApplicant from "./pages/master/ControlsManagement/ManageJointApplicant/EditJointApplicant";
import ViewJointApplicant from "./pages/master/ControlsManagement/ManageJointApplicant/ViewJointApplicant";

import ReferenceList from "./pages/master/ControlsManagement/ManageReferences/ReferenceList";
import AddReference from "./pages/master/ControlsManagement/ManageReferences/AddReference";
import EditReference from "./pages/master/ControlsManagement/ManageReferences/EditReference";
import ViewReference from "./pages/master/ControlsManagement/ManageReferences/ViewReference";

import ApplicationProcessList from "./pages/master/ControlsManagement/ManageApplicationProcess/ApplicationProcessList";
import UpdateActionType from "./pages/master/ControlsManagement/ManageApplicationProcess/UpdateActionType";
import UpdateProcessingMode from "./pages/master/ControlsManagement/ManageApplicationProcess/UpdateProcessingMode";
import UpdateApplication from "./pages/master/ControlsManagement/ManageApplicationProcess/UpdateApplication";

import ScoreCardRatingHome from "./pages/master/ControlsManagement/ManageScoreCardRating/ScoreCardRatingHome";
import ReferenceCheckList from "./pages/master/ControlsManagement/ManageScoreCardRating/ReferenceCheck/ReferenceCheckList";
import AddReferenceCheck from "./pages/master/ControlsManagement/ManageScoreCardRating/ReferenceCheck/AddReferenceCheck";
import EditReferenceCheck from "./pages/master/ControlsManagement/ManageScoreCardRating/ReferenceCheck/EditReferenceCheck";
import CreditHistoryList from "./pages/master/ControlsManagement/ManageScoreCardRating/CreditHistory/CreditHistoryList";
import AddCreditHistory from "./pages/master/ControlsManagement/ManageScoreCardRating/CreditHistory/AddCreditHistory";
import EditCreditHistory from "./pages/master/ControlsManagement/ManageScoreCardRating/CreditHistory/EditCreditHistory";
import InvestigationReportList from "./pages/master/ControlsManagement/ManageScoreCardRating/InvastigationReport/InvestigationReportList";
import AddInvestigationReport from "./pages/master/ControlsManagement/ManageScoreCardRating/InvastigationReport/AddInvestigationReport";
import EditInvestigationReport from "./pages/master/ControlsManagement/ManageScoreCardRating/InvastigationReport/EditInvestigationReport";

import TeleVerificationList from "./pages/master/ControlsManagement/ManageVerification/TeleVerification/TeleVerificationList";

// Agent Master
import VerificationAgencyList from "./pages/master/agent-management/VerificationAgency/VerificationAgencyList";
import VerificationAgencyForm from "./pages/master/agent-management/VerificationAgency/VerificationAgencyForm";
import VerificationAgencyView from "./pages/master/agent-management/VerificationAgency/VerificationAgencyView";
import ManageVerificationFees from "./pages/master/agent-management/VerificationAgency/ManageVerificationFees";

import CollectionAgentList from "./pages/master/agent-management/CollectionAgent/CollectionAgentList";
import CollectionAgentForm from "./pages/master/agent-management/CollectionAgent/CollectionAgentForm";
import CollectionAgentView from "./pages/master/agent-management/CollectionAgent/CollectionAgentView";
import UpdateAgent from "./pages/master/agent-management/CollectionAgent/UpdateAgent";
import ManageFees from "./pages/master/agent-management/CollectionAgent/ManageFees";

import LegalAgentList from "./pages/master/agent-management/CollectionAgent/LegalAgentList";
import LegalAgentForm from "./pages/master/agent-management/CollectionAgent/LegalAgentForm";
import LegalAgentView from "./pages/master/agent-management/CollectionAgent/LegalAgentView";

function MainLayout({ children }) {
    return (
        <div className="h-full bg-gray-50 flex text-gray-900">
            <Sidebar />
            <Header />
            <main className="lg:ml-64 pt-28 lg:pt-16 w-full min-h-screen">
                {children}
            </main>
        </div>
    );
}

export default function App() {
    return (
        <Router basename="/tenant">
            <Routes>
                {/* Public route — no layout, no auth required */}
                <Route path="/login" element={<Login />} />

                {/* All other routes require login and show the main layout */}
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Routes>
                    {/* Default: go straight to dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" />} />

                    {/* TENANT ROUTES */}
                    <Route path="/dashboard" element={<TenantDashboard />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/leads/new" element={<AddLead />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/risk-engine" element={<RiskEngine />} />
                    <Route path="/escalation-rules" element={<EscalationRules />} />
                    <Route path="/mandates" element={<MandateManagement />} />
                    <Route path="/loan-applications" element={<LoanApplications />} />
                    <Route path="/loan-applications/new/:productId" element={<PersonalLoanApplicationWizard />} />
                    <Route path="/loan-applications/new-personal-loan" element={<PersonalLoanApplicationWizard />} />
                    <Route path="/disbursements" element={<DisbursementQueue />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/training" element={<Training />} />
                    <Route path="/add-business" element={<AddBusiness />} />
                    <Route path="/my-subscription" element={<MySubscription />} />
                    <Route path="/channel-partners" element={<ChannelPartners />} />
                    <Route path="/channel-partners/sales" element={<ChannelPartners />} />
                    <Route path="/channel-partners/api-providers" element={<ApiProviders />} />
                    <Route path="/third-party-users" element={<ThirdPartyUsers />} />
                    <Route path="/branches" element={<Branches />} />
                    <Route path="/loans" element={<Loans />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/roles_permissions" element={<RolesPermissions />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/internal-team-dashboards" element={<InternalTeamDashboards />} />
                    <Route path="/rules-config" element={<Rules />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/active-loans" element={<ActiveLoans />} />
                    <Route path="/knowledge-base" element={<KnowledgeBase />} />
                    <Route path="/subscription-plans" element={<SubscriptionPlans />} />
                    <Route path="/roles" element={<TenantRoles />} />

                    {/* MASTER ROUTES (Restored) */}
                    <Route path="/master-dashboard" element={<MasterDashboard />} />
                    <Route path="/organizations" element={<OrganizationList />} />
                    <Route path="/master-users" element={<MasterUserList />} />
                    <Route path="/master-roles" element={<MasterRoleList />} />

                    {/* MASTER ROUTES (Existing) */}
                    <Route path="/subscriptions" element={<MasterSubscriptionPage />} />
                    <Route path="/approvals" element={<ApprovalList />} />
                    <Route path="/approvals/add" element={<AddApproval />} />
                    <Route path="/approvals/edit/:id" element={<EditApproval />} />
                    <Route path="/approvals/view/:id" element={<ApprovalView />} />
                    <Route path="/manage-approvals" element={<ManageApprovalPage />} />
                    <Route path="/escalation" element={<EscalationPage />} />

                    <Route path="/product-management/list" element={<ProductList />} />
                    <Route path="/product-management/add" element={<AddProduct />} />
                    <Route path="/product-management/:id/edit" element={<EditProduct />} />
                    <Route path="/product-management/:id/view" element={<ViewProduct />} />

                    <Route path="/product-mix/list" element={<ProductMixList />} />
                    <Route path="/product-mix/add" element={<AddProductMix />} />
                    <Route path="/product-mix/:id/edit" element={<EditProductMix />} />

                    <Route path="/fees/list" element={<FeeList />} />
                    <Route path="/fees/add" element={<AddFees />} />
                    <Route path="/fees/:id/edit" element={<EditFees />} />

                    <Route path="/charges/list" element={<ChargeList />} />
                    <Route path="/charges/add" element={<AddCharge />} />
                    <Route path="/charges/edit/:id" element={<EditCharge />} />
                    <Route path="/charges/:id" element={<ChargeDetail />} />

                    <Route path="/interest/list" element={<InterestList />} />
                    <Route path="/interest/add" element={<AddInterest />} />
                    <Route path="/interest/:id/edit" element={<EditInterest />} />
                    <Route path="/interest/:id" element={<InterestDetail />} />

                    <Route path="/repayment/list" element={<RepaymentList />} />
                    <Route path="/repayment/add" element={<AddRepayment />} />
                    <Route path="/repayment/:id/edit" element={<EditRepayment />} />
                    <Route path="/repayment/:id" element={<RepaymentDetail />} />

                    <Route path="/penalties" element={<PenaltyList />} />
                    <Route path="/penalties/add" element={<AddPenalty />} />
                    <Route path="/penalties/:id/edit" element={<EditPenalty />} />
                    <Route path="/penalties/:id" element={<PenaltyDetail />} />

                    <Route path="/moratorium" element={<MoratoriumList />} />
                    <Route path="/moratorium/add" element={<AddMoratorium />} />
                    <Route path="/moratorium/:id/edit" element={<EditMoratorium />} />
                    <Route path="/moratorium/:id/view" element={<MoratoriumDetail />} />
                    <Route path="/moratorium/:id" element={<MoratoriumDetail />} />

                    <Route path="/loan-improvement" element={<LoanImprovementList />} />
                    <Route path="/loan-improvement-dashboard" element={<LoanImprovementDashboard />} />
                    <Route path="/loan-improvement/:loanId" element={<LoanImprovementDashboard />} />
                    <Route path="/loan-improvement/:loanId/interest-rate" element={<ChangeInterestRate />} />
                    <Route path="/loan-improvement/:loanId/tenure" element={<ChangeRepaymentPeriod />} />
                    <Route path="/loan-improvement/:loanId/emi" element={<ChangeRepaymentAmount />} />
                    <Route path="/loan-improvement/:loanId/product" element={<ChangeLoanProduct />} />
                    <Route path="/loan-improvement/:loanId/fees" element={<ChangeFeesCharges />} />
                    <Route path="/loan-improvement/:loanId/collateral" element={<ChangeCollateral />} />
                    <Route path="/loan-improvement/:loanId/rationalisation" element={<RepaymentRationalisation />} />
                    <Route path="/loan-improvement/:loanId/moratorium" element={<MoratoriumInterest />} />
                    <Route path="/loan-improvement/:loanId/top-up" element={<TopUpManagement />} />

                    <Route path="/currency-management" element={<CurrencyList />} />
                    <Route path="/currency-management/add" element={<CurrencyForm />} />
                    <Route path="/currency-management/edit/:id" element={<CurrencyForm isEdit="true" />} />
                    <Route path="/currency-management/view/:id" element={<CurrencyView />} />

                    <Route path="/concession-management" element={<ConcessionList />} />
                    <Route path="/concession-management/view/:id" element={<ConcessionView />} />
                    <Route path="/concession-management/type/add" element={<ConcessionTypeForm />} />
                    <Route path="/concession-management/category/add" element={<ConcessionCategoryForm />} />

                    <Route path="/eligibility" element={<EligibilityList />} />
                    <Route path="/eligibility/add" element={<EligibilityForm />} />
                    <Route path="/eligibility/edit/:id" element={<EligibilityForm isEdit="true" />} />
                    <Route path="/eligibility/view/:id" element={<EligibilityView />} />

                    <Route path="/banking" element={<BankingList />} />
                    <Route path="/banking/add" element={<BankingForm />} />
                    <Route path="/banking/edit/:id" element={<BankingForm isEdit="true" />} />
                    <Route path="/banking/view/:id" element={<BankingView />} />

                    <Route path="/obligation" element={<ExistingObligationList />} />
                    <Route path="/obligation/add" element={<ExistingObligationForm />} />
                    <Route path="/obligation/edit/:id" element={<ExistingObligationForm isEdit="true" />} />
                    <Route path="/obligation/view/:id" element={<ExistingObligationView />} />

                    <Route path="/score-card" element={<ScoreCardList />} />
                    <Route path="/score-card/add" element={<ScoreCardForm />} />
                    <Route path="/score-card/edit/:id" element={<ScoreCardForm isEdit="true" />} />
                    <Route path="/score-card/view/:id" element={<ScoreCardView />} />

                    <Route path="/predefine-template" element={<PredefinedTemplateList />} />
                    <Route path="/predefine-template/add" element={<AddTemplate />} />
                    <Route path="/predefine-template/edit/:id" element={<EditTemplate />} />
                    <Route path="/predefine-template/view/:id" element={<ViewTemplate />} />

                    <Route path="/customize-template" element={<CustomizeTemplateList />} />
                    <Route path="/customize-template/edit/:id" element={<CustomizeTemplateEdit />} />
                    <Route path="/customize-template/view/:id" element={<CustomizeTemplateView />} />

                    <Route path="/bank-management" element={<BankManagement />} />
                    <Route path="/bank-management/add" element={<AddBank />} />
                    <Route path="/bank-management/edit/:id" element={<EditBank />} />

                    <Route path="/fund-management" element={<FundManagement />} />
                    <Route path="/fund-management/add" element={<AddFund />} />
                    <Route path="/fund-management/edit/:id" element={<EditFund />} />
                    <Route path="/fund-management/view/:id" element={<ViewFund />} />

                    <Route path="/portfolio-management" element={<PortfolioManagement />} />
                    <Route path="/portfolio-management/add" element={<AddPortfolio />} />
                    <Route path="/portfolio-management/edit/:id" element={<EditPortfolio />} />
                    <Route path="/portfolio-management/view/:id" element={<ViewPortfolio />} />

                    <Route path="/mode-of-bank" element={<ModeOfBank />} />
                    <Route path="/taxation-management" element={<TaxationManagement />} />

                    {/* ✅ Business Model routes */}
                    <Route path="/business-model" element={<BusinessModel />} />
                    <Route path="/business-model/add" element={<BusinessModelFormPage modeType="add" />} />
                    <Route path="/business-model/edit/:id" element={<BusinessModelFormPage modeType="edit" />} />
                    <Route path="/business-model/view/:id" element={<BusinessModelViewPage />} />

                    {/* ✅ FIXED: Vendor routes */}
                    <Route path="/profile-management/vendor"          element={<VendorList />} />
                    <Route path="/profile-management/vendor/add"      element={<VendorAdd />} />
                    <Route path="/profile-management/vendor/view/:id" element={<VendorView />} />
                    <Route path="/profile-management/vendor/edit/:id" element={<VendorEdit />} />

                    <Route path="/profile-management/agent"  element={<AgentList />} />
                    <Route path="/profile-management/client" element={<ClientList />} />

                    {/* Agent Master */}
                    <Route path="/verification-agency" element={<VerificationAgencyList />} />
                    <Route path="/verification-agency/add" element={<VerificationAgencyForm />} />
                    <Route path="/verification-agency/edit/:id" element={<VerificationAgencyForm />} />
                    <Route path="/verification-agency/view/:id" element={<VerificationAgencyView />} />
                    <Route path="/verification-agency/manage-fees/:id" element={<ManageVerificationFees />} />

                    <Route path="/collection-agent" element={<CollectionAgentList />} />
                    <Route path="/collection-agent/add" element={<CollectionAgentForm />} />
                    <Route path="/collection-agent/edit/:id" element={<CollectionAgentForm />} />
                    <Route path="/collection-agent/view/:id" element={<CollectionAgentView />} />
                    <Route path="/collection-agent/update/:id" element={<UpdateAgent />} />
                    <Route path="/collection-agent/fees/:id" element={<ManageFees />} />

                    <Route path="/legal-agent" element={<LegalAgentList />} />
                    <Route path="/legal-agents/add" element={<LegalAgentForm />} />
                    <Route path="/legal-agents/edit/:id" element={<LegalAgentForm />} />
                    <Route path="/legal-agents/view/:id" element={<LegalAgentView />} />

                    {/* Controls Management */}
                    <Route path="/controls/language" element={<LanguageList />} />
                    <Route path="/controls/language/add" element={<LanguageAdd />} />
                    <Route path="/controls/language/edit/:id" element={<LanguageEdit />} />
                    <Route path="/controls/language/view/:id" element={<LanguageView />} />

                    <Route path="/controls/geo" element={<GeoLocationList />} />
                    <Route path="/controls/geo/add" element={<AddGeoLocationRule />} />
                    <Route path="/controls/geo/edit/:id" element={<EditGeoLocationRule />} />
                    <Route path="/controls/geo/view/:id" element={<ViewGeoLocationRule />} />

                    <Route path="/controls/login-auth" element={<LoginAuthList />} />
                    <Route path="/controls/login-auth/add" element={<AddLoginAuth />} />
                    <Route path="/controls/login-auth/edit/:id" element={<EditLoginAuth />} />
                    <Route path="/controls/login-auth/view/:id" element={<ViewLoginAuth />} />

                    <Route path="/controls/co-applicant" element={<CoApplicantList />} />
                    <Route path="/controls/co-applicant/add" element={<AddCoApplicant />} />
                    <Route path="/controls/co-applicant/edit/:id" element={<EditCoApplicant />} />
                    <Route path="/controls/co-applicant/view/:id" element={<ViewCoApplicant />} />

                    <Route path="/controls/login-fees" element={<LoginFeeList />} />
                    <Route path="/controls/login-fees/add" element={<AddLoginFee />} />
                    <Route path="/controls/login-fees/edit/:id" element={<EditLoginFee />} />
                    <Route path="/controls/login-fees/view/:id" element={<ViewLoginFee />} />

                    <Route path="/controls/joint-applicant" element={<JointApplicantList />} />
                    <Route path="/controls/joint-applicant/add" element={<AddJointApplicant />} />
                    <Route path="/controls/joint-applicant/edit/:id" element={<EditJointApplicant />} />
                    <Route path="/controls/joint-applicant/view/:id" element={<ViewJointApplicant />} />

                    <Route path="/controls/references" element={<ReferenceList />} />
                    <Route path="/controls/references/add" element={<AddReference />} />
                    <Route path="/controls/references/edit/:id" element={<EditReference />} />
                    <Route path="/controls/references/view/:id" element={<ViewReference />} />

                    <Route path="/controls/application-process" element={<ApplicationProcessList />} />
                    <Route path="/controls/application-process/action-type" element={<UpdateActionType />} />
                    <Route path="/controls/application-process/processing-mode" element={<UpdateProcessingMode />} />
                    <Route path="/controls/application-process/update-application" element={<UpdateApplication />} />

                    <Route path="/controls/score-card" element={<ScoreCardRatingHome />} />
                    <Route path="/controls/score-card/reference-check" element={<ReferenceCheckList />} />
                    <Route path="/controls/score-card/reference-check/add" element={<AddReferenceCheck />} />
                    <Route path="/controls/score-card/reference-check/edit/:id" element={<EditReferenceCheck />} />
                    <Route path="/controls/score-card/credit-history" element={<CreditHistoryList />} />
                    <Route path="/controls/score-card/credit-history/add" element={<AddCreditHistory />} />
                    <Route path="/controls/score-card/credit-history/edit/:id" element={<EditCreditHistory />} />
                    <Route path="/controls/score-card/investigation-report" element={<InvestigationReportList />} />
                    <Route path="/controls/score-card/investigation-report/add" element={<AddInvestigationReport />} />
                    <Route path="/controls/score-card/investigation-report/edit/:id" element={<EditInvestigationReport />} />

                    <Route path="/controls/verification" element={<TeleVerificationList />} />

                    {/* Rule Management */}
                    <Route path="/rule-management/rule-master" element={<RuleNameList />} />
                    <Route path="/rule-management/rule-master/add" element={<AddRuleName />} />
                    <Route path="/rule-management/rule-master/edit/:id" element={<EditRuleName />} />
                    <Route path="/rule-management/rule-master/view/:id" element={<ViewRuleName />} />

                    <Route path="/rule-management/impact-values" element={<ImpactValueList />} />
                    <Route path="/rule-management/impact-values/add" element={<AddImpactValue />} />
                    <Route path="/rule-management/impact-values/edit/:id" element={<EditImpactValue />} />
                    <Route path="/rule-management/impact-values/view/:id" element={<ViewImpactValue />} />

                    <Route path="/rule-management/client-profile" element={<ClientProfileRuleList />} />
                    <Route path="/rule-management/client-profile/add" element={<AddClientProfileRule />} />
                    <Route path="/rule-management/client-profile/edit/:id" element={<EditClientProfileRule />} />
                    <Route path="/rule-management/client-profile/view/:id" element={<ViewClientProfileRule />} />

                    <Route path="/rule-management/collateral-quality" element={<CollateralRuleList />} />
                    <Route path="/rule-management/collateral-quality/add" element={<AddCollateralRule />} />
                    <Route path="/rule-management/collateral-quality/edit/:id" element={<EditCollateralRule />} />
                    <Route path="/rule-management/collateral-quality/view/:id" element={<ViewCollateralRule />} />

                    <Route path="/rule-management/financial-eligibility" element={<FinancialRuleList />} />
                    <Route path="/rule-management/financial-eligibility/add" element={<AddFinancialRule />} />
                    <Route path="/rule-management/financial-eligibility/edit/:id" element={<EditFinancialRule />} />
                    <Route path="/rule-management/financial-eligibility/view/:id" element={<ViewFinancialRule />} />

                    <Route path="/rule-management/risk-mitigation" element={<RiskMitigationRuleList />} />
                    <Route path="/rule-management/risk-mitigation/add" element={<AddRiskMitigationRule />} />
                    <Route path="/rule-management/risk-mitigation/edit/:id" element={<EditRiskMitigationRule />} />
                    <Route path="/rule-management/risk-mitigation/view/:id" element={<ViewRiskMitigationRule />} />

                    <Route path="/rule-management/scorecard" element={<ScorecardHome />} />
                    <Route path="/rule-management/scorecard/internal-score/add" element={<AddInternalScoreRule />} />
                    <Route path="/rule-management/scorecard/internal-score/edit/:id" element={<EditInternalScoreRule />} />
                    <Route path="/rule-management/scorecard/internal-score/view/:id" element={<ViewInternalScoreRule />} />
                    <Route path="/rule-management/scorecard/credit-history/add" element={<AddCreditHistoryRule />} />

                    <Route path="/rule-management/verification" element={<VerificationRuleHome />} />
                    <Route path="/rule-management/verification/internal" element={<InternalVerificationRule />} />
                    <Route path="/rule-management/verification/internal/add" element={<AddInternalVerificationRule />} />
                    <Route path="/rule-management/verification/internal/edit/:id" element={<EditInternalVerificationRule />} />
                    <Route path="/rule-management/verification/internal/view/:id" element={<ViewInternalVerificationRule />} />
                    <Route path="/rule-management/verification/agency" element={<AgencyVerificationRule />} />
                    <Route path="/rule-management/verification/agency/add" element={<AddAgencyVerificationRule />} />
                    <Route path="/rule-management/verification/agency/edit/:id" element={<EditAgencyVerificationRule />} />
                    <Route path="/rule-management/verification/agency/view/:id" element={<ViewAgencyVerificationRule />} />

                    <Route path="*" element={<Navigate to="/dashboard" />} />
                                </Routes>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}