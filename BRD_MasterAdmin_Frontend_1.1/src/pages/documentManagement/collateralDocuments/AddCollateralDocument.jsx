import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// import { documentService } from "../../../services/documentService";

const COLLATERAL_CATEGORIES = ["Movable", "Immovable", "Guarantee"];
const COLLATERAL_TYPES = ["Property", "Land", "Vehicle", "FD"];
const COVERAGE_TYPES = ["Full", "Partial", "Hypothecation"];
const MODES = ["Registered", "Hypothecated"];

const initialForm = {
  collateral_category: "",
  collateral_type: "",
  coverage_type: "",
  mode: "",
  collateral_details: "",
  ltv_ratio: "",
  status: "Active",
};

const AddCollateralDocument = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const err = {};
    if (!form.collateral_category) err.collateral_category = "Required";
    if (!form.collateral_type) err.collateral_type = "Required";
    if (!form.coverage_type) err.coverage_type = "Required";
    if (!form.mode) err.mode = "Required";
    if (!form.ltv_ratio) err.ltv_ratio = "Required";
    return err;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        is_active: form.status === "Active",
      };

      /*
      await documentService.addCollateralDocument(payload);
      */

      navigate("/documents/collateral");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-50">
          <FiArrowLeft />
        </button>
        <h1 className="text-xl font-semibold">Add Collateral Document</h1>
      </div>

      {/* FORM */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select label="Collateral Category" name="collateral_category" options={COLLATERAL_CATEGORIES} form={form} onChange={handleChange} error={errors.collateral_category} />
          <Select label="Collateral Type" name="collateral_type" options={COLLATERAL_TYPES} form={form} onChange={handleChange} error={errors.collateral_type} />
          <Select label="Security Coverage Type" name="coverage_type" options={COVERAGE_TYPES} form={form} onChange={handleChange} error={errors.coverage_type} />
          <Select label="Mode of Collateral" name="mode" options={MODES} form={form} onChange={handleChange} error={errors.mode} />

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Collateral Details</label>
            <textarea
              name="collateral_details"
              value={form.collateral_details}
              onChange={handleChange}
              className="mt-2 w-full p-3 rounded-xl bg-gray-50"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Loan to Collateral Value (%)</label>
            <input
              type="number"
              name="ltv_ratio"
              value={form.ltv_ratio}
              onChange={handleChange}
              className="mt-2 w-full p-3 rounded-xl bg-gray-50"
            />
            {errors.ltv_ratio && <p className="text-xs text-red-600">{errors.ltv_ratio}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-2 w-full p-3 rounded-xl bg-gray-50"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-blue-600 text-white flex items-center justify-center gap-2"
            >
              <FiSave /> {submitting ? "Saving..." : "Save Collateral Rule"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AddCollateralDocument;

const Select = ({ label, name, options, form, onChange, error }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select
      name={name}
      value={form[name]}
      onChange={onChange}
      className="mt-2 w-full p-3 rounded-xl bg-gray-50"
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);
