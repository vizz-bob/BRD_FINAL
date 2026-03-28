import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const EditTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    type: "",
    version: "",
    uploaded_by: "",
    status: "Active",
  });

  useEffect(() => {
    // Load template data by id (mocked here)
    const data = {
      name: "Retail Loan Template",
      type: "Loan",
      version: "v1.0",
      uploaded_by: "Admin",
      status: "Active",
    };
    setForm(data);
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Template updated", form);
    navigate("/templates");
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
        >
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Edit Template</h1>
          <p className="text-sm text-gray-500">Modify existing template details</p>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl p-6 shadow-sm max-w-2xl">
        <FormField label="Template Name" name="name" value={form.name} onChange={handleChange} />
        <FormField label="Type" name="type" value={form.type} onChange={handleChange} />
        <FormField label="Version" name="version" value={form.version} onChange={handleChange} />
        <FormField label="Uploaded By" name="uploaded_by" value={form.uploaded_by} onChange={handleChange} />

        <div className="flex items-center gap-4 mt-4">
          <label className="text-sm font-medium">Status:</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="px-3 py-2 rounded-xl bg-gray-50 text-sm outline-none"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FiSave /> Update Template
        </button>
      </div>
    </MainLayout>
  );
};

export default EditTemplate;

const FormField = ({ label, name, value, onChange }) => (
  <div className="flex flex-col mb-4">
    <label className="text-sm font-medium mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="px-3 py-2 rounded-xl bg-gray-50 text-sm outline-none"
    />
  </div>
);
