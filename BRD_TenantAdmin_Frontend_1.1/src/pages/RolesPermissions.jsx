import { useEffect, useState, useMemo } from "react";
import { roleAPI } from "../services/rolesService.js";
import { userAPI } from "../services/userService.js";
import {
  ShieldCheckIcon, UserGroupIcon, PlusIcon, MagnifyingGlassIcon,
  PencilSquareIcon, TrashIcon, DocumentDuplicateIcon, CheckCircleIcon,
  XCircleIcon, ChevronDownIcon, InformationCircleIcon, KeyIcon, ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { rolesApi } from "../services/api.js";

// ============================================================
// CONSTANTS (unchanged)
// ============================================================
const PERMISSION_KEY_MAP = {
  loan_create: { category: "loan_management", value: "CREATE_LOANS" },
  loan_approve: { category: "loan_management", value: "APPROVE_LOANS" },
  loan_view: { category: "loan_management", value: "VIEW_LOANS" },
  loan_edit: { category: "loan_management", value: "EDIT_APPLICATIONS" },
  loan_delete: { category: "loan_management", value: "DELETE_LOANS" },
  application_processing_loan: { category: "loan_management", value: "LOAN_APPLICATION" },
  credit_assessment: { category: "loan_management", value: "CREDIT_ASSESSMENT" },
  loan_lifecycle: { category: "loan_management", value: "LOAN_LIFECYCLE" },
  loan_closure: { category: "loan_management", value: "LOAN_CLOSURE" },
  sanction_approval: { category: "loan_management", value: "SANCTION_APPROVAL" },
  view_docs: { category: "document_management", value: "VIEW_DOCUMENTS" },
  download_docs: { category: "document_management", value: "DOWNLOAD_DOCUMENTS" },
  upload_docs: { category: "document_management", value: "UPLOAD_DOCUMENTS" },
  delete_docs: { category: "document_management", value: "DELETE_DOCUMENTS" },
  document_collection: { category: "document_management", value: "DOCUMENT_COLLECTION" },
  document_verification: { category: "document_management", value: "DOCUMENT_VERIFICATION" },
  kyc_documents: { category: "document_management", value: "KYC_DOCUMENTS" },
  property_documents: { category: "document_management", value: "PROPERTY" },
  income_financial: { category: "document_management", value: "INCOME" },
  audit_logs: { category: "system_administration", value: "AUDIT_LOGS" },
  edit_policies: { category: "system_administration", value: "EDIT_POLICIES" },
  manage_users: { category: "system_administration", value: "MANAGE_USERS" },
  manage_roles: { category: "system_administration", value: "MANAGE_ROLES" },
  manage_branches: { category: "system_administration", value: "MANAGE_BRANCHES" },
  user_management: { category: "system_administration", value: "USER_MANAGEMENT" },
  role_permission: { category: "system_administration", value: "ROLE_PERMISSION" },
  tenant_organization_settings: { category: "system_administration", value: "TENANT" },
  configuration_masters: { category: "system_administration", value: "CONFIGURATION" },
  workflow_setup: { category: "system_administration", value: "WORKFLOW_SETUP" },
  view_reports: { category: "analytics_reports", value: "VIEW_REPORTS" },
  export_reports: { category: "analytics_reports", value: "EXPORT_DATA" },
  dashboard_analytics: { category: "analytics_reports", value: "DASHBOARD" },
  performance_reports: { category: "analytics_reports", value: "PERFORMANCE" },
  customer_analytics: { category: "analytics_reports", value: "CUSTOMER" },
  financial_reports: { category: "analytics_reports", value: "FINANCIAL" },
  operational_reports: { category: "analytics_reports", value: "OPERATIONAL" },
  view_all_branches: { category: "branch_control", value: "VIEW_ALL" },
  edit_branch_details: { category: "branch_control", value: "EDIT_BRANCH" },
  assign_users_to_branches: { category: "branch_control", value: "ASSIGN_USERS" },
  branch_management: { category: "branch_control", value: "BRANCH_MANAGEMENT" },
  branch_wise_user_mapping: { category: "branch_control", value: "BRANCH_USER_MAPPING" },
  branch_wise_loan_access: { category: "branch_control", value: "BRANCH_LOAN_ACCESS" },
  branch_performance_monitoring: { category: "branch_control", value: "BRANCH_PERFORMANCE" },
  geo_area_control: { category: "branch_control", value: "GEO" },
  branch_configuration_settings: { category: "branch_control", value: "BRANCH_CONFIGURATION" },
};

const ROLE_TYPES = [
  { id: "admin", name: "Admin", description: "Full access to specific modules" },
  { id: "manager", name: "Manager", description: "Can approve and oversee operations" },
  { id: "supervisor", name: "Supervisor", description: "Manages team and assigns tasks" },
  { id: "executive", name: "Executive", description: "Operational access for daily tasks" },
  { id: "user", name: "Standard User", description: "Basic read/write access" },
];

const PERMISSION_DEFINITIONS = {
  loan_create: { label: "Create Loans", desc: "Initiate new loan applications" },
  loan_approve: { label: "Approve Loans", desc: "Final approval authority for loans" },
  loan_edit: { label: "Edit Applications", desc: "Modify existing loan details" },
  loan_view: { label: "View Loans", desc: "Read-only access to loan files" },
  loan_delete: { label: "Delete Loans", desc: "Remove loan records permanently" },
  application_processing_loan: { label: "Loan Application Processing", desc: "Apply, submit, reject, rework" },
  credit_assessment: { label: "Credit Assessment", desc: "Credit score view" },
  loan_lifecycle: { label: "Loan Lifecycle", desc: "Written-off status" },
  loan_closure: { label: "Loan Closure", desc: "All clearance before closure" },
  sanction_approval: { label: "Sanction Approval", desc: "Final sanction approval" },
  view_docs: { label: "View Documents", desc: "Preview uploaded documents" },
  download_docs: { label: "Download Documents", desc: "Save documents locally" },
  upload_docs: { label: "Upload Documents", desc: "Add new files to records" },
  delete_docs: { label: "Delete Documents", desc: "Remove files from records" },
  document_collection: { label: "Document Collection", desc: "Upload all documents" },
  document_verification: { label: "Document Verification", desc: "Verify, reject, mark, pending" },
  kyc_documents: { label: "KYC Documents", desc: "Aadhaar, PAN, Voter ID, DL, Passport" },
  income_financial: { label: "Income & Financial Documents", desc: "Salary slip, Bank statement, ITR" },
  property_documents: { label: "Property / Collateral Documents", desc: "Sale deed, Agreement, Valuation report" },
  audit_logs: { label: "Audit Logs", desc: "View system activity history" },
  edit_policies: { label: "Edit Policies", desc: "Modify credit and risk policies" },
  manage_users: { label: "Manage Users", desc: "Create and edit user accounts" },
  manage_roles: { label: "Manage Roles", desc: "Create and edit access roles" },
  manage_branches: { label: "Manage Branches", desc: "Configure branch settings" },
  user_management: { label: "User Management", desc: "Create user, edit, activate / deactivate" },
  role_permission: { label: "Role & Permission Management", desc: "Permission assign to create role" },
  tenant_organization_settings: { label: "Tenant & Organization Settings", desc: "Company info, timezone, currency" },
  configuration_masters: { label: "Configuration Masters", desc: "Loan types, document types, product masters" },
  workflow_setup: { label: "Workflow Setup", desc: "All rules are defined" },
  view_reports: { label: "View Reports", desc: "Access analytical dashboards" },
  export_reports: { label: "Export Data", desc: "Download reports as CSV/PDF" },
  dashboard_analytics: { label: "Dashboard Analytics", desc: "Overall KPIs, charts, performance metrics" },
  performance_reports: { label: "Performance Reports", desc: "Disbursed vs closed, active loans, NPA ratio" },
  customer_analytics: { label: "Customer Analytics", desc: "Customer growth, repeat borrowers, demographics" },
  financial_reports: { label: "Financial Reports", desc: "Interest earned, Outstanding amounts" },
  operational_reports: { label: "Operational Reports", desc: "Branch-wise, User-wise productivity" },
  view_all_branches: { label: "View All Branches", desc: "Access data across all locations" },
  edit_branch_details: { label: "Edit Branch", desc: "Modify branch configurations" },
  assign_users_to_branches: { label: "Assign Users", desc: "Move users between branches" },
  branch_management: { label: "Branch Management", desc: "Create, edit, activate / deactivate branch" },
  branch_wise_user_mapping: { label: "Branch-wise User Mapping", desc: "User assign, transfer between branches" },
  branch_wise_loan_access: { label: "Branch-wise Loan Access", desc: "Which branch sees which loan" },
  branch_performance_monitoring: { label: "Branch Performance Monitoring", desc: "Disbursement, login, approval stats" },
  geo_area_control: { label: "Geo / Area Control", desc: "Pincode, district, zone mapping" },
  branch_configuration_settings: { label: "Branch Configuration Settings", desc: "Working hours, holidays" },
};

const PERMISSION_CATEGORIES = [
  { id: "loan_management", name: "Loan Management", icon: <DocumentDuplicateIcon className="w-4 h-4" />, permissions: ["loan_create","loan_approve","loan_edit","loan_view","loan_delete","application_processing_loan","credit_assessment","loan_lifecycle","loan_closure","sanction_approval"] },
  { id: "document_management", name: "Document Management", icon: <InformationCircleIcon className="w-4 h-4" />, permissions: ["view_docs","download_docs","upload_docs","delete_docs","document_collection","document_verification","kyc_documents","income_financial","property_documents"] },
  { id: "system_administration", name: "System Administration", icon: <ShieldCheckIcon className="w-4 h-4" />, permissions: ["audit_logs","edit_policies","manage_users","manage_roles","manage_branches","user_management","role_permission","tenant_organization_settings","configuration_masters","workflow_setup"] },
  { id: "reports", name: "Analytics & Reports", icon: <ArrowsUpDownIcon className="w-4 h-4" />, permissions: ["view_reports","export_reports","dashboard_analytics","performance_reports","customer_analytics","financial_reports","operational_reports"] },
  { id: "branch_permissions", name: "Branch Control", icon: <UserGroupIcon className="w-4 h-4" />, permissions: ["view_all_branches","edit_branch_details","assign_users_to_branches","branch_management","branch_wise_user_mapping","branch_wise_loan_access","branch_performance_monitoring","geo_area_control","branch_configuration_settings"] },
];

const generateRoleId = (existingRoles) => {
  const existingIds = new Set(existingRoles.map((r) => r.role_id));
  let newId;
  do { newId = Math.floor(10000000 + Math.random() * 90000000).toString(); } while (existingIds.has(newId));
  return newId;
};

const getEmptyRole = () => ({
  role_type: "", name: "", role_id: "", description: "", status: "active",
  permissions: Object.keys(PERMISSION_DEFINITIONS).reduce((acc, key) => { acc[key] = false; return acc; }, {}),
});

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function RolesPermissions() {
  const [activeTab, setActiveTab] = useState("roles");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ type: "", message: "", show: false });
  const [roles, setRoles] = useState([]);
  const [roleSearch, setRoleSearch] = useState("");
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleFormPhase, setRoleFormPhase] = useState(1);
  const [roleForm, setRoleForm] = useState(getEmptyRole());
  const [permissionsSearch, setPermissionsSearch] = useState("");
  const [matrixModalRole, setMatrixModalRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [isUserRoleModalOpen, setIsUserRoleModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [selectedUserNewRoleId, setSelectedUserNewRoleId] = useState("");

  const filteredRoles = useMemo(() => roles.filter((r) => r.name.toLowerCase().includes(roleSearch.toLowerCase()) || r.role_id.toString().includes(roleSearch)), [roles, roleSearch]);
  const filteredUsers = useMemo(() => users.filter((u) => (u.first_name + " " + u.last_name).toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()) || (u.role_type || "").toLowerCase().includes(userSearch.toLowerCase())), [users, userSearch]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try { await Promise.all([loadRoles(), loadUsers()]); }
    catch (error) { showNotification("error", "Failed to load initial data"); }
    finally { setLoading(false); }
  };

  const loadRoles = async () => {
    const res = await roleAPI.list();
    const data = res.data || [];
    const processed = data.map((r) => {
      const permissions = { ...getEmptyRole().permissions };
      Object.entries(PERMISSION_KEY_MAP).forEach(([uiKey, map]) => { permissions[uiKey] = r[map.category]?.includes(map.value) || false; });
      return { id: r.id, role_id: r.id, name: r.role_name, role_type: r.role_type, description: r.description, status: r.role_status, permissions };
    });
    setRoles(processed);
  };

  const loadUsers = async () => {
    try {
      const res = await userAPI.getAll();
      if (res.data) {
        const currentTenant = sessionStorage.getItem("tenant_id");
        setUsers(res.data.filter((u) => u.tenant_id === currentTenant && !["MASTER_ADMIN", "SUPER_ADMIN"].includes(u.role_type)));
      }
    } catch (err) { console.error("Error loading users:", err); }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message, show: true });
    setTimeout(() => setNotification((n) => ({ ...n, show: false })), 4000);
  };

  const handleOpenCreateRole = () => { setEditingRole(null); setRoleForm({ ...getEmptyRole(), role_id: generateRoleId(roles) }); setRoleFormPhase(1); setIsRoleModalOpen(true); };

  const handleEditRole = async (role) => {
    setEditingRole(role);
    try {
      const permRes = await rolesApi.getPermissions(role.role_id);
      let loadedPerms = {};
      if (permRes.ok) {
        if (Array.isArray(permRes.data)) loadedPerms = Object.keys(PERMISSION_DEFINITIONS).reduce((acc, key) => { acc[key] = permRes.data.includes(key); return acc; }, {});
        else loadedPerms = permRes.data;
      }
      setRoleForm({ ...role, permissions: { ...getEmptyRole().permissions, ...loadedPerms } });
      setRoleFormPhase(1); setIsRoleModalOpen(true);
    } catch (e) { showNotification("error", "Could not load role permissions"); }
  };

  const handleCloneRole = (role) => {
    setEditingRole(null);
    setRoleForm({ ...role, name: `${role.name} (Copy)`, role_id: generateRoleId(roles), permissions: role.permissions || getEmptyRole().permissions });
    setRoleFormPhase(1); setIsRoleModalOpen(true);
    showNotification("success", "Role cloned! Please review details.");
  };

  const handleDeleteRole = async (roleId) => {
    if (!window.confirm("Are you sure? This will revoke access for all users with this role.")) return;
    try {
      const res = await roleAPI.delete(roleId);
      if (res.status == 204) { showNotification("success", "Role deleted successfully"); loadRoles(); }
      else showNotification("error", "Failed to delete role");
    } catch (e) { showNotification("error", "An error occurred"); }
  };

  const buildBackendPayload = () => {
    const payload = { role_type: roleForm.role_type.toUpperCase(), role_name: roleForm.name, description: roleForm.description, role_status: roleForm.status };
    Object.entries(roleForm.permissions).forEach(([key, enabled]) => {
      if (!enabled) return;
      const map = PERMISSION_KEY_MAP[key];
      if (map) payload[map.category] = map.value;
    });
    return payload;
  };

  const handleRoleSubmit = async () => {
    try {
      const payload = buildBackendPayload();
      editingRole ? await roleAPI.update(editingRole.id, payload) : await roleAPI.create(payload);
      showNotification("success", editingRole ? "Role updated successfully" : "Role created successfully");
      setIsRoleModalOpen(false); loadRoles();
    } catch (err) { showNotification("error", "Failed to save role"); }
  };

  const togglePermission = (key) => { setRoleForm((prev) => ({ ...prev, permissions: { ...prev.permissions, [key]: !prev.permissions[key] } })); };
  const togglePermissionCategory = (categoryPermissions, shouldEnable) => { setRoleForm((prev) => { const newPerms = { ...prev.permissions }; categoryPermissions.forEach((key) => { newPerms[key] = shouldEnable; }); return { ...prev, permissions: newPerms }; }); };

  const handleUserRoleEdit = (user) => {
    setSelectedUserForEdit(user);
    const matchingRole = roles.find((r) => r.role_id === user.role_id) || roles.find((r) => r.role_type === user.role_type);
    setSelectedUserNewRoleId(matchingRole ? matchingRole.role_id : "");
    setIsUserRoleModalOpen(true);
  };

  const handleUserRoleSave = async () => {
    if (!selectedUserNewRoleId) { showNotification("error", "Please select a role"); return; }
    try {
      const selectedRoleObj = roles.find((r) => r.role_id === selectedUserNewRoleId);
      const payload = { id: selectedUserForEdit.id, role_id: selectedRoleObj.role_id, role_type: selectedRoleObj.role_type, status: selectedUserForEdit.status, first_name: selectedUserForEdit.first_name, last_name: selectedUserForEdit.last_name, email: selectedUserForEdit.email, mobile_no: selectedUserForEdit.mobile_no };
      await userAPI.update(selectedUserForEdit.id, payload);
      showNotification("success", "User role updated successfully");
      setIsUserRoleModalOpen(false); loadUsers();
    } catch (e) { showNotification("error", "Failed to update user role"); }
  };

  const renderPermissionMatrix = (readOnly = false, permissionsObj = roleForm.permissions) => (
    <div className="space-y-4 sm:space-y-6">
      <div className="sticky top-0 bg-white z-10 pb-3 border-b border-gray-100">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input type="text" placeholder="Search permissions..." className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none" value={permissionsSearch} onChange={(e) => setPermissionsSearch(e.target.value)} />
        </div>
      </div>
      {PERMISSION_CATEGORIES.map((category) => {
        const visiblePerms = category.permissions.filter((p) => p.toLowerCase().includes(permissionsSearch.toLowerCase()) || PERMISSION_DEFINITIONS[p]?.label.toLowerCase().includes(permissionsSearch.toLowerCase()));
        if (visiblePerms.length === 0) return null;
        return (
          <div key={category.id} className="bg-gray-50/50 border border-gray-100 rounded-xl overflow-hidden">
            <div className="bg-gray-100/50 px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white rounded-md shadow-sm text-blue-600 shrink-0">{category.icon}</div>
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{category.name}</h4>
              </div>
              {!readOnly && (
                <div className="flex gap-2">
                  <button onClick={() => togglePermissionCategory(visiblePerms, true)} className="text-xs px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors">Select All</button>
                  <button onClick={() => togglePermissionCategory(visiblePerms, false)} className="text-xs px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors">Clear</button>
                </div>
              )}
            </div>
            <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              {visiblePerms.map((key) => {
                const def = PERMISSION_DEFINITIONS[key] || { label: key, desc: "" };
                const isChecked = permissionsObj[key];
                return (
                  <div key={key} onClick={() => !readOnly && togglePermission(key)} className={`relative flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border transition-all ${isChecked ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-white border-gray-200 hover:border-gray-300"} ${readOnly ? "cursor-default" : "cursor-pointer"}`}>
                    <div className={`mt-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${isChecked ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"}`}>
                      {isChecked && <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs sm:text-sm font-semibold leading-snug ${isChecked ? "text-blue-900" : "text-gray-700"}`}>{def.label}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 leading-tight mt-0.5">{def.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/30 p-4 sm:p-6 md:p-8 font-sans">

      {/* Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 sm:px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border-l-4 text-sm sm:text-base max-w-sm ${notification.type === "error" ? "bg-white border-red-500 text-red-700" : "bg-white border-green-500 text-green-700"}`}>
          {notification.type === "error" ? <XCircleIcon className="w-5 h-5 shrink-0" /> : <CheckCircleIcon className="w-5 h-5 shrink-0" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-5 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Access Control Center</h1>
        <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-lg">Manage roles, define permission matrices, and assign access to tenant users.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 sm:gap-6 border-b border-gray-200 mb-5 sm:mb-8 overflow-x-auto">
        {[
          { id: "roles", label: "Roles Configuration", icon: <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5" />, count: roles.length },
          { id: "users", label: "User Access", icon: <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5" />, count: users.length },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`pb-3 px-1 flex items-center gap-1.5 sm:gap-2 font-semibold text-xs sm:text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
            {tab.icon} {tab.label}
            <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[500px] overflow-hidden">

        {/* ROLES TAB */}
        {activeTab === "roles" && (
          <div className="p-4 sm:p-6">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-5 sm:mb-6">
              <div className="relative w-full sm:w-80">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input type="text" placeholder="Filter roles by name or ID..." value={roleSearch} onChange={(e) => setRoleSearch(e.target.value)} className="w-full pl-9 sm:pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm" />
              </div>
              <button onClick={handleOpenCreateRole} className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-200 transition-all active:scale-95 text-sm whitespace-nowrap">
                <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Create New Role
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left border-collapse" style={{ minWidth: "540px" }}>
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider font-bold">
                    <th className="px-4 sm:px-6 py-3 sm:py-4">Role Details</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">Type</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4">Status</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">Permissions</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRoles.map((role) => (
                    <tr key={role.role_id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md shrink-0">
                            {role.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 text-sm truncate">{role.name}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500 font-mono mt-0.5 hidden sm:block">ID: {role.role_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">{role.role_type || "Custom"}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold border ${role.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${role.status === "active" ? "bg-green-500" : "bg-gray-400"}`} />
                          {role.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <button onClick={() => setMatrixModalRole(role)} className="text-xs sm:text-sm text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1">
                          View Matrix <ArrowsUpDownIcon className="w-3 h-3" />
                        </button>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <button onClick={() => handleCloneRole(role)} title="Clone" className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><DocumentDuplicateIcon className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                          <button onClick={() => handleEditRole(role)} title="Edit" className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><PencilSquareIcon className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                          <button onClick={() => handleDeleteRole(role.role_id)} title="Delete" className="p-1.5 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRoles.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                        <ShieldCheckIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-base sm:text-lg font-medium">No roles found</p>
                        <button onClick={handleOpenCreateRole} className="text-indigo-600 font-semibold hover:underline text-sm mt-1">Create the first one?</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="p-4 sm:p-6">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-5 sm:mb-6">
              <div className="relative w-full sm:w-80">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input type="text" placeholder="Search users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="w-full pl-9 sm:pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm" />
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <InformationCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Filtered by current tenant
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredUsers.map((user) => {
                const userRole = roles.find((r) => r.role_id === user.role_id) || roles.find((r) => r.role_type === user.role_type);
                return (
                  <div key={user.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-base sm:text-lg border-2 border-white shadow-sm shrink-0">
                            {user.first_name[0]}{user.last_name[0]}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm truncate">{user.first_name} {user.last_name}</h3>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border shrink-0 ${user.status === "Active" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                          {user.status}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-2.5 sm:p-3 rounded-lg border border-gray-100 mb-4">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Current Role</p>
                        <div className="flex items-center gap-2">
                          <KeyIcon className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="font-semibold text-gray-800 text-sm truncate">{userRole ? userRole.name : user.role_type || "Unassigned"}</span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1 pl-6 line-clamp-1">{userRole ? userRole.description : "No description available"}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex gap-2">
                      <button onClick={() => handleUserRoleEdit(user)} className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs sm:text-sm font-semibold transition-colors">Change Role</button>
                      <button onClick={() => { if (userRole) setMatrixModalRole(userRole); else showNotification("error", "No valid role assigned to view"); }} className="flex-1 py-2 border border-gray-200 hover:border-gray-300 text-gray-600 rounded-lg text-xs sm:text-sm font-semibold transition-colors">View Access</button>
                    </div>
                  </div>
                );
              })}
              {filteredUsers.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <UserGroupIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No users found.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT ROLE MODAL */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-3 sm:p-4 text-center">
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsRoleModalOpen(false)} />
            <div className="relative bg-white rounded-2xl text-left overflow-hidden shadow-xl w-full max-w-2xl sm:max-w-4xl flex flex-col max-h-[90vh]">
              <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900">{editingRole ? "Edit Role Configuration" : "Create New Role"}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Step {roleFormPhase} of 2: {roleFormPhase === 1 ? "Role Details" : "Permission Matrix"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full ${roleFormPhase >= 1 ? "bg-blue-600" : "bg-gray-200"}`} />
                    <div className={`w-2 h-2 rounded-full ${roleFormPhase >= 2 ? "bg-blue-600" : "bg-gray-200"}`} />
                  </div>
                  <button onClick={() => setIsRoleModalOpen(false)} className="text-gray-400 hover:text-gray-500 ml-2 sm:ml-4"><XCircleIcon className="w-6 h-6 sm:w-8 sm:h-8" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                {roleFormPhase === 1 && (
                  <div className="space-y-5 max-w-2xl mx-auto">
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Role Type</label>
                        <select value={roleForm.role_type} onChange={(e) => setRoleForm({ ...roleForm, role_type: e.target.value })} className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 sm:py-3 text-sm">
                          <option value="">Select Role Type...</option>
                          {ROLE_TYPES.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
                          <option value="custom">Custom Role</option>
                        </select>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Role Status</label>
                        <select value={roleForm.status} onChange={(e) => setRoleForm({ ...roleForm, status: e.target.value })} className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 sm:py-3 text-sm">
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Role Name <span className="text-red-500">*</span></label>
                        <input type="text" value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} placeholder="e.g. Senior Loan Officer" className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 sm:py-3 text-sm" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea value={roleForm.description} onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} rows={3} placeholder="Briefly describe what this role is for..." className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 sm:py-3 text-sm resize-none" />
                      </div>
                      <div className="col-span-2 bg-blue-50 p-3 sm:p-4 rounded-xl border border-blue-100 text-xs sm:text-sm text-blue-800 flex gap-3">
                        <InformationCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <p>Role ID is auto-generated as <strong>{roleForm.role_id}</strong>. This identifier is used for system integrations and cannot be changed manually.</p>
                      </div>
                    </div>
                  </div>
                )}
                {roleFormPhase === 2 && renderPermissionMatrix(false)}
              </div>

              <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center border-t border-gray-200">
                {roleFormPhase === 2 ? (
                  <button onClick={() => setRoleFormPhase(1)} className="text-gray-600 font-semibold hover:text-gray-900 text-sm">Back to Details</button>
                ) : <div />}
                <div className="flex gap-2 sm:gap-3">
                  <button onClick={() => setIsRoleModalOpen(false)} className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-white text-sm transition-all">Cancel</button>
                  {roleFormPhase === 1 ? (
                    <button disabled={!roleForm.name || !roleForm.role_type} onClick={() => setRoleFormPhase(2)} className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 shadow-lg shadow-primary-200 disabled:opacity-50 disabled:shadow-none transition-all text-sm">
                      Configure Permissions →
                    </button>
                  ) : (
                    <button onClick={handleRoleSubmit} className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all flex items-center gap-2 text-sm">
                      <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Save Role
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER ROLE MODAL */}
      {isUserRoleModalOpen && selectedUserForEdit && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsUserRoleModalOpen(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Assign Role to User</h3>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100 mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-base sm:text-lg shrink-0">
                  {selectedUserForEdit.first_name[0]}{selectedUserForEdit.last_name[0]}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 text-sm truncate">{selectedUserForEdit.first_name} {selectedUserForEdit.last_name}</div>
                  <div className="text-xs sm:text-sm text-gray-500 truncate">{selectedUserForEdit.email}</div>
                </div>
              </div>
              <div className="mb-5 sm:mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Select New Role</label>
                <div className="relative">
                  <select value={selectedUserNewRoleId} onChange={(e) => setSelectedUserNewRoleId(e.target.value)} className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 sm:py-3 pl-3 sm:pl-4 appearance-none bg-white text-sm">
                    <option value="">-- Choose a Role --</option>
                    {roles.map((r) => <option key={r.role_id} value={r.role_id}>{r.name} ({r.role_type})</option>)}
                  </select>
                  <ChevronDownIcon className="absolute right-3 sm:right-4 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                </div>
                {selectedUserNewRoleId && (
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 text-blue-800 rounded-xl text-xs sm:text-sm border border-blue-100">
                    <strong>Preview:</strong> This role grants access to:
                    <ul className="list-disc pl-5 mt-1.5 space-y-1 text-xs">
                      {Object.entries(roles.find((r) => r.role_id === selectedUserNewRoleId)?.permissions || {}).filter(([, v]) => v).slice(0, 5).map(([k]) => (
                        <li key={k}>{PERMISSION_DEFINITIONS[k]?.label || k}</li>
                      ))}
                      <li>...and more.</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 sm:gap-3">
                <button onClick={() => setIsUserRoleModalOpen(false)} className="px-3 sm:px-4 py-2 rounded-lg text-gray-600 font-semibold hover:bg-gray-100 text-sm transition">Cancel</button>
                <button onClick={handleUserRoleSave} className="px-4 sm:px-6 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 shadow-md text-sm transition">Update Access</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MATRIX VIEW MODAL */}
      {matrixModalRole && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-3 sm:p-4">
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setMatrixModalRole(null)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl sm:max-w-5xl flex flex-col" style={{ maxHeight: "85vh" }}>
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900">Effective Permissions</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Role: <span className="font-semibold text-blue-600">{matrixModalRole.name}</span></p>
                </div>
                <button onClick={() => setMatrixModalRole(null)} className="text-gray-400 hover:text-gray-600 transition"><XCircleIcon className="w-6 h-6 sm:w-8 sm:h-8" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">{renderPermissionMatrix(true, matrixModalRole.permissions || {})}</div>
              <div className="p-3 sm:p-4 border-t border-gray-100 flex justify-end">
                <button onClick={() => setMatrixModalRole(null)} className="px-4 sm:px-6 py-2 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 text-sm transition">Close Viewer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}