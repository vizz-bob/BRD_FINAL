import { useState } from "react";
import { loanApplicationAPI } from "../../services/loanApplicationService";
import { 
  UserIcon, 
  MapPinIcon, 
  BanknotesIcon, 
  BuildingLibraryIcon,
  XMarkIcon,
  LockClosedIcon // Added to show locked sections
} from "@heroicons/react/24/outline";

export default function NewLoanApplicationModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("A"); // A, B, C, D
  
  // Track which sections have been "unlocked" (reached validly)
  const [unlockedSections, setUnlockedSections] = useState(["A"]);

  // COMPLETE STATE MODEL (38 Fields)
  const [formData, setFormData] = useState({
    // A. Onboarding & Identity
    first_name: "",
    last_name: "",
    mobile_no: "",
    email: "",
    dob: "",
    pan_number: "",
    aadhaar_number: "",
    gender: "M",

    // B. Profile & Address
    income_type: "Salaried",
    borrower_type: "Individual",
    res_address_line1: "",
    res_address_line2: "",
    res_city: "",
    res_state: "",
    res_country: "India",
    res_pincode: "",
    office_address_line1: "",
    office_city: "",
    office_pincode: "",

    // C. Financials
    requested_amount: "",
    requested_tenure: 12,
    monthly_income: "",
    employment_type: "Private",
    employer_name: "",
    annual_turnover: "",
    business_name: "",

    // D. Bank & Disbursal
    bank_account_number: "",
    ifsc_code: "",
    account_type: "Savings",
    mandate_type: "eNACH",
    disbursement_consent: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ---------------------------------------------------------
  // VALIDATION LOGIC
  // ---------------------------------------------------------
  const validateSection = (section) => {
    switch(section) {
      case 'A': // Identity
        return (
          formData.first_name.trim() && 
          formData.last_name.trim() && 
          formData.mobile_no.trim() &&
          formData.email.trim() && 
          formData.dob && 
          formData.pan_number.trim() && 
          formData.aadhaar_number.trim()
        );
      
      case 'B': // Address
        return (
          formData.res_address_line1.trim() && 
          formData.res_city.trim() && 
          formData.res_state.trim() &&
          formData.res_pincode.trim() && 
          formData.office_address_line1.trim() && 
          formData.office_city.trim() && 
          formData.office_pincode.trim()
        );

      case 'C': // Financials
        const basicFinancials = formData.requested_amount && formData.requested_tenure && formData.monthly_income;
        if (!basicFinancials) return false;
        
        // Conditional Check
        if (formData.income_type === 'Salaried') {
          return formData.employer_name.trim();
        } else {
          return formData.business_name.trim();
        }

      case 'D': // Bank (Only checked on Submit)
        return formData.bank_account_number.trim() && formData.ifsc_code.trim() && formData.disbursement_consent;

      default: return false;
    }
  };

  // Handle "Next" Button Click
  const handleNext = () => {
    const sections = ['A', 'B', 'C', 'D'];
    const currentIndex = sections.indexOf(activeSection);
    
    // Check if current fields are filled
    if (!validateSection(activeSection)) {
      alert("Please fill all required fields in this section before proceeding.");
      return;
    }

    // Move to next
    const nextSection = sections[currentIndex + 1];
    if (nextSection) {
      if (!unlockedSections.includes(nextSection)) {
        setUnlockedSections([...unlockedSections, nextSection]);
      }
      setActiveSection(nextSection);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final check for Section D
    if (!validateSection('D')) {
      alert("Please complete the Bank details and sign the consent.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        tenant: 1, 
        customer: 1, 
        product: 1, 
        requested_amount: Number(formData.requested_amount),
        requested_tenure: Number(formData.requested_tenure),
        monthly_income: Number(formData.monthly_income),
      };

      await loanApplicationAPI.create(payload);
      alert("Application Created Successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error creating application: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Helper to render section tabs
  const SectionTab = ({ id, label, icon: Icon }) => {
    const isUnlocked = unlockedSections.includes(id);
    const isActive = activeSection === id;

    return (
      <button
        type="button"
        disabled={!isUnlocked} // Disable if not unlocked
        onClick={() => setActiveSection(id)}
        className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium border-b-2 transition-colors ${
          isActive
            ? "border-primary-600 text-primary-700 bg-primary-50" 
            : isUnlocked
              ? "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer"
              : "border-transparent text-gray-300 bg-gray-50 cursor-not-allowed"
        }`}
      >
        {isUnlocked ? <Icon className="h-5 w-5" /> : <LockClosedIcon className="h-5 w-5" />}
        {label}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] animate-scale-in">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">New Personal Loan Application</h2>
            <p className="text-sm text-gray-500">Complete the 4-step onboarding form.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* SECTION TABS */}
        <div className="flex border-b border-gray-200">
          <SectionTab id="A" label="Identity" icon={UserIcon} />
          <SectionTab id="B" label="Address" icon={MapPinIcon} />
          <SectionTab id="C" label="Financials" icon={BanknotesIcon} />
          <SectionTab id="D" label="Bank Info" icon={BuildingLibraryIcon} />
        </div>

        {/* SCROLLABLE FORM BODY */}
        <form id="loan-form" className="flex-1 overflow-y-auto p-8">
          
          {/* --- SECTION A: IDENTITY --- */}
          <div className={activeSection === "A" ? "block" : "hidden"}>
            <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 border-b pb-2">A. Onboarding & Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input name="first_name" label="First Name" value={formData.first_name} onChange={handleChange} required />
              <Input name="last_name" label="Last Name" value={formData.last_name} onChange={handleChange} required />
              
              <Input name="mobile_no" label="Mobile Number" value={formData.mobile_no} onChange={handleChange} required placeholder="10-digit mobile" />
              <Input name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required />
              
              <Input name="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleChange} required />
              
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>

              <Input name="pan_number" label="PAN Number" value={formData.pan_number} onChange={handleChange} required placeholder="ABCDE1234F" />
              <Input name="aadhaar_number" label="Aadhaar Number" value={formData.aadhaar_number} onChange={handleChange} required placeholder="12 digits" />
            </div>
          </div>

          {/* --- SECTION B: ADDRESS --- */}
          <div className={activeSection === "B" ? "block" : "hidden"}>
            <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 border-b pb-2">B. Profile & Address</h3>
            
            {/* Profile Switches */}
            <div className="grid grid-cols-2 gap-6 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
               <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Income Type (Critical)</label>
                  <select name="income_type" value={formData.income_type} onChange={handleChange} className="border border-gray-300 rounded-lg p-2 text-sm font-bold text-primary-700">
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                  </select>
               </div>
               <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Borrower Type</label>
                  <select name="borrower_type" value={formData.borrower_type} onChange={handleChange} className="border border-gray-300 rounded-lg p-2 text-sm">
                    <option value="Individual">Individual</option>
                    <option value="Non-Individual">Non-Individual</option>
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Residential */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Residential Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input name="res_address_line1" label="Line 1" value={formData.res_address_line1} onChange={handleChange} required className="md:col-span-2" />
                  <Input name="res_address_line2" label="Line 2 (Optional)" value={formData.res_address_line2} onChange={handleChange} />
                  <Input name="res_city" label="City" value={formData.res_city} onChange={handleChange} required />
                  <Input name="res_state" label="State" value={formData.res_state} onChange={handleChange} required />
                  <Input name="res_pincode" label="Pincode" value={formData.res_pincode} onChange={handleChange} required />
                  <Input name="res_country" label="Country" value={formData.res_country} onChange={handleChange} disabled />
                </div>
              </div>

              {/* Office */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Office Address (For Geo-Fencing)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input name="office_address_line1" label="Line 1" value={formData.office_address_line1} onChange={handleChange} required className="md:col-span-2" />
                  <Input name="office_city" label="City" value={formData.office_city} onChange={handleChange} required />
                  <Input name="office_pincode" label="Pincode" value={formData.office_pincode} onChange={handleChange} required />
                </div>
              </div>
            </div>
          </div>

          {/* --- SECTION C: FINANCIALS --- */}
          <div className={activeSection === "C" ? "block" : "hidden"}>
            <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 border-b pb-2">C. Financials & Product</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <Input name="requested_amount" label="Loan Amount Requested (₹)" type="number" value={formData.requested_amount} onChange={handleChange} required />
               <Input name="requested_tenure" label="Tenure (Months)" type="number" value={formData.requested_tenure} onChange={handleChange} required />
            </div>

            {/* Conditional Fields */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
               {formData.income_type === 'Salaried' ? (
                 <>
                   <h4 className="text-sm font-bold text-blue-800 mb-4">Salaried Profile Details</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <Input name="monthly_income" label="Net Monthly Salary" type="number" value={formData.monthly_income} onChange={handleChange} required />
                     
                     <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-700">Employment Type</label>
                        <select name="employment_type" value={formData.employment_type} onChange={handleChange} className="border border-gray-300 rounded-lg p-2 text-sm">
                          <option value="Private">Private Sector</option>
                          <option value="Public">Public Sector</option>
                          <option value="Government">Government</option>
                        </select>
                     </div>
                     
                     <Input name="employer_name" label="Employer Company Name" value={formData.employer_name} onChange={handleChange} required />
                   </div>
                 </>
               ) : (
                 <>
                   <h4 className="text-sm font-bold text-blue-800 mb-4">Self-Employed Profile Details</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <Input name="monthly_income" label="Monthly Net Income" type="number" value={formData.monthly_income} onChange={handleChange} required />
                     <Input name="annual_turnover" label="Annual Turnover" type="number" value={formData.annual_turnover} onChange={handleChange} />
                     <Input name="business_name" label="Business Name" value={formData.business_name} onChange={handleChange} required />
                   </div>
                 </>
               )}
            </div>
          </div>

          {/* --- SECTION D: BANK --- */}
          <div className={activeSection === "D" ? "block" : "hidden"}>
            <h3 className="text-sm font-bold text-gray-900 uppercase mb-4 border-b pb-2">D. Bank & Disbursal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input name="bank_account_number" label="Bank Account Number" value={formData.bank_account_number} onChange={handleChange} required />
               <Input name="ifsc_code" label="IFSC Code" value={formData.ifsc_code} onChange={handleChange} required className="uppercase" />
               
               <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Account Type</label>
                  <select name="account_type" value={formData.account_type} onChange={handleChange} className="border border-gray-300 rounded-lg p-2 text-sm">
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                    <option value="Overdraft">Overdraft</option>
                  </select>
               </div>

               <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Repayment Mandate</label>
                  <select name="mandate_type" value={formData.mandate_type} onChange={handleChange} className="border border-gray-300 rounded-lg p-2 text-sm">
                    <option value="eNACH">e-NACH (API)</option>
                    <option value="UPI">UPI AutoPay</option>
                    <option value="Physical">Physical NACH</option>
                  </select>
               </div>
            </div>

            <div className="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
               <label className="flex items-start gap-3 cursor-pointer">
                 <input 
                   type="checkbox" 
                   name="disbursement_consent" 
                   checked={formData.disbursement_consent} 
                   onChange={handleChange}
                   className="mt-1 h-4 w-4 text-primary-600 rounded"
                   required
                 />
                 <div className="text-sm text-yellow-900">
                   <strong>Disbursement Consent:</strong> I verify that the bank details provided above belong to the applicant. I authorize the disbursement of funds to this account upon loan sanction.
                 </div>
               </label>
            </div>
          </div>

        </form>

        {/* FOOTER BUTTONS */}
        <div className="p-6 border-t border-gray-200 flex justify-between bg-gray-50 rounded-b-xl">
           <button 
             type="button" 
             onClick={onClose} 
             className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white font-medium transition"
           >
             Cancel
           </button>
           
           <div className="flex gap-3">
             {activeSection !== 'A' && (
               <button 
                 type="button" 
                 onClick={() => {
                   const sections = ['A', 'B', 'C', 'D'];
                   const idx = sections.indexOf(activeSection);
                   setActiveSection(sections[idx - 1]);
                 }}
                 className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white font-medium transition"
               >
                 Back
               </button>
             )}
             
             {activeSection !== 'D' ? (
               <button 
                 type="button" 
                 onClick={handleNext} // CHANGED to handleNext logic
                 className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition shadow-sm"
               >
                 Next Step
               </button>
             ) : (
               <button 
                 type="button" 
                 onClick={handleSubmit} 
                 disabled={loading}
                 className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition shadow-md disabled:opacity-50"
               >
                 {loading ? "Creating..." : "Submit Application"}
               </button>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// HELPER COMPONENTS
// ------------------------------------------------------------------

const Input = ({ label, name, className, ...props }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-xs font-semibold text-gray-700">{label}</label>
    <input 
      name={name}
      className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
      {...props}
    />
  </div>
);
