
import rulesService from '../../services/rulesService';
import authService from '../../services/authService';
import { createContext, useContext, useEffect, useState } from 'react';

const RiskEngineContext = createContext({
  data: {},
  update: () => {},
});

function useEngineState(key, initialValue) {
  const { data, update } = useContext(RiskEngineContext);
  const val = data[key] !== undefined ? data[key] : initialValue;
  const setVal = (newVal) => {
    update(key, typeof newVal === 'function' ? newVal(val) : newVal);
  };
  return [val, setVal];
}

import {
  ClipboardDocumentListIcon,
  UserCircleIcon,
  BanknotesIcon,
  ShieldExclamationIcon,
  ChartBarIcon,
  MagnifyingGlassCircleIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  PlayIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

// ─── tiny helpers ────────────────────────────────────────────────────────────

function SectionCard({ icon: Icon, title, subtitle, accent = "primary", children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const colors = {
    primary: "bg-primary-600 shadow-primary-200",
    emerald: "bg-emerald-600 shadow-emerald-200",
    amber: "bg-amber-500 shadow-amber-200",
    rose: "bg-rose-600 shadow-rose-200",
    violet: "bg-violet-600 shadow-violet-200",
    sky: "bg-sky-600 shadow-sky-200",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors"
      >
        <div className={`p-2 sm:p-2.5 rounded-xl text-white shadow-lg ${colors[accent]} shrink-0`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-slate-800">{title}</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-snug">{subtitle}</p>
        </div>
        {open ? (
          <ChevronUpIcon className="h-4 w-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-slate-400 shrink-0" />
        )}
      </button>
      {open && <div className="px-4 sm:px-5 pb-5 border-t border-slate-100">{children}</div>}
    </div>
  );
}

function Label({ children }) {
  return <label className="block text-xs font-semibold text-slate-600 mb-1">{children}</label>;
}

function Input({ placeholder, type = "text", value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-slate-50 transition"
    />
  );
}

function Select({ children, value, onChange }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 transition"
    >
      {children}
    </select>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          checked ? "bg-primary-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4.5" : "translate-x-0.5"
          }`}
        />
      </div>
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

function AddRowButton({ onClick, label = "Add Row" }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-primary-600 text-xs font-semibold hover:text-primary-700 mt-3 transition-colors"
    >
      <PlusIcon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function Tag({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 border border-primary-200 rounded-md px-2 py-0.5 text-xs font-medium">
      {children}
      {onRemove && (
        <button onClick={onRemove} className="hover:text-rose-500 transition-colors">
          ×
        </button>
      )}
    </span>
  );
}

const DEFAULT_RISK_ENGINE_CONFIG = {
  ruleName: "New Risk Rule",
  ruleType: "knockout",
  impactValue: "25",
  product: "All Products",
  segment: "All Segments",
  ageMin: "21",
  ageMax: "60",
  coAgeMin: "18",
  coAgeMax: "65",
  employerTypes: ["Public", "Govt"],
  businessAge: "2",
  selectedSectors: ["IT/ITES", "Healthcare"],
  addressCriteria: "match",
  negativeAreas: ["110059", "400063"],
  minSalary: "25000",
  minBusiness: "50000",
  minTurnover: "600000",
  minBank: "10000",
  cashFlowValue: "15000",
  foir: "55",
  itrToggle: true,
  cashFlowToggle: true,
  complianceToggle: false,
  collateralRelevance: "Mandatory",
  ownershipVerification: "Self-Owned",
  minEstimatedValue: "500000",
  maxLtvRatio: "75",
  risks: [
    { type: "Credit", mitigation: "Personal Guarantee" },
    { type: "Market", mitigation: "LTV Cap at 70%" },
  ],
  rows: [
    { bureau: "CIBIL", minScore: "700", maxEnquiries: "3", maxDelayed: "2" },
    { bureau: "Experian", minScore: "650", maxEnquiries: "5", maxDelayed: "3" },
  ],
  personas: [
    { name: "Professional", minScore: "60", weight: "30" },
    { name: "Salaried Employee", minScore: "50", weight: "40" },
    { name: "Corporate Group", minScore: "65", weight: "30" }
  ],
  internalVerif: true,
  internalVerifType: "Field Verification",
  internalTat: "2",
  agencyVerif: false,
  agencyName: "",
  agencyLevel: "Basic",
  mismatchFlag: true,
  dupPan: true
};

// ─── Section 1: Rule Identification ──────────────────────────────────────────

function RuleIdentification() {
  const [ruleName, setRuleName] = useEngineState('ruleName', "");
  const [impactValue, setImpactValue] = useEngineState('impactValue', "");
  const [ruleType, setRuleType] = useEngineState('ruleType', "knockout");
  const [product, setProduct] = useEngineState('product', "All Products");
  const [segment, setSegment] = useEngineState('segment', "All Segments");
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="sm:col-span-2">
        <Label>Rule Name</Label>
        <Input placeholder="e.g. Minimum Salary Eligibility" value={ruleName} onChange={(e) => setRuleName(e.target.value)} />
      </div>
      <div>
        <Label>Impact / Weight Value</Label>
        <Input type="number" placeholder="e.g. 25" value={impactValue} onChange={(e) => setImpactValue(e.target.value)} />
      </div>
      <div>
        <Label>Rule Type</Label>
        <Select value={ruleType} onChange={(e) => setRuleType(e.target.value)}>
          <option value="knockout">Knockout (Hard Stop)</option>
          <option value="scoring">Scoring (Soft)</option>
          <option value="advisory">Advisory</option>
        </Select>
      </div>
      <div>
        <Label>Applicable Product</Label>
        <Select value={product} onChange={(e) => setProduct(e.target.value)}>
          <option>All Products</option>
          <option>Personal Loan</option>
          <option>Business Loan</option>
          <option>Home Loan</option>
        </Select>
      </div>
      <div>
        <Label>Borrower Segment</Label>
        <Select value={segment} onChange={(e) => setSegment(e.target.value)}>
          <option>All Segments</option>
          <option>Salaried</option>
          <option>Self-Employed</option>
          <option>Corporate</option>
        </Select>
      </div>
    </div>
  );
}

// ─── Section 2: Client Profile Rules ─────────────────────────────────────────

function ClientProfileRules() {
  const [employerTypes, setEmployerTypes] = useEngineState('employerTypes', ["Public", "Govt"]);
  const [ageMin, setAgeMin] = useEngineState('ageMin', "21");
  const [ageMax, setAgeMax] = useEngineState('ageMax', "60");
  const [coAgeMin, setCoAgeMin] = useEngineState('coAgeMin', "18");
  const [coAgeMax, setCoAgeMax] = useEngineState('coAgeMax', "65");
  const [businessAge, setBusinessAge] = useEngineState('businessAge', "2");
  const [addressCriteria, setAddressCriteria] = useEngineState('addressCriteria', "match");
  const [negativeAreas, setNegativeAreas] = useEngineState('negativeAreas', ["110059", "400063"]);
  const [areaInput, setAreaInput] = useEngineState('areaInput', "");
  const sectors = ["Manufacturing", "IT/ITES", "Retail", "Healthcare", "Real Estate", "FMCG"];
  const [selectedSectors, setSelectedSectors] = useEngineState('selectedSectors', ["IT/ITES", "Healthcare"]);

  const toggleSector = (s) =>
    setSelectedSectors((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const toggleEmployer = (e) =>
    setEmployerTypes((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));

  return (
    <div className="mt-4 space-y-5">
      {/* Age */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Age Requirements</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div><Label>Applicant Min Age</Label><Input type="number" placeholder="21" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} /></div>
          <div><Label>Applicant Max Age</Label><Input type="number" placeholder="60" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} /></div>
          <div><Label>Co-Applicant Min</Label><Input type="number" placeholder="18" value={coAgeMin} onChange={(e) => setCoAgeMin(e.target.value)} /></div>
          <div><Label>Co-Applicant Max</Label><Input type="number" placeholder="65" value={coAgeMax} onChange={(e) => setCoAgeMax(e.target.value)} /></div>
        </div>
      </div>

      {/* Employment */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Employment & Business</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
          <div>
            <Label>Employer Types (Allowed)</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {["Public", "Private", "Govt", "PSU"].map((t) => (
                <button
                  key={t}
                  onClick={() => toggleEmployer(t)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors ${
                    employerTypes.includes(t)
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-slate-600 border-slate-300 hover:border-primary-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Min Business Age (Years)</Label>
            <Input type="number" placeholder="2" value={businessAge} onChange={(e) => setBusinessAge(e.target.value)} />
          </div>
          <div>
            <Label>Business Sectors</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {sectors.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSector(s)}
                  className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
                    selectedSectors.includes(s)
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-slate-500 border-slate-300 hover:border-emerald-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location Logic</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label>Address Criteria</Label>
            <Select value={addressCriteria} onChange={(e) => setAddressCriteria(e.target.value)}>
              <option value="match">Residence = Office (Match Required)</option>
              <option value="mismatch">Allow Mismatch</option>
              <option value="any">Any</option>
            </Select>
          </div>
          <div>
            <Label>Blacklisted Pincodes / Areas</Label>
            <div className="flex gap-2">
              <input
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter pincode"
                value={areaInput}
                onChange={(e) => setAreaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && areaInput.trim()) {
                    setNegativeAreas([...negativeAreas, areaInput.trim()]);
                    setAreaInput("");
                  }
                }}
              />
              <button
                onClick={() => { if (areaInput.trim()) { setNegativeAreas([...negativeAreas, areaInput.trim()]); setAreaInput(""); } }}
                className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {negativeAreas.map((a) => (
                <Tag key={a} onRemove={() => setNegativeAreas(negativeAreas.filter((x) => x !== a))}>
                  {a}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section 3: Financial & Eligibility ──────────────────────────────────────

function FinancialCriteria() {
  const [itrToggle, setItrToggle] = useEngineState('itrToggle', true);
  const [complianceToggle, setComplianceToggle] = useEngineState('complianceToggle', false);
  const [cashFlowToggle, setCashFlowToggle] = useEngineState('cashFlowToggle', true);
  const [minSalary, setMinSalary] = useEngineState('minSalary', "25000");
  const [minBusiness, setMinBusiness] = useEngineState('minBusiness', "50000");
  const [minTurnover, setMinTurnover] = useEngineState('minTurnover', "600000");
  const [minBank, setMinBank] = useEngineState('minBank', "10000");
  const [cashFlowValue, setCashFlowValue] = useEngineState('cashFlowValue', "15000");
  const [foir, setFoir] = useEngineState('foir', "55");

  return (
    <div className="mt-4 space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div><Label>Min Monthly Salary (₹)</Label><Input type="number" placeholder="25000" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} /></div>
        <div><Label>Min Business Income (₹)</Label><Input type="number" placeholder="50000" value={minBusiness} onChange={(e) => setMinBusiness(e.target.value)} /></div>
        <div><Label>Min Annual Turnover (₹)</Label><Input type="number" placeholder="600000" value={minTurnover} onChange={(e) => setMinTurnover(e.target.value)} /></div>
        <div><Label>Min Bank Balance (₹)</Label><Input type="number" placeholder="10000" value={minBank} onChange={(e) => setMinBank(e.target.value)} /></div>
        <div><Label>Cash Flow Threshold (₹)</Label><Input type="number" placeholder="15000" value={cashFlowValue} onChange={(e) => setCashFlowValue(e.target.value)} /></div>
        <div><Label>FOIR Limit (%)</Label><Input type="number" placeholder="55" value={foir} onChange={(e) => setFoir(e.target.value)} /></div>
      </div>
      <div className="flex flex-wrap gap-5">
        <Toggle label="ITR Required" checked={itrToggle} onChange={setItrToggle} />
        <Toggle label="Cash Flow Eligibility Check" checked={cashFlowToggle} onChange={setCashFlowToggle} />
        <Toggle label="Financial Compliance Check" checked={complianceToggle} onChange={setComplianceToggle} />
      </div>
    </div>
  );
}

// ─── Section 4: Collateral & Risk ────────────────────────────────────────────

function CollateralRisk() {
  const [risks, setRisks] = useEngineState('risks', [
    { type: "Credit", mitigation: "Personal Guarantee" },
    { type: "Market", mitigation: "LTV Cap at 70%" },
  ]);
  const [collateralRelevance, setCollateralRelevance] = useEngineState('collateralRelevance', "Mandatory");
  const [ownershipVerification, setOwnershipVerification] = useEngineState('ownershipVerification', "Self-Owned");
  const [minEstimatedValue, setMinEstimatedValue] = useEngineState('minEstimatedValue', "500000");
  const [maxLtvRatio, setMaxLtvRatio] = useEngineState('maxLtvRatio', "75");

  const addRisk = () => setRisks([...risks, { type: "", mitigation: "" }]);
  const removeRisk = (i) => setRisks(risks.filter((_, idx) => idx !== i));
  const updateRisk = (i, field, val) => {
    const updated = [...risks];
    updated[i][field] = val;
    setRisks(updated);
  };

  return (
    <div className="mt-4 space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <Label>Collateral Relevance</Label>
          <Select value={collateralRelevance} onChange={(e) => setCollateralRelevance(e.target.value)}>
            <option>Mandatory</option>
            <option>Optional</option>
            <option>Not Required</option>
          </Select>
        </div>
        <div>
          <Label>Ownership Verification</Label>
          <Select value={ownershipVerification} onChange={(e) => setOwnershipVerification(e.target.value)}>
            <option>Self-Owned</option>
            <option>Co-Owned</option>
            <option>Any</option>
          </Select>
        </div>
        <div><Label>Min Estimated Value (₹)</Label><Input type="number" placeholder="500000" value={minEstimatedValue} onChange={(e) => setMinEstimatedValue(e.target.value)} /></div>
        <div><Label>Max LTV Ratio (%)</Label><Input type="number" placeholder="75" value={maxLtvRatio} onChange={(e) => setMaxLtvRatio(e.target.value)} /></div>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Risk & Mitigation Logic</p>
        <div className="space-y-2">
          {risks.map((r, i) => (
            <div key={i} className="flex gap-2 items-center">
              <div className="flex-1">
                <Select value={r.type} onChange={(e) => updateRisk(i, "type", e.target.value)}>
                  <option value="">Select Risk Type</option>
                  <option>Credit</option>
                  <option>Market</option>
                  <option>Operational</option>
                  <option>Compliance</option>
                </Select>
              </div>
              <div className="flex-[2]">
                <Input placeholder="Mitigation Plan" value={r.mitigation} onChange={(e) => updateRisk(i, "mitigation", e.target.value)} />
              </div>
              <button onClick={() => removeRisk(i)} className="text-slate-400 hover:text-rose-500 transition-colors shrink-0">
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <AddRowButton onClick={addRisk} label="Add Risk Factor" />
      </div>
    </div>
  );
}

// ─── Section 5: Scorecard ─────────────────────────────────────────────────────

function ScorecardConfig() {
  const [rows, setRows] = useEngineState('rows', [
    { bureau: "CIBIL", minScore: "700", maxEnquiries: "3", maxDelayed: "2" },
    { bureau: "Experian", minScore: "650", maxEnquiries: "5", maxDelayed: "3" },
  ]);

  const addRow = () => setRows([...rows, { bureau: "", minScore: "", maxEnquiries: "", maxDelayed: "" }]);
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));
  const update = (i, field, val) => { const u = [...rows]; u[i][field] = val; setRows(u); };

  const [personas, setPersonas] = useEngineState('personas', [
    { name: "Professional", minScore: "60", weight: "30" },
    { name: "Salaried Employee", minScore: "50", weight: "40" },
    { name: "Corporate Group", minScore: "65", weight: "30" }
  ]);

  const updatePersona = (idx, field, val) => {
    const updated = [...personas];
    updated[idx][field] = val;
    setPersonas(updated);
  };

  return (
    <div className="mt-4 space-y-5">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Credit Bureau Integration</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-bold text-slate-500 uppercase border-b border-slate-100">
                <th className="pb-2 pr-3">Bureau</th>
                <th className="pb-2 pr-3">Min Score</th>
                <th className="pb-2 pr-3">Max Enquiries</th>
                <th className="pb-2 pr-3">Max Delayed Payments</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="py-1 pr-3">
                    <Select value={r.bureau} onChange={(e) => update(i, "bureau", e.target.value)}>
                      <option value="">Select</option>
                      <option>CIBIL</option>
                      <option>Experian</option>
                      <option>Equifax</option>
                      <option>CRIF</option>
                    </Select>
                  </td>
                  <td className="py-1 pr-3"><Input type="number" placeholder="700" value={r.minScore} onChange={(e) => update(i, "minScore", e.target.value)} /></td>
                  <td className="py-1 pr-3"><Input type="number" placeholder="3" value={r.maxEnquiries} onChange={(e) => update(i, "maxEnquiries", e.target.value)} /></td>
                  <td className="py-1 pr-3"><Input type="number" placeholder="2" value={r.maxDelayed} onChange={(e) => update(i, "maxDelayed", e.target.value)} /></td>
                  <td className="py-1">
                    <button onClick={() => removeRow(i)} className="text-slate-400 hover:text-rose-500 transition-colors">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AddRowButton onClick={addRow} label="Add Bureau" />
      </div>

      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Internal Scorecard Personas</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {personas.map((persona, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl p-3 bg-slate-50">
              <p className="text-xs font-bold text-slate-700 mb-2">{persona.name}</p>
              <div className="space-y-2">
                <div><Label>Min Internal Score</Label><Input type="number" placeholder="60" value={persona.minScore} onChange={(e) => updatePersona(idx, "minScore", e.target.value)} /></div>
                <div><Label>Weight (%)</Label><Input type="number" placeholder="30" value={persona.weight} onChange={(e) => updatePersona(idx, "weight", e.target.value)} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section 6: Verification & Integrity ─────────────────────────────────────

function VerificationRules() {
  const [mismatchFlag, setMismatchFlag] = useEngineState('mismatchFlag', true);
  const [dupPan, setDupPan] = useEngineState('dupPan', true);
  const [internalVerif, setInternalVerif] = useEngineState('internalVerif', true);
  const [agencyVerif, setAgencyVerif] = useEngineState('agencyVerif', false);
  const [internalVerifType, setInternalVerifType] = useEngineState('internalVerifType', "Field Verification");
  const [internalTat, setInternalTat] = useEngineState('internalTat', "2");
  const [agencyName, setAgencyName] = useEngineState('agencyName', "");
  const [agencyLevel, setAgencyLevel] = useEngineState('agencyLevel', "Basic");

  return (
    <div className="mt-4 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <p className="text-xs font-bold text-slate-700 mb-3">Internal Verification</p>
          <div className="space-y-2">
            <div><Label>Verification Type</Label>
              <Select value={internalVerifType} onChange={(e) => setInternalVerifType(e.target.value)}>
                <option>Field Verification</option>
                <option>Tele-Verification</option>
                <option>Video KYC</option>
              </Select>
            </div>
            <div><Label>Turnaround Time (Days)</Label><Input type="number" placeholder="2" value={internalTat} onChange={(e) => setInternalTat(e.target.value)} /></div>
            <Toggle label="Mandatory for all applications" checked={internalVerif} onChange={setInternalVerif} />
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <p className="text-xs font-bold text-slate-700 mb-3">Agency Verification (Third-Party)</p>
          <div className="space-y-2">
            <div><Label>Agency Name</Label><Input placeholder="e.g. Karza, IDfy" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} /></div>
            <div><Label>Verification Level</Label>
              <Select value={agencyLevel} onChange={(e) => setAgencyLevel(e.target.value)}>
                <option>Basic</option>
                <option>Enhanced</option>
                <option>Premium</option>
              </Select>
            </div>
            <Toggle label="Enable Agency Verification" checked={agencyVerif} onChange={setAgencyVerif} />
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Data Integrity Flags</p>
        <div className="flex flex-wrap gap-5">
          <Toggle label="Flag Data Mismatch Automatically" checked={mismatchFlag} onChange={setMismatchFlag} />
          <Toggle label="Flag Duplicate PAN Cards" checked={dupPan} onChange={setDupPan} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Rules() {
  const [saved, setSaved] = useState(false);
  const [simulating, setSimulating] = useState(false);
  
  const [data, setData] = useState({});
  const [tenantId, setTenantId] = useState(null);
  const [ruleId, setRuleId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = authService.getTenantIdFromToken() || sessionStorage.getItem("tenant_id") || "1";
    setTenantId(t);
  }, []);

  useEffect(() => {
    if (!tenantId) return;
    rulesService.getConfig(tenantId).then((res) => {
      // Merge defaults with backend data to ensure full payload on first save
      const backendData = res?.config?.riskEngine || {};
      const mergedData = { ...DEFAULT_RISK_ENGINE_CONFIG, ...backendData };
      
      if (res) setRuleId(res.id);
      setData(mergedData);
      setLoading(false);
    });
  }, [tenantId]);

  const update = (key, val) => setData((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSimulating(true);
    try {
      const res = await rulesService.getConfig(tenantId);
      const existingConfig = res?.config || {};
      const payload = { ...existingConfig, riskEngine: data };
      await rulesService.saveConfig(res?.id || null, payload, tenantId);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch(e) {
      console.error(e);
      alert('Failed to save');
    }
    setSimulating(false);
  };

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => setSimulating(false), 2000);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Configuration...</div>;

  return (
    <RiskEngineContext.Provider value={{ data, update }}>

    <div className="p-3 sm:p-5 lg:p-8 max-w-[1200px] mx-auto min-h-screen bg-slate-50 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-primary-600 rounded-xl text-white shadow-lg shadow-primary-200 shrink-0 mt-0.5 sm:mt-0">
            <ClipboardDocumentListIcon className="h-5 w-5 sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Rule Management
            </h1>
            <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5">
              Define, configure, and publish automated decision-making rules for the lending lifecycle.
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-2">
            <ClockIcon className="h-3.5 w-3.5" />
            <span>Draft · Not Published</span>
          </div>
          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-60"
          >
            <PlayIcon className="h-3.5 w-3.5" />
            {simulating ? "Running…" : "Simulate"}
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              saved
                ? "bg-emerald-600 text-white"
                : "bg-primary-600 hover:bg-primary-700 text-white"
            }`}
          >
            {saved ? <><CheckCircleIcon className="h-3.5 w-3.5" /> Saved!</> : "Save & Publish"}
          </button>
        </div>
      </div>

      {/* Rule Sections */}
      <div className="space-y-3">
        <SectionCard
          icon={ClipboardDocumentListIcon}
          title="1. Rule Identification & Weighting"
          subtitle="Name the rule, assign its impact weight, and scope it to a product or segment."
          accent="primary"
          defaultOpen={true}
        >
          <RuleIdentification />
        </SectionCard>

        <SectionCard
          icon={UserCircleIcon}
          title="2. Client Profile Rules"
          subtitle="Age requirements, employer types, business parameters, and location-based logic."
          accent="sky"
        >
          <ClientProfileRules />
        </SectionCard>

        <SectionCard
          icon={BanknotesIcon}
          title="3. Financial & Eligibility Criteria"
          subtitle="Income thresholds, liquidity checks, FOIR limits, and compliance toggles."
          accent="emerald"
        >
          <FinancialCriteria />
        </SectionCard>

        <SectionCard
          icon={ShieldExclamationIcon}
          title="4. Collateral & Risk Management"
          subtitle="Collateral quality, ownership verification, and risk mitigation logic."
          accent="amber"
        >
          <CollateralRisk />
        </SectionCard>

        <SectionCard
          icon={ChartBarIcon}
          title="5. Automated Scorecard Configuration"
          subtitle="Bureau integration rules and internal scoring personas."
          accent="violet"
        >
          <ScorecardConfig />
        </SectionCard>

        <SectionCard
          icon={MagnifyingGlassCircleIcon}
          title="6. Verification & Data Integrity Rules"
          subtitle="Internal/agency verification standards and automatic data integrity flags."
          accent="rose"
        >
          <VerificationRules />
        </SectionCard>
      </div>

      {/* Footer note */}
      
      <p className="text-center text-xs text-slate-400 mt-6">
        Rules are versioned and time-stamped on publish. Simulate before going live.
      </p>
    </div>
    </RiskEngineContext.Provider>
  );
}