import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

const PARAMETERS = ["Age","Employment Type","Residence Type","Marital Status","City"];
const CONDITIONS = ["Equals","Between","Greater Than","Less Than"];
const STATUS = ["ACTIVE","INACTIVE"];   // backend values

export default function AddClientProfileRule() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    rule_name: "",
    parameter: "",
    condition: "",
    value: "",
    impact_value: "",
    status: "ACTIVE",
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      rule_name: form.rule_name.trim(),
      parameter: form.parameter.trim(),
      condition: form.condition.trim(),
      value: form.value.trim(),
      impact_value: form.impact_value.trim(),
      status: form.status
    };

    await ruleManagementService.createClientProfileRule(payload);
    navigate("/rule-management/client-profile");
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-50">
          <FiArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Add Client Profile Rule</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Rule Name" name="rule_name" value={form.rule_name} onChange={handleChange} required />
        <Select label="Parameter" name="parameter" value={form.parameter} onChange={handleChange} options={PARAMETERS} required />
        <Select label="Condition" name="condition" value={form.condition} onChange={handleChange} options={CONDITIONS} required />
        <Input label="Value" name="value" value={form.value} onChange={handleChange} required />
        <Input label="Impact Value" name="impact_value" value={form.impact_value} onChange={handleChange} required />
        <Select label="Status" name="status" value={form.status} onChange={handleChange} options={STATUS} required />

        <div className="md:col-span-2 flex justify-end">
          <button className="px-5 py-3 bg-indigo-600 text-white rounded-xl flex items-center gap-2">
            <FiSave /> Save Rule
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

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
      <option value="" disabled>Select</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);
