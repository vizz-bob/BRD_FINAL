import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

/* Allowed engines */
const RULE_CODES = [
  { label: "Client Profile Engine", value: "CLIENT_PROFILE" },
  { label: "Collateral Quality Engine", value: "COLLATERAL" },
  { label: "Financial Eligibility Engine", value: "FINANCIAL" },
  { label: "Score Card Engine", value: "SCORECARD" },
  { label: "Verification Engine", value: "VERIFICATION" },
  { label: "Risk & Mitigation Engine", value: "RISK" },
];

export default function EditRuleName() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    rule_name: "",
    rule_code: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    (async () => {
      const data = await ruleManagementService.getRuleMasterById(id);
      setForm({
        rule_name: data.rule_name,
        rule_code: data.rule_code,
        description: data.description || "",
        status: data.status,
      });
    })();
  }, [id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      rule_name: form.rule_name.trim(),
      rule_code: form.rule_code,
      description: form.description,
      status: form.status,
    };

    await ruleManagementService.updateRuleMaster(id, payload);
    navigate("/rule-management/rule-master");
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-50">
          <FiArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Edit Rule Engine</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Rule Name" name="rule_name" value={form.rule_name} onChange={handleChange} required />

        <Select label="Rule Engine" name="rule_code" value={form.rule_code} onChange={handleChange} options={RULE_CODES} required />

        <Select label="Status" name="status" value={form.status} onChange={handleChange} options={[{label:"Active",value:"Active"},{label:"Inactive",value:"Inactive"}]} />

        <Textarea label="Description" name="description" value={form.description} onChange={handleChange} className="md:col-span-2" />

        <div className="md:col-span-2 flex justify-end">
          <button className="px-5 py-3 bg-indigo-600 text-white rounded-xl flex items-center gap-2">
            <FiSave /> Update Engine
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
      <option value="" disabled>Select</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <textarea {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl border text-sm" />
  </div>
);
