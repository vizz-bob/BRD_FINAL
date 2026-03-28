import { useEffect, useState, useMemo, useCallback } from "react";
import { productLoanAPI } from "../../services/productLoanService";

// =============================================================================
// SECTION 1: GLOBAL CONFIGURATION & CONSTANTS
// =============================================================================

const STATIC_LOAN_TYPES = [
  { label: "PERSONAL", value: "PERSONAL" },
  { label: "PAYDAY", value: "PAYDAY" },
  { label: "BUSINESS", value: "BUSINESS" },
  { label: "GROUP_LOAN", value: "GROUP_LOAN" },
  { label: "VEHICLE", value: "VEHICLE" },
  { label: "UNSECURED_EDUCATION", value: "UNSECURED_EDUCATION" },
  { label: "SECURED_EDUCATION", value: "SECURED_EDUCATION" },
  { label: "LOAN_AGAINST_PROPERTY", value: "LOAN_AGAINST_PROPERTY" },
  { label: "LOAN_AGAINST_SHARES", value: "LOAN_AGAINST_SHARES" },
  { label: "GOLD", value: "GOLD" },
  { label: "SUPPLY_CHAIN", value: "SUPPLY_CHAIN" },
  { label: "BILL_INVOICE", value: "BILL_INVOICE" },
  { label: "VIRTUAL_CARD", value: "VIRTUAL_CARD" },
  { label: "CREDIT_LINE", value: "CREDIT_LINE" },
  { label: "AGRICULTURE", value: "AGRICULTURE" },
  { label: "MICROFINANCE", value: "MICROFINANCE" },
  { label: "EQUIPMENT", value: "EQUIPMENT" },
  { label: "MEDICAL_EMERGENCY", value: "MEDICAL_EMERGENCY" },
];

const REPAYMENT_FREQUENCIES = [
  { label: "Monthly", value: "MONTHLY", description: "Standard 30-day cycle" },
  { label: "Weekly", value: "WEEKLY", description: "7-day collection cycle" },
  { label: "Bi-Weekly", value: "BI_WEEKLY", description: "14-day collection cycle" },
  { label: "Quarterly", value: "QUARTERLY", description: "90-day cycle (Business)" },
];

const INTEREST_TYPES = [
  { label: "Fixed Rate", value: "FIXED", desc: "Stable EMIs throughout tenure" },
  { label: "Floating Rate", value: "FLOATING", desc: "Market-linked fluctuating rates" },
];

const COLLECTION_STAGES = [
  { label: "Deduct from Disbursement", value: "DISBURSEMENT" },
  { label: "Add to EMI", value: "ONGOING" },
  { label: "On Missed EMI", value: "MISSED_EMI" },
  { label: "Post Default", value: "POST_DEFAULT" },
];

// =============================================================================
// SECTION 2: UTILITIES & HELPERS
// =============================================================================

const formatCurrency = (amount) => {
  return Number(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  });
};

// =============================================================================
// SECTION 3: ICONS & ASSETS
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
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
  ),
  Eye: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Health: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
};

// =============================================================================
// SECTION 4: UI COMPONENT SYSTEM (ATOMS)
// =============================================================================

const FormLabel = ({ children, required }) => (
  <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-widest mb-2 ml-0.5 select-none">
    {children}
    {required && <span className="text-rose-500 ml-1" title="Required Field">*</span>}
  </label>
);

const FormHelperText = ({ children }) => (
  <p className="text-[10px] font-medium text-slate-400 mt-1.5 ml-1">{children}</p>
);

const InputBox = ({ type = "text", placeholder, value, onChange, prefix, suffix, disabled, className, ...props }) => (
  <div className={`relative flex items-center group ${className}`}>
    {prefix && (
      <div className="absolute left-0 pl-4 flex items-center pointer-events-none z-10">
        <span className="text-slate-400 font-bold text-sm group-focus-within:text-primary-500 transition-colors duration-200">{prefix}</span>
      </div>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full bg-white border border-slate-300 text-slate-800 font-bold text-sm rounded-xl focus:ring-[3px] focus:ring-primary-500/20 focus:border-primary-600 hover:border-slate-400 block p-3.5 shadow-sm transition-all duration-200 ease-in-out outline-none placeholder:text-slate-300 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-slate-200 ${prefix ? "pl-10" : ""} ${suffix ? "pr-14" : ""}`}
      {...props}
    />
    {suffix && (
      <div className="absolute right-1 top-1 bottom-1 flex items-center pointer-events-none">
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1.5 rounded-lg border border-slate-200 select-none">{suffix}</span>
      </div>
    )}
  </div>
);

const SelectBox = ({ options, value, onChange, placeholder, prefix, disabled }) => (
  <div className="relative flex items-center group">
    {prefix && (
      <div className="absolute left-0 pl-4 flex items-center pointer-events-none z-10">
        <span className="text-slate-400 font-bold text-sm group-focus-within:text-primary-500 transition-colors duration-200">{prefix}</span>
      </div>
    )}
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full bg-white border border-slate-300 text-slate-800 font-semibold text-sm rounded-xl focus:ring-[3px] focus:ring-primary-500/20 focus:border-primary-600 hover:border-slate-400 block p-3.5 shadow-sm transition-all duration-200 ease-in-out outline-none cursor-pointer appearance-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${prefix ? "pl-10" : ""}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value || opt}>{opt.label || opt}</option>
      ))}
    </select>
  </div>
);

const FormGroup = ({ label, children, helper, required, className }) => (
  <div className={`flex flex-col ${className}`}>
    {label && <FormLabel required={required}>{label}</FormLabel>}
    {children}
    {helper && <FormHelperText>{helper}</FormHelperText>}
  </div>
);

const Switch = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={(e) => { e.stopPropagation(); onChange(); }}
    className={`${checked ? "bg-primary-600 shadow-primary-200" : "bg-slate-200"} relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-primary-500/20`}
  >
    <span
      aria-hidden="true"
      className={`${checked ? "translate-x-5" : "translate-x-0"} pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out`}
    />
  </button>
);

const Badge = ({ children, color = "blue", size = "normal" }) => {
  const styles = {
    blue: "bg-primary-50 text-primary-700 border-primary-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    purple: "bg-primary-50 text-primary-700 border-primary-200",
    orange: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-slate-100 text-slate-600 border-slate-200",
  };
  const sizeClasses = size === "large" ? "px-4 py-1.5 text-xs" : "px-2.5 py-0.5 text-[10px]";
  return (
    <span className={`inline-flex items-center ${sizeClasses} rounded-md font-bold uppercase tracking-wide border ${styles[color] || styles.blue}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = "primary", onClick, disabled, className, icon, size = "md" }) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-widest transition-all duration-200 transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed";
  const sizes = {
    sm: "px-3 py-2 text-[10px]",
    md: "px-4 sm:px-6 py-2.5 text-xs",
    lg: "px-6 sm:px-8 py-3.5 text-sm",
  };
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-200 border border-transparent",
    secondary: "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm",
    danger: "bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 shadow-sm",
    ghost: "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 border border-transparent",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${className}`}>
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </button>
  );
};

// =============================================================================
// SECTION 5: COMPLEX CONFIGURATION FORMS (MOLECULES)
// =============================================================================

const InterestConfigForm = ({ product, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: `${product.product_name} - Interest Rate`,
    interest_type: "FIXED",
    base_rate: "",
    benchmark_type: "REPO",
    spread_margin: "0",
    accrual_method: "SIMPLE",
    accrual_stage: "POST_EMI",
    enable_moratorium: false,
    moratorium_period: 0,
    moratorium_treatment: "CAPITALIZE",
  });

  const handleSubmit = async () => {
    try {
      // ✅ Fixed: use productLoanAPI.update() directly with nested interest_config payload
      await productLoanAPI.update(product.id, { interest_config: form });
      onSave();
    } catch (e) {
      alert("Failed to save Interest Configuration");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden animate-fade-in">
      <div className="bg-slate-50/50 px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center text-xl shadow-sm border border-primary-200 shrink-0">%</div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">Interest Configuration</h3>
            <p className="text-slate-500 text-xs font-medium">Define calculation logic and rates</p>
          </div>
        </div>
        <Badge color="blue" size="large">{product.product_name}</Badge>
      </div>
      <div className="p-4 sm:p-6 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
        <div className="space-y-6 sm:space-y-8">
          <FormGroup label="Interest Strategy" helper="Determines how the rate behaves over time.">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {INTEREST_TYPES.map((type) => (
                <button key={type.value} onClick={() => setForm({ ...form, interest_type: type.value })}
                  className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${form.interest_type === type.value ? "border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500" : "border-slate-200 hover:border-slate-300 bg-white"}`}>
                  <span className={`font-bold text-xs sm:text-sm ${form.interest_type === type.value ? "text-indigo-700" : "text-slate-600"}`}>{type.label}</span>
                  <span className="text-[10px] text-slate-400 text-center mt-1 leading-tight hidden sm:block">{type.desc}</span>
                </button>
              ))}
            </div>
          </FormGroup>
          <FormGroup label="Annual Base Rate" required>
            <InputBox type="number" value={form.base_rate} onChange={(e) => setForm({ ...form, base_rate: e.target.value })} placeholder="e.g. 12.5" suffix="PA %" />
          </FormGroup>
          <div className="pt-4 border-t border-slate-100">
            <FormGroup label="Accrual Method">
              <SelectBox value={form.accrual_method} onChange={(e) => setForm({ ...form, accrual_method: e.target.value })}
                options={[{ label: "Simple Interest (Flat)", value: "SIMPLE" }, { label: "Compound (Reducing)", value: "COMPOUND" }]} />
            </FormGroup>
          </div>
        </div>
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-indigo-50/50 p-4 sm:p-6 rounded-2xl border border-indigo-100">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[11px] font-bold text-indigo-900 uppercase tracking-widest">Moratorium & Holiday</label>
              <Switch checked={form.enable_moratorium} onChange={() => setForm({ ...form, enable_moratorium: !form.enable_moratorium })} />
            </div>
            {form.enable_moratorium ? (
              <div className="space-y-4 animate-fade-in">
                <FormGroup label="Moratorium Period (Months)">
                  <InputBox type="number" value={form.moratorium_period} onChange={(e) => setForm({ ...form, moratorium_period: e.target.value })} suffix="MONTHS" />
                </FormGroup>
                <FormGroup label="Interest Treatment">
                  <SelectBox value={form.moratorium_treatment} onChange={(e) => setForm({ ...form, moratorium_treatment: e.target.value })}
                    options={[{ label: "Capitalize Interest (Add to Principal)", value: "CAPITALIZE" }, { label: "Simple Accrual (Pay Later)", value: "SIMPLE_ACCRUAL" }, { label: "Waive Interest (Holiday)", value: "WAIVE" }]} />
                </FormGroup>
              </div>
            ) : (
              <div className="text-xs text-indigo-400 font-medium italic p-2">Enable to configure grace periods where principal repayment is paused.</div>
            )}
          </div>
          <FormGroup label="Application Stage">
            <SelectBox value={form.accrual_stage} onChange={(e) => setForm({ ...form, accrual_stage: e.target.value })}
              options={[{ label: "Post-EMI (Standard Loan)", value: "POST_EMI" }, { label: "Pre-EMI (Construction Linked)", value: "PRE_EMI" }]} />
          </FormGroup>
        </div>
      </div>
      <div className="bg-slate-50 px-4 sm:px-8 py-4 sm:py-6 border-t border-slate-200 flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save Configuration</Button>
      </div>
    </div>
  );
};

const RepaymentConfigForm = ({ product, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: `${product.product_name} - Repayment Schedule`,
    schedule_type: "EMI",
    frequency: "MONTHLY",
    cycle_date: "5",
    waterfall_sequence: ["Penalties", "Charges", "Fees", "Interest", "Principal"],
    grace_days: 3,
  });

  const moveItem = (index, direction) => {
    const newSeq = [...form.waterfall_sequence];
    const [removed] = newSeq.splice(index, 1);
    newSeq.splice(index + direction, 0, removed);
    setForm({ ...form, waterfall_sequence: newSeq });
  };

  const handleSubmit = async () => {
    try {
      // ✅ Fixed: use productLoanAPI.update() directly with nested repayment_config payload
      await productLoanAPI.update(product.id, { repayment_config: form });
      onSave();
    } catch (e) {
      alert("Failed to save Repayment Config");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in">
      <div className="bg-slate-50/50 px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl shadow-sm border border-orange-200 shrink-0">↻</div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">Repayment Schedule</h3>
            <p className="text-slate-500 text-xs font-medium">Cycle dates, frequencies, and allocation logic</p>
          </div>
        </div>
        <Badge color="orange" size="large">{product.product_name}</Badge>
      </div>
      <div className="p-4 sm:p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
        <div className="lg:col-span-1 space-y-6 sm:space-y-8">
          <FormGroup label="Schedule Type">
            <SelectBox value={form.schedule_type} onChange={(e) => setForm({ ...form, schedule_type: e.target.value })}
              options={[{ label: "Amortized EMI", value: "EMI" }, { label: "Bullet / Balloon Payment", value: "BULLET" }, { label: "Step-Up Repayment", value: "STEP_UP" }]} />
          </FormGroup>
          <FormGroup label="Collection Frequency">
            <SelectBox value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} options={REPAYMENT_FREQUENCIES} />
          </FormGroup>
          <FormGroup label="Cycle Date" helper="Day of the month for collection.">
            <InputBox type="number" value={form.cycle_date} onChange={(e) => setForm({ ...form, cycle_date: e.target.value })} placeholder="5" suffix="TH DAY" />
          </FormGroup>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-orange-50/50 to-white border border-orange-100 rounded-2xl p-5 sm:p-8 h-full shadow-inner relative overflow-hidden group">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 relative z-10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-orange-100 shadow-md flex items-center justify-center text-xl shrink-0">🌊</div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-orange-950 uppercase tracking-widest">Waterfall Mechanism</h4>
                <p className="text-xs text-orange-700 font-medium mt-1 hidden sm:block">Drag items to reorder payment allocation priority.</p>
              </div>
            </div>
            <div className="space-y-3 relative z-10">
              {form.waterfall_sequence.map((item, idx) => (
                <div key={item} className="flex justify-between items-center bg-white p-3 sm:p-4 rounded-xl border border-orange-200/60 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200 group/item">
                  <div className="flex items-center gap-3 sm:gap-5">
                    <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-50 text-orange-700 flex items-center justify-center font-bold text-xs sm:text-sm shadow-inner ring-4 ring-white border border-orange-100 shrink-0">{idx + 1}</span>
                    <span className="font-bold text-slate-700 text-xs sm:text-sm tracking-wide">{item}</span>
                  </div>
                  <div className="flex gap-1 sm:gap-2 opacity-40 group-hover/item:opacity-100 transition-opacity">
                    <button disabled={idx === 0} onClick={() => moveItem(idx, -1)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-orange-50 text-slate-400 hover:text-orange-600 transition disabled:opacity-0 cursor-pointer">▲</button>
                    <button disabled={idx === form.waterfall_sequence.length - 1} onClick={() => moveItem(idx, 1)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-orange-50 text-slate-400 hover:text-orange-600 transition disabled:opacity-0 cursor-pointer">▼</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 px-4 sm:px-8 py-4 sm:py-6 border-t border-slate-200 flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save Schedule</Button>
      </div>
    </div>
  );
};

const RiskConfigForm = ({ product, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: `${product.product_name} - Risk Policy`,
    min_age: 21,
    max_age: 60,
    min_salary: 15000,
    max_foir: 60,
    allowed_income_types: ["Salaried"],
    min_cibil_score: 700,
  });

  const handleSubmit = async () => {
    try {
      // ✅ Fixed: use productLoanAPI.update() directly with nested risk_rule payload
      await productLoanAPI.update(product.id, { risk_rule: form });
      onSave();
    } catch (e) {
      alert("Failed to save Risk Configuration");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in">
      <div className="bg-slate-50/50 px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl shadow-sm border border-rose-200 shrink-0">🛡️</div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">Risk & Eligibility</h3>
            <p className="text-slate-500 text-xs font-medium">Underwriting parameters and criteria</p>
          </div>
        </div>
        <Badge color="red" size="large">{product.product_name}</Badge>
      </div>
      <div className="p-4 sm:p-6 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
        <div className="space-y-6 sm:space-y-8">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 sm:mb-6 border-b border-slate-100 pb-2">Applicant Demographics</h4>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <FormGroup label="Min Age"><InputBox type="number" value={form.min_age} onChange={(e) => setForm({ ...form, min_age: e.target.value })} suffix="YRS" /></FormGroup>
              <FormGroup label="Max Age"><InputBox type="number" value={form.max_age} onChange={(e) => setForm({ ...form, max_age: e.target.value })} suffix="YRS" /></FormGroup>
            </div>
          </div>
          <FormGroup label="Min Monthly Income">
            <InputBox type="number" value={form.min_salary} onChange={(e) => setForm({ ...form, min_salary: e.target.value })} prefix="₹" />
          </FormGroup>
        </div>
        <div className="space-y-6 sm:space-y-8">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 sm:mb-6 border-b border-slate-100 pb-2">Underwriting Logic</h4>
            <div className="bg-emerald-50/30 p-4 sm:p-6 rounded-2xl border border-emerald-100/50">
              <FormGroup label="Minimum Health Card Score" helper="Threshold for automated rejection.">
                <InputBox type="number" value={form.min_cibil_score} onChange={(e) => setForm({ ...form, min_cibil_score: e.target.value })} prefix="🫀" placeholder="e.g. 700" />
              </FormGroup>
              <div className="mt-3 flex items-center gap-2 relative">
                <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                  <div style={{ width: `${(form.min_cibil_score / 900) * 100}%` }} className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500 transition-all duration-500"></div>
                </div>
                <div className="flex justify-between w-full absolute top-3 text-[9px] font-bold text-slate-400"><span>300</span><span>900</span></div>
              </div>
            </div>
          </div>
          <FormGroup label="Internal Policy Name">
            <InputBox value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} />
          </FormGroup>
        </div>
      </div>
      <div className="bg-slate-50 px-4 sm:px-8 py-4 sm:py-6 border-t border-slate-200 flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={handleSubmit}>Save Risk Rules</Button>
      </div>
    </div>
  );
};

const FeesManager = ({ product, existingCharges, onSave }) => {
  const [charges, setCharges] = useState(existingCharges || []);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newFee, setNewFee] = useState({
    name: "",
    category: "FEE",
    frequency: "ONE_TIME",
    basis: "FIXED",
    value: "",
    recovery_stage: "DISBURSEMENT",
  });

  const handleAddFee = async () => {
    if (!newFee.name || !newFee.value) {
      alert("Please enter Fee Name and Value");
      return;
    }
    setLoading(true);
    try {
      // ✅ Fixed: build the updated charges array locally and PATCH via productLoanAPI.update()
      const updatedCharges = [...charges, newFee];
      await productLoanAPI.update(product.id, { charges: updatedCharges });
      setCharges(updatedCharges);
      setIsCreating(false);
      setNewFee({ name: "", category: "FEE", frequency: "ONE_TIME", basis: "FIXED", value: "", recovery_stage: "DISBURSEMENT" });
      if (onSave) onSave();
    } catch (e) {
      alert("Failed to add fee.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFee = async (feeIndex) => {
    if (!confirm("Are you sure you want to remove this fee?")) return;
    try {
      // ✅ Fixed: filter by index (since local fees may not have IDs), then PATCH via productLoanAPI.update()
      const updatedCharges = charges.filter((_, idx) => idx !== feeIndex);
      await productLoanAPI.update(product.id, { charges: updatedCharges });
      setCharges(updatedCharges);
      if (onSave) onSave();
    } catch (e) {
      alert("Failed to remove fee");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:gap-5 animate-fade-in">
        {charges.map((fee, index) => (
          <div key={fee.id || index} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-inner shrink-0 ${fee.category === "FEE" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                {fee.category === "FEE" ? "🧾" : "⚠️"}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base sm:text-xl group-hover:text-indigo-600 transition-colors">{fee.name}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge color="gray">{fee.recovery_stage}</Badge>
                  <Badge color="gray">{fee.frequency}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-10 ml-auto">
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">{fee.basis === "FIXED" ? `₹${fee.value}` : `${fee.value}%`}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Amount</div>
              </div>
              {/* ✅ Fixed: pass index instead of fee.id since local fees may not have IDs */}
              <button onClick={() => handleRemoveFee(index)} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-200 shadow-sm shrink-0">
                <Icons.Trash />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isCreating ? (
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-2xl shadow-emerald-500/10 animate-fade-in overflow-hidden ring-4 ring-emerald-50/50">
          <div className="bg-emerald-50/50 px-4 sm:px-8 py-4 sm:py-6 border-b border-emerald-100 flex justify-between items-center">
            <h4 className="font-bold text-base sm:text-lg text-emerald-900 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>Add New Fee
            </h4>
            <button onClick={() => setIsCreating(false)} className="text-xs font-bold text-emerald-700 hover:text-emerald-900 uppercase tracking-wide bg-emerald-100 px-3 py-1 rounded-lg">Cancel</button>
          </div>
          <div className="p-4 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 mb-8 sm:mb-10">
              <div className="col-span-1 sm:col-span-2">
                <FormGroup label="Fee Name" required>
                  <InputBox placeholder="e.g. Processing Fee" value={newFee.name} onChange={(e) => setNewFee({ ...newFee, name: e.target.value })} autoFocus />
                </FormGroup>
              </div>
              <FormGroup label="Category">
                <SelectBox value={newFee.category} onChange={(e) => setNewFee({ ...newFee, category: e.target.value })}
                  options={[{ label: "Standard Fee", value: "FEE" }, { label: "Penalty / Charge", value: "PENALTY" }]} />
              </FormGroup>
              <div className="flex flex-col gap-2 mb-4">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest ml-0.5">Value <span className="text-rose-500">*</span></label>
                <div className="flex shadow-sm rounded-xl overflow-hidden border border-slate-300 focus-within:ring-[3px] focus-within:ring-indigo-500/20 focus-within:border-indigo-600 transition-all">
                  <input type="number" className="w-full p-3.5 font-bold text-slate-800 outline-none min-w-0" placeholder="0.00" value={newFee.value} onChange={(e) => setNewFee({ ...newFee, value: e.target.value })} />
                  <select className="bg-slate-50 border-l border-slate-300 px-2 sm:px-4 font-bold text-slate-600 text-sm outline-none hover:bg-slate-100 cursor-pointer shrink-0" value={newFee.basis} onChange={(e) => setNewFee({ ...newFee, basis: e.target.value })}>
                    <option value="FIXED">₹ (Flat)</option>
                    <option value="PERCENTAGE">% (Percent)</option>
                  </select>
                </div>
              </div>
              <FormGroup label="Collection Stage">
                <SelectBox value={newFee.recovery_stage} onChange={(e) => setNewFee({ ...newFee, recovery_stage: e.target.value })} options={COLLECTION_STAGES} />
              </FormGroup>
              <FormGroup label="Frequency">
                <SelectBox value={newFee.frequency} onChange={(e) => setNewFee({ ...newFee, frequency: e.target.value })}
                  options={[{ label: "One Time", value: "ONE_TIME" }, { label: "Recurring", value: "RECURRING" }]} />
              </FormGroup>
            </div>
            <Button variant="success" className="w-full py-4 text-sm" onClick={handleAddFee} disabled={loading}>
              {loading ? "Saving..." : "Create & Link Fee"}
            </Button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsCreating(true)} className="w-full py-6 sm:py-8 border-2 border-dashed border-slate-300 text-slate-400 font-bold rounded-3xl hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all text-xs sm:text-sm uppercase tracking-widest flex flex-col items-center gap-2 sm:gap-3 group">
          <span className="text-3xl sm:text-4xl font-light group-hover:scale-110 transition-transform text-emerald-500">+</span>
          Add New Fee / Charge
        </button>
      )}
    </div>
  );
};

// =============================================================================
// SECTION 6: PRODUCT EDITING & DISPLAY (TEMPLATES)
// =============================================================================

const EditProductForm = ({ product, onSave, onCancel, loanTypes }) => {
  const [form, setForm] = useState({ ...product });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // ✅ Correct: productLoanAPI.update() matches service's update(id, payload)
      await productLoanAPI.update(product.id, form);
      onSave(form);
    } catch (e) {
      alert("Failed to update product details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-2xl overflow-hidden animate-fade-in relative mb-6 sm:mb-8">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 p-5 sm:p-8 text-white flex justify-between items-center">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Edit Product Details</h3>
          <p className="text-indigo-200 text-xs sm:text-sm mt-1 font-medium">Update core parameters and limits</p>
        </div>
        <button onClick={onCancel} className="bg-white/10 hover:bg-white/20 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition text-white shrink-0">
          <span className="text-xl leading-none">&times;</span>
        </button>
      </div>
      <div className="p-4 sm:p-8 lg:p-10 space-y-8 sm:space-y-12">
        <div className="space-y-6 sm:space-y-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 border-b border-slate-100 pb-4">
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base sm:text-lg shadow-sm shrink-0">1</span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-widest">Product Identity</h4>
              <p className="text-xs text-slate-400 font-medium">Basic information.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 pl-2 sm:pl-4">
            <FormGroup label="Product Name" required>
              <InputBox value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} />
            </FormGroup>
            <FormGroup label="Loan Type">
              <SelectBox value={form.loan_type} onChange={(e) => setForm({ ...form, loan_type: e.target.value })} options={loanTypes} placeholder="Select Loan Type" />
            </FormGroup>
          </div>
        </div>
        <div className="space-y-6 sm:space-y-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 border-b border-slate-100 pb-4">
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base sm:text-lg shadow-sm shrink-0">2</span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-widest">Financial Constraints</h4>
              <p className="text-xs text-slate-400 font-medium">Set the hard limits.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-8 pl-2 sm:pl-4">
            <FormGroup label="Min Amount"><InputBox type="number" prefix="₹" value={form.min_amount} onChange={(e) => setForm({ ...form, min_amount: e.target.value })} /></FormGroup>
            <FormGroup label="Max Amount"><InputBox type="number" prefix="₹" value={form.max_amount} onChange={(e) => setForm({ ...form, max_amount: e.target.value })} /></FormGroup>
            <FormGroup label="Min Tenure"><InputBox type="number" suffix="MONTHS" value={form.min_tenure} onChange={(e) => setForm({ ...form, min_tenure: e.target.value })} /></FormGroup>
            <FormGroup label="Max Tenure"><InputBox type="number" suffix="MONTHS" value={form.max_tenure} onChange={(e) => setForm({ ...form, max_tenure: e.target.value })} /></FormGroup>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 p-4 sm:p-8 flex flex-wrap justify-end gap-3 sm:gap-4 border-t border-slate-200">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Update Product"}</Button>
      </div>
    </div>
  );
};

const ProductDetails = ({ product, onBack }) => (
  <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
    <div className="bg-slate-900 text-white p-5 sm:p-8 flex flex-wrap justify-between items-center gap-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl pointer-events-none"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 sm:gap-6">
          <button onClick={onBack} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition backdrop-blur-md shrink-0">←</button>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">{product.product_name}</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 uppercase tracking-wider font-bold">{product.loan_type}</p>
          </div>
        </div>
      </div>
      <div className="relative z-10">
        <Badge color={product.is_active ? "green" : "red"} size="large">{product.is_active ? "ACTIVE" : "INACTIVE"}</Badge>
      </div>
    </div>
    <div className="p-4 sm:p-8 lg:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
      <div className="space-y-6 sm:space-y-8">
        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-100/50">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-5 sm:mb-8 border-b border-slate-100 pb-4 flex items-center gap-3">
            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg text-xl">💰</span> Financial Limits
          </h3>
          <div className="grid grid-cols-2 gap-y-6 sm:gap-y-10 text-sm">
            {[
              { label: "Min Amount", value: `₹${Number(product.min_amount).toLocaleString()}` },
              { label: "Max Amount", value: `₹${Number(product.max_amount).toLocaleString()}` },
              { label: "Min Tenure", value: `${product.min_tenure} Months` },
              { label: "Max Tenure", value: `${product.max_tenure} Months` },
            ].map(item => (
              <div key={item.label}>
                <div className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-2">{item.label}</div>
                <div className="font-mono text-lg sm:text-2xl font-bold text-slate-800">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-50 p-5 sm:p-8 rounded-3xl border border-slate-100">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-6 border-b border-slate-200 pb-4">System IDs</h3>
          <ul className="space-y-3 sm:space-y-4 text-xs text-slate-500 font-mono">
            {[
              { label: "Interest Config", value: product.interest_config || "---" },
              { label: "Repayment Config", value: product.repayment_config || "---" },
              { label: "Risk Rule", value: product.risk_rule || "---" },
            ].map(item => (
              <li key={item.label} className="flex justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm gap-2">
                <span className="shrink-0">{item.label}</span>
                <span className="font-bold text-slate-800 truncate text-right">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-6 sm:space-y-8">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col justify-center items-center text-center min-h-[200px] hover:border-indigo-200 transition-colors group">
          <div className="text-5xl sm:text-7xl mb-6 sm:mb-8 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">📦</div>
          <h3 className="text-xl sm:text-3xl font-bold text-slate-800">Product Overview</h3>
          <p className="text-slate-400 mt-3 sm:mt-4 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">This is a read-only view of the loan product.</p>
        </div>
      </div>
    </div>
  </div>
);

const ProductManager = ({ product, onBack, loanTypes }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [configData, setConfigData] = useState({ interest: null, repayment: null, risk: null, charges: [] });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(product);

  const refreshConfig = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ Correct: productLoanAPI.getById() matches service
      const res = await productLoanAPI.getById(currentProduct.id);
      if (res.data.product_name) setCurrentProduct((prev) => ({ ...prev, ...res.data }));
      setConfigData({
        interest: res.data.interest_details,
        repayment: res.data.repayment_config_details,
        risk: res.data.risk_details,
        charges: res.data.charges_details || [],
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [currentProduct.id]);

  useEffect(() => { refreshConfig(); }, [refreshConfig]);

  const handleEditSuccess = (updatedData) => {
    setCurrentProduct({ ...currentProduct, ...updatedData });
    setIsEditing(false);
    refreshConfig();
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "interest", label: "Interest Rules", icon: "💰" },
    { id: "repayment", label: "Repayment", icon: "🔄" },
    { id: "risk", label: "Risk Criteria", icon: "🛡️" },
    { id: "fees", label: "Fees & Charges", icon: "🧾" },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden min-h-[85vh] flex flex-col">
      <div className="bg-slate-900 text-white p-4 sm:p-8 flex justify-between items-start sm:items-center gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition transform hover:-translate-x-1 shrink-0 text-sm sm:text-base">← Back</button>
            <h1 className="text-lg sm:text-2xl font-bold truncate">{currentProduct.product_name}</h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 ml-0 sm:ml-14 font-medium">{currentProduct.loan_type}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden bg-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition">☰ Menu</button>
          <div className="hidden sm:block text-right bg-slate-800/50 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-slate-700 shrink-0">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Current Status</div>
            <div className="font-bold text-emerald-400 flex items-center gap-2 mt-1 text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>Active Config
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 relative">
        {isSidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
        <div className={`absolute lg:static top-0 left-0 h-full z-30 lg:z-auto w-72 lg:w-64 xl:w-80 bg-slate-50 border-r border-slate-200 p-4 sm:p-6 space-y-2 sm:space-y-3 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} overflow-y-auto`}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? "bg-white text-indigo-600 shadow-xl shadow-indigo-100 border border-indigo-50 translate-x-2" : "text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm"}`}>
              <span className="text-lg sm:text-xl opacity-80 shrink-0">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>
        <div className="flex-1 p-4 sm:p-8 lg:p-12 bg-slate-50/30 overflow-y-auto min-w-0">
          {loading ? (
            <div className="flex justify-center items-center h-full flex-col gap-6 min-h-[300px]">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-slate-400 font-bold tracking-widest text-sm animate-pulse">LOADING DATA...</div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {activeTab === "overview" && (
                <>
                  {isEditing ? (
                    <EditProductForm product={currentProduct} onSave={handleEditSuccess} onCancel={() => setIsEditing(false)} loanTypes={loanTypes} />
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all">
                        <div className="flex flex-wrap justify-between items-center mb-6 sm:mb-8 gap-3">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-800">Product Limits</h3>
                          <Button variant="primary" onClick={() => setIsEditing(true)} size="sm" icon={<Icons.Edit />}>Edit Details</Button>
                        </div>
                        <div className="space-y-4 sm:space-y-6">
                          {[
                            { label: "Min Amount", value: `₹${Number(currentProduct.min_amount).toLocaleString()}` },
                            { label: "Max Amount", value: `₹${Number(currentProduct.max_amount).toLocaleString()}` },
                            { label: "Tenure Range", value: `${currentProduct.min_tenure} - ${currentProduct.max_tenure} Months` },
                          ].map((item, i) => (
                            <div key={i} className={`flex justify-between ${i < 2 ? "border-b border-slate-50 pb-4" : "pt-2"}`}>
                              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">{item.label}</span>
                              <span className="font-bold text-slate-800 text-sm sm:text-lg">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-6 sm:mb-8">Configuration Status</h3>
                        <div className="space-y-3 sm:space-y-5">
                          {[
                            { label: "Interest Rules", ready: !!configData.interest },
                            { label: "Repayment Logic", ready: !!configData.repayment },
                            { label: "Risk Engine", ready: !!configData.risk, extra: configData.risk && <span className="text-[10px] font-bold text-slate-500 mt-1 flex items-center gap-1">Health Score: <span className="text-emerald-600 bg-emerald-50 px-1.5 rounded">{configData.risk.min_cibil_score}</span></span> },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <span className={`w-4 h-4 rounded-full shrink-0 ${item.ready ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]" : "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]"}`} />
                              <div className="flex flex-col min-w-0">
                                <span className="text-slate-700 font-bold text-xs sm:text-sm">{item.label}</span>
                                {item.extra}
                              </div>
                              <span className={`ml-auto text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shrink-0 ${item.ready ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                                {item.ready ? "READY" : "MISSING"}
                              </span>
                            </div>
                          ))}
                          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className={`w-4 h-4 rounded-full shrink-0 ${configData.charges?.length > 0 ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]" : "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]"}`} />
                            <span className="text-slate-700 font-bold text-xs sm:text-sm">Fees Configured</span>
                            <span className="ml-auto text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded-md uppercase tracking-wider shrink-0">{configData.charges?.length || 0} ITEMS</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              {activeTab === "interest" && (
                configData.interest ? (
                  <div className="bg-white p-5 sm:p-10 rounded-3xl border border-blue-100 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -mr-10 -mt-10 opacity-50 blur-2xl"></div>
                    <div className="flex flex-wrap justify-between items-start gap-4 relative z-10">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-3">{configData.interest.name}</h3>
                        <Badge color="blue" size="large">{configData.interest.interest_type}</Badge>
                      </div>
                      <Button variant="secondary" onClick={() => setConfigData({ ...configData, interest: null })} size="sm">Edit Config</Button>
                    </div>
                    <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-10">
                      {[
                        { label: "Base Rate", value: <>{configData.interest.base_rate}<span className="text-xl sm:text-2xl text-slate-400 ml-1 font-medium">%</span></>, big: true },
                        { label: "Method", value: configData.interest.accrual_method },
                        { label: "Stage", value: configData.interest.accrual_stage },
                      ].map(item => (
                        <div key={item.label} className="p-5 sm:p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3">{item.label}</div>
                          <div className={`font-black text-slate-800 ${item.big ? "text-4xl sm:text-5xl" : "text-lg sm:text-xl font-bold"}`}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : <InterestConfigForm product={currentProduct} onSave={refreshConfig} onCancel={() => { }} />
              )}
              {activeTab === "repayment" && (
                configData.repayment ? (
                  <div className="bg-white p-5 sm:p-10 rounded-3xl border border-orange-100 shadow-xl relative overflow-hidden">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6 sm:mb-8 relative z-10">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">{configData.repayment.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge color="orange">{configData.repayment.schedule_type}</Badge>
                          <Badge color="purple">{configData.repayment.frequency}</Badge>
                        </div>
                      </div>
                      <Button variant="secondary" onClick={() => setConfigData({ ...configData, repayment: null })} size="sm">Edit Config</Button>
                    </div>
                    <div className="bg-orange-50/30 p-5 sm:p-8 rounded-2xl border border-orange-100/50">
                      <div className="text-xs font-bold text-orange-800 uppercase mb-4 tracking-widest">Waterfall Sequence</div>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {(Array.isArray(configData.repayment.waterfall_sequence) ? configData.repayment.waterfall_sequence : []).map((step, i) => (
                          <div key={i} className="flex items-center">
                            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-orange-200 rounded-lg text-xs sm:text-sm font-bold text-slate-700 shadow-sm">{step}</span>
                            {i < configData.repayment.waterfall_sequence.length - 1 && <span className="text-orange-300 mx-1 sm:mx-3 font-bold">→</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : <RepaymentConfigForm product={currentProduct} onSave={refreshConfig} onCancel={() => { }} />
              )}
              {activeTab === "risk" && (
                configData.risk ? (
                  <div className="bg-white p-5 sm:p-10 rounded-3xl border border-rose-100 shadow-xl relative overflow-hidden">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6 sm:mb-10 relative z-10">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">{configData.risk.name}</h3>
                        <Badge color="red">Risk Rules</Badge>
                      </div>
                      <Button variant="secondary" onClick={() => setConfigData({ ...configData, risk: null })} size="sm">Edit Rules</Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                      <div className="bg-slate-50 p-5 sm:p-8 rounded-2xl border border-slate-100">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 sm:mb-6 border-b border-slate-200 pb-2">Eligibility</h4>
                        <ul className="space-y-3 sm:space-y-4 text-sm text-slate-700">
                          <li className="flex justify-between"><span className="font-medium text-slate-500">Age</span><span className="font-bold">{configData.risk.min_age} - {configData.risk.max_age} Yrs</span></li>
                          <li className="flex justify-between"><span className="font-medium text-slate-500">Min Salary</span><span className="font-bold">₹{Number(configData.risk.min_salary).toLocaleString()}</span></li>
                        </ul>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-4"><Icons.Health /><span className="font-bold text-rose-800 uppercase tracking-wider text-xs">Health Card Score</span></div>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight">{configData.risk.min_cibil_score || 0}</span>
                          <span className="text-base sm:text-lg text-slate-400 font-medium">/ 900</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                          <div className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${(Number(configData.risk.min_cibil_score || 0) / 900) * 100}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider"><span>Poor (300)</span><span>Excellent (900)</span></div>
                        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-100">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-500 uppercase">Max FOIR</span>
                            <span className="text-xl sm:text-2xl font-bold text-slate-800">{configData.risk.max_foir}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : <RiskConfigForm product={currentProduct} onSave={refreshConfig} onCancel={() => { }} />
              )}
              {activeTab === "fees" && (
                <div>
                  <div className="flex flex-wrap justify-between items-center mb-6 sm:mb-8 gap-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Fees & Charges</h2>
                    <Badge color="green" size="large">{configData.charges?.length || 0} Active</Badge>
                  </div>
                  <FeesManager product={currentProduct} existingCharges={configData.charges} onSave={refreshConfig} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// SECTION 7: CREATE PRODUCT FORM
// =============================================================================

const CreateProductForm = ({ onCancel, onSuccess, loanTypes }) => {
  const [form, setForm] = useState({
    product_name: "",
    loan_type: "",
    min_amount: "",
    max_amount: "",
    min_tenure: "",
    max_tenure: "",
    is_active: true,
  });

  const handleSubmit = async () => {
    if (!form.product_name || !form.min_amount || !form.max_amount || !form.loan_type) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      product_name: form.product_name.trim(),
      loan_type: form.loan_type,
      min_amount: Number(form.min_amount),
      max_amount: Number(form.max_amount),
      ...(form.min_tenure ? { min_tenure: Number(form.min_tenure) } : {}),
      ...(form.max_tenure ? { max_tenure: Number(form.max_tenure) } : {}),
      is_active: form.is_active,
    };

    try {
      await productLoanAPI.create(payload);
      onSuccess();
    } catch (e) {
      // Surface the actual DRF validation errors instead of a generic message
      const data = e?.response?.data;
      if (data && typeof data === "object") {
        const messages = Object.entries(data)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
          .join("\n");
        alert(`Validation Error:\n\n${messages}`);
      } else {
        alert(e?.response?.data?.detail || e?.message || "Failed to create product");
      }
      console.error("Create product error:", e?.response?.data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in my-6 sm:my-10 border border-slate-100 relative">
      <div className="bg-primary-600 p-6 sm:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-700 rounded-full -mr-20 -mt-20 opacity-40 blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-4xl font-black mb-2 sm:mb-3 tracking-tight">Create New Product</h2>
          <p className="text-white/80 font-medium text-sm sm:text-lg">Define the core parameters for your lending product.</p>
        </div>
      </div>
      <div className="p-4 sm:p-8 lg:p-12 space-y-10 sm:space-y-16">
        <div className="space-y-6 sm:space-y-8">
          <div className="flex items-center gap-4 sm:gap-5 border-b border-slate-100 pb-5 sm:pb-6">
            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-xl shadow-primary-200 shrink-0">1</span>
            <div>
              <h4 className="text-sm sm:text-lg font-bold text-slate-900 uppercase tracking-widest">Core Details</h4>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Basic identification information</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:gap-10 pl-2 sm:pl-4">
            <FormGroup label="Product Name" required>
              <InputBox placeholder="e.g. Salaried Personal Loan 2025" value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} />
            </FormGroup>
            <FormGroup label="Loan Type" required>
              <SelectBox options={loanTypes} value={form.loan_type} onChange={(e) => setForm({ ...form, loan_type: e.target.value })} placeholder="Select Loan Type" />
            </FormGroup>
          </div>
        </div>
        <div className="space-y-6 sm:space-y-8">
          <div className="flex items-center gap-4 sm:gap-5 border-b border-slate-100 pb-5 sm:pb-6">
            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-xl shadow-primary-200 shrink-0">2</span>
            <div>
              <h4 className="text-sm sm:text-lg font-bold text-slate-900 uppercase tracking-widest">Constraints</h4>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Financial boundaries and limits</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-10 pl-2 sm:pl-4">
            <FormGroup label="Min Amount" required><InputBox type="number" prefix="₹" value={form.min_amount} onChange={(e) => setForm({ ...form, min_amount: e.target.value })} /></FormGroup>
            <FormGroup label="Max Amount" required><InputBox type="number" prefix="₹" value={form.max_amount} onChange={(e) => setForm({ ...form, max_amount: e.target.value })} /></FormGroup>
            <FormGroup label="Min Tenure"><InputBox type="number" suffix="MO" value={form.min_tenure} onChange={(e) => setForm({ ...form, min_tenure: e.target.value })} /></FormGroup>
            <FormGroup label="Max Tenure"><InputBox type="number" suffix="MO" value={form.max_tenure} onChange={(e) => setForm({ ...form, max_tenure: e.target.value })} /></FormGroup>
          </div>
        </div>
        <div className="pt-6 sm:pt-10 border-t border-slate-100 flex flex-wrap justify-end gap-4 sm:gap-6">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} size="lg">Create Product</Button>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// SECTION 8: MAIN PAGE CONTROLLER
// =============================================================================

export default function Loans() {
  const [view, setView] = useState("list");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Static loan types — no master API call needed
  const [loanTypes] = useState(STATIC_LOAN_TYPES);

  const loadProducts = async () => {
    try {
      // ✅ Correct: productLoanAPI.getAll() matches service
      const res = await productLoanAPI.getAll();
      setProducts(res.data || []);
    } catch (e) {
      console.error("Error loading products");
    }
  };

  useEffect(() => { loadProducts(); }, [view]);

  const handleCreateSuccess = () => { setView("list"); loadProducts(); };
  const handleManage = (product) => { setSelectedProduct(product); setView("manage"); };
  const handleView = (product) => { setSelectedProduct(product); setView("details"); };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      // ✅ Fixed: productLoanAPI.remove() — was incorrectly called as .delete()
      await productLoanAPI.remove(id);
      loadProducts();
    } catch (e) {
      alert("Failed to delete product.");
    }
  };

  const toggleStatus = async (p) => {
    setProducts((prev) => prev.map((item) => item.id === p.id ? { ...item, is_active: !p.is_active } : item));
    try {
      // ✅ Fixed: productLoanAPI.update() — was incorrectly called as .patch()
      await productLoanAPI.update(p.id, { is_active: !p.is_active });
    } catch (e) {
      setProducts((prev) => prev.map((item) => item.id === p.id ? { ...item, is_active: p.is_active } : item));
      alert("Status update failed");
    }
  };

  const filteredProducts = useMemo(() => {
    const productList = Array.isArray(products) ? products : [];
    if (!search) return productList;
    return productList.filter((p) => p && p.product_name && p.product_name.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  const pageWrapper = (children) => <div className="p-3 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">{children}</div>;

  if (view === "create") return pageWrapper(<CreateProductForm onCancel={() => setView("list")} onSuccess={handleCreateSuccess} loanTypes={loanTypes} />);
  if (view === "manage" && selectedProduct) return pageWrapper(<ProductManager product={selectedProduct} onBack={() => { setSelectedProduct(null); setView("list"); }} loanTypes={loanTypes} />);
  if (view === "details" && selectedProduct) return pageWrapper(<ProductDetails product={selectedProduct} onBack={() => { setSelectedProduct(null); setView("list"); }} />);

  return (
    <div className="p-3 sm:p-6 lg:p-10 xl:p-12 max-w-[1800px] mx-auto min-h-screen bg-slate-50 font-sans">
      <div className="flex flex-wrap justify-between items-start sm:items-center mb-6 sm:mb-10 lg:mb-12 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-1 sm:mb-2">Loan Products</h1>
          <p className="text-slate-500 text-sm sm:text-base lg:text-lg font-medium">Manage your lending portfolio and business logic.</p>
        </div>
        <Button variant="primary" onClick={() => setView("create")} icon={<Icons.Plus />} size="lg">
          <span className="hidden sm:inline">Create New Product</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>
      <div className="bg-white rounded-2xl sm:rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-3 sm:p-6 lg:p-8 border-b border-slate-100 bg-white">
          <div className="relative w-full max-w-2xl">
            <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400"><Icons.Search /></span>
            <input
              className="w-full pl-11 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-inner placeholder:text-slate-400"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ minWidth: "600px" }}>
            <thead className="bg-slate-50/80 text-slate-500 font-extrabold uppercase tracking-widest text-[10px] sm:text-[11px] backdrop-blur-sm border-b border-slate-200">
              <tr>
                <th className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6">Product</th>
                <th className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6">Category</th>
                <th className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 hidden md:table-cell">Financial Limits</th>
                <th className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6">Status</th>
                <th className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(Array.isArray(filteredProducts) ? filteredProducts : []).map((p) => (
                <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8">
                    <div className="font-bold text-slate-800 text-sm sm:text-base lg:text-lg mb-1">{p.product_name}</div>
                    <div className="text-[10px] text-slate-400 font-bold bg-slate-100 inline-block px-2 py-0.5 rounded whitespace-nowrap">{p.min_tenure}-{p.max_tenure} Mo</div>
                  </td>
                  <td className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8"><Badge color="purple">{p.loan_type}</Badge></td>
                  <td className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 hidden md:table-cell">
                    <div className="font-mono font-bold text-slate-700 text-xs sm:text-sm lg:text-base whitespace-nowrap">
                      ₹{Number(p.min_amount).toLocaleString()} <span className="text-slate-400 mx-1">-</span> ₹{Number(p.max_amount).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <Switch checked={p.is_active} onChange={() => toggleStatus(p)} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap hidden sm:inline ${p.is_active ? "text-emerald-600 bg-emerald-50 px-2 py-1 rounded" : "text-slate-400 bg-slate-100 px-2 py-1 rounded"}`}>
                        {p.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 text-right">
                    <div className="flex justify-end gap-1 sm:gap-2 opacity-60 group-hover:opacity-100 transition-all">
                      <Button variant="secondary" size="sm" onClick={() => handleView(p)} icon={<Icons.Eye />}><span className="hidden lg:inline">View</span></Button>
                      <Button variant="primary" size="sm" onClick={() => handleManage(p)} className="bg-indigo-600 hover:bg-indigo-700">
                        <span className="hidden sm:inline">Configure</span><span className="sm:hidden">⚙</span>
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)} icon={<Icons.Trash />} />
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredProducts.length && (
                <tr><td colSpan={5} className="px-6 py-12 sm:py-24 text-center">
                  <div className="flex flex-col items-center justify-center opacity-40">
                    <span className="text-5xl sm:text-6xl mb-4">🔍</span>
                    <p className="text-lg sm:text-xl font-bold text-slate-800">No products found</p>
                    <p className="text-slate-500 text-sm">Try adjusting your search or create a new one.</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}
