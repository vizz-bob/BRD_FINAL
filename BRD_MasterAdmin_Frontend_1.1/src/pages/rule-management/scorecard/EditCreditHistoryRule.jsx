import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

const BUREAUS = ["CIBIL", "Experian", "Equifax", "CRIF"];
const RISK_LEVELS = ["Low", "Medium", "High"];
const STATUS = ["Active", "Inactive"];

export default function EditCreditHistoryRule() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    credit_bureau: "",
    min_credit_score: "",
    max_dpd_days: "",
    max_enquiries: "",
    risk_level: "",
    status: "Active",
    remarks: "",
  });

  useEffect(() => {
    loadRule();
  }, [id]);

  const loadRule = async () => {
    const data = await ruleManagementService.getCreditHistoryRules();
    const record = data.find((x) => String(x.id) === String(id));
    if (record) setForm(record);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await ruleManagementService.updateCreditHistoryRule(id, form);
    navigate("/rule-management/scorecard/credit-history");
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-50">
          <FiArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Edit Credit History Rule</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select label="Credit Bureau" name="credit_bureau" value={form.credit_bureau} onChange={handleChange} options={BUREAUS} required />
        <Input label="Minimum Credit Score" name="min_credit_score" type="number" value={form.min_credit_score} onChange={handleChange} required />
        <Input label="Maximum DPD (days)" name="max_dpd_days" type="number" value={form.max_dpd_days} onChange={handleChange} required />
        <Input label="Maximum Enquiries" name="max_enquiries" type="number" value={form.max_enquiries} onChange={handleChange} required />
        <Select label="Risk Level" name="risk_level" value={form.risk_level} onChange={handleChange} options={RISK_LEVELS} required />
        <Select label="Status" name="status" value={form.status} onChange={handleChange} options={STATUS} />
        <Textarea label="Remarks" name="remarks" value={form.remarks} onChange={handleChange} className="md:col-span-2" />

        <div className="md:col-span-2 flex justify-end">
          <button className="px-5 py-3 bg-indigo-600 text-white rounded-xl flex items-center gap-2">
            <FiSave /> Update Rule
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

/* UI helpers */
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl border text-sm" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl border text-sm">
      <option value="">Select</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <textarea {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl border text-sm" />
  </div>
);
