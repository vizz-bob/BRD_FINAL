import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { ruleManagementService } from "../../../services/ruleManagementService";

const INCOME_TYPES = ["Salaried", "Business", "Professional"];
const STATUS = ["Active", "Inactive"];

export default function EditFinancialRule() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    income_type: "",
    min_monthly_income: "",
    max_emi_ratio: "",
    min_bank_balance: "",
    max_existing_obligation: "",
    status: "Active",
    remarks: "",
  });

  useEffect(() => {
    (async () => {
    const data = await ruleManagementService.getFinancialRuleById(id);
setForm(data);

     
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await ruleManagementService.updateFinancialRule(id, form);
    navigate("/rule-management/financial-eligibility");
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-50">
          <FiArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Edit Financial Eligibility Rule</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select label="Income Type" name="income_type" value={form.income_type} onChange={handleChange} options={INCOME_TYPES} required />

        <Input label="Minimum Monthly Income" name="min_monthly_income" type="number" value={form.min_monthly_income} onChange={handleChange} required />

        <Input label="Maximum EMI Ratio (%)" name="max_emi_ratio" value={form.max_emi_ratio} onChange={handleChange} required />

        <Input label="Minimum Bank Balance" name="min_bank_balance" type="number" value={form.min_bank_balance} onChange={handleChange} required />

        <Input label="Max Existing Obligation (₹)" name="max_existing_obligation" type="number" value={form.max_existing_obligation} onChange={handleChange} />

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
