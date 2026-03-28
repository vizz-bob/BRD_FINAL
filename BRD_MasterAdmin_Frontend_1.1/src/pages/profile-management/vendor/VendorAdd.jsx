import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";

export default function VendorAdd() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "",
    category: "",
    constitution: "",
    location: "",
    serviceType: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    console.log("Add Vendor:", form);
    navigate("/profile-management/vendor");
  };

  return (
    <MainLayout>
      <h1 className="text-xl font-semibold mb-4">Add Vendor</h1>

      <div className="bg-white p-6 rounded-2xl shadow grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select name="type" onChange={handleChange} label="Vendor Type">
          <option value="">Select</option>
          <option>Individual</option>
          <option>Company</option>
          <option>Partnership</option>
        </Select>

        <Select name="category" onChange={handleChange} label="Category">
          <option value="">Select</option>
          <option>Legal</option>
          <option>Valuation</option>
          <option>Technical</option>
        </Select>

        <Select name="constitution" onChange={handleChange} label="Constitution">
          <option value="">Select</option>
          <option>Proprietorship</option>
          <option>Pvt Ltd</option>
          <option>LLP</option>
        </Select>

        <Input
          label="Location"
          name="location"
          onChange={handleChange}
        />

        <Select
          name="serviceType"
          onChange={handleChange}
          label="Service Type"
          className="md:col-span-2"
        >
          <option value="">Select</option>
          <option>Documentation</option>
          <option>Verification</option>
          <option>Valuation</option>
        </Select>

        <div className="md:col-span-2 flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl"
          >
            Save Vendor
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

/* Reusable */
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input {...props} className="w-full mt-1 p-2 border rounded-lg" />
  </div>
);

const Select = ({ label, children, className = "", ...props }) => (
  <div className={className}>
    <label className="text-sm font-medium">{label}</label>
    <select {...props} className="w-full mt-1 p-2 border rounded-lg">
      {children}
    </select>
  </div>
);
