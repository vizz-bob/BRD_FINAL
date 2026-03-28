import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

const STATUS = ["ACTIVE", "INACTIVE"];
const RISK_LEVELS = ["LOW", "MEDIUM", "HIGH", "VERY_HIGH"];
const IMPACT_TYPES = ["CREDIT_SCORE", "AGE_RISK", "FIN_WEAK", "COLLATERAL_STRENGTH", "VERIFICATION_FAIL"];

export default function AddImpactValue() {
  const navigate = useNavigate();
  const [rules, setRules] = useState([]);

  const [form, setForm] = useState({
    rule: "",
    impact_type: "",
    impact_value: "",
    risk_impact: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    ruleManagementService.getRuleMasters().then(res => {
      setRules(res?.results || res || []);
    });
  }, []);

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await ruleManagementService.createImpactValue(form);
    navigate("/rule-management/impact-values");
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-50">
          <FiArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Add Impact Value</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

        <Select label="Rule Engine" name="rule" value={form.rule} onChange={handleChange} options={rules} required />

        <Select label="Impact Type" name="impact_type" value={form.impact_type} onChange={handleChange} options={IMPACT_TYPES} required />

        <Input label="Impact Value" name="impact_value" type="number" value={form.impact_value} onChange={handleChange} required />

        <Select label="Risk Impact" name="risk_impact" value={form.risk_impact} onChange={handleChange} options={RISK_LEVELS} required />

        <Select label="Status" name="status" value={form.status} onChange={handleChange} options={STATUS} />

        <div className="md:col-span-2 flex justify-end">
          <button className="px-5 py-3 bg-indigo-600 text-white rounded-xl flex items-center gap-2">
            <FiSave /> Save Impact
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
      {options.map(o => (
        <option key={o.id || o} value={o.id || o}>{o.rule_name || o}</option>
      ))}
    </select>
  </div>
);
