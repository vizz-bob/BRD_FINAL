import { useEffect, useState, useMemo, useRef } from "react";
import {
  branchAPI,
  businessAPI,
  productAPI,
} from "../../services/branchService.js";

// =============================================================================
// SECTION 1: ICONS
// =============================================================================

const Icons = {
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  Building: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18M13.5 3v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
  MapPin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  Receipt: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  ),
  Eye: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  EyeOff: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ),
};

// =============================================================================
// SECTION 2: UI ATOMS
// =============================================================================

const FormLabel = ({ children, required }) => (
  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 ml-0.5 select-none">
    {children}
    {required && <span className="text-rose-500 ml-1" title="Required">*</span>}
  </label>
);

const InputBox = ({ type = "text", placeholder, value, onChange, icon, className = "", disabled, rightElement, ...props }) => (
  <div className={`relative flex items-center group ${className}`}>
    {icon && (
      <div className="absolute left-0 pl-3 flex items-center pointer-events-none z-10">
        <span className="text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200">{icon}</span>
      </div>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent block py-3 px-3.5 shadow-sm transition-all duration-200 ease-in-out outline-none placeholder:text-slate-300 placeholder:font-normal disabled:bg-slate-100 disabled:text-slate-400 ${icon ? "pl-10" : ""} ${rightElement ? "pr-20" : ""}`}
      {...props}
    />
    {rightElement && (
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {rightElement}
      </div>
    )}
  </div>
);

const TextareaBox = ({ placeholder, value, onChange, icon, rows = 3, ...props }) => (
  <div className="relative flex group">
    {icon && (
      <div className="absolute left-0 top-3.5 pl-3 flex items-start pointer-events-none z-10">
        <span className="text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200">{icon}</span>
      </div>
    )}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent block p-3.5 shadow-sm transition-all duration-200 ease-in-out outline-none placeholder:text-slate-300 placeholder:font-normal resize-none ${icon ? "pl-10" : ""}`}
      {...props}
    />
  </div>
);

// FIX: SelectBox now uses correct labelKey/valueKey and is styled consistently
const SelectBox = ({
  options = [],
  value,
  onChange,
  placeholder = "Select",
  icon,
  labelKey = "label",
  valueKey = "value",
  ...props
}) => (
  <div className="relative flex items-center group">
    {icon && (
      <div className="absolute left-0 pl-3 flex items-center pointer-events-none z-10">
        <span className="text-slate-400 group-focus-within:text-blue-500 transition-colors">{icon}</span>
      </div>
    )}
    <select
      value={value || ""}
      onChange={onChange}
      className={`w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent block py-3 px-3.5 pr-10 shadow-sm transition-all duration-200 outline-none ${icon ? "pl-10" : ""} ${!value ? "text-slate-400 font-normal" : ""}`}
      {...props}
    >
      <option value="" className="text-slate-400 font-normal">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt[valueKey]} value={opt[valueKey]}>
          {opt[labelKey]}
        </option>
      ))}
    </select>
    <div className="absolute right-3 pointer-events-none text-slate-400 group-focus-within:text-blue-600">
      <Icons.ChevronDown />
    </div>
  </div>
);

const ToggleSwitch = ({ checked, onChange, label }) => (
  <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
    <span className="text-sm font-bold text-slate-700">{label}</span>
    <button
      type="button"
      onClick={onChange}
      className={`${checked ? "bg-blue-600" : "bg-slate-300"} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
    >
      <span
        aria-hidden="true"
        className={`${checked ? "translate-x-5" : "translate-x-0"} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  </div>
);

const FormGroup = ({ label, children, required, className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    {label && <FormLabel required={required}>{label}</FormLabel>}
    {children}
  </div>
);

const Button = ({ children, variant = "primary", onClick, disabled, className = "", icon, type = "button" }) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 border border-transparent",
    secondary: "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm",
    danger: "bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 shadow-sm",
    ghost: "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-widest transition-all duration-200 transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed px-5 py-3 text-xs ${variants[variant]} ${className}`}
    >
      {icon} {children}
    </button>
  );
};

// Inline validation error banner shown inside modal
const ValidationBanner = ({ message }) =>
  message ? (
    <div className="mx-4 sm:mx-6 mb-2 bg-rose-50 text-rose-600 px-4 py-3 rounded-xl text-xs font-bold border border-rose-200 flex items-center gap-2">
      <span className="text-rose-400 shrink-0">⚠</span>
      {message}
    </div>
  ) : null;

// Section header divider used inside modal form
const SectionDivider = ({ title }) => (
  <div className="col-span-1 sm:col-span-2">
    <h4 className="text-xs font-bold text-blue-900 uppercase tracking-widest border-b border-blue-100 pb-2 mb-1">
      {title}
    </h4>
  </div>
);

// =============================================================================
// SECTION 3: COMPLEX COMPONENTS
// =============================================================================

const MultiSelectDropdown = ({ options = [], selected = [], onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const safeSelected = Array.isArray(selected) ? selected : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (id) => {
    const newSelected = safeSelected.includes(id)
      ? safeSelected.filter((x) => x !== id)
      : [...safeSelected, id];
    onChange(newSelected);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className="w-full bg-slate-50 border border-slate-200 rounded-xl min-h-[48px] p-2 flex flex-wrap gap-1.5 items-center cursor-pointer hover:border-blue-300 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {safeSelected.length === 0 ? (
          <span className="text-slate-300 text-sm pl-1 select-none">{placeholder}</span>
        ) : (
          safeSelected.map((id) => {
            const product = options.find((p) => p.id === id);
            return (
              <span key={id} className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                {product?.product_name || "Unknown"}
                <span
                  className="cursor-pointer hover:text-blue-900 font-black leading-none"
                  onClick={(e) => { e.stopPropagation(); toggleOption(id); }}
                >
                  ×
                </span>
              </span>
            );
          })
        )}
        <span className="ml-auto pr-1 text-slate-400 shrink-0"><Icons.ChevronDown /></span>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto">
          {options.length === 0 ? (
            <div className="p-4 text-sm text-center text-slate-400">No products found</div>
          ) : (
            options.map((option) => (
              <div
                key={option.id}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors"
                onClick={() => toggleOption(option.id)}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${safeSelected.includes(option.id) ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}>
                  {safeSelected.includes(option.id) && (
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-700">{option.product_name}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Password input with show/hide toggle and generate button
const PasswordField = ({ value, onChange, onGenerate, placeholder = "Enter password" }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col xs:flex-row gap-2">
      <div className="relative flex-1 group flex items-center">
        <div className="absolute left-0 pl-3 flex items-center pointer-events-none z-10">
          <span className="text-slate-400 group-focus-within:text-blue-500 transition-colors"><Icons.Lock /></span>
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent block py-3 px-3.5 pl-10 pr-10 shadow-sm transition-all duration-200 outline-none placeholder:text-slate-300 placeholder:font-normal"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
          title={show ? "Hide password" : "Show password"}
        >
          {show ? <Icons.EyeOff /> : <Icons.Eye />}
        </button>
      </div>
      <button
        type="button"
        onClick={onGenerate}
        className="shrink-0 px-4 py-3 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors whitespace-nowrap"
      >
        Auto Generate
      </button>
    </div>
  );
};

// =============================================================================
// SECTION 4: MAIN PAGE
// =============================================================================

export default function Branches() {
  const [items, setItems] = useState([]);
  const [businessOptions, setBusinessOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const [validationError, setValidationError] = useState("");
  const [search, setSearch] = useState("");

  const generatePassword = () =>
    Math.random().toString(36).slice(-8) +
    Math.random().toString(36).slice(-4).toUpperCase() +
    "!";

  const initialForm = {
    business: "",
    branch_name: "",
    contact_person: "",
    email: "",
    mobile_no: "",
    address: "",
    gstin: "",
    allowed_products: [],
    branch_password: "",
    is_verified: false,
    status: "ACTIVE",
  };

  // FIX: mapFormToPayload conditionally includes branch_password so empty
  // password is never sent to backend during edit
  const mapFormToPayload = (formData, isEdit = false) => {
    const payload = {
      business: formData.business,
      branch_name: formData.branch_name,
      contact_person: formData.contact_person,
      email: formData.email,
      mobile_no: formData.mobile_no,
      address: formData.address,
      gstin: formData.gstin || null,
      allowed_products: formData.allowed_products,
      is_verified: formData.is_verified,
      status: formData.status,
    };
    // Only include password if provided (always required on create, optional on edit)
    if (!isEdit || formData.branch_password) {
      payload.branch_password = formData.branch_password;
    }
    return payload;
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [branchesRes, businesses, products] = await Promise.all([
          branchAPI.getAll(),
          businessAPI.getAll(),
          productAPI.getAll(),
        ]);

        const normalize = (res) => {
          if (Array.isArray(res)) return res;
          if (Array.isArray(res?.results)) return res.results;
          if (Array.isArray(res?.data?.results)) return res.data.results;
          if (Array.isArray(res?.data)) return res.data;
          return [];
        };

        setItems(normalize(branchesRes));
        setBusinessOptions(normalize(businesses));
        setProductOptions(normalize(products));
      } catch (err) {
        console.error("Initialization failed:", err);
        setValidationError("Failed to load data from server.");
      }
    };
    loadAllData();
  }, []);

  const validateBranch = (data, isEdit = false) => {
    if (!data.branch_name?.trim()) return "Branch Name is required.";
    if (!data.business) return "Business selection is required.";
    if (!isEdit && !data.branch_password?.trim()) return "Password is required.";
    if (data.mobile_no && !/^[6-9]\d{9}$/.test(data.mobile_no))
      return "Invalid Mobile Number (must be 10 digits starting with 6-9).";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      return "Invalid Email Address.";
    return null;
  };

  const handleSave = async () => {
    const errorMsg = validateBranch(form, false);
    if (errorMsg) { setValidationError(errorMsg); return; }
    try {
      const payload = mapFormToPayload(form, false);
      const created = await branchAPI.create(payload);
      setItems((prev) => [...prev, created]);
      setCreating(false);
      setForm(initialForm);
      setValidationError("");
    } catch (e) {
      console.error(e.response?.data);
      setValidationError("Create failed. Please check your inputs.");
    }
  };

  const handleUpdate = async () => {
    const errorMsg = validateBranch(editing, true);
    if (errorMsg) { setValidationError(errorMsg); return; }
    try {
      const payload = mapFormToPayload(editing, true);
      const updated = await branchAPI.update(editing.id, payload);
      setItems((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setEditing(null);
      setValidationError("");
    } catch (e) {
      setValidationError("Update failed. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await branchAPI.delete(deleting.id);
      setItems(items.filter((b) => b.id !== deleting.id));
      setDeleting(null);
    } catch (e) {
      alert("Delete failed. Please try again.");
    }
  };

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter(
      (b) =>
        b.branch_name?.toLowerCase().includes(q) ||
        b.contact_person?.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q)
    );
  }, [items, search]);

  // STATUS OPTIONS — consistent shape for SelectBox (uses default labelKey="label", valueKey="value")
  const statusOptionsCreate = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
  ];
  const statusOptionsEdit = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-[1800px] mx-auto min-h-screen bg-slate-50 font-sans">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-wrap justify-between items-start sm:items-center mb-6 sm:mb-10 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-1">
            Branch Management
          </h1>
          <p className="text-slate-500 text-sm sm:text-base font-medium">
            Manage branch details, products, and verification.
          </p>
        </div>
        <Button
          onClick={() => { setCreating(true); setForm(initialForm); setValidationError(""); }}
          icon={<Icons.Plus />}
        >
          Add Branch
        </Button>
      </div>

      {/* ── SEARCH + TABLE CARD ── */}
      <div className="bg-white rounded-2xl sm:rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
        {/* Search bar */}
        <div className="p-4 sm:p-6 md:p-8 border-b border-slate-100">
          <div className="relative w-full max-w-lg">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Icons.Search />
            </span>
            <input
              className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
              placeholder="Search by branch name, person, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50/80 text-slate-500 font-extrabold uppercase tracking-widest text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-6 lg:px-8 py-5">Branch Info</th>
                <th className="px-6 lg:px-8 py-5">Contact Details</th>
                <th className="px-6 lg:px-8 py-5">Assigned Products</th>
                <th className="px-6 lg:px-8 py-5">Status & Verification</th>
                <th className="px-6 lg:px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    {items.length === 0 ? "No branches found. Click 'Add Branch' to create one." : "No results match your search."}
                  </td>
                </tr>
              )}
              {filteredItems.map((b) => (
                <tr key={b.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 lg:px-8 py-5">
                    <div className="font-bold text-slate-800 text-sm">{b.branch_name}</div>
                    <div className="text-xs font-semibold text-blue-500 mt-0.5">{b.business || "—"}</div>
                  </td>
                  <td className="px-6 lg:px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <span className="text-slate-400 shrink-0"><Icons.User /></span>
                        {b.contact_person || "—"}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                        <span className="text-slate-300 shrink-0"><Icons.Phone /></span>
                        {b.mobile_no || "—"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-5">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {Array.isArray(b.allowed_products) && b.allowed_products.slice(0, 2).map((prod, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 font-semibold">{prod}</span>
                      ))}
                      {Array.isArray(b.allowed_products) && b.allowed_products.length > 2 && (
                        <span className="text-[10px] text-slate-400 font-bold">+{b.allowed_products.length - 2} more</span>
                      )}
                      {(!Array.isArray(b.allowed_products) || b.allowed_products.length === 0) && (
                        <span className="text-[10px] text-slate-300">None assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-5">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${b.status === "Active" || b.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {b.status}
                      </span>
                      {b.is_verified && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600">
                          <Icons.ShieldCheck /> Verified
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-5 text-right">
                    <div className="flex justify-end gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          const formattedProducts = Array.isArray(b.allowed_products)
                            ? b.allowed_products
                            : b.allowed_products
                            ? b.allowed_products.split(",").map((s) => s.trim())
                            : [];
                          setEditing({ ...b, allowed_products: formattedProducts, branch_password: "" });
                          setValidationError("");
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Icons.Edit />
                      </button>
                      <button
                        onClick={() => setDeleting(b)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredItems.length === 0 && (
            <div className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
              {items.length === 0 ? "No branches yet." : "No results found."}
            </div>
          )}
          {filteredItems.map((b) => (
            <div key={b.id} className="p-4 flex flex-col gap-3">
              {/* Card top row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-800 text-sm">{b.branch_name}</div>
                  <div className="text-xs font-semibold text-blue-500 mt-0.5">{b.business || "—"}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      const formattedProducts = Array.isArray(b.allowed_products)
                        ? b.allowed_products
                        : b.allowed_products
                        ? b.allowed_products.split(",").map((s) => s.trim())
                        : [];
                      setEditing({ ...b, allowed_products: formattedProducts, branch_password: "" });
                      setValidationError("");
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Icons.Edit />
                  </button>
                  <button
                    onClick={() => setDeleting(b)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Icons.Trash />
                  </button>
                </div>
              </div>

              {/* Contact row */}
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {b.contact_person && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                    <span className="text-slate-400"><Icons.User /></span> {b.contact_person}
                  </div>
                )}
                {b.mobile_no && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="text-slate-400"><Icons.Phone /></span> {b.mobile_no}
                  </div>
                )}
              </div>

              {/* Tags row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${b.status === "Active" || b.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                  {b.status}
                </span>
                {b.is_verified && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600">
                    <Icons.ShieldCheck /> Verified
                  </div>
                )}
                {Array.isArray(b.allowed_products) && b.allowed_products.slice(0, 2).map((prod, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 font-semibold">{prod}</span>
                ))}
                {Array.isArray(b.allowed_products) && b.allowed_products.length > 2 && (
                  <span className="text-[10px] text-slate-400 font-bold">+{b.allowed_products.length - 2}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════
          CREATE MODAL
      ════════════════════════════════════════════ */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          {/* On mobile: sheet slides up from bottom. On sm+: centered modal */}
          <div className="bg-white w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[95dvh] sm:max-h-[90vh]">

            {/* Modal header */}
            <div className="bg-slate-50 px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-b border-slate-200 flex justify-between items-center rounded-t-3xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Icons.Building />
                </div>
                <div>
                  <h2 className="text-base sm:text-xl font-extrabold text-slate-900 leading-tight">Add New Branch</h2>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider">Fill in all required fields</p>
                </div>
              </div>
              <button onClick={() => { setCreating(false); setValidationError(""); }} className="text-slate-400 hover:text-rose-500 transition p-1">
                <Icons.Close />
              </button>
            </div>

            {/* Modal body — scrollable */}
            <div className="overflow-y-auto flex-1 px-4 sm:px-6 md:px-8 py-5 sm:py-6 space-y-6">

              {/* ── Section 1: Identity & Business ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <SectionDivider title="Identity & Business" />

                <FormGroup label="Branch Name" required>
                  <InputBox
                    value={form.branch_name}
                    onChange={(e) => setForm({ ...form, branch_name: e.target.value })}
                    placeholder="e.g. Mumbai Main"
                    icon={<Icons.Building />}
                  />
                </FormGroup>

                <FormGroup label="Business Name" required>
                  {/* FIX: correct labelKey / valueKey for business options */}
                  <SelectBox
                    options={businessOptions}
                    value={form.business}
                    valueKey="id"
                    labelKey="business_name"
                    placeholder="Select Business Entity"
                    icon={<Icons.Building />}
                    onChange={(e) => setForm({ ...form, business: e.target.value })}
                  />
                </FormGroup>

                <FormGroup label="Allowed Products" className="sm:col-span-2">
                  <MultiSelectDropdown
                    options={productOptions}
                    selected={Array.isArray(form.allowed_products) ? form.allowed_products : []}
                    onChange={(val) => setForm((prev) => ({ ...prev, allowed_products: val }))}
                    placeholder="Select products..."
                  />
                </FormGroup>

                <FormGroup label="GSTIN">
                  <InputBox
                    value={form.gstin}
                    onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                    placeholder="e.g. 22AAAAA0000A1Z5"
                    icon={<Icons.Receipt />}
                  />
                </FormGroup>
              </div>

              {/* ── Section 2: Contact & Address ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <SectionDivider title="Contact & Address" />

                <FormGroup label="Contact Person">
                  <InputBox
                    value={form.contact_person}
                    onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                    placeholder="Manager Name"
                    icon={<Icons.User />}
                  />
                </FormGroup>

                <FormGroup label="Mobile Number">
                  <InputBox
                    type="tel"
                    value={form.mobile_no}
                    onChange={(e) => setForm({ ...form, mobile_no: e.target.value })}
                    placeholder="10-digit mobile number"
                    icon={<Icons.Phone />}
                    maxLength={10}
                  />
                </FormGroup>

                <FormGroup label="Email Address">
                  <InputBox
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="branch@example.com"
                    icon={<Icons.Mail />}
                  />
                </FormGroup>

                <FormGroup label="Branch Address" className="sm:col-span-2">
                  <TextareaBox
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Full branch address details..."
                    icon={<Icons.MapPin />}
                    rows={3}
                  />
                </FormGroup>
              </div>

              {/* ── Section 3: Status & Security ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <SectionDivider title="Status & Security" />

                {/* FIX: Password field — extracted to PasswordField component (no absolute button overlap) */}
                <FormGroup label="Branch Password" required className="sm:col-span-2">
                  <PasswordField
                    value={form.branch_password}
                    onChange={(e) => setForm({ ...form, branch_password: e.target.value })}
                    onGenerate={() => setForm({ ...form, branch_password: generatePassword() })}
                    placeholder="Enter or auto-generate a password"
                  />
                </FormGroup>

                <FormGroup label="Current Status">
                  {/* FIX: options now use default labelKey="label" / valueKey="value" */}
                  <SelectBox
                    options={statusOptionsCreate}
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    placeholder="Select status"
                  />
                </FormGroup>

                <div className="sm:col-span-2">
                  <ToggleSwitch
                    label="Branch Verification Status"
                    checked={form.is_verified}
                    onChange={() => setForm({ ...form, is_verified: !form.is_verified })}
                  />
                </div>
              </div>
            </div>

            {/* FIX: Validation error shown inline above footer (not absolute) */}
            <ValidationBanner message={validationError} />

            {/* Modal footer */}
            <div className="px-4 sm:px-6 md:px-8 py-4 bg-slate-50 border-t border-slate-200 flex flex-col-reverse xs:flex-row justify-end gap-2 sm:gap-3 shrink-0 rounded-b-3xl">
              <Button variant="ghost" onClick={() => { setCreating(false); setValidationError(""); }} className="w-full xs:w-auto">
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={!form.branch_name || !form.business}
                className="w-full xs:w-auto"
              >
                Create Branch
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          EDIT MODAL
      ════════════════════════════════════════════ */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[95dvh] sm:max-h-[90vh]">

            {/* Modal header */}
            <div className="bg-slate-50 px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-b border-slate-200 flex justify-between items-center rounded-t-3xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Icons.Edit />
                </div>
                <div>
                  <h2 className="text-base sm:text-xl font-extrabold text-slate-900 leading-tight">Edit Branch</h2>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider truncate max-w-[160px] sm:max-w-xs">
                    {editing.branch_name}
                  </p>
                </div>
              </div>
              <button onClick={() => { setEditing(null); setValidationError(""); }} className="text-slate-400 hover:text-rose-500 transition p-1">
                <Icons.Close />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto flex-1 px-4 sm:px-6 md:px-8 py-5 sm:py-6 space-y-6">

              {/* ── Section 1: Identity & Business ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <SectionDivider title="Identity & Business" />

                <FormGroup label="Branch Name" required>
                  <InputBox
                    value={editing.branch_name}
                    onChange={(e) => setEditing({ ...editing, branch_name: e.target.value })}
                    icon={<Icons.Building />}
                    placeholder="Branch name"
                  />
                </FormGroup>

                <FormGroup label="Business Name" required>
                  <SelectBox
                    options={businessOptions}
                    value={editing.business || ""}
                    labelKey="business_name"
                    valueKey="id"
                    placeholder="Select Business"
                    icon={<Icons.Building />}
                    onChange={(e) => setEditing((prev) => ({ ...prev, business: e.target.value }))}
                  />
                </FormGroup>

                <FormGroup label="Allowed Products" className="sm:col-span-2">
                  <MultiSelectDropdown
                    options={productOptions}
                    selected={editing.allowed_products || []}
                    onChange={(val) => setEditing({ ...editing, allowed_products: val })}
                    placeholder="Select products..."
                  />
                </FormGroup>

                <FormGroup label="GSTIN">
                  <InputBox
                    value={editing.gstin || ""}
                    onChange={(e) => setEditing({ ...editing, gstin: e.target.value })}
                    icon={<Icons.Receipt />}
                    placeholder="GST Number"
                  />
                </FormGroup>
              </div>

              {/* ── Section 2: Contact & Address ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <SectionDivider title="Contact & Address" />

                <FormGroup label="Contact Person">
                  <InputBox
                    value={editing.contact_person || ""}
                    onChange={(e) => setEditing({ ...editing, contact_person: e.target.value })}
                    icon={<Icons.User />}
                    placeholder="Manager Name"
                  />
                </FormGroup>

                <FormGroup label="Mobile Number">
                  <InputBox
                    value={editing.mobile_no || ""}
                    onChange={(e) => setEditing({ ...editing, mobile_no: e.target.value })}
                    icon={<Icons.Phone />}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </FormGroup>

                <FormGroup label="Email Address">
                  <InputBox
                    type="email"
                    value={editing.email || ""}
                    onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                    icon={<Icons.Mail />}
                    placeholder="branch@example.com"
                  />
                </FormGroup>

                <FormGroup label="Branch Address" className="sm:col-span-2">
                  <TextareaBox
                    value={editing.address || ""}
                    onChange={(e) => setEditing({ ...editing, address: e.target.value })}
                    icon={<Icons.MapPin />}
                    placeholder="Full branch address..."
                    rows={3}
                  />
                </FormGroup>
              </div>

              {/* ── Section 3: Status & Security ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <SectionDivider title="Status & Security" />

                {/* Optional password change on edit */}
                <FormGroup label="Change Password (optional)" className="sm:col-span-2">
                  <PasswordField
                    value={editing.branch_password || ""}
                    onChange={(e) => setEditing({ ...editing, branch_password: e.target.value })}
                    onGenerate={() => setEditing({ ...editing, branch_password: generatePassword() })}
                    placeholder="Leave blank to keep existing password"
                  />
                </FormGroup>

                <FormGroup label="Current Status">
                  <SelectBox
                    options={statusOptionsEdit}
                    value={editing.status}
                    onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                    placeholder="Select status"
                  />
                </FormGroup>

                <div className="sm:col-span-2">
                  <ToggleSwitch
                    label="Branch Verification Status"
                    checked={editing.is_verified}
                    onChange={() => setEditing({ ...editing, is_verified: !editing.is_verified })}
                  />
                </div>
              </div>
            </div>

            {/* FIX: Validation error shown inline */}
            <ValidationBanner message={validationError} />

            {/* Modal footer */}
            <div className="px-4 sm:px-6 md:px-8 py-4 bg-slate-50 border-t border-slate-200 flex flex-col-reverse xs:flex-row justify-end gap-2 sm:gap-3 shrink-0 rounded-b-3xl">
              <Button variant="ghost" onClick={() => { setEditing(null); setValidationError(""); }} className="w-full xs:w-auto">
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdate} className="w-full xs:w-auto">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          DELETE MODAL
      ════════════════════════════════════════════ */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 text-center border border-slate-200">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ⚠️
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-800">Confirm Deletion</h3>
            <p className="text-slate-500 mt-2 mb-6 text-sm">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-800">{deleting.branch_name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex flex-col-reverse sm:flex-row justify-center gap-3">
              <Button variant="secondary" onClick={() => setDeleting(null)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} className="w-full sm:w-auto">
                Delete Branch
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in { animation: fadeIn 0.25s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (max-width: 400px) { .xs\\:flex-row { flex-direction: row; } .xs\\:w-auto { width: auto; } }
      `}</style>
    </div>
  );
}
