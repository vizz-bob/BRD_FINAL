import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

/* --- DROPDOWNS --- */
const EMPLOYER_TYPES = ["Government", "Private", "Self Employed"];
const QUALIFICATIONS = ["Graduate", "Post Graduate", "Professional"];
const STATUS = ["active", "inactive"];   // backend values

export default function EditClientProfileRule() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    rule_name: "",
    parameter: "",
    condition: "",
    value: "",
    impact_value: "",
    status: "active",
  });

  /* LOAD EXISTING RULE */
useEffect(() => {
  (async () => {
    const data = await ruleManagementService.getClientProfileRuleById(id);
    setForm({
      rule_name: data.rule_name || "",
      parameter: data.parameter || "",
      condition: data.condition || "",
      value: data.value || "",
      impact_value: data.impact_value || "",
      status: data.status || "active",
    });
  })();
}, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await ruleManagementService.updateClientProfileRule(id, form);
    navigate("/rule-management/client-profile");
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-50">
          <FiArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Edit Client Profile Rule</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Input label="Rule Name" name="rule_name" value={form.rule_name} onChange={handleChange} required />

        <Input label="Parameter" name="parameter" value={form.parameter} onChange={handleChange} required />

        <Input label="Condition" name="condition" value={form.condition} onChange={handleChange} required />

        <Input label="Value" name="value" value={form.value} onChange={handleChange} required />

        <Input label="Impact Value" name="impact_value" value={form.impact_value} onChange={handleChange} />

        <Select label="Status" name="status" value={form.status} onChange={handleChange} options={STATUS} />

        <div className="md:col-span-2 flex justify-end">
          <button className="px-5 py-3 bg-indigo-600 text-white rounded-xl flex items-center gap-2">
            <FiSave /> Update Rule
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
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);
