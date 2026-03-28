import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
  Outlet,
} from "react-router-dom";

import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Organization from "./pages/organization/Organization";
import AddOrganization from "./pages/organization/AddOrganization";
import OrganizationList from "./pages/organization/OrganizationList";
import BranchList from "./pages/organization/BranchList";
import UpdateBranch from "./pages/organization/UpdateBranch";
import CreateBranch from "./pages/organization/CreateBranch";
import EditOrganization from "./pages/organization/EditOrganization";

// import ProtectedRoute from "./components/ProtectedRoute"; // we will create this
import Users from "./pages/Users/Users";
import AddUser from "./pages/Users/AddUser";
import EditUser from "./pages/Users/EditUser";

import UserList from "./pages/Users/UserList";
// ROLE MANAGEMENT PAGES
import Roles from "./pages/roles/Roles";
import CreateRole from "./pages/roles/CreateRole";
import SetPermissions from "./pages/roles/SetPermissions";
import AssignPermissions from "./pages/roles/AssignPermissions";

// import IntegrationManagament from "./pages/integration/IntegrationManagement";

import Notification from "./pages/notifications/Notifications";

import ReportingAnalytics from "./pages/Reports/ReportingAnalytics";
import DailyDisbursementReport from "./pages/Reports/DailyDisbursementReport";
import BranchPerformanceReport from "./pages/Reports/BranchPerformanceReport";
import LoanApprovalRejectionReport from "./pages/Reports/LoanApprovalRejectionReport";
import NpaReport from "./pages/Reports/NpaReport";
import RevenueReport from "./pages/Reports/RevenueReport";
import UserActivityReport from "./pages/Reports/UserActivityReport";
import AuditMain from "./pages/audit/AuditMain";
import ViewUserActions from "./pages/audit/ViewUserActions";
import TrackEditsDeletes from "./pages/audit/TrackEditsDeletes";
import ActivityTimeline from "./pages/audit/ActivityTimeline";
import TrackIpLogs from "./pages/audit/TrackIpLogs";
import BranchDataMonitor from "./pages/audit/BranchDataMonitor";
import ProfilePage from "./components/ProfilePage";
// import CouponPage from "./pages/subscription/CouponPage";
// import SubscribersPage from "./pages/subscription/SubscribersPage";
// import EmploymentTypePage from "./pages/subscription/EmploymentTypePage";
// import OccupationTypePage from "./pages/subscription/OccupationTypePage";
import SubscriptionHome from "./pages/subscription/SubscriptionHome";
import RoleList from "./pages/roles/RoleList";
import SubscriptionPage from "./pages/subscription/SubscriptionPage";
import AddSubscription from "./pages/subscription/AddSubscription";
import CouponPage from "./pages/subscription/CouponPage";
import AddCoupon from "./pages/subscription/AddCoupon";
import SubscribersPage from "./pages/subscription/SubscribersPage";
import EditSubscription from "./pages/subscription/EditSubscription";
import EditCoupon from "./pages/subscription/EditCoupon";
import EmploymentTypePage from "./pages/employement/EmploymentTypePage";
import AddEmploymentTypePage from "./pages/employement/AddEmploymentTypePage";
import EditEmploymentTypePage from "./pages/employement/EditEmploymentTypePage";
import ViewEmploymentTypePage from "./pages/employement/ViewEmploymentTypePage";
import AddOccupationTypePage from "./pages/occupation/AddOccupationTypePage";
import EditOccupationTypePage from "./pages/occupation/EditOccupationTypePage";
import OccupationTypePage from "./pages/occupation/OccupationTypePage";
import ViewOccupationTypePage from "./pages/occupation/ViewOccupationTypePage";
import RequireMasterAdmin from "./auth/RequireMasterAdmin";

import ApprovalList from "./pages/approvalMaster/ApprovalList";
import AddApproval from "./pages/approvalMaster/AddApproval";
import EditApproval from "./pages/approvalMaster/EditApproval";
import { ManageApprovalPage } from "./pages/approvalMaster/ManageApprovalPage";
import { EscalationPage } from "./pages/approvalMaster/EscalationPage";

import ProductList from "./pages/productManagement/product/ProductList";
import AddProduct from "./pages/productManagement/product/AddProduct";
import EditProduct from "./pages/productManagement/product/EditProduct";
import ProductMixList from "./pages/productManagement/productMixer/ProductMixList";
import AddProductMix from "./pages/productManagement/productMixer/AddProductMix";
import EditProductMix from "./pages/productManagement/productMixer/EditProductMix";
import FeeList from "./pages/productManagement/fees/FeeList";
import AddFees from "./pages/productManagement/fees/AddFees";
import EditFees from "./pages/productManagement/fees/EditFees";
import InterestList from "./pages/productManagement/interestManagement/InterestList";
import AddInterest from "./pages/productManagement/interestManagement/AddInterest";
import InterestDetail from "./pages/productManagement/interestManagement/InterestDetail";
import EditInterest from "./pages/productManagement/interestManagement/EditInterest";
import ChargeList from "./pages/productManagement/chargeManagement/ChargeList";
import AddCharge from "./pages/productManagement/chargeManagement/AddCharge";
import ChargeDetail from "./pages/productManagement/chargeManagement/ChargeDetail";
import EditCharge from "./pages/productManagement/chargeManagement/EditCharge";
import ApprovalView from "./pages/approvalMaster/ApprovalView";
import EligibilityList from "./pages/Eligibilty&ScoreManagement/EligibilityManagement/EligibilityList";
import EligibilityView from "./pages/Eligibilty&ScoreManagement/EligibilityManagement/EligibilityView";
import EligibilityForm from "./pages/Eligibilty&ScoreManagement/EligibilityManagement/EligibilityForm";
import BankingList from "./pages/Eligibilty&ScoreManagement/BankingManagement/BankingList";
import BankingView from "./pages/Eligibilty&ScoreManagement/BankingManagement/BankingView";
import BankingForm from "./pages/Eligibilty&ScoreManagement/BankingManagement/BankingForm";
import ExistingObligationList from "./pages/Eligibilty&ScoreManagement/ExistingObligationManagement/ExistingObligationList";
import ExistingObligationView from "./pages/Eligibilty&ScoreManagement/ExistingObligationManagement/ExistingObligationView";
import ExistingObligationForm from "./pages/Eligibilty&ScoreManagement/ExistingObligationManagement/ExistingObligationForm";
import ScoreCardList from "./pages/Eligibilty&ScoreManagement/ScoreCardManagement/ScoreCardList";
import ScoreCardView from "./pages/Eligibilty&ScoreManagement/ScoreCardManagement/ScoreCardView";
import ScoreCardForm from "./pages/Eligibilty&ScoreManagement/ScoreCardManagement/ScoreCardForm";
import AddTemplate from "./pages/templateManagement/predefineTemplate/AddTemplate";
import ViewTemplate from "./pages/templateManagement/predefineTemplate/ViewTemplate";
import EditTemplate from "./pages/templateManagement/predefineTemplate/EditTemplate";
import PredefinedTemplateList from "./pages/templateManagement/predefineTemplate/PredefinedTemplateList";
import CustomizeTemplateList from "./pages/templateManagement/customizeTemplate/CustomizeTemplateList";
import CustomizeTemplateView from "./pages/templateManagement/customizeTemplate/CustomizeTemplateView";
import CustomizeTemplateEdit from "./pages/templateManagement/customizeTemplate/CustomizeTemplateEdit";
import RepaymentList from "./pages/productManagement/repaymentManagement/RepaymentList";
import AddRepayment from "./pages/productManagement/repaymentManagement/AddRepayment";
import RepaymentDetail from "./pages/productManagement/repaymentManagement/RepaymentDetail";
import EditRepayment from "./pages/productManagement/repaymentManagement/EditRepayment";

import MoratoriumList from "./pages/productManagement/moratiumManagment/MoratoriumList";
import AddMoratorium from "./pages/productManagement/moratiumManagment/AddMoratorium";
import MoratoriumDetail from "./pages/productManagement/moratiumManagment/MoratoriumDetail";
import EditMoratorium from "./pages/productManagement/moratiumManagment/EditMoratorium";
import PenaltyList from "./pages/productManagement/penaltyManagement/PenaltyList";
import AddPenalty from "./pages/productManagement/penaltyManagement/AddPenalty";
import PenaltyDetail from "./pages/productManagement/penaltyManagement/PenaltyDetail";
import EditPenalty from "./pages/productManagement/penaltyManagement/EditPenalty";

import LoanImprovementList from "./pages/loanImproveManagement/LoanImprovementList";
import LoanImprovementDashboard from "./pages/loanImproveManagement/LoanImprovementDashboard";
import ChangeInterestRate from "./pages/loanImproveManagement/ChangeInterestRate";
import ChangeRepaymentPeriod from "./pages/loanImproveManagement/ChangeRepaymentPeriod";
import ChangeRepaymentAmount from "./pages/loanImproveManagement/ChangeRepaymentAmount";
import ChangeLoanProduct from "./pages/loanImproveManagement/ChangeLoanProduct";
import ChangeFeesCharges from "./pages/loanImproveManagement/ChangeFeesCharges";
import ChangeCollateral from "./pages/loanImproveManagement/ChangeCollateral";
import RepaymentRationalisation from "./pages/loanImproveManagement/RepaymentRationalisation";
import MoratoriumInterest from "./pages/loanImproveManagement/MoratoriumInterest";
import TopUpManagement from "./pages/loanImproveManagement/TopUpManagement";

import SanctionDocumentList from "./pages/documentManagement/sanctions/SanctionDocumentList";
import AddSanctionDocument from "./pages/documentManagement/sanctions/AddSanctionDocument";
import EditSanctionDocument from "./pages/documentManagement/sanctions/EditSanctionDocument";
import ViewSanctionDocument from "./pages/documentManagement/sanctions/ViewSanctionDocument";
import LoanDocumentList from "./pages/documentManagement/loanDocuments/LoanDocumentList";
import AddLoanDocument from "./pages/documentManagement/loanDocuments/AddLoanDocument";
import EditLoanDocument from "./pages/documentManagement/loanDocuments/EditLoanDocument";
import ViewLoanDocument from "./pages/documentManagement/loanDocuments/ViewLoanDocument";

import AddCollateralDocument from "./pages/documentManagement/collateralDocuments/AddCollateralDocument";
import EditCollateralDocument from "./pages/documentManagement/collateralDocuments/EditCollateralDocument";
import ViewCollateralDocument from "./pages/documentManagement/collateralDocuments/ViewCollateralDocument";
import CollateralDocumentList from "./pages/documentManagement/collateralDocuments/CollateralDocumentList";
import RiskList from "./pages/risk-Management/risk-master/RiskList";
import BankManagement from "./pages/bank-funds/BankManagement";
import FundManagement from "./pages/bank-funds/FundManagement";
import PortfolioManagement from "./pages/bank-funds/PortfolioManagement";
import ModeOfBank from "./pages/bank-funds/ModeOfBank";
import TaxationManagement from "./pages/bank-funds/TaxationManagement";
import BusinessModel from "./pages/bank-funds/BusinessModel";
import EditBank from "./pages/bank-funds/EditBank";
import AddFund from "./pages/bank-funds/AddFund";
import EditFund from "./pages/bank-funds/EditFund";
import ViewFund from "./pages/bank-funds/ViewFund";
import FundAllocationRules from "./pages/bank-funds/FundAllocationRule";
import AddPortfolio from "./pages/bank-funds/AddPortfolio";
import EditPortfolio from "./pages/bank-funds/EditPortfolio";
import ViewPortfolio from "./pages/bank-funds/ViewPortfolio";
import PortfolioBankMatrix from "./pages/bank-funds/PortfolioBankMatrix";
import PortfolioAllocationRules from "./pages/bank-funds/PortfolioAllocationRule";
import ModeFormPage from "./pages/bank-funds/ModeFormPage";
import ModeViewPage from "./pages/bank-funds/ModeViewPage";
import TaxFormPage from "./pages/bank-funds/TaxFormPage";
import TaxViewPage from "./pages/bank-funds/TaxViewPage";
import BusinessModelFormPage from "./pages/bank-funds/BusinessModelFormPage";
import BusinessModelViewPage from "./pages/bank-funds/BusinessModelViewPage";
import VendorList from "./pages/profile-management/vendor/VendorList";
import VendorView from "./pages/profile-management/vendor/VendorView";
import VendorMasterEdit from "./pages/profile-management/vendor/VendorMasterEdit";
import AgentList from "./pages/profile-management/agent/AgentList";
import AgentView from "./pages/profile-management/agent/AgentView";
import AgentMasterEdit from "./pages/profile-management/agent/AgentMasterEdit";
import ClientList from "./pages/profile-management/client/ClientList";
import ClientView from "./pages/profile-management/client/ClientView";
import ClientMasterEdit from "./pages/profile-management/client/ClientMasterEdit";
import VendorAdd from "./pages/profile-management/vendor/VendorAdd";
import AgentAdd from "./pages/profile-management/agent/AgentAdd";
import ClientAdd from "./pages/profile-management/client/ClientAdd";
import ChannelPartnerList from "./pages/agent-management/ChannelPartner/ChannelPartnerList";
import ChannelPartnerView from "./pages/agent-management/ChannelPartner/ChannelPartnerView";
import AddEditAgent from "./pages/agent-management/ChannelPartner/AddEditAgent";
import UpdatePayout from "./pages/agent-management/ChannelPartner/UpdatePayout";
import UpdateRecovery from "./pages/agent-management/ChannelPartner/UpdateRecovery";
import AgentPerformance from "./pages/agent-management/ChannelPartner/AgentPerformance";
import ManageTenants from "./pages/agent-management/ChannelPartner/ManageTenants";
import PromotionalOffers from "./pages/agent-management/ChannelPartner/PromotionalOffers";
import PerformanceTemplate from "./pages/agent-management/ChannelPartner/PerformanceTemplate";
import CollectionAgentList from "./pages/agent-management/CollectionAgent/CollectionAgentList";
import CollectionAgentView from "./pages/agent-management/CollectionAgent/CollectionAgentView";
import CollectionAgentForm from "./pages/agent-management/CollectionAgent/CollectionAgentForm";
import LegalAgentForm from "./pages/agent-management/CollectionAgent/LegalAgentForm";
import UpdateAgent from "./pages/agent-management/CollectionAgent/UpdateAgent";
import ManageFees from "./pages/agent-management/CollectionAgent/ManageFees";
import AddRisk from "./pages/risk-Management/risk-master/AddRisk";
import EditRisk from "./pages/risk-Management/risk-master/EditRisk";
import ViewRisk from "./pages/risk-Management/risk-master/ViewRisk";
import MitigationList from "./pages/risk-Management/mitigation/MitigationList";
import AddMitigation from "./pages/risk-Management/mitigation/AddMitigation";
import ViewMitigation from "./pages/risk-Management/mitigation/ViewMitigation";
import EditMitigation from "./pages/risk-Management/mitigation/EditMitigation";

import DeviationList from "./pages/risk-Management/deviation/DeviationList";
import AddDeviation from "./pages/risk-Management/deviation/AddDeviation";
import ViewDeviation from "./pages/risk-Management/deviation/ViewDeviation";
import EditDeviation from "./pages/risk-Management/deviation/EditDeviation";

import RCUList from "./pages/risk-Management/rcu/RCUList";
import ViewRCU from "./pages/risk-Management/rcu/ViewRCU";
import EditRCU from "./pages/risk-Management/rcu/EditRCU";
import AddRCU from "./pages/risk-Management/rcu/AddRCU";

import FraudList from "./pages/risk-Management/fraud/FraudList";
import AddFraud from "./pages/risk-Management/fraud/AddFraud";
import ViewFraud from "./pages/risk-Management/fraud/ViewFraud";
import EditFraud from "./pages/risk-Management/fraud/EditFraud";

import PortfolioLimitList from "./pages/risk-Management/portfolio-limits/PortfolioLimitList";
import AddPortfolioLimit from "./pages/risk-Management/portfolio-limits/AddPortfolioLimit";
import EditPortfolioLimit from "./pages/risk-Management/portfolio-limits/EditPortfolioLimit";
import ViewPortfolioLimit from "./pages/risk-Management/portfolio-limits/ViewPortfolioLimit";

import DefaultLimitList from "./pages/risk-Management/default-limits/DefaultLimitList";
import AddDefaultLimit from "./pages/risk-Management/default-limits/AddDefaultLimit";
import EditDefaultLimit from "./pages/risk-Management/default-limits/EditDefaultLimit";
import ViewDefaultLimit from "./pages/risk-Management/default-limits/ViewDefaultLimit";

import OtherList from "./pages/risk-Management/others/OtherList";
import AddOther from "./pages/risk-Management/others/AddOther";
import EditOther from "./pages/risk-Management/others/EditOther";
import ViewOther from "./pages/risk-Management/others/ViewOther";

import CollectionManagement from "./pages/collection-management/CollectionManagement";
import PaymentGatewayList from "./pages/collection-management/payment-gateways/PaymentGatewayList";
import EditPaymentGateway from "./pages/collection-management/payment-gateways/EditPaymentGateway";
import AddPaymentGateway from "./pages/collection-management/payment-gateways/AddPaymentGateway";
import CollectionControl from "./pages/collection-management/CollectionControl";
import MapClientTeam from "./pages/collection-management/MapClientTeam";
import MapClientAgent from "./pages/collection-management/MapClientAgent";
import PayoutManagement from "./pages/collection-management/PayoutManagement";
import LegalAgentList from "./pages/agent-management/CollectionAgent/LegalAgentList";
import LegalAgentView from "./pages/agent-management/CollectionAgent/LegalAgentView";
import VerificationAgencyList from "./pages/agent-management/VerificationAgency/VerificationAgencyList";
import VerificationAgencyForm from "./pages/agent-management/VerificationAgency/VerificationAgencyForm";
import VerificationAgencyView from "./pages/agent-management/VerificationAgency/VerificationAgencyView";
import ManageVerificationFees from "./pages/agent-management/VerificationAgency/ManageVerificationFees";
import LanguageList from "./pages/ControlsManagement/ManageLanguage/LanguageList";
import LanguageAdd from "./pages/ControlsManagement/ManageLanguage/AddLanguage";
import LanguageEdit from "./pages/ControlsManagement/ManageLanguage/EditLanguage";
import LanguageView from "./pages/ControlsManagement/ManageLanguage/ViewLanguage";
import CountryList from "./pages/ControlsManagement/ManageGeoLocation/CountryList";
import AddCountry from "./pages/ControlsManagement/ManageGeoLocation/AddCountry";
import EditCountry from "./pages/ControlsManagement/ManageGeoLocation/EditCountry";
import StateList from "./pages/ControlsManagement/ManageGeoLocation/StateList";
import AddState from "./pages/ControlsManagement/ManageGeoLocation/AddState";
import EditState from "./pages/ControlsManagement/ManageGeoLocation/EditState";
import CityList from "./pages/ControlsManagement/ManageGeoLocation/CityList";
import AddCity from "./pages/ControlsManagement/ManageGeoLocation/AddCity";
import EditCity from "./pages/ControlsManagement/ManageGeoLocation/EditCity";
import AreaList from "./pages/ControlsManagement/ManageGeoLocation/AreaList";
import AddArea from "./pages/ControlsManagement/ManageGeoLocation/AddArea";
import EditArea from "./pages/ControlsManagement/ManageGeoLocation/EditArea";
import LoginAuthList from "./pages/ControlsManagement/ManageLoginAuthentication/LoginAuthList";
import AddLoginAuth from "./pages/ControlsManagement/ManageLoginAuthentication/AddLoginAuth";
import EditLoginAuth from "./pages/ControlsManagement/ManageLoginAuthentication/EditLoginAuth";
import ViewLoginAuth from "./pages/ControlsManagement/ManageLoginAuthentication/ViewLoginAuth";
import CoApplicantList from "./pages/ControlsManagement/ManageCoApplicant/CoApplicantList";
import AddCoApplicant from "./pages/ControlsManagement/ManageCoApplicant/AddCoApplicant";
import EditCoApplicant from "./pages/ControlsManagement/ManageCoApplicant/EditCoApplicant";
import ViewCoApplicant from "./pages/ControlsManagement/ManageCoApplicant/ViewCoApplicant";
import LoginFeeList from "./pages/ControlsManagement/ManageLoginFees/LoginFeeList";
import AddLoginFee from "./pages/ControlsManagement/ManageLoginFees/AddLoginFee";
import EditLoginFee from "./pages/ControlsManagement/ManageLoginFees/EditLoginFee";
import ViewLoginFee from "./pages/ControlsManagement/ManageLoginFees/ViewLoginFee";
import JointApplicantList from "./pages/ControlsManagement/ManageJointApplicant/JointApplicantList";
import AddJointApplicant from "./pages/ControlsManagement/ManageJointApplicant/AddJointApplicant";
import EditJointApplicant from "./pages/ControlsManagement/ManageJointApplicant/EditJointApplicant";
import ViewJointApplicant from "./pages/ControlsManagement/ManageJointApplicant/ViewJointApplicant";
import ScoreCardRatingHome from "./pages/ControlsManagement/ManageScoreCardRating/ScoreCardRatingHome";
import ReferenceList from "./pages/ControlsManagement/ManageReferences/ReferenceList";
import AddReference from "./pages/ControlsManagement/ManageReferences/AddReference";
import EditReference from "./pages/ControlsManagement/ManageReferences/EditReference";
import ViewReference from "./pages/ControlsManagement/ManageReferences/ViewReference";
// import CreditHistoryList from "./pages/ControlsManagement/ManageScoreCardRating/CreditHistory/CreditHistoryList";
// import AddCreditHistory from "./pages/ControlsManagement/ManageScoreCardRating/CreditHistory/AddCreditHistory";
// import EditCreditHistory from "./pages/ControlsManagement/ManageScoreCardRating/CreditHistory/EditCreditHistory";
// import AddInvestigationReport from "./pages/ControlsManagement/ManageScoreCardRating/InvastigationReport/AddInvestigationReport";
// import EditInvestigationReport from "./pages/ControlsManagement/ManageScoreCardRating/InvastigationReport/EditInvestigationReport";
import InvestigationReportList from "./pages/ControlsManagement/ManageScoreCardRating/InvastigationReport/InvestigationReportList";
// import TeleVerificationList from "./pages/ControlsManagement/ManageVerification/TeleVerification/TeleVerificationList";
// import MeetingList from "./pages/ControlsManagement/ManageVerification/CreditPersonalMeetings/MeetingList";
// import VerificationHome from "./pages/ControlsManagement/ManageVerification/VerificationHome";
// import AddTeleVerification from "./pages/ControlsManagement/ManageVerification/TeleVerification/AddTeleVerification";
// import EditTeleVerification from "./pages/ControlsManagement/ManageVerification/TeleVerification/EditTeleVerification";
// import ViewTeleVerification from "./pages/ControlsManagement/ManageVerification/TeleVerification/ViewTeleVerification";
// import AddMeeting from "./pages/ControlsManagement/ManageVerification/CreditPersonalMeetings/AddMeeting";
// import EditMeeting from "./pages/ControlsManagement/ManageVerification/CreditPersonalMeetings/EditMeeting";
// import ViewMeeting from "./pages/ControlsManagement/ManageVerification/CreditPersonalMeetings/ViewMeeting";
import DisbursementList from "./pages/disbursment-management/disbursement/DisbursementList";
import DisbursementForm from "./pages/disbursment-management/disbursement/DisbursementForm";
import DisbursementDetail from "./pages/disbursment-management/disbursement/DisbursementDetail";
// import AgencyList from "./pages/disbursment-management/agency/AgencyList";
// import AgencyDetail from "./pages/disbursment-management/agency/AgencyDetail";
import AgencyForm from "./pages/disbursment-management/agency/AgencyForm";
// import DocumentDetail from "./pages/disbursment-management/document/DocumentDetail";
// import DocumentList from "./pages/disbursment-management/document/DocumentList";
// import DocumentForm from "./pages/disbursment-management/document/DocumentForm";
// import DownPaymentDetail from "./pages/disbursment-management/downPayment/DownPaymentDetail";
// import DownPaymentList from "./pages/disbursment-management/downPayment/DownPaymentList";
// import DownPaymentForm from "./pages/disbursment-management/downPayment/DownPaymentForm";
// import FrequencyForm from "./pages/disbursment-management/frequency/FrequencyForm";
// import FrequencyList from "./pages/disbursment-management/frequency/FrequencyList";
// import FrequencyDetail from "./pages/disbursment-management/frequency/FrequencyDetail";
// import ThirdPartyDetail from "./pages/disbursment-management/third-party/ThirdPartyDetail";
// import ThirdPartyList from "./pages/disbursment-management/third-party/ThirdPartyList";
// import ThirdPartyForm from "./pages/disbursment-management/third-party/ThirdPartyForm";
// import StageMasterDetail from "./pages/disbursment-management/stage/StageMasterDetail";
// import StageMasterList from "./pages/disbursment-management/stage/StageMasterList";
// import StageMasterForm from "./pages/disbursment-management/stage/StageMasterForm";

import ClassificationForm from "./pages/provisioning-classification/loan-classification/ClassificationForm";
import ClassificationList from "./pages/provisioning-classification/loan-classification/ClassificationList";
import ClassificationManage from "./pages/provisioning-classification/loan-classification/ClassificationManage";
import ClassificationUpdate from "./pages/provisioning-classification/loan-classification/ClassificationUpdate";

import ProvisioningRuleList from "./pages/provisioning-classification/provisioning-npa/ProvisioningRuleList";
import ProvisioningRuleForm from "./pages/provisioning-classification/provisioning-npa/ProvisioningRuleForm";
import ProvisioningManagerForm from "./pages/provisioning-classification/provisioning-npa/ProvisioningManagerForm";

import SettlementManage from "./pages/provisioning-classification/settlement/SettlementManage";
import SettlementUpdate from "./pages/provisioning-classification/settlement/SettlementUpdate";
import SettlementRuleForm from "./pages/provisioning-classification/settlement/SettlementRuleForm";
import SettlementRuleList from "./pages/provisioning-classification/settlement/SettlementRuleList";

import WriteoffManage from "./pages/provisioning-classification/writeoff-settlement/WriteoffManage";
import WriteoffUpdate from "./pages/provisioning-classification/writeoff-settlement/WriteoffUpdate";
import WriteoffRuleForm from "./pages/provisioning-classification/writeoff-settlement/WriteoffRuleForm";
import WriteoffRuleList from "./pages/provisioning-classification/writeoff-settlement/WriteoffRuleList";

import IncentiveRuleForm from "./pages/provisioning-classification/incentive-management/IncentiveRuleForm";
import IncentiveRuleList from "./pages/provisioning-classification/incentive-management/IncentiveRuleList";
import CurrencyList from "./pages/currency-management/CurrencyList";
import CurrencyForm from "./pages/currency-management/CurrencyForm";
import CurrencyView from "./pages/currency-management/CurrencyView";
import ConcessionList from "./pages/concession-management/ConcessionList";
import ConcessionView from "./pages/concession-management/ConcessionView";
import ConcessionTypeForm from "./pages/concession-management/ConcessionTypeForm";
import ConcessionCategoryForm from "./pages/concession-management/ConcessionCategoryForm";
import RuleNameList from "./pages/rule-management/rule-master/RuleNameList";
import AddRuleName from "./pages/rule-management/rule-master/AddRuleName";
import EditRuleName from "./pages/rule-management/rule-master/EditRuleName";
import ViewRuleName from "./pages/rule-management/rule-master/ViewRuleName";
import ImpactValueList from "./pages/rule-management/impact-values/ImpactValueList";
import AddImpactValue from "./pages/rule-management/impact-values/AddImpactValue";
import EditImpactValue from "./pages/rule-management/impact-values/EditImpactValue";
import ViewImpactValue from "./pages/rule-management/impact-values/ViewImpactValue";
import ClientProfileRuleList from "./pages/rule-management/client-profile/ClientProfileRuleList";
import AddClientProfileRule from "./pages/rule-management/client-profile/AddClientProfileRule";
import EditClientProfileRule from "./pages/rule-management/client-profile/EditClientProfileRule";
import ViewClientProfileRule from "./pages/rule-management/client-profile/ViewClientProfileRule";
import InternalVerificationRule from "./pages/rule-management/verification/InternalVerificationRule";
import EditInternalVerificationRule from "./pages/rule-management/verification/EditInternalVerificationRule";
import ViewInternalVerificationRule from "./pages/rule-management/verification/ViewInternalVerificationRule";
import AgencyVerificationRule from "./pages/rule-management/verification/AgencyVerificationRule";
import EditAgencyVerificationRule from "./pages/rule-management/verification/EditAgencyVerificationRule";
import ViewAgencyVerificationRule from "./pages/rule-management/verification/ViewAgencyVerificationRule";
import VerificationDashboard from "./pages/rule-management/verification/VerificationRuleHome";
import VerificationRuleHome from "./pages/rule-management/verification/VerificationRuleHome";

import FinancialRuleList from "./pages/rule-management/financial-eligibility/FinancialRuleList";
import AddFinancialRule from "./pages/rule-management/financial-eligibility/AddFinancialRule";
import EditFinancialRule from "./pages/rule-management/financial-eligibility/EditFinancialRule";
import ViewFinancialRule from "./pages/rule-management/financial-eligibility/ViewFinancialRule";
import CollateralRuleList from "./pages/rule-management/collateral-quality/CollateralRuleList";
import AddCollateralRule from "./pages/rule-management/collateral-quality/AddCollateralRule";
import EditCollateralRule from "./pages/rule-management/collateral-quality/EditCollateralRule";
import ViewCollateralRule from "./pages/rule-management/collateral-quality/ViewCollateralRule";
import ViewRiskMitigationRule from "./pages/rule-management/risk-mitigation/ViewRiskMitigationRule";
import EditRiskMitigationRule from "./pages/rule-management/risk-mitigation/EditRiskMitigationRule";
import AddRiskMitigationRule from "./pages/rule-management/risk-mitigation/AddRiskMitigationRule";
import RiskMitigationRuleList from "./pages/rule-management/risk-mitigation/RiskMitigationRuleList";
import ViewGeoLocationRule from "./pages/rule-management/scorecard/ViewGeoLocationRule";
import EditGeoLocationRule from "./pages/rule-management/scorecard/EditGeoLocationRule";
import AddGeoLocationRule from "./pages/rule-management/scorecard/AddGeoLocationRule";
import GeoLocationRuleList from "./pages/rule-management/scorecard/GeoLocationRuleList";
import EditInternalScoreRule from "./pages/rule-management/scorecard/EditInternalScoreRule";
import AddInternalScoreRule from "./pages/rule-management/scorecard/AddInternalScoreRule";
import ViewInternalScoreRule from "./pages/rule-management/scorecard/ViewInternalScoreRule";
import ViewCreditHistoryRule from "./pages/rule-management/scorecard/ViewCreditHistoryRule";
import CreditHistoryRuleList from "./pages/rule-management/scorecard/CreditHistoryRuleList";
import AddCreditHistoryRule from "./pages/rule-management/scorecard/AddCreditHistoryRule";
import EditCreditHistoryRule from "./pages/rule-management/scorecard/EditCreditHistoryRule";
import InternalScoreRuleList from "./pages/rule-management/scorecard/InternalScoreRuleList";
import ScorecardHome from "./pages/rule-management/scorecard/ScorecardHome";
import AddPermission from "./pages/roles/AddPermission";
import EditSubscriber from "./pages/subscription/EditSubscriber";
import ManageGeoLocation from "./pages/ControlsManagement/ManageGeoLocation/ManageGeoLocation";
import GeoForm from "./pages/ControlsManagement/ManageGeoLocation/GeoForm";
import GeoList from "./pages/ControlsManagement/ManageGeoLocation/GeoList";
import GeoLocationList from "./pages/ControlsManagement/ManageGeoLocation/GeoLocationList";
import AddInternalVerificationRule from "./pages/rule-management/verification/AddInternalVerificationRule";
import AddAgencyVerificationRule from "./pages/rule-management/verification/AddAgencyVerificationRule";
import ApplicationProcessList from "./pages/ControlsManagement/ManageApplicationProcess/ApplicationProcessList";
import UpdateApplication from "./pages/ControlsManagement/ManageApplicationProcess/UpdateApplication";
import UpdateProcessingMode from "./pages/ControlsManagement/ManageApplicationProcess/UpdateProcessingMode";
import ApplicationSettings from "./pages/ControlsManagement/ManageApplicationProcess/ApplicationSettings";
import UpdateActionType from "./pages/ControlsManagement/ManageApplicationProcess/UpdateActionType";
import MainLayout from "./layout/MainLayout";
import Unauthorized from "./components/Unauthorized";
import ReferenceCheckList from "./pages/ControlsManagement/ManageScoreCardRating/ReferenceCheck/ReferenceCheckList";
import ViewProduct from "./pages/productManagement/product/ViewProduct";
import AddBank from "./pages/bank-funds/AddBank";

export default function App() {
  //  AUTH + RBAC HELPERS

  const isAuthenticated = () => {
    return !!localStorage.getItem("access_token");
  };

  const getPermissions = () => {
    const perms = localStorage.getItem("permissions");
    if (!perms) return [];
    return perms
      .split(",")
      .map((p) => p.trim().toLowerCase())
      .filter(Boolean);
  };

  const hasPermission = (permission) => {
    if (!permission) return true;
    return getPermissions().includes(permission.toLowerCase());
  };

  //  ROUTE GUARDS

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  };

  const RBACRoute = ({ permission, children }) => {
    if (!hasPermission(permission)) {
      return <Navigate to="/unauthorized" replace />;
    }
    return children;
  };

  /* ===============================
     APP ROUTES
  =============================== */

  return (
    <BrowserRouter>
      <Routes>
        {/* ============ PUBLIC ============ */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ============ PROTECTED ROOT ============ */}

        {/* -------- Dashboard -------- */}
        <Route
          path="dashboard"
          element={
            <RBACRoute permission="dashboard.view">
              <Dashboard />
            </RBACRoute>
          }
        />

        {/* -------- Organization -------- */}
        <Route
          path="organizations"
          element={
            <RBACRoute permission="organization.view">
              <Organization />
            </RBACRoute>
          }
        />
        <Route
          path="organizations/list"
          element={
            <RBACRoute permission="organization.view">
              <OrganizationList />
            </RBACRoute>
          }
        />
        <Route
          path="organizations/add"
          element={
            <RBACRoute permission="organization.create">
              <AddOrganization />
            </RBACRoute>
          }
        />
        <Route
          path="organizations/:id/edit"
          element={
            <RBACRoute permission="organization.update">
              <EditOrganization />
            </RBACRoute>
          }
        />

        {/* -------- Branch -------- */}
        <Route
          path="organizations/branches/list"
          element={
            <RBACRoute permission="branch.view">
              <BranchList />
            </RBACRoute>
          }
        />
        <Route
          path="organizations/branches/add"
          element={
            <RBACRoute permission="branch.create">
              <CreateBranch />
            </RBACRoute>
          }
        />
        <Route
          path="organizations/branches/update/:id"
          element={
            <RBACRoute permission="branch.update">
              <UpdateBranch />
            </RBACRoute>
          }
        />

        {/* -------- Users -------- */}
        <Route
          path="users"
          element={
            <RBACRoute permission="users.view">
              <UserList />
            </RBACRoute>
          }
        />
        <Route
          path="users/add"
          element={
            <RBACRoute permission="users.create">
              <AddUser />
            </RBACRoute>
          }
        />

        {/* ================= ROLES AND PERMISSION ================= */}
        <Route
          path="roles/"
          element={
            <RBACRoute permission="roles.view">
              <Roles />
            </RBACRoute>
          }
        />

        <Route
          path="roles/list"
          element={
            <RBACRoute permission="roles.view">
              <RoleList />
            </RBACRoute>
          }
        />

        <Route
          path="roles/create"
          element={
            <RBACRoute permission="roles.create">
              <CreateRole />
            </RBACRoute>
          }
        />

        <Route
          path="roles/set-permissions/"
          element={
            <RBACRoute permission="permission.assign">
              <SetPermissions />
            </RBACRoute>
          }
        />

        <Route
          path="roles/assign-permissions/"
          element={
            <RBACRoute permission="permission.assign">
              <AssignPermissions />
            </RBACRoute>
          }
        />

        <Route
          path="roles/add-permission/"
          element={
            <RBACRoute permission="permission.create">
              <AddPermission />
            </RBACRoute>
          }
        />

        {/* ================= ELIGIBILITY ================= */}
        <Route
          path="/eligibility"
          element={
            <RBACRoute permission="eligibility.view">
              <EligibilityList />
            </RBACRoute>
          }
        />

        <Route
          path="/eligibility/view/:id"
          element={
            <RBACRoute permission="eligibility.view">
              <EligibilityView />
            </RBACRoute>
          }
        />

        <Route
          path="/eligibility/add"
          element={
            <RBACRoute permission="eligibility.create">
              <EligibilityForm />
            </RBACRoute>
          }
        />

        <Route
          path="/eligibility/edit/:id"
          element={
            <RBACRoute permission="eligibility.update">
              <EligibilityForm isEdit="true" />
            </RBACRoute>
          }
        />

        {/* ================= BANKING ================= */}
        <Route
          path="/banking"
          element={
            <RBACRoute permission="banking.view">
              <BankingList />
            </RBACRoute>
          }
        />

        <Route
          path="/banking/view/:id"
          element={
            <RBACRoute permission="banking.view">
              <BankingView />
            </RBACRoute>
          }
        />

        <Route
          path="/banking/add"
          element={
            <RBACRoute permission="banking.create">
              <BankingForm />
            </RBACRoute>
          }
        />

        <Route
          path="/banking/edit/:id"
          element={
            <RBACRoute permission="banking.update">
              <BankingForm isEdit="true" />
            </RBACRoute>
          }
        />

        {/* ================= OBLIGATION ================= */}
        <Route
          path="/obligation"
          element={
            <RBACRoute permission="obligation.view">
              <ExistingObligationList />
            </RBACRoute>
          }
        />

        <Route
          path="/obligation/view/:id"
          element={
            <RBACRoute permission="obligation.view">
              <ExistingObligationView />
            </RBACRoute>
          }
        />

        <Route
          path="/obligation/add"
          element={
            <RBACRoute permission="obligation.create">
              <ExistingObligationForm />
            </RBACRoute>
          }
        />

        <Route
          path="/obligation/edit/:id"
          element={
            <RBACRoute permission="obligation.update">
              <ExistingObligationForm />
            </RBACRoute>
          }
        />

        {/* ================= SCORE CARD ================= */}
        <Route
          path="/score-card"
          element={
            <RBACRoute permission="score.view">
              <ScoreCardList />
            </RBACRoute>
          }
        />

        <Route
          path="/score-card/view/:id"
          element={
            <RBACRoute permission="score.view">
              <ScoreCardView />
            </RBACRoute>
          }
        />

        <Route
          path="/score-card/add"
          element={
            <RBACRoute permission="score.create">
              <ScoreCardForm />
            </RBACRoute>
          }
        />

        <Route
          path="/score-card/edit/:id"
          element={
            <RBACRoute permission="score.update">
              <ScoreCardForm />
            </RBACRoute>
          }
        />

        {/* ================= APPROVALS ================= */}
        <Route
          path="/approvals"
          element={
            <RBACRoute permission="approval.view">
              <ApprovalList />
            </RBACRoute>
          }
        />

        <Route
          path="/approvals/add/"
          element={
            <RBACRoute permission="approval.create">
              <AddApproval />
            </RBACRoute>
          }
        />

        <Route
          path="/manage-approvals"
          element={
            <RBACRoute permission="approval.assign">
              <ManageApprovalPage />
            </RBACRoute>
          }
        />

        <Route
          path="/escalation"
          element={
            <RBACRoute permission="approval.escalation">
              <EscalationPage />
            </RBACRoute>
          }
        />

        {/* ================= AUDITS ================= */}
        <Route
          path="/audits"
          element={
            <RBACRoute permission="audit.view">
              <AuditMain />
            </RBACRoute>
          }
        />

        <Route
          path="subscriptions/"
          element={
            <RBACRoute permission="subscriptions.view">
              <SubscriptionHome />
            </RBACRoute>
          }
        />

        <Route
          path="subscriptions/list/"
          element={
            <RBACRoute permission="subscriptions.view">
              <SubscriptionPage />
            </RBACRoute>
          }
        />

        <Route
          path="subscriptions/add/"
          element={
            <RBACRoute permission="subscriptions.create">
              <AddSubscription />
            </RBACRoute>
          }
        />
        {/* ======report======= */}

        <Route
          path="reports/"
          element={
            <RBACRoute permission="reports.manage">
              <ReportingAnalytics />
            </RBACRoute>
          }
        />

        <Route
          path="reports/daily-disbursement/"
          element={
            <RBACRoute permission="reports.view">
              <DailyDisbursementReport />
            </RBACRoute>
          }
        />

        <Route
          path="reports/branch-performance/"
          element={
            <RBACRoute permission="reports.view">
              <BranchPerformanceReport />
            </RBACRoute>
          }
        />

        <Route
          path="reports/loan-approval-rejection/"
          element={
            <RBACRoute permission="reports.view">
              <LoanApprovalRejectionReport />
            </RBACRoute>
          }
        />
        <Route
          path="reports/npa-report/"
          element={
            <RBACRoute permission="reports.view">
              <NpaReport />
            </RBACRoute>
          }
        />

        <Route
          path="reports/revenue-report/"
          element={
            <RBACRoute permission="reports.view">
              <RevenueReport />
            </RBACRoute>
          }
        />
        <Route
          path="reports/user-activity-report/"
          element={
            <RBACRoute permission="reports.view">
              <UserActivityReport />
            </RBACRoute>
          }
        />
        {/* ======audit======= */}
        <Route
          path="audits/"
          element={
            <RBACRoute permission="audit.view">
              <AuditMain />
            </RBACRoute>
          }
        />

        <Route
          path="audits/user-actions/"
          element={
            <RBACRoute permission="audits.view">
              <ViewUserActions />
            </RBACRoute>
          }
        />
        <Route
          path="audits/user-actions/"
          element={
            <RBACRoute permission="audits.view">
              <ViewUserActions />
            </RBACRoute>
          }
        />

        <Route
          path="audits/edits-deletes/"
          element={
            <RBACRoute permission="audits.view">
              <TrackEditsDeletes />
            </RBACRoute>
          }
        />

        <Route
          path="audits/timestamps/"
          element={
            <RBACRoute permission="audits.view">
              <ActivityTimeline />
            </RBACRoute>
          }
        />

        <Route
          path="audits/ip-logs/"
          element={
            <RBACRoute permission="audits.view">
              <TrackIpLogs />
            </RBACRoute>
          }
        />

        <Route
          path="audits/branch-data/"
          element={
            <RBACRoute permission="audits.view">
              <BranchDataMonitor />
            </RBACRoute>
          }
        />
        {/* ======subscriptions====== */}
        <Route
          path="subscriptions/"
          element={
            <RBACRoute permission="subscriptions.view">
              <SubscriptionHome />
            </RBACRoute>
          }
        />

        <Route
          path="subscriptions/list/"
          element={
            <RBACRoute permission="subscriptions.view">
              <SubscriptionPage />
            </RBACRoute>
          }
        />
        <Route
          path="subscriptions/add/"
          element={
            <RBACRoute permission="subscriptions.create">
              <AddSubscription />
            </RBACRoute>
          }
        />
        <Route
          path="subscriptions/edit/:uuid"
          element={
            <RBACRoute permission="subscriptions.update">
              <EditSubscription />
            </RBACRoute>
          }
        />

        {/* coupons */}

        <Route
          path="coupons/"
          element={
            <RBACRoute permission="coupon.view">
              <CouponPage />
            </RBACRoute>
          }
        />

        <Route
          path="coupons/add"
          element={
            <RBACRoute permission="coupon.create">
              <AddCoupon />
            </RBACRoute>
          }
        />

        <Route
          path="coupons/edit/:uuid"
          element={
            <RBACRoute permission="coupon.update">
              <EditCoupon />
            </RBACRoute>
          }
        />

        {/* subscribers */}

        <Route
          path="subscribers/"
          element={
            <RBACRoute permission="subscriber.view">
              <SubscribersPage />
            </RBACRoute>
          }
        />

        {/* employment */}

        <Route
          path="employment-types/"
          element={
            <RBACRoute permission="employment_types.view">
              <EmploymentTypePage />
            </RBACRoute>
          }
        />

        <Route
          path="employment-types/add"
          element={
            <RBACRoute permission="employment_types.add">
              <AddEmploymentTypePage />
            </RBACRoute>
          }
        />

        <Route
          path="employment-types/edit/:uuid"
          element={
            <RBACRoute permission="employment_types.edit">
              <EditEmploymentTypePage />
            </RBACRoute>
          }
        />

        <Route
          path="employment-types/view/:uuid"
          element={
            <RBACRoute permission="employment_types.view">
              <ViewEmploymentTypePage />
            </RBACRoute>
          }
        />
        {/* occupation */}

        <Route
          path="occupation-types/"
          element={
            <RBACRoute permission="occupation_types.view">
              <OccupationTypePage />
            </RBACRoute>
          }
        />

        <Route
          path="occupation-types/add"
          element={
            <RBACRoute permission="occupation_types.add">
              <AddOccupationTypePage />
            </RBACRoute>
          }
        />

        <Route
          path="occupation-types/edit/:uuid"
          element={
            <RBACRoute permission="occupation_types.edit">
              <EditOccupationTypePage />
            </RBACRoute>
          }
        />

        <Route
          path="occupation-types/view/:uuid"
          element={
            <RBACRoute permission="occupation_types.view">
              <ViewOccupationTypePage />
            </RBACRoute>
          }
        />

        {/* document */}

        <Route
          path="document"
          element={
            <RBACRoute permission="documents.view">
              <Notification />
            </RBACRoute>
          }
        />
        {/* product */}

        <Route
          path="product-management/list"
          element={
            <RBACRoute permission="product.view">
              <ProductList />
            </RBACRoute>
          }
        />

        <Route
          path="product-management/add"
          element={
            <RBACRoute permission="product.create">
              <AddProduct />
            </RBACRoute>
          }
        />

        <Route
          path="product-management/:id/edit"
          element={
            <RBACRoute permission="product.update">
              <EditProduct />
            </RBACRoute>
          }
        />
        <Route
          path="product-management/:id/view"
          element={
            <RBACRoute permission="product.view">
              <ViewProduct />
            </RBACRoute>
          }
        />

        {/* product-mix */}

        <Route
          path="product-mix/list"
          element={
            <RBACRoute permission="product_mix.view">
              <ProductMixList />
            </RBACRoute>
          }
        />

        <Route
          path="product-mix/add"
          element={
            <RBACRoute permission="product_mix.create">
              <AddProductMix />
            </RBACRoute>
          }
        />

        <Route
          path="product-mix/:id/edit"
          element={
            <RBACRoute permission="product_mix.update">
              <EditProductMix />
            </RBACRoute>
          }
        />

        {/* fees */}

        <Route
          path="fees/list"
          element={
            <RBACRoute permission="fees.view">
              <FeeList />
            </RBACRoute>
          }
        />

        <Route
          path="fees/add"
          element={
            <RBACRoute permission="fees.create">
              <AddFees />
            </RBACRoute>
          }
        />

        <Route
          path="fees/:id/edit"
          element={
            <RBACRoute permission="fees.update">
              <EditFees />
            </RBACRoute>
          }
        />

        {/* interest */}

        <Route
          path="interest/list"
          element={
            <RBACRoute permission="interest.view">
              <InterestList />
            </RBACRoute>
          }
        />

        <Route
          path="interest/add"
          element={
            <RBACRoute permission="interest.create">
              <AddInterest />
            </RBACRoute>
          }
        />

        <Route
          path="interest/:id"
          element={
            <RBACRoute permission="interest.update">
              <InterestDetail />
            </RBACRoute>
          }
        />

        <Route
          path="interest/:id/edit"
          element={
            <RBACRoute permission="interest.update">
              <EditInterest />
            </RBACRoute>
          }
        />

        {/* charges */}

        <Route
          path="charges/list"
          element={
            <RBACRoute permission="charges.view">
              <ChargeList />
            </RBACRoute>
          }
        />

        <Route
          path="charges/add"
          element={
            <RBACRoute permission="charges.create">
              <AddCharge />
            </RBACRoute>
          }
        />

        <Route
          path="charges/:id"
          element={
            <RBACRoute permission="charges.update">
              <ChargeDetail />
            </RBACRoute>
          }
        />

        <Route
          path="charges/edit/:id"
          element={
            <RBACRoute permission="charges.update">
              <EditCharge />
            </RBACRoute>
          }
        />

        {/* repayment */}

        <Route
          path="repayment/list"
          element={
            <RBACRoute permission="repayment.view">
              <RepaymentList />
            </RBACRoute>
          }
        />

        <Route
          path="repayment/add"
          element={
            <RBACRoute permission="repayment.create">
              <AddRepayment />
            </RBACRoute>
          }
        />

        <Route
          path="repayment/:id"
          element={
            <RBACRoute permission="repayment.update">
              <RepaymentDetail />
            </RBACRoute>
          }
        />

        <Route
          path="repayment/:id/edit"
          element={
            <RBACRoute permission="repayment.update">
              <EditRepayment />
            </RBACRoute>
          }
        />

        {/* moratorium */}

        <Route
          path="moratorium"
          element={
            <RBACRoute permission="moratorium.view">
              <MoratoriumList />
            </RBACRoute>
          }
        />

        <Route
          path="moratorium/add"
          element={
            <RBACRoute permission="moratorium.create">
              <AddMoratorium />
            </RBACRoute>
          }
        />

        <Route
          path="moratorium/:id"
          element={
            <RBACRoute permission="moratorium.update">
              <MoratoriumDetail />
            </RBACRoute>
          }
        />

        <Route
          path="moratorium/:id/edit"
          element={
            <RBACRoute permission="moratorium.update">
              <EditMoratorium />
            </RBACRoute>
          }
        />

        {/* penalties */}

        <Route
          path="penalties"
          element={
            <RBACRoute permission="penalties.view">
              <PenaltyList />
            </RBACRoute>
          }
        />

        <Route
          path="penalties/add"
          element={
            <RBACRoute permission="penalties.create">
              <AddPenalty />
            </RBACRoute>
          }
        />

        <Route
          path="penalties/:id"
          element={
            <RBACRoute permission="penalties.update">
              <PenaltyDetail />
            </RBACRoute>
          }
        />

        <Route
          path="penalties/:id/edit"
          element={
            <RBACRoute permission="penalties.update">
              <EditPenalty />
            </RBACRoute>
          }
        />

        {/* loan-improvement */}

        <Route
          path="loan-improvement"
          element={
            <RBACRoute permission="loan_improvement.view">
              <LoanImprovementList />
            </RBACRoute>
          }
        />

        <Route
          path="loan-improvement/:loanId"
          element={
            <RBACRoute permission="loan_improvement.view">
              <LoanImprovementDashboard />
            </RBACRoute>
          }
        />

        <Route
          path="loan-improvement/:loanId/interest-rate"
          element={
            <RBACRoute permission="loan_improvement.update">
              <ChangeInterestRate />
            </RBACRoute>
          }
        />

        <Route
          path="loan-improvement/:loanId/tenure"
          element={
            <RBACRoute permission="loan_improvement.update">
              <ChangeRepaymentPeriod />
            </RBACRoute>
          }
        />

        <Route
          path="loan-improvement/:loanId/emi"
          element={
            <RBACRoute permission="loan_improvement.update">
              <ChangeRepaymentAmount />
            </RBACRoute>
          }
        />

        <Route
          path="loan-improvement/:loanId/product"
          element={
            <RBACRoute permission="loan_improvement.update">
              <ChangeLoanProduct />
            </RBACRoute>
          }
        />

        <Route
          path="loan-improvement/:loanId/fees"
          element={
            <RBACRoute permission="loan_improvement.update">
              <ChangeFeesCharges />
            </RBACRoute>
          }
        />

        <Route
          path="loan-improvement/:loanId/collateral"
          element={
            <RBACRoute permission="loan_improvement.update">
              <ChangeCollateral />
            </RBACRoute>
          }
        />

        <Route
          path="loan-improvement/:loanId/rationalisation"
          element={
            <RBACRoute permission="loan_improvement.update">
              <RepaymentRationalisation />
            </RBACRoute>
          }
        />

        <Route
          path="loan-improvement/:loanId/moratorium"
          element={
            <RBACRoute permission="loan_improvement.update">
              <MoratoriumInterest />
            </RBACRoute>
          }
        />

        <Route
          path="loan-improvement/:loanId/top-up"
          element={
            <RBACRoute permission="loan_improvement.update">
              <TopUpManagement />
            </RBACRoute>
          }
        />

        {/* Template Management */}

        <Route
          path="predefine-template/"
          element={
            <RBACRoute permission="template.predefine">
              <PredefinedTemplateList />
            </RBACRoute>
          }
        />
        <Route
          path="customize-template/"
          element={
            <RBACRoute permission="template.customize">
              <CustomizeTemplateList />
            </RBACRoute>
          }
        />

        {/* Bank & Fund */}

        <Route
          path="bank-management/"
          element={
            <RBACRoute permission="bank.view">
              <BankManagement />
            </RBACRoute>
          }
        />

        <Route
          path="bank-management/add"
          element={
            <RBACRoute permission="bank.create">
              <AddBank />
            </RBACRoute>
          }
        />

        <Route
          path="bank-management/edit/:id"
          element={
            <RBACRoute permission="bank.update">
              <EditBank />
            </RBACRoute>
          }
        />

        <Route
          path="fund-management/"
          element={
            <RBACRoute permission="fund.view">
              <FundManagement />
            </RBACRoute>
          }
        />

        <Route
          path="fund-management/add"
          element={
            <RBACRoute permission="fund.create">
              <AddFund />
            </RBACRoute>
          }
        />

        <Route
          path="fund-management/edit/:id"
          element={
            <RBACRoute permission="fund.update">
              <EditFund />
            </RBACRoute>
          }
        />

        <Route
          path="portfolio-management/"
          element={
            <RBACRoute permission="fund.view">
              <PortfolioManagement />
            </RBACRoute>
          }
        />

        <Route
          path="portfolio-management/add"
          element={
            <RBACRoute permission="fund.create">
              <AddPortfolio />
            </RBACRoute>
          }
        />

        <Route
          path="portfolio-management/edit/:id"
          element={
            <RBACRoute permission="fund.update">
              <EditPortfolio />
            </RBACRoute>
          }
        />

        <Route
          path="mode-of-bank/"
          element={
            <RBACRoute permission="fund.view">
              <ModeOfBank />
            </RBACRoute>
          }
        />

        <Route
          path="mode-of-bank/add"
          element={
            <RBACRoute permission="fund.create">
              <ModeFormPage modeType="add" />
            </RBACRoute>
          }
        />

        <Route
          path="mode-of-bank/edit/:id"
          element={
            <RBACRoute permission="fund.update">
              <ModeFormPage modeType="edit" />
            </RBACRoute>
          }
        />

        <Route
          path="taxation-management/"
          element={
            <RBACRoute permission="fund.view">
              <TaxationManagement />
            </RBACRoute>
          }
        />

        <Route
          path="taxation-management/add"
          element={
            <RBACRoute permission="fund.create">
              <TaxFormPage modeType="add" />
            </RBACRoute>
          }
        />

        <Route
          path="taxation-management/edit/:id"
          element={
            <RBACRoute permission="fund.update">
              <TaxFormPage modeType="edit" />
            </RBACRoute>
          }
        />

        <Route
          path="business-model/"
          element={
            <RBACRoute permission="fund.view">
              <BusinessModel />
            </RBACRoute>
          }
        />

        <Route
          path="business-model/add"
          element={
            <RBACRoute permission="fund.create">
              <BusinessModelFormPage modeType="add" />
            </RBACRoute>
          }
        />

        <Route
          path="business-model/edit/:id"
          element={
            <RBACRoute permission="fund.update">
              <BusinessModelFormPage modeType="edit" />
            </RBACRoute>
          }
        />
        <Route
          path="business-model/view/:id"
          element={
            <RBACRoute permission="fund.update">
              <BusinessModelViewPage />
            </RBACRoute>
          }
        />

        {/* Document */}

        <Route
          path="documents/sanction"
          element={
            <RBACRoute permission="sanction_documents.view">
              <SanctionDocumentList />
            </RBACRoute>
          }
        />

        <Route
          path="documents/sanction/add"
          element={
            <RBACRoute permission="sanction_documents.add">
              <AddSanctionDocument />
            </RBACRoute>
          }
        />

        <Route
          path="documents/sanction/:id/edit"
          element={
            <RBACRoute permission="sanction_documents.edit">
              <EditSanctionDocument />
            </RBACRoute>
          }
        />

        <Route
          path="documents/sanction/:id"
          element={
            <RBACRoute permission="sanction_documents.view">
              <ViewSanctionDocument />
            </RBACRoute>
          }
        />

        {/* loan document */}

        <Route
          path="documents/loan"
          element={
            <RBACRoute permission="loan_documents.view">
              <LoanDocumentList />
            </RBACRoute>
          }
        />

        <Route
          path="documents/loan/add"
          element={
            <RBACRoute permission="loan_documents.add">
              <AddLoanDocument />
            </RBACRoute>
          }
        />

        <Route
          path="documents/loan/:id/edit"
          element={
            <RBACRoute permission="loan_documents.edit">
              <EditLoanDocument />
            </RBACRoute>
          }
        />

        <Route
          path="documents/loan/:id"
          element={
            <RBACRoute permission="loan_documents.view">
              <ViewLoanDocument />
            </RBACRoute>
          }
        />

        {/* Document Management */}

        <Route
          path="documents/collateral"
          element={
            <RBACRoute permission="collateral_documents.view">
              <CollateralDocumentList />
            </RBACRoute>
          }
        />

        <Route
          path="documents/collateral/add"
          element={
            <RBACRoute permission="collateral_documents.add">
              <AddCollateralDocument />
            </RBACRoute>
          }
        />

        <Route
          path="documents/collateral/:id/edit"
          element={
            <RBACRoute permission="collateral_documents.edit">
              <EditCollateralDocument />
            </RBACRoute>
          }
        />

        <Route
          path="documents/collateral/:id"
          element={
            <RBACRoute permission="collateral_documents.view">
              <ViewCollateralDocument />
            </RBACRoute>
          }
        />

        {/* Risk Management */}

        <Route
          path="risk-management/risks"
          element={
            <RBACRoute permission="risks.view">
              <RiskList />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/risks/add"
          element={
            <RBACRoute permission="risks.add">
              <AddRisk />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/risks/:id/view"
          element={
            <RBACRoute permission="risks.view">
              <ViewRisk />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/risks/:id/edit"
          element={
            <RBACRoute permission="risks.edit">
              <EditRisk />
            </RBACRoute>
          }
        />

        {/* Risk Mitigation */}

        <Route
          path="risk-management/mitigation"
          element={
            <RBACRoute permission="risk_mitigation.view">
              <MitigationList />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/mitigation/add"
          element={
            <RBACRoute permission="risk_mitigation.add">
              <AddMitigation />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/mitigation/:id/view"
          element={
            <RBACRoute permission="risk_mitigation.view">
              <ViewMitigation />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/mitigation/:id/edit"
          element={
            <RBACRoute permission="risk_mitigation.edit">
              <EditMitigation />
            </RBACRoute>
          }
        />
        {/* Deviation Management */}

        <Route
          path="risk-management/deviations"
          element={
            <RBACRoute permission="deviations.view">
              <DeviationList />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/deviations/add"
          element={
            <RBACRoute permission="deviations.add">
              <AddDeviation />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/deviations/:id/view"
          element={
            <RBACRoute permission="deviations.view">
              <ViewDeviation />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/deviations/:id/edit"
          element={
            <RBACRoute permission="deviations.edit">
              <EditDeviation />
            </RBACRoute>
          }
        />

        {/* RCU */}

        <Route
          path="risk-management/rcu"
          element={
            <RBACRoute permission="rcu.view">
              <RCUList />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/rcu/add"
          element={
            <RBACRoute permission="rcu.add">
              <AddRCU />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/rcu/:id/view"
          element={
            <RBACRoute permission="rcu.view">
              <ViewRCU />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/rcu/:id/edit"
          element={
            <RBACRoute permission="rcu.edit">
              <EditRCU />
            </RBACRoute>
          }
        />

        {/* Fraud Management */}

        <Route
          path="risk-management/fraud"
          element={
            <RBACRoute permission="fraud.view">
              <FraudList />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/fraud/add"
          element={
            <RBACRoute permission="fraud.add">
              <AddFraud />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/fraud/:id/view"
          element={
            <RBACRoute permission="fraud.view">
              <ViewFraud />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/fraud/:id/edit"
          element={
            <RBACRoute permission="fraud.edit">
              <EditFraud />
            </RBACRoute>
          }
        />
        {/* Portfolio Limits */}

        <Route
          path="risk-management/portfolio-limits"
          element={
            <RBACRoute permission="portfolio_limits.view">
              <PortfolioLimitList />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/portfolio-limits/add"
          element={
            <RBACRoute permission="portfolio_limits.add">
              <AddPortfolioLimit />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/portfolio-limits/:id/view"
          element={
            <RBACRoute permission="portfolio_limits.view">
              <ViewPortfolioLimit />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/portfolio-limits/:id/edit"
          element={
            <RBACRoute permission="portfolio_limits.edit">
              <EditPortfolioLimit />
            </RBACRoute>
          }
        />
        {/* Default Limits */}

        <Route
          path="risk-management/default-limits"
          element={
            <RBACRoute permission="default_limits.view">
              <DefaultLimitList />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/default-limits/add"
          element={
            <RBACRoute permission="default_limits.add">
              <AddDefaultLimit />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/default-limits/:id/view"
          element={
            <RBACRoute permission="default_limits.view">
              <ViewDefaultLimit />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/default-limits/:id/edit"
          element={
            <RBACRoute permission="default_limits.edit">
              <EditDefaultLimit />
            </RBACRoute>
          }
        />

        {/* Risk Management */}

        <Route
          path="risk-management/others"
          element={
            <RBACRoute permission="risk_others.view">
              <OtherList />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/others/add"
          element={
            <RBACRoute permission="risk_others.add">
              <AddOther />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/others/:id/view"
          element={
            <RBACRoute permission="risk_others.view">
              <ViewOther />
            </RBACRoute>
          }
        />

        <Route
          path="risk-management/others/:id/edit"
          element={
            <RBACRoute permission="risk_others.edit">
              <EditOther />
            </RBACRoute>
          }
        />

        {/* Agent Management */}

        <Route
          path="channel-partners"
          element={
            <RBACRoute permission="channel_partners.view">
              <ChannelPartnerList />
            </RBACRoute>
          }
        />

        <Route
          path="channel-partners/add"
          element={
            <RBACRoute permission="channel_partners.create">
              <AddEditAgent />
            </RBACRoute>
          }
        />

        <Route
          path="channel-partners/edit/:id"
          element={
            <RBACRoute permission="channel_partners.update">
              <AddEditAgent />
            </RBACRoute>
          }
        />

        <Route
          path="channel-partners/view/:id"
          element={
            <RBACRoute permission="channel_partners.view">
              <ChannelPartnerView />
            </RBACRoute>
          }
        />

        <Route
          path="channel-partners/payout/:id"
          element={
            <RBACRoute permission="channel_partners.update">
              <UpdatePayout />
            </RBACRoute>
          }
        />

        <Route
          path="channel-partners/recovery/:id"
          element={
            <RBACRoute permission="channel_partners.update">
              <UpdateRecovery />
            </RBACRoute>
          }
        />

        <Route
          path="channel-partners/performance/:id"
          element={
            <RBACRoute permission="channel_partners.view">
              <AgentPerformance />
            </RBACRoute>
          }
        />

        <Route
          path="channel-partners/tenants/:id"
          element={
            <RBACRoute permission="channel_partners.update">
              <ManageTenants />
            </RBACRoute>
          }
        />

        {/* Collection Agent Management */}

        <Route
          path="collection-agent"
          element={
            <RBACRoute permission="collection_agent.view">
              <CollectionAgentList />
            </RBACRoute>
          }
        />

        <Route
          path="collection-agent/add"
          element={
            <RBACRoute permission="collection_agent.create">
              <CollectionAgentForm />
            </RBACRoute>
          }
        />

        <Route
          path="collection-agent/edit/:id"
          element={
            <RBACRoute permission="collection_agent.update">
              <CollectionAgentForm />
            </RBACRoute>
          }
        />

        <Route
          path="collection-agent/view/:id"
          element={
            <RBACRoute permission="collection_agent.view">
              <CollectionAgentView />
            </RBACRoute>
          }
        />

        <Route
          path="collection-agent/update/:id"
          element={
            <RBACRoute permission="collection_agent.update">
              <UpdateAgent />
            </RBACRoute>
          }
        />

        <Route
          path="collection-agent/fees/:id"
          element={
            <RBACRoute permission="collection_agent.update">
              <ManageFees />
            </RBACRoute>
          }
        />
        {/* Legal / Verification Agencies */}

        <Route
          path="legal-agent"
          element={
            <RBACRoute permission="legal_agent.view">
              <LegalAgentList />
            </RBACRoute>
          }
        />

        <Route
          path="legal-agents/add"
          element={
            <RBACRoute permission="legal_agent.create">
              <LegalAgentForm />
            </RBACRoute>
          }
        />

        <Route
          path="legal-agents/edit/:id"
          element={
            <RBACRoute permission="legal_agent.update">
              <LegalAgentForm />
            </RBACRoute>
          }
        />

        <Route
          path="legal-agents/view/:id"
          element={
            <RBACRoute permission="legal_agent.view">
              <LegalAgentView />
            </RBACRoute>
          }
        />
        <Route
          path="verification-agency"
          element={
            <RBACRoute permission="verification_agency.view">
              <VerificationAgencyList />
            </RBACRoute>
          }
        />

        <Route
          path="verification-agency/add"
          element={
            <RBACRoute permission="verification_agency.create">
              <VerificationAgencyForm />
            </RBACRoute>
          }
        />

        <Route
          path="verification-agency/edit/:id"
          element={
            <RBACRoute permission="verification_agency.update">
              <VerificationAgencyForm />
            </RBACRoute>
          }
        />

        <Route
          path="verification-agency/view/:id"
          element={
            <RBACRoute permission="verification_agency.view">
              <VerificationAgencyView />
            </RBACRoute>
          }
        />

        <Route
          path="verification-agency/manage-fees/:id"
          element={
            <RBACRoute permission="verification_agency.update">
              <ManageVerificationFees />
            </RBACRoute>
          }
        />
        {/* Controls */}

        <Route
          path="controls/language"
          element={
            <RBACRoute permission="language.view">
              <LanguageList />
            </RBACRoute>
          }
        />

        <Route
          path="controls/language/add"
          element={
            <RBACRoute permission="language.create">
              <LanguageAdd />
            </RBACRoute>
          }
        />

        <Route
          path="controls/language/edit/:id"
          element={
            <RBACRoute permission="language.update">
              <LanguageEdit />
            </RBACRoute>
          }
        />

        <Route
          path="controls/language/view/:id"
          element={
            <RBACRoute permission="language.view">
              <LanguageView />
            </RBACRoute>
          }
        />

        <Route
          path="controls/geo"
          element={
            <RBACRoute permission="geo.view">
              <GeoLocationList />
            </RBACRoute>
          }
        />

        <Route
          path="controls/geo/add"
          element={
            <RBACRoute permission="geo.create">
              <AddGeoLocationRule />
            </RBACRoute>
          }
        />

        <Route
          path="controls/geo/edit/:id"
          element={
            <RBACRoute permission="geo.update">
              <EditGeoLocationRule />
            </RBACRoute>
          }
        />

        <Route
          path="controls/geo/view/:id"
          element={
            <RBACRoute permission="geo.view">
              <ViewGeoLocationRule />
            </RBACRoute>
          }
        />

        <Route
          path="controls/login-auth"
          element={
            <RBACRoute permission="login_auth.view">
              <LoginAuthList />
            </RBACRoute>
          }
        />

        <Route
          path="controls/login-auth/add"
          element={
            <RBACRoute permission="login_auth.create">
              <AddLoginAuth />
            </RBACRoute>
          }
        />

        <Route
          path="controls/login-auth/edit/:id"
          element={
            <RBACRoute permission="login_auth.update">
              <EditLoginAuth />
            </RBACRoute>
          }
        />

        <Route
          path="controls/login-auth/view/:id"
          element={
            <RBACRoute permission="login_auth.view">
              <ViewLoginAuth />
            </RBACRoute>
          }
        />

        <Route
          path="controls/co-applicant"
          element={
            <RBACRoute permission="coapplicant.view">
              <CoApplicantList />
            </RBACRoute>
          }
        />

        <Route
          path="controls/co-applicant/add"
          element={
            <RBACRoute permission="coapplicant.create">
              <AddCoApplicant />
            </RBACRoute>
          }
        />

        <Route
          path="controls/co-applicant/edit/:id"
          element={
            <RBACRoute permission="coapplicant.update">
              <EditCoApplicant />
            </RBACRoute>
          }
        />

        <Route
          path="controls/co-applicant/view/:id"
          element={
            <RBACRoute permission="coapplicant.view">
              <ViewCoApplicant />
            </RBACRoute>
          }
        />

        <Route
          path="controls/login-fees"
          element={
            <RBACRoute permission="loginfee.view">
              <LoginFeeList />
            </RBACRoute>
          }
        />

        <Route
          path="controls/login-fees/add"
          element={
            <RBACRoute permission="loginfee.create">
              <AddLoginFee />
            </RBACRoute>
          }
        />

        <Route
          path="controls/login-fees/edit/:id"
          element={
            <RBACRoute permission="loginfee.update">
              <EditLoginFee />
            </RBACRoute>
          }
        />

        <Route
          path="controls/login-fees/view/:id"
          element={
            <RBACRoute permission="loginfee.view">
              <ViewLoginFee />
            </RBACRoute>
          }
        />

        <Route
          path="controls/joint-applicant"
          element={
            <RBACRoute permission="joint_applicant.view">
              <JointApplicantList />
            </RBACRoute>
          }
        />

        <Route
          path="controls/joint-applicant/add"
          element={
            <RBACRoute permission="joint_applicant.create">
              <AddJointApplicant />
            </RBACRoute>
          }
        />

        <Route
          path="controls/joint-applicant/edit/:id"
          element={
            <RBACRoute permission="joint_applicant.update">
              <EditJointApplicant />
            </RBACRoute>
          }
        />

        <Route
          path="controls/joint-applicant/view/:id"
          element={
            <RBACRoute permission="joint_applicant.view">
              <ViewJointApplicant />
            </RBACRoute>
          }
        />

        <Route
          path="controls/references"
          element={
            <RBACRoute permission="references.view">
              <ReferenceList />
            </RBACRoute>
          }
        />

        <Route
          path="controls/references/add"
          element={
            <RBACRoute permission="references.create">
              <AddReference />
            </RBACRoute>
          }
        />

        <Route
          path="controls/references/edit/:id"
          element={
            <RBACRoute permission="reference.update">
              <EditReference />
            </RBACRoute>
          }
        />

        <Route
          path="controls/references/view/:id"
          element={
            <RBACRoute permission="references.view">
              <ViewReference />
            </RBACRoute>
          }
        />

        <Route
          path="controls/application-process"
          element={
            <RBACRoute permission="application.view">
              <ApplicationProcessList />
            </RBACRoute>
          }
        />

        <Route
          path="controls/application-process/add"
          element={
            <RBACRoute permission="application.update">
              <ApplicationSettings />
            </RBACRoute>
          }
        />

        <Route
          path="controls/application-process/action-type"
          element={
            <RBACRoute permission="application.update">
              <UpdateActionType />
            </RBACRoute>
          }
        />

        <Route
          path="controls/application-process/processing-mode"
          element={
            <RBACRoute permission="application.update">
              <UpdateProcessingMode />
            </RBACRoute>
          }
        />

        <Route
          path="controls/application-process/update-application"
          element={
            <RBACRoute permission="application.update">
              <UpdateApplication />
            </RBACRoute>
          }
        />

        <Route
          path="controls/score-card"
          element={
            <RBACRoute permission="scorecard.view">
              <ScoreCardRatingHome />
            </RBACRoute>
          }
        />

        <Route
          path="controls/score-card/reference-check"
          element={
            <RBACRoute permission="scorecard.view">
              <ReferenceCheckList />
            </RBACRoute>
          }
        />
        <Route
          path="controls/score-card/credit-history"
          element={
            <RBACRoute permission="scorecard.view">
              <CreditHistoryRuleList />
            </RBACRoute>
          }
        />
        <Route
          path="controls/score-card/investigation-report"
          element={
            <RBACRoute permission="scorecard.view">
              <InvestigationReportList />
            </RBACRoute>
          }
        />

        <Route
          path="controls/verification"
          element={
            <RBACRoute permission="verification.view">
              <VerificationDashboard />
            </RBACRoute>
          }
        />

        {/* Collection Management */}

        <Route path="collection-management">
          <Route
            index
            element={
              <RBACRoute permission="collection_management.view">
                <CollectionManagement />
              </RBACRoute>
            }
          />

          <Route path="payment-gateways">
            <Route
              index
              element={
                <RBACRoute permission="payment_gateways.view">
                  <PaymentGatewayList />
                </RBACRoute>
              }
            />
            <Route
              path="add"
              element={
                <RBACRoute permission="payment_gateways.add">
                  <AddPaymentGateway />
                </RBACRoute>
              }
            />
            <Route
              path=":id/edit"
              element={
                <RBACRoute permission="payment_gateways.edit">
                  <EditPaymentGateway />
                </RBACRoute>
              }
            />
          </Route>

          <Route
            path="controls"
            element={
              <RBACRoute permission="collection_controls.view">
                <CollectionControl />
              </RBACRoute>
            }
          />

          <Route
            path="client-team-mapping/add"
            element={
              <RBACRoute permission="collection_mapping.add">
                <MapClientTeam />
              </RBACRoute>
            }
          />

          <Route
            path="client-agent-mapping/add"
            element={
              <RBACRoute permission="collection_mapping.add">
                <MapClientAgent />
              </RBACRoute>
            }
          />

          <Route
            path="payouts/add"
            element={
              <RBACRoute permission="collection_payouts.add">
                <PayoutManagement />
              </RBACRoute>
            }
          />
        </Route>

        {/* Disbursement Management */}

        <Route path="disbursement-management">
          <Route
            index
            element={
              <RBACRoute permission="disbursement.view">
                <DisbursementList />
              </RBACRoute>
            }
          />

          <Route path="disbursement">
            <Route
              index
              element={
                <RBACRoute permission="disbursement.view">
                  <DisbursementList />
                </RBACRoute>
              }
            />
            <Route
              path="add"
              element={
                <RBACRoute permission="disbursement.add">
                  <DisbursementForm />
                </RBACRoute>
              }
            />
            <Route
              path=":id/edit"
              element={
                <RBACRoute permission="disbursement.edit">
                  <DisbursementForm />
                </RBACRoute>
              }
            />
            <Route
              path=":id/view"
              element={
                <RBACRoute permission="disbursement.view">
                  <DisbursementDetail />
                </RBACRoute>
              }
            />
          </Route>
        </Route>

        {/* Provisioning / Classification */}

        <Route path="provisioning-classification/loan-classification">
          <Route
            index
            element={
              <RBACRoute permission="loan_classification.view">
                <ClassificationList />
              </RBACRoute>
            }
          />
          <Route
            path="add"
            element={
              <RBACRoute permission="loan_classification.add">
                <ClassificationForm />
              </RBACRoute>
            }
          />
          <Route
            path=":id/edit"
            element={
              <RBACRoute permission="loan_classification.edit">
                <ClassificationForm />
              </RBACRoute>
            }
          />
          <Route
            path=":id/update"
            element={
              <RBACRoute permission="loan_classification.edit">
                <ClassificationUpdate />
              </RBACRoute>
            }
          />
          <Route
            path=":id/manage"
            element={
              <RBACRoute permission="loan_classification.edit">
                <ClassificationManage />
              </RBACRoute>
            }
          />
        </Route>

        <Route
          path="writeoff"
          element={
            <RBACRoute permission="writeoff.view">
              <Outlet />
            </RBACRoute>
          }
        >
          <Route index element={<WriteoffRuleList />} />

          <Route
            path="add"
            element={
              <RBACRoute permission="writeoff.add">
                <WriteoffRuleForm />
              </RBACRoute>
            }
          />

          <Route
            path=":id/edit"
            element={
              <RBACRoute permission="writeoff.edit">
                <WriteoffRuleForm />
              </RBACRoute>
            }
          />

          <Route
            path=":id/update"
            element={
              <RBACRoute permission="writeoff.update">
                <WriteoffUpdate />
              </RBACRoute>
            }
          />

          <Route
            path=":id/manage"
            element={
              <RBACRoute permission="writeoff.manage">
                <WriteoffManage />
              </RBACRoute>
            }
          />
        </Route>

        <Route
          path="settlement"
          element={
            <RBACRoute permission="settlement.view">
              <Outlet />
            </RBACRoute>
          }
        >
          <Route index element={<SettlementRuleList />} />

          <Route
            path="add"
            element={
              <RBACRoute permission="settlement.add">
                <SettlementRuleForm />
              </RBACRoute>
            }
          />

          <Route
            path=":id/edit"
            element={
              <RBACRoute permission="settlement.edit">
                <SettlementRuleForm />
              </RBACRoute>
            }
          />

          <Route
            path=":id/update"
            element={
              <RBACRoute permission="settlement.update">
                <SettlementUpdate />
              </RBACRoute>
            }
          />

          <Route
            path=":id/manage"
            element={
              <RBACRoute permission="settlement.manage">
                <SettlementManage />
              </RBACRoute>
            }
          />
        </Route>

        <Route
          path="provisioning-npa"
          element={
            <RBACRoute permission="provisioning.view">
              <Outlet />
            </RBACRoute>
          }
        >
          <Route index element={<ProvisioningRuleList />} />

          <Route
            path="add"
            element={
              <RBACRoute permission="provisioning.add">
                <ProvisioningRuleForm />
              </RBACRoute>
            }
          />

          <Route
            path=":id/edit"
            element={
              <RBACRoute permission="provisioning.edit">
                <ProvisioningRuleForm />
              </RBACRoute>
            }
          />

          <Route
            path=":id/manage"
            element={
              <RBACRoute permission="provisioning.manage">
                <ProvisioningManagerForm />
              </RBACRoute>
            }
          />
        </Route>
        <Route
          path="incentive-management"
          element={
            <RBACRoute permission="incentive.view">
              <Outlet />
            </RBACRoute>
          }
        >
          <Route index element={<IncentiveRuleList />} />

          <Route
            path="add"
            element={
              <RBACRoute permission="incentive.add">
                <IncentiveRuleForm />
              </RBACRoute>
            }
          />

          <Route
            path=":id/edit"
            element={
              <RBACRoute permission="incentive.edit">
                <IncentiveRuleForm />
              </RBACRoute>
            }
          />
        </Route>
        <Route
          path="/currency-management"
          element={
            <RBACRoute permission="currency.view">
              <CurrencyList />
            </RBACRoute>
          }
        />

        <Route
          path="/currency-management/add"
          element={
            <RBACRoute permission="currency.create">
              <CurrencyForm />
            </RBACRoute>
          }
        />

        <Route
          path="/currency-management/edit/:uuid"
          element={
            <RBACRoute permission="currency.update">
              <CurrencyForm isEdit />
            </RBACRoute>
          }
        />

        <Route
          path="/currency-management/view/:uuid"
          element={
            <RBACRoute permission="currency.view">
              <CurrencyView />
            </RBACRoute>
          }
        />

        {/* concession-management */}

        <Route
          path="/concession-management"
          element={
            <RBACRoute permission="concession.view">
              <Outlet />
            </RBACRoute>
          }
        >
          {/* Concession List */}

          <Route index element={<ConcessionList />} />

          {/* -------- Concession Type -------- */}

          <Route
            path="type/add"
            element={
              <RBACRoute permission="concession_type.create">
                <ConcessionTypeForm />
              </RBACRoute>
            }
          />

          <Route
            path="type/edit/:id"
            element={
              <RBACRoute permission="concession_type.update">
                <ConcessionTypeForm />
              </RBACRoute>
            }
          />

          <Route
            path="type/view/:id"
            element={
              <RBACRoute permission="concession_type.view">
                <ConcessionView />
              </RBACRoute>
            }
          />

          {/* -------- Concession Category -------- */}

          <Route
            path="category/add"
            element={
              <RBACRoute permission="concession_category.create">
                <ConcessionCategoryForm />
              </RBACRoute>
            }
          />

          <Route
            path="category/edit/:id"
            element={
              <RBACRoute permission="concession_category.update">
                <ConcessionCategoryForm />
              </RBACRoute>
            }
          />

          <Route
            path="category/view/:id"
            element={
              <RBACRoute permission="concession_category.view">
                <ConcessionView />
              </RBACRoute>
            }
          />
        </Route>

        <Route
          path="/rule-management"
          element={
            <RBACRoute permission="rule_management.view">
              <Outlet />
            </RBACRoute>
          }
        >
          {/* ================= RULE MASTER ================= */}

          <Route path="rule-master" element={<RuleNameList />} />

          <Route
            path="rule-master/add"
            element={
              <RBACRoute permission="rule_master.add">
                <AddRuleName />
              </RBACRoute>
            }
          />

          <Route
            path="rule-master/edit/:id"
            element={
              <RBACRoute permission="rule_master.edit">
                <EditRuleName />
              </RBACRoute>
            }
          />

          <Route
            path="rule-master/view/:id"
            element={
              <RBACRoute permission="rule_master.view">
                <ViewRuleName />
              </RBACRoute>
            }
          />

          {/* ================= IMPACT VALUES ================= */}

          <Route path="impact-values" element={<ImpactValueList />} />

          <Route
            path="impact-values/add"
            element={
              <RBACRoute permission="impact_value.add">
                <AddImpactValue />
              </RBACRoute>
            }
          />

          <Route
            path="impact-values/edit/:id"
            element={
              <RBACRoute permission="impact_value.edit">
                <EditImpactValue />
              </RBACRoute>
            }
          />

          <Route
            path="impact-values/view/:id"
            element={
              <RBACRoute permission="impact_value.view">
                <ViewImpactValue />
              </RBACRoute>
            }
          />

          {/* ================= CLIENT PROFILE RULE ================= */}

          <Route path="client-profile" element={<ClientProfileRuleList />} />

          <Route
            path="client-profile/add"
            element={
              <RBACRoute permission="client_profile_rule.add">
                <AddClientProfileRule />
              </RBACRoute>
            }
          />

          <Route
            path="client-profile/edit/:id"
            element={
              <RBACRoute permission="client_profile_rule.edit">
                <EditClientProfileRule />
              </RBACRoute>
            }
          />

          <Route
            path="client-profile/view/:id"
            element={
              <RBACRoute permission="client_profile_rule.view">
                <ViewClientProfileRule />
              </RBACRoute>
            }
          />

          {/* ================= VERIFICATION RULES ================= */}

          <Route path="verification" element={<VerificationRuleHome />} />

          {/* Internal */}
          <Route
            path="verification/internal"
            element={<InternalVerificationRule />}
          />

          <Route
            path="verification/internal/add"
            element={
              <RBACRoute permission="verification.internal.add">
                <AddInternalVerificationRule />
              </RBACRoute>
            }
          />

          <Route
            path="verification/internal/edit/:id"
            element={
              <RBACRoute permission="verification.internal.edit">
                <EditInternalVerificationRule />
              </RBACRoute>
            }
          />

          <Route
            path="verification/internal/view/:id"
            element={
              <RBACRoute permission="verification.internal.view">
                <ViewInternalVerificationRule />
              </RBACRoute>
            }
          />

          {/* Agency */}
          <Route
            path="verification/agency"
            element={<AgencyVerificationRule />}
          />

          <Route
            path="verification/agency/add"
            element={
              <RBACRoute permission="verification.agency.add">
                <AddAgencyVerificationRule />
              </RBACRoute>
            }
          />

          <Route
            path="verification/agency/edit/:id"
            element={
              <RBACRoute permission="verification.agency.edit">
                <EditAgencyVerificationRule />
              </RBACRoute>
            }
          />

          <Route
            path="verification/agency/view/:id"
            element={
              <RBACRoute permission="verification.agency.view">
                <ViewAgencyVerificationRule />
              </RBACRoute>
            }
          />

          {/* ================= COLLATERAL QUALITY ================= */}

          <Route path="collateral-quality" element={<CollateralRuleList />} />

          <Route
            path="collateral-quality/add"
            element={
              <RBACRoute permission="collateral_rule.add">
                <AddCollateralRule />
              </RBACRoute>
            }
          />

          <Route
            path="collateral-quality/edit/:id"
            element={
              <RBACRoute permission="collateral_rule.edit">
                <EditCollateralRule />
              </RBACRoute>
            }
          />

          <Route
            path="collateral-quality/view/:id"
            element={
              <RBACRoute permission="collateral_rule.view">
                <ViewCollateralRule />
              </RBACRoute>
            }
          />

          {/* ================= FINANCIAL ELIGIBILITY ================= */}

          <Route path="financial-eligibility" element={<FinancialRuleList />} />

          <Route
            path="financial-eligibility/add"
            element={
              <RBACRoute permission="financial_rule.add">
                <AddFinancialRule />
              </RBACRoute>
            }
          />

          <Route
            path="financial-eligibility/edit/:id"
            element={
              <RBACRoute permission="financial_rule.edit">
                <EditFinancialRule />
              </RBACRoute>
            }
          />

          <Route
            path="financial-eligibility/view/:id"
            element={
              <RBACRoute permission="financial_rule.view">
                <ViewFinancialRule />
              </RBACRoute>
            }
          />

          {/* RULE MANAGEMENT */}

          <Route
            path="rule-management/scorecard"
            element={
              <RBACRoute permission="scorecard.view">
                <ScorecardHome />
              </RBACRoute>
            }
          />

          <Route
            path="rule-management/scorecard/internal"
            element={
              <RBACRoute permission="scorecard.internal.view">
                <InternalScoreRuleList />
              </RBACRoute>
            }
          />

          <Route
            path="rule-management/scorecard/internal/add"
            element={
              <RBACRoute permission="scorecard.internal.add">
                <AddInternalScoreRule />
              </RBACRoute>
            }
          />

          <Route
            path="rule-management/scorecard/internal/edit/:id"
            element={
              <RBACRoute permission="scorecard.internal.edit">
                <EditInternalScoreRule />
              </RBACRoute>
            }
          />

          <Route
            path="rule-management/scorecard/internal/view/:id"
            element={
              <RBACRoute permission="scorecard.internal.view">
                <ViewInternalScoreRule />
              </RBACRoute>
            }
          />

          {/* SCORECARD GEO RULES */}

          <Route
            path="rule-management/scorecard/geo"
            element={
              <RBACRoute permission="scorecard.geo.view">
                <GeoLocationRuleList />
              </RBACRoute>
            }
          />

          <Route
            path="rule-management/scorecard/geo/add"
            element={
              <RBACRoute permission="scorecard.geo.add">
                <AddGeoLocationRule />
              </RBACRoute>
            }
          />

          <Route
            path="rule-management/scorecard/geo/edit/:id"
            element={
              <RBACRoute permission="scorecard.geo.edit">
                <EditGeoLocationRule />
              </RBACRoute>
            }
          />

          <Route
            path="rule-management/scorecard/geo/view/:id"
            element={
              <RBACRoute permission="scorecard.geo.view">
                <ViewGeoLocationRule />
              </RBACRoute>
            }
          />

          {/* SCORECARD  CREDIT HISTORY */}

          <Route
            path="rule-management/scorecard/credit-history"
            element={
              <RBACRoute permission="scorecard.credit_history.view">
                <CreditHistoryRuleList />
              </RBACRoute>
            }
          />

          <Route
            path="rule-management/scorecard/credit-history/add"
            element={
              <RBACRoute permission="scorecard.credit_history.add">
                <AddCreditHistoryRule />
              </RBACRoute>
            }
          />

          <Route
            path="rule-management/scorecard/credit-history/edit/:id"
            element={
              <RBACRoute permission="scorecard.credit_history.edit">
                <EditCreditHistoryRule />
              </RBACRoute>
            }
          />

          <Route
            path="rule-management/scorecard/credit-history/view/:id"
            element={
              <RBACRoute permission="scorecard.credit_history.view">
                <ViewCreditHistoryRule />
              </RBACRoute>
            }
          />

          {/* RULE MANAGEMENT */}

          <Route
            path="rule-management/risk-mitigation"
            element={
              <RBACRoute permission="risk_mitigation.view">
                <RiskMitigationRuleList />
              </RBACRoute>
            }
          />

          <Route
            path="rule-management/risk-mitigation/add"
            element={
              <RBACRoute permission="risk_mitigation.add">
                <AddRiskMitigationRule />
              </RBACRoute>
            }
          />

          <Route
            path="rule-management/risk-mitigation/edit/:id"
            element={
              <RBACRoute permission="risk_mitigation.edit">
                <EditRiskMitigationRule />
              </RBACRoute>
            }
          />

          <Route
            path="rule-management/risk-mitigation/view/:id"
            element={
              <RBACRoute permission="risk_mitigation.view">
                <ViewRiskMitigationRule />
              </RBACRoute>
            }
          />

          {/* PROFILE MANAGEMENT */}

          {/* <Route
            path="profile-management/ven"
            element={
              <RBACRoute permission="vendor.view">
                <VendorList />
              </RBACRoute>
            }
          /> */}

          <Route
          path="vendor"
          element={
            <RBACRoute permission="vendor.view">
              <VendorList />
            </RBACRoute>
          }
        ></Route>

          <Route
            path="profile-management/vendor/add"
            element={
              <RBACRoute permission="vendor.create">
                <VendorAdd />
              </RBACRoute>
            }
          />

          <Route
            path="profile-management/vendor/edit/:id"
            element={
              <RBACRoute permission="vendor.update">
                <VendorMasterEdit />
              </RBACRoute>
            }
          />

          <Route
            path="profile-management/vendor/view/:id"
            element={
              <RBACRoute permission="vendor.view">
                <VendorView />
              </RBACRoute>
            }
          />

          {/* PROFILE  AGENT */}

          <Route
            path="profile-management/agent"
            element={
              <RBACRoute permission="agent.view">
                <AgentList />
              </RBACRoute>
            }
          />

          <Route
            path="profile-management/agent/add"
            element={
              <RBACRoute permission="agent.create">
                <AgentAdd />
              </RBACRoute>
            }
          />

          <Route
            path="profile-management/agent/edit/:id"
            element={
              <RBACRoute permission="agent.update">
                <AgencyForm />
              </RBACRoute>
            }
          />

          <Route
            path="profile-management/agent/view/:id"
            element={
              <RBACRoute permission="agent.view">
                <AgentView />
              </RBACRoute>
            }
          />

          {/* PROFILE  CLIENT */}

          <Route
            path="profile-management/client"
            element={
              <RBACRoute permission="client.view">
                <ClientList />
              </RBACRoute>
            }
          />

          <Route
            path="profile-management/client/add"
            element={
              <RBACRoute permission="client.create">
                <ClientAdd />
              </RBACRoute>
            }
          />

          <Route
            path="profile-management/client/edit/:id"
            element={
              <RBACRoute permission="client.update">
                <ClientMasterEdit />
              </RBACRoute>
            }
          />

          <Route
            path="profile-management/client/view/:id"
            element={
              <RBACRoute permission="client.view">
                <ClientView />
              </RBACRoute>
            }
          />
          {/* CONTROLS MANAGEMENT */}

          <Route
            path="controls-management/geo/form"
            element={
              <RBACRoute permission="geo.add">
                <GeoForm />
              </RBACRoute>
            }
          />

          <Route
            path="controls-management/geo/list"
            element={
              <RBACRoute permission="geo.view">
                <GeoList />
              </RBACRoute>
            }
          />
        </Route>

        {/* ============ FALLBACKS ============ */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
