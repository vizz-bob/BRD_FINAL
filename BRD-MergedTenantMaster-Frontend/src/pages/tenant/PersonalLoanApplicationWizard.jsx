import React, { useState, useEffect } from "react";
import { productLoanAPI } from "../../services/productLoanService";
import { useParams } from "react-router-dom";
import {
  UserIcon, MapPinIcon, BanknotesIcon, BuildingLibraryIcon,
  DocumentTextIcon, ArrowRightIcon, ArrowLeftIcon, CheckCircleIcon,
  CloudArrowUpIcon, LockClosedIcon,
} from "@heroicons/react/24/outline";
import { loanApplicationAPI } from "../../services/loanApplicationService";
import { getCategories } from "../../services/categoryService";

// --------------------------------------------------------------------------
// UI HELPERS
// --------------------------------------------------------------------------

const InputGroup = ({ label, name, type = "text", placeholder, required, width = "full", value, onChange, error, ...props }) => (
  <div className={`flex flex-col gap-1.5 ${width === "half" ? "col-span-2 sm:col-span-1" : "col-span-2"}`}>
    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      className={`w-full px-3 sm:px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm ${
        error ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-primary-500"
      } ${type === "date" ? "cursor-text" : ""}`}
      {...props}
    />
    {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
  </div>
);

const SelectGroup = ({ label, name, options, width = "full", value, onChange }) => (
  <div className={`flex flex-col gap-1.5 ${width === "half" ? "col-span-2 sm:col-span-1" : "col-span-2"}`}>
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <div className="relative">
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-primary-500 outline-none text-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

const FileUploader = ({ label, name, accept = ".pdf,.jpg,.png", file, setFile }) => (
  <div className="col-span-2 border-2 border-dashed border-gray-200 rounded-xl p-4 sm:p-6 hover:bg-gray-50 transition-colors text-center">
    <div className="flex flex-col items-center justify-center gap-2">
      <CloudArrowUpIcon className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300" />
      <h4 className="text-xs sm:text-sm font-bold text-gray-700 leading-snug">{label}</h4>
      {file ? (
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full text-green-700 text-xs mt-1 flex-wrap justify-center">
          <CheckCircleIcon className="h-4 w-4 shrink-0" />
          <span className="truncate max-w-[160px]">{file.name}</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setFile(name, null); }}
            className="text-red-500 hover:text-red-700 font-bold ml-1"
          >×</button>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400">Drag & drop or click to upload</p>
          <input type="file" name={name} id={`file-${name}`} className="hidden" accept={accept}
            onChange={(e) => { if (e.target.files[0]) setFile(name, e.target.files[0]); }}
          />
          <label htmlFor={`file-${name}`} className="mt-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-100 transition">
            Browse Files
          </label>
        </>
      )}
    </div>
  </div>
);

// --------------------------------------------------------------------------
// MAIN WIZARD
// --------------------------------------------------------------------------

export default function PersonalLoanApplicationWizard() {
  const { productId } = useParams();
  const [isMortgage, setIsMortgage] = useState(productId?.toString().toUpperCase().includes("MORTGAGE"));
  const [isBusiness, setIsBusiness] = useState(false);
  const [isPersonal, setIsPersonal] = useState(productId?.toString().toUpperCase().includes("PERSONAL"));
  const [isHome, setIsHome] = useState(productId?.toString().toUpperCase().includes("HOME"));

  useEffect(() => {
    let mounted = true;
    const detectProduct = async () => {
      if (!productId) return;
      if (productId.toString().toUpperCase().includes("MORTGAGE")) { setIsMortgage(true); return; }
      try {
        const res = await productLoanAPI.getAll();
        const products = res?.data || [];
        if (!mounted || !products) return;
        const found = products.find((p) => {
          if (String(p.id) === String(productId)) return true;
          if (String(p.pk) === String(productId)) return true;
          return [p.name, p.title, p.product_name, p.slug, p.display_name].some(
            (c) => c && String(c).toUpperCase().includes("MORTGAGE")
          );
        });
        if (found) {
          const text = [found.name, found.loan_type].map((v) => String(v || "").toUpperCase()).join(" ");
          setIsMortgage(text.includes("MORTGAGE") || text.includes("PROPERTY") || text.includes("LAP"));
          setIsBusiness(text.includes("BUSINESS"));
          setIsPersonal(text.includes("PERSONAL"));
          setIsHome(text.includes("HOME"));
        }
      } catch (err) { console.warn("Product detection failed:", err); }
    };
    detectProduct();
    return () => { mounted = false; };
  }, [productId]);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    first_name: "", last_name: "", mobile_no: "", email: "", dob: "", gender: "M",
    pan_number: "", aadhaar_number: "", income_type: "Salaried",
    res_address_line1: "", res_address_line2: "", res_city: "", res_state: "",
    res_pincode: "", res_country: "India", office_address_line1: "", office_city: "",
    office_pincode: "", requested_amount: "", requested_tenure: 12, monthly_income: "",
    employer_name: "", employment_type: "Private", business_name: "", annual_turnover: "",
    bank_account_number: "", ifsc_code: "", account_type: "Savings", mandate_type: "eNACH",
    disbursement_consent: false, doc_identity: null, doc_address: null, doc_income: null,
    doc_bank: null, doc_video: null, doc_photographs: null, doc_form16: null,
    doc_itr_2yrs: null, doc_itr_3yrs: null, doc_balance_sheet: null, doc_business_proof: null,
    doc_sale_deed: null, doc_mother_deed: null, doc_encumbrance: null, doc_building_plan: null,
    doc_occupancy: null, doc_property_tax: null, doc_utility_bills: null, doc_noc: null,
  });

  const [dynamicOptions, setDynamicOptions] = useState({
    gender: [{ label: "Male", value: "M" }, { label: "Female", value: "F" }, { label: "Other", value: "O" }],
    employment_type: [{ label: "Private Sector", value: "Private" }, { label: "Public Sector", value: "Public" }, { label: "Government", value: "Govt" }],
    income_type: [{ label: "Salaried", value: "Salaried" }, { label: "Self-Employed", value: "Self-Employed" }],
    account_type: [{ label: "Savings", value: "Savings" }, { label: "Current", value: "Current" }],
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories();
        const grouped = {};
        cats.forEach(c => {
          grouped[c.category_key] = grouped[c.category_key] || [];
          grouped[c.category_key].push({ label: c.title, value: c.title });
        });

        setDynamicOptions(prev => ({
          gender: grouped.gender?.length ? grouped.gender : prev.gender,
          employment_type: grouped.employment_type?.length ? grouped.employment_type : prev.employment_type,
          income_type: grouped.income_type?.length ? grouped.income_type : prev.income_type,
          account_type: grouped.account_type?.length ? grouped.account_type : prev.account_type,
        }));
      } catch (err) {
        console.warn("Failed to load dynamic categories:", err);
      }
    };
    loadCategories();
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case "mobile_no": return !/^[6-9]\d{9}$/.test(value) ? "Invalid 10-digit mobile number" : "";
      case "pan_number": return !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value) ? "Invalid PAN format (e.g., ABCDE1234F)" : "";
      case "aadhaar_number": return !/^\d{12}$/.test(value) ? "Aadhaar must be 12 digits" : "";
      case "email": return !/\S+@\S+\.\S+/.test(value) ? "Invalid email address" : "";
      case "ifsc_code": return !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value) ? "Invalid IFSC Code" : "";
      case "res_pincode": case "office_pincode": return !/^\d{6}$/.test(value) ? "Pincode must be 6 digits" : "";
      case "requested_amount":
        if (Number(value) < 10000) return "Minimum loan amount is ₹10,000";
        if (Number(value) > 2000000) return "Maximum loan amount is ₹20 Lakhs";
        return "";
      default: return "";
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;
    const requireField = (field, label) => {
      if (!formData[field]) { newErrors[field] = `${label} is required`; isValid = false; }
      else if (validateField(field, formData[field])) { newErrors[field] = validateField(field, formData[field]); isValid = false; }
    };
    if (step === 1) { requireField("first_name", "First Name"); requireField("last_name", "Last Name"); requireField("mobile_no", "Mobile"); requireField("email", "Email"); requireField("pan_number", "PAN"); requireField("dob", "Date of Birth"); }
    if (step === 2) { requireField("res_address_line1", "Residential Address"); requireField("res_pincode", "Residence Pincode"); requireField("office_address_line1", "Office Address"); requireField("office_pincode", "Office Pincode"); }
    if (step === 3) { requireField("requested_amount", "Amount"); requireField("monthly_income", "Monthly Income"); formData.income_type === "Salaried" ? requireField("employer_name", "Employer Name") : requireField("business_name", "Business Name"); }
    if (step === 4) { requireField("bank_account_number", "Account Number"); requireField("ifsc_code", "IFSC Code"); if (!formData.disbursement_consent) { newErrors["disbursement_consent"] = "Consent is mandatory"; isValid = false; } }
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    const upperCaseFields = ["pan_number", "ifsc_code"];
    const storageValue = upperCaseFields.includes(name) ? finalValue.toUpperCase() : finalValue;
    setFormData((prev) => ({ ...prev, [name]: storageValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSetFile = (name, file) => {
    if (file && file.size > 5 * 1024 * 1024) { alert("File size exceeds 5MB"); return; }
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleNext = () => {
    if (validateStep(currentStep)) { setCurrentStep((p) => p + 1); window.scrollTo(0, 0); }
    else alert("Please fix validation errors before proceeding.");
  };

  const handleBack = () => { setCurrentStep((p) => p - 1); window.scrollTo(0, 0); };

  const handleSubmitApplication = async () => {
    if (!formData.doc_identity || !formData.doc_bank) { alert("Please upload at least Identity Proof and Bank Statement."); return; }
    if (!validateStep(4)) return;
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (!key.startsWith("doc_") && value !== null && value !== undefined && value !== "") formDataToSend.append(key, value);
      });
      Object.entries(formData).forEach(([key, value]) => {
        if (key.startsWith("doc_") && value instanceof File) formDataToSend.append(key, value);
      });
      const tenantId = Number(sessionStorage.getItem("tenant_id") || 1);
      const customerId = Number(sessionStorage.getItem("customer_id") || 1);
      const resolvedProductId = Number(productId || 1);
      
      if (!Number.isInteger(tenantId) || !Number.isInteger(customerId) || !Number.isInteger(resolvedProductId)) {
        throw new Error("Invalid tenant, customer, or product ID");
      }
      formDataToSend.append("tenant", tenantId);
      formDataToSend.append("customer", customerId);
      formDataToSend.append("product", resolvedProductId);
      await loanApplicationAPI.create(formDataToSend);
      setSubmitStatus("success");
    } catch (error) {
      let errorMsg = "Submission failed";
      if (error.response?.data) {
        const data = error.response.data;
        errorMsg = data.detail ? data.detail : Object.entries(data).map(([field, msgs]) => `${field.toUpperCase()}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`).join("\n");
      } else if (error.message) errorMsg = error.message;
      alert("Submission Failed:\n" + errorMsg);
      setSubmitStatus("error");
    } finally { setLoading(false); }
  };

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircleIcon className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 text-sm sm:text-base mb-6">Your application has been successfully created. Our credit team will review your details. You will be notified via SMS/Email shortly.</p>
          <button onClick={() => (window.location.href = "/loan-applications")} className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition text-sm">
            Go to Queue
          </button>
        </div>
      </div>
    );
  }

  const StepIndicator = ({ id, label, icon: Icon }) => (
    <div className={`flex flex-col items-center z-10 ${currentStep >= id ? "text-primary-600" : "text-gray-400"}`}>
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2 transition-all ${currentStep >= id ? "bg-primary-100 ring-4 ring-white" : "bg-gray-100"}`}>
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <span className="text-[10px] sm:text-xs font-bold hidden sm:block">{label}</span>
    </div>
  );

  const steps = [
    { id: 1, label: "Identity", icon: UserIcon },
    { id: 2, label: "Address", icon: MapPinIcon },
    { id: 3, label: "Financials", icon: BanknotesIcon },
    { id: 4, label: "Bank", icon: BuildingLibraryIcon },
    { id: 5, label: "Documents", icon: DocumentTextIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-3 sm:px-4 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">APPLY FOR LOAN</h1>
          <p className="text-gray-500 text-sm sm:text-base">Complete the 5 steps below to get sanctioned in minutes.</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm mb-4 sm:mb-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute bottom-0 left-0 h-1 bg-gray-100 w-full">
            <div className="h-full bg-primary-600 transition-all duration-500" style={{ width: `${(currentStep / 5) * 100}%` }} />
          </div>
          {steps.map((step) => (
            <StepIndicator key={step.id} id={step.id} label={step.label} icon={step.icon} />
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-4 sm:p-6 lg:p-8">

            {/* STEP 1: IDENTITY */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-lg sm:text-xl font-bold mb-5 flex items-center gap-2">
                  <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 shrink-0" /> Step 1: Identity Details
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <InputGroup name="first_name" label="First Name" placeholder="e.g. Ankur" required width="half" value={formData.first_name} onChange={handleChange} error={errors.first_name} />
                  <InputGroup name="last_name" label="Last Name" placeholder="e.g. Sati" required width="half" value={formData.last_name} onChange={handleChange} error={errors.last_name} />
                  <InputGroup name="email" label="Email Address" type="email" placeholder="name@example.com" required value={formData.email} onChange={handleChange} error={errors.email} />
                  <InputGroup name="mobile_no" label="Mobile Number" placeholder="9876543210" required value={formData.mobile_no} onChange={handleChange} error={errors.mobile_no} />
                  <InputGroup name="dob" label="Date of Birth" type="date" required width="half" value={formData.dob} onChange={handleChange} max={new Date().toISOString().split("T")[0]} error={errors.dob} />
                  <SelectGroup name="gender" label="Gender" width="half" value={formData.gender} onChange={handleChange} options={dynamicOptions.gender} />
                  <div className="col-span-2 border-t border-gray-100 my-1" />
                  <InputGroup name="pan_number" label="PAN Number" placeholder="ABCDE1234F" required width="half" value={formData.pan_number} onChange={handleChange} error={errors.pan_number} />
                  <InputGroup name="aadhaar_number" label="Aadhaar Number" placeholder="12-digit number" required width="half" value={formData.aadhaar_number} onChange={handleChange} error={errors.aadhaar_number} />
                </div>
              </div>
            )}

            {/* STEP 2: ADDRESS */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-lg sm:text-xl font-bold mb-5 flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 shrink-0" /> Step 2: Address Details
                </h2>
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Residential Address</h3>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <InputGroup name="res_address_line1" label="Address Line 1" placeholder="Flat No, Building" required value={formData.res_address_line1} onChange={handleChange} error={errors.res_address_line1} />
                    <InputGroup name="res_address_line2" label="Address Line 2" placeholder="Street, Area" value={formData.res_address_line2} onChange={handleChange} />
                    <InputGroup name="res_city" label="City" width="half" required value={formData.res_city} onChange={handleChange} error={errors.res_city} />
                    <InputGroup name="res_state" label="State" width="half" required value={formData.res_state} onChange={handleChange} error={errors.res_state} />
                    <InputGroup name="res_pincode" label="Pincode" width="half" required value={formData.res_pincode} onChange={handleChange} error={errors.res_pincode} />
                    <InputGroup name="res_country" label="Country" width="half" disabled required value={formData.res_country} onChange={handleChange} />
                  </div>
                </div>
                <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                    Office Address
                    <span className="text-[10px] bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full normal-case font-semibold">Used for Geo-Fencing</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <InputGroup name="office_address_line1" label="Office Address" required value={formData.office_address_line1} onChange={handleChange} error={errors.office_address_line1} />
                    <InputGroup name="office_city" label="City" width="half" required value={formData.office_city} onChange={handleChange} error={errors.office_city} />
                    <InputGroup name="office_pincode" label="Pincode" width="half" required value={formData.office_pincode} onChange={handleChange} error={errors.office_pincode} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: FINANCIALS */}
            {currentStep === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-lg sm:text-xl font-bold mb-5 flex items-center gap-2">
                  <BanknotesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 shrink-0" /> Step 3: Financial Profile
                </h2>
                <div className="bg-blue-50 p-1.5 rounded-xl flex mb-6 sm:mb-8">
                  {dynamicOptions.income_type.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFormData((prev) => ({ ...prev, income_type: opt.value }))}
                      className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${formData.income_type === opt.value ? "bg-white shadow text-blue-700" : "text-blue-400 hover:text-blue-600"}`}
                    >{opt.label}</button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <InputGroup name="requested_amount" label="Loan Amount Needed (₹)" type="number" required value={formData.requested_amount} onChange={handleChange} error={errors.requested_amount} />
                  <InputGroup name="requested_tenure" label="Tenure (Months)" type="number" required value={formData.requested_tenure} onChange={handleChange} error={errors.requested_tenure} />
                  <InputGroup name="monthly_income" label={formData.income_type === "Salaried" ? "Net Monthly Salary" : "Monthly Net Income"} type="number" required value={formData.monthly_income} onChange={handleChange} error={errors.monthly_income} />
                  {formData.income_type === "Salaried" ? (
                    <>
                      <InputGroup name="employer_name" label="Current Employer Name" required value={formData.employer_name} onChange={handleChange} error={errors.employer_name} />
                      <SelectGroup name="employment_type" label="Employment Type" value={formData.employment_type} onChange={handleChange} options={dynamicOptions.employment_type} />
                    </>
                  ) : (
                    <>
                      <InputGroup name="business_name" label="Registered Business Name" required value={formData.business_name} onChange={handleChange} error={errors.business_name} />
                      <InputGroup name="annual_turnover" label="Last Year Turnover" type="number" required value={formData.annual_turnover} onChange={handleChange} error={errors.annual_turnover} />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: BANK */}
            {currentStep === 4 && (
              <div className="animate-fade-in">
                <h2 className="text-lg sm:text-xl font-bold mb-5 flex items-center gap-2">
                  <BuildingLibraryIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 shrink-0" /> Step 4: Bank & Disbursal
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <InputGroup name="bank_account_number" label="Bank Account Number" required value={formData.bank_account_number} onChange={handleChange} error={errors.bank_account_number} />
                  <InputGroup name="ifsc_code" label="IFSC Code" placeholder="HDFC0001234" required width="half" value={formData.ifsc_code} onChange={handleChange} error={errors.ifsc_code} />
                  <SelectGroup name="account_type" label="Account Type" width="half" value={formData.account_type} onChange={handleChange} options={dynamicOptions.account_type} />
                  <div className="col-span-2 bg-yellow-50 border border-yellow-200 p-4 rounded-xl mt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="disbursement_consent"
                        checked={formData.disbursement_consent}
                        onChange={handleChange}
                        className="mt-1 w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 shrink-0"
                      />
                      <div className="text-xs sm:text-sm text-yellow-900 leading-relaxed">
                        <strong>Mandatory Consent:</strong> I confirm that the bank account details provided above belong to me. I authorize <strong>Aditsh Lending</strong> to credit the sanctioned loan amount to this account and set up e-NACH for repayment.
                      </div>
                    </label>
                    {errors.disbursement_consent && <p className="text-xs text-red-600 mt-2 ml-8">{errors.disbursement_consent}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: DOCUMENTS */}
            {currentStep === 5 && (
              <div className="animate-fade-in">
                <h2 className="text-lg sm:text-xl font-bold mb-5 flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 shrink-0" /> Step 5: Document Uploads
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {isBusiness ? (
                    <>
                      <h3 className="col-span-2 text-xs sm:text-sm font-bold text-gray-600 mb-1">Business Documents</h3>
                      {[
                        { label: "GST Registration Certificate", name: "doc_gst_cert", accept: ".pdf" },
                        { label: "Business Address Proof", name: "doc_business_address_proof", accept: ".pdf" },
                        { label: "Bank Statement (Last 12 Months)", name: "doc_bank_12m", accept: ".pdf" },
                        { label: "Financial Documents (ITR 3 Years + GST Returns)", name: "doc_financials", accept: ".pdf" },
                        { label: "Business Proof (Trade License)", name: "doc_business_proof", accept: ".pdf" },
                      ].map((d) => <FileUploader key={d.name} {...d} file={formData[d.name]} setFile={handleSetFile} />)}
                      <div className="col-span-2 mt-2 pt-4 border-t border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm"><LockClosedIcon className="h-4 w-4" /> Mandatory: Self-Declaration Video</h3>
                        <FileUploader label="Self-Declaration Video (10-30s)" name="doc_video" accept=".mp4,.mov" file={formData.doc_video} setFile={handleSetFile} />
                      </div>
                    </>
                  ) : isMortgage ? (
                    <>
                      {[
                        { heading: "🔹 KYC Documents", docs: [{ label: "PAN Card", name: "doc_identity" }, { label: "Aadhaar / Passport / Voter ID", name: "doc_address" }, { label: "Photographs", name: "doc_photographs" }] },
                        { heading: "🔹 Income Documents", docs: formData.income_type === "Salaried" ? [{ label: "Last 6 Months Salary Slips", name: "doc_income", accept: ".pdf" }, { label: "Bank Statement (6–12 Months)", name: "doc_bank", accept: ".pdf" }, { label: "Form 16 / ITR (2 Years)", name: "doc_form16", accept: ".pdf" }] : [{ label: "ITR (3 Years)", name: "doc_itr_3yrs", accept: ".pdf" }, { label: "Balance Sheet & P&L", name: "doc_balance_sheet", accept: ".pdf" }, { label: "Business Proof", name: "doc_business_proof", accept: ".pdf" }] },
                        { heading: "🔹 Property Documents", docs: [{ label: "Registered Sale Deed", name: "doc_sale_deed", accept: ".pdf" }, { label: "Mother Deed / Chain Deed", name: "doc_mother_deed", accept: ".pdf" }, { label: "Encumbrance Certificate", name: "doc_encumbrance", accept: ".pdf" }, { label: "Approved Building Plan", name: "doc_building_plan", accept: ".pdf" }, { label: "Occupancy Certificate", name: "doc_occupancy", accept: ".pdf" }, { label: "Property Tax Receipts", name: "doc_property_tax", accept: ".pdf" }, { label: "Latest Utility Bills", name: "doc_utility_bills", accept: ".pdf" }, { label: "NOC (if applicable)", name: "doc_noc", accept: ".pdf" }] },
                      ].map((section) => (
                        <React.Fragment key={section.heading}>
                          <h3 className="col-span-2 text-xs sm:text-sm font-bold text-gray-600 mt-3 mb-1">{section.heading}</h3>
                          {section.docs.map((d) => <FileUploader key={d.name} {...d} file={formData[d.name]} setFile={handleSetFile} />)}
                        </React.Fragment>
                      ))}
                    </>
                  ) : (
                    <>
                      <FileUploader label="Identity Proof (PAN Card)" name="doc_identity" file={formData.doc_identity} setFile={handleSetFile} />
                      <FileUploader label="Address Proof (Aadhaar/Passport)" name="doc_address" file={formData.doc_address} setFile={handleSetFile} />
                      <FileUploader label="Bank Statement (Last 6 Months)" name="doc_bank" accept=".pdf" file={formData.doc_bank} setFile={handleSetFile} />
                      {formData.income_type === "Salaried" ? (
                        <FileUploader label="Salary Slips (Last 3 Months)" name="doc_income" accept=".pdf" file={formData.doc_income} setFile={handleSetFile} />
                      ) : (
                        <>
                          <FileUploader label="ITR (Last 2 Years)" name="doc_itr_2yrs" accept=".pdf" file={formData.doc_itr_2yrs} setFile={handleSetFile} />
                          <FileUploader label="GST Returns (Last 2 Years)" name="doc_gst_returns_2yrs" accept=".pdf" file={formData.doc_gst_returns_2yrs} setFile={handleSetFile} />
                        </>
                      )}
                      <div className="col-span-2 mt-2 pt-4 border-t border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm"><LockClosedIcon className="h-4 w-4" /> Mandatory for Unsecured Loans</h3>
                        <FileUploader label="Self-Declaration Video (10-30s)" name="doc_video" accept=".mp4,.mov" file={formData.doc_video} setFile={handleSetFile} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-200 flex justify-between items-center gap-3">
            {currentStep > 1 ? (
              <button onClick={handleBack} className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all text-sm">
                <ArrowLeftIcon className="h-4 w-4" /> Back
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button onClick={handleNext} className="flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm">
                Next Step <ArrowRightIcon className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={handleSubmitApplication} disabled={loading} className="flex items-center gap-2 px-6 sm:px-10 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                {loading ? (
                  <><svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Submitting...</>
                ) : (
                  <>Submit Application <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16,1,0.3,1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
