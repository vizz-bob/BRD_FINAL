import React, { useEffect, useState, useMemo } from "react";
import { userAPI } from "../../services/userService";
import { roleAPI } from "../../services/rolesService";

// =============================================================================
// SECTION 1: ICONS
// =============================================================================
const Icons = {
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
  Mail: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>,
  Key: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>,
  Badge: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>,
  Building: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18M13.5 3v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
  Close: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>,
  Lock: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  ShieldCheck: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>,
  ArrowPath: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
};

// =============================================================================
// SECTION 2: UI COMPONENTS
// =============================================================================

const FormLabel = ({ children, required }) => (
  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 ml-0.5 select-none">
    {children}
    {required && <span className="text-rose-500 ml-1" title="Required">*</span>}
  </label>
);

const InputBox = ({ type = "text", placeholder, value, onChange, icon, className, disabled, ...props }) => (
  <div className={`relative flex items-center group ${className}`}>
    {icon && (
      <div className="absolute left-0 pl-4 flex items-center pointer-events-none z-10">
        <span className="text-slate-400 group-focus-within:text-primary-500 transition-colors duration-200 shrink-0">{icon}</span>
      </div>
    )}
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
      className={`w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-transparent block p-3.5 shadow-sm transition-all duration-200 ease-in-out outline-none placeholder:text-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${icon ? 'pl-11' : ''}`}
      {...props}
    />
  </div>
);

const SelectBox = ({ options, value, onChange, placeholder, icon, ...props }) => (
  <div className="relative flex items-center group">
    {icon && (
      <div className="absolute left-0 pl-4 flex items-center pointer-events-none z-10">
        <span className="text-slate-400 group-focus-within:text-primary-500 transition-colors duration-200 shrink-0">{icon}</span>
      </div>
    )}
    <select
      value={value} onChange={onChange}
      className={`w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-transparent block p-3.5 shadow-sm transition-all duration-200 ease-in-out outline-none appearance-none cursor-pointer ${icon ? 'pl-11' : ''}`}
      {...props}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value || opt.id || opt}>{opt.label || opt.name || opt}</option>
      ))}
    </select>
    <div className="absolute right-4 pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors duration-200"><Icons.ChevronDown /></div>
  </div>
);

const FormGroup = ({ label, children, required, className }) => (
  <div className={`flex flex-col ${className}`}>
    {label && <FormLabel required={required}>{label}</FormLabel>}
    {children}
  </div>
);

const Button = ({ children, variant = "primary", onClick, disabled, className = "", icon }) => {
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-200 active:bg-primary-800",
    secondary: "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm active:bg-slate-100",
    danger: "bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 shadow-sm active:bg-rose-100",
    ghost: "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:bg-slate-200",
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-widest transition-all duration-200 transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed px-4 md:px-6 py-2.5 md:py-3 text-xs whitespace-nowrap shrink-0 ${variants[variant]} ${className}`}
    >
      {icon} {children}
    </button>
  );
};

const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-3 md:gap-4">
    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-xl md:text-2xl font-black text-slate-800">{value}</h3>
    </div>
  </div>
);

// =============================================================================
// SECTION 3: CONSTANTS
// =============================================================================

const ROLE_OPTIONS = [
  { value: "STAFF", label: "Staff Member" },
  { value: "SUPERVISOR", label: "Supervisor / Manager" },
  { value: "ADMIN", label: "Tenant Admin" },
  { value: "LOAN", label: "Loan Officer" },
  { value: "COLLECTION", label: "Collection Agent" },
];

const STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

// =============================================================================
// SECTION 4: MAIN COMPONENT
// =============================================================================

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [validationError, setValidationError] = useState("");

  const currentTenant = sessionStorage.getItem("tenant_id") || "";

  const initialForm = {
    first_name: "", last_name: "", email: "",
    mobile_no: "", role_type: "STAFF", role_id: "", password: "",
    status: "ACTIVE", supervisor_name: "", supervisor_email: "", supervisor_mobile: "",
  };

  const [form, setForm] = useState(initialForm);

  const roleMap = useMemo(() => (Array.isArray(roles) ? roles : []).reduce((acc, role) => { acc[role.id] = role.name || role.role_name; return acc; }, {}), [roles]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([userAPI.getAll(), roleAPI.list()]);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.results || []));
      setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : (rolesRes.data?.results || []));
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInitialData(); }, [currentTenant]);

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 12; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    return pass;
  };

  const isSupervisorRole = (role) => role === "SUPERVISOR";

  const mapFormToPayload = (formData) => {
    const normalizedRole = ["STAFF", "SUPERVISOR", "ADMIN", "LOAN", "COLLECTION"].includes(formData.role_type)
      ? formData.role_type
      : "STAFF";

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      mobile_number: formData.mobile_no,
      role_type: normalizedRole,
      role_id: Number(formData.role_id),
      account_status: formData.status === "Active" ? "ACTIVE" : "INACTIVE",
      is_active: formData.status === "Active",
      action: "TAKEN",
    };

    if (formData.password) payload.password = formData.password;
    return payload;
  };

  const validateForm = (data, isEdit = false) => {
    if (!data.first_name?.trim()) return "First name is required";
    if (!data.last_name?.trim()) return "Last name is required";
    if (!data.email?.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) return "Invalid email format";
    if (!data.mobile_no?.toString().trim()) return "Mobile number is required";
    if (!data.role_type) return "Role type is required";
    if (!data.role_id) return "Role ID is required";
    if (!isEdit && !data.password) return "Password is required for new users";
    return null;
  };

  const handleCreate = async () => {
    const error = validateForm(form);
    if (error) { setValidationError(error); return; }
    try {
      await userAPI.create(mapFormToPayload(form));
      setCreating(false); setForm(initialForm); setValidationError(""); fetchInitialData();
    } catch (e) {
      const apiError = e.response?.data;
      if (apiError && typeof apiError === "object") {
        const msg = Object.values(apiError).flat().join(" ");
        setValidationError(msg || "Failed to create user. Please check inputs.");
      } else {
        setValidationError("Failed to create user. Please check inputs.");
      }
    }
  };

  const handleUpdate = async () => {
    const error = validateForm(editing, true);
    if (error) { setValidationError(error); return; }
    try {
      await userAPI.update(editing.id, mapFormToPayload(editing));
      setEditing(null); setValidationError(""); fetchInitialData();
    } catch (e) {
      setValidationError(e.response?.data?.detail || "Failed to update user.");
    }
  };

  const handleDelete = async () => {
    try {
      await userAPI.delete(deleting.id);
      setDeleting(null); fetchInitialData();
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const filteredItems = useMemo(() => (Array.isArray(users) ? users : []).filter(user => {
    const matchesSearch =
      user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      (user.role || user.role_type)?.toLowerCase().includes(search.toLowerCase());
    const userRole = user.role || user.role_type;
    return matchesSearch && (roleFilter === "ALL" || userRole === roleFilter);
  }), [users, search, roleFilter]);

  const stats = useMemo(() => ({
    total: (Array.isArray(users) ? users : []).length,
    active: (Array.isArray(users) ? users : []).filter(u => u.is_active || u.account_status === "ACTIVE" || u.status === 'Active').length,
    supervisors: (Array.isArray(users) ? users : []).filter(u => (u.role || u.role_type) === 'SUPERVISOR').length
  }), [users]);

  // Supervisor section shared between create/edit
  const SupervisorSection = ({ data, setData }) => (
    <div className="bg-purple-50 p-4 md:p-6 rounded-2xl border border-purple-100 animate-fade-in">
      <h4 className="text-xs font-bold text-purple-900 uppercase tracking-widest border-b border-purple-200 pb-2 mb-4">Supervisor Specifics</h4>
      <div className="space-y-4">
        <FormGroup label="Supervisor Name" required>
          <InputBox value={data.supervisor_name} onChange={e => setData({ ...data, supervisor_name: e.target.value })} placeholder="Enter Supervisor Name" icon={<Icons.User />} />
        </FormGroup>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormGroup label="Supervisor Email" required>
            <InputBox type="email" value={data.supervisor_email} onChange={e => setData({ ...data, supervisor_email: e.target.value })} placeholder="supervisor@email.com" icon={<Icons.Mail />} />
          </FormGroup>
          <FormGroup label="Supervisor Mobile" required>
            <InputBox type="tel" value={data.supervisor_mobile} onChange={e => setData({ ...data, supervisor_mobile: e.target.value })} placeholder="Mobile No" icon={<Icons.Phone />} />
          </FormGroup>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1800px] mx-auto min-h-screen bg-slate-50 font-sans">

      {/* ── Header ── */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter mb-1 md:mb-2">
            User Management
          </h1>
          <p className="text-slate-500 text-sm md:text-lg font-medium">
            Manage employees, roles, and access permissions for your tenant.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <Button variant="ghost" onClick={fetchInitialData} icon={<Icons.ArrowPath />}>Refresh</Button>
          <Button variant="secondary" onClick={() => window.print()} icon={<Icons.Building />}>Export</Button>
          <Button onClick={() => { setCreating(true); setForm(initialForm); setValidationError(""); }} icon={<Icons.Plus />}>
            Add User
          </Button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
        <StatCard title="Total Users" value={stats.total} icon={<Icons.Users />} colorClass="bg-blue-100 text-blue-600" />
        <StatCard title="Active Accounts" value={stats.active} icon={<Icons.ShieldCheck />} colorClass="bg-emerald-100 text-emerald-600" />
        <StatCard title="Supervisors" value={stats.supervisors} icon={<Icons.Badge />} colorClass="bg-purple-100 text-purple-600" />
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl md:rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden mb-8">

        {/* Filter bar */}
        <div className="p-4 md:p-6 border-b border-slate-100 bg-white flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative w-full max-w-lg">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none shrink-0"><Icons.Search /></span>
            <input
              className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
              placeholder="Search by name, email or role..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap shrink-0">
              Filter:
            </span>
            <div className="flex-1 md:flex-none md:min-w-[180px]">
              <SelectBox
                options={[{ value: 'ALL', label: 'All Roles' }, ...ROLE_OPTIONS]}
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50/80 text-slate-500 font-extrabold uppercase tracking-widest text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-5 md:px-8 py-4 md:py-5 whitespace-nowrap">User Profile</th>
                <th className="px-5 md:px-8 py-4 md:py-5 whitespace-nowrap">Role & ID</th>
                <th className="px-5 md:px-8 py-4 md:py-5 whitespace-nowrap">Contact Info</th>
                <th className="px-5 md:px-8 py-4 md:py-5 whitespace-nowrap">Supervisor Info</th>
                <th className="px-5 md:px-8 py-4 md:py-5 whitespace-nowrap">Status</th>
                <th className="px-5 md:px-8 py-4 md:py-5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="p-12 text-center text-slate-400 font-bold animate-pulse">Loading users...</td></tr>
              ) : filteredItems.length > 0 ? filteredItems.map((u) => (
                <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-5 md:px-8 py-4 md:py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm shrink-0">
                        {u.first_name?.[0]}{u.last_name?.[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 text-sm whitespace-nowrap">{u.first_name} {u.last_name}</div>
                        <div className="text-[10px] font-bold text-indigo-500 mt-0.5 whitespace-nowrap">Tenant: {u.tenant_id || u.tenant}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 md:px-8 py-4 md:py-5">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
                        {u.role || u.role_type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold tracking-wider whitespace-nowrap">
                        {u.role_id && roleMap[u.role_id] ? `Role: ${roleMap[u.role_id]}` : `RID: ${u.role_id || "N/A"}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 md:px-8 py-4 md:py-5">
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <span className="text-slate-400 shrink-0"><Icons.Mail /></span>
                        <span className="truncate max-w-[180px]">{u.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <span className="text-slate-400 shrink-0"><Icons.Phone /></span>
                        <span className="whitespace-nowrap">{u.phone || u.mobile_number || "–"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 md:px-8 py-4 md:py-5">
                    {isSupervisorRole(u.role || u.role_type) ? (
                      <div className="bg-purple-50 p-2 rounded-lg border border-purple-100 max-w-[200px]">
                        <div className="text-[10px] uppercase tracking-widest font-extrabold text-purple-400 mb-1">Supervisor</div>
                        <div className="text-xs font-bold text-purple-900 truncate">{u.supervisor_name}</div>
                        <div className="text-[10px] text-purple-600 truncate" title={u.supervisor_email}>{u.supervisor_email}</div>
                        <div className="text-[10px] text-purple-600 whitespace-nowrap">{u.supervisor_mobile}</div>
                      </div>
                    ) : <span className="text-xs text-slate-300 italic">N/A</span>}
                  </td>
                  <td className="px-5 md:px-8 py-4 md:py-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap ${u.is_active || u.account_status === 'ACTIVE' || u.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {u.is_active || u.account_status === 'ACTIVE' || u.status === 'Active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 md:px-8 py-4 md:py-5 text-right">
                    <div className="flex justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setViewing(u)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"><Icons.Eye /></button>
                      <button onClick={() => { setEditing({ ...u, mobile_no: u.phone || u.mobile_number, role_type: u.role || u.role_type, status: u.account_status || (u.is_active ? "ACTIVE" : "INACTIVE"), password: "" }); setValidationError(""); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><Icons.Edit /></button>
                      <button onClick={() => setDeleting(u)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"><Icons.Trash /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No users match your search</td></tr>
              )}
            </tbody>
          </table>
      </div>
          </div>

      {/* ── CREATE MODAL ── */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-50 px-5 md:px-8 py-4 md:py-6 border-b border-slate-200 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0"><Icons.User /></div>
                <div className="min-w-0">
                  <h2 className="text-base md:text-xl font-extrabold text-slate-900 truncate">Add New User</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider hidden sm:block">Tenant: {currentTenant}</p>
                </div>
              </div>
              <button onClick={() => setCreating(false)} className="text-slate-400 hover:text-rose-500 transition shrink-0 ml-3"><Icons.Close /></button>
            </div>

            <div className="p-5 md:p-8 overflow-y-auto space-y-5 md:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <FormGroup label="First Name" required><InputBox value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} placeholder="e.g. Rahul" icon={<Icons.User />} /></FormGroup>
                <FormGroup label="Last Name" required><InputBox value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} placeholder="e.g. Verma" icon={<Icons.User />} /></FormGroup>
                <FormGroup label="Email Address" required><InputBox type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="user@company.com" icon={<Icons.Mail />} /></FormGroup>
                <FormGroup label="Mobile Number" required><InputBox type="tel" value={form.mobile_no} onChange={e => setForm({ ...form, mobile_no: e.target.value })} placeholder="9876543210" icon={<Icons.Phone />} /></FormGroup>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <FormGroup label="Role Type" required><SelectBox options={ROLE_OPTIONS} value={form.role_type} onChange={e => setForm({ ...form, role_type: e.target.value })} icon={<Icons.Badge />} /></FormGroup>
                <FormGroup label="Role ID" required>
                  <SelectBox options={(Array.isArray(roles) ? roles : []).map(r => ({ value: r.id, label: r.name || r.role_name }))} value={form.role_id} onChange={e => setForm({ ...form, role_id: e.target.value })} placeholder="Select Role ID" icon={<Icons.Key />} />
                </FormGroup>
                <FormGroup label="Login Password" required>
                  <div className="flex gap-2">
                    <InputBox type="text" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Secure password" icon={<Icons.Lock />} />
                    <button type="button" onClick={() => setForm({ ...form, password: generatePassword() })} className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 shrink-0 whitespace-nowrap">Gen</button>
                  </div>
                </FormGroup>
                <FormGroup label="Account Status"><SelectBox options={STATUS_OPTIONS} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} /></FormGroup>
              </div>
              {isSupervisorRole(form.role_type) && <SupervisorSection data={form} setData={setForm} />}
              {validationError && (
                <div className="bg-rose-50 text-rose-600 px-4 py-2.5 rounded-xl text-xs font-bold border border-rose-200">{validationError}</div>
              )}
            </div>

            <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-end gap-3 shrink-0">
              <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreate}>Create User Account</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-50 px-5 md:px-8 py-4 md:py-6 border-b border-slate-200 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0"><Icons.Edit /></div>
                <div className="min-w-0">
                  <h2 className="text-base md:text-xl font-extrabold text-slate-900 truncate">Edit User Details</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider hidden sm:block truncate">ID: {editing.id} • {editing.first_name} {editing.last_name}</p>
                </div>
              </div>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-rose-500 transition shrink-0 ml-3"><Icons.Close /></button>
            </div>

            <div className="p-5 md:p-8 overflow-y-auto space-y-5 md:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <FormGroup label="First Name" required><InputBox value={editing.first_name} onChange={e => setEditing({ ...editing, first_name: e.target.value })} icon={<Icons.User />} /></FormGroup>
                <FormGroup label="Last Name" required><InputBox value={editing.last_name} onChange={e => setEditing({ ...editing, last_name: e.target.value })} icon={<Icons.User />} /></FormGroup>
                <FormGroup label="Email" required><InputBox value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} icon={<Icons.Mail />} /></FormGroup>
                <FormGroup label="Mobile" required><InputBox value={editing.mobile_no} onChange={e => setEditing({ ...editing, mobile_no: e.target.value })} icon={<Icons.Phone />} /></FormGroup>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <FormGroup label="Role Type" required><SelectBox options={ROLE_OPTIONS} value={editing.role_type} onChange={e => setEditing({ ...editing, role_type: e.target.value })} icon={<Icons.Badge />} /></FormGroup>
                <FormGroup label="Role ID" required><SelectBox options={(Array.isArray(roles) ? roles : []).map(r => ({ value: r.id, label: r.name || r.role_name }))} value={editing.role_id} onChange={e => setEditing({ ...editing, role_id: e.target.value })} icon={<Icons.Key />} /></FormGroup>
                <FormGroup label="Reset Password (Optional)">
                  <div className="flex gap-2">
                    <InputBox type="text" value={editing.password} onChange={e => setEditing({ ...editing, password: e.target.value })} placeholder="Leave blank to keep current" icon={<Icons.Lock />} />
                    <button type="button" onClick={() => setEditing({ ...editing, password: generatePassword() })} className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 shrink-0 whitespace-nowrap">Gen</button>
                  </div>
                </FormGroup>
                <FormGroup label="Status"><SelectBox options={STATUS_OPTIONS} value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })} /></FormGroup>
              </div>
              {isSupervisorRole(editing.role_type) && <SupervisorSection data={editing} setData={setEditing} />}
              {validationError && (
                <div className="bg-rose-50 text-rose-600 px-4 py-2.5 rounded-xl text-xs font-bold border border-rose-200">{validationError}</div>
              )}
            </div>

            <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-end gap-3 shrink-0">
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW MODAL ── */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setViewing(null)} className="absolute top-5 right-5 text-slate-300 hover:text-slate-600 transition"><Icons.Close /></button>
            <div className="flex flex-col items-center mb-6 md:mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xl md:text-2xl font-black mb-4">
                {viewing.first_name?.[0]}{viewing.last_name?.[0]}
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 text-center">{viewing.first_name} {viewing.last_name}</h2>
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-2 whitespace-nowrap">
                {viewing.role || viewing.role_type}
              </span>
            </div>
            <div className="space-y-3 bg-slate-50 rounded-2xl p-4 md:p-6 border border-slate-100">
              {[
                { label: "Email", value: viewing.email },
                { label: "Mobile", value: viewing.phone || viewing.mobile_number },
                { label: "Status", value: viewing.is_active || viewing.account_status === "ACTIVE" ? "Active" : "Inactive", color: viewing.is_active || viewing.account_status === "ACTIVE" ? "text-emerald-600" : "text-slate-500" },
                { label: "Role ID", value: viewing.role_id || "N/A" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center border-b border-slate-200 pb-2 last:border-0 gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase shrink-0">{label}</span>
                  <span className={`text-sm font-bold text-right truncate ${color || "text-slate-700"}`}>{value}</span>
                </div>
              ))}
            </div>
            {isSupervisorRole(viewing.role || viewing.role_type) && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-4 md:p-6 border border-purple-100">
                <h5 className="text-xs font-black text-purple-900 uppercase tracking-widest mb-3">Supervisor Data</h5>
                <p className="text-sm text-purple-800 mb-1"><strong>Name:</strong> {viewing.supervisor_name}</p>
                <p className="text-sm text-purple-800 mb-1 break-all"><strong>Email:</strong> {viewing.supervisor_email}</p>
                <p className="text-sm text-purple-800"><strong>Mobile:</strong> {viewing.supervisor_mobile}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-sm md:max-w-md text-center border border-slate-200">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4"><Icons.Trash /></div>
            <h3 className="text-lg md:text-xl font-extrabold text-slate-800">Delete User Account</h3>
            <p className="text-slate-500 mt-2 mb-6 text-sm">
              Are you sure you want to remove <span className="font-bold text-slate-800">{deleting.first_name} {deleting.last_name}</span>?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>Confirm Delete</Button>
            </div>
          </div>
        </div>
      )}

      <style>{`.animate-fade-in { animation: fadeIn 0.2s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}
