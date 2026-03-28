import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AddTemplate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "",
    version: "",
    uploaded_by: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Form submitted", form);
    navigate("/templates"); // After save, redirect to list
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
          <h1 className="text-2xl font-bold">Add Template</h1>
          <p className="text-sm text-gray-500">Upload a new predefined template</p>
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
          <FiSave /> Save Template
        </button>
      </div>
    </MainLayout>
  );
};

export default AddTemplate;

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
