import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const COUNTRIES = ["India", "USA"];

export default function EditState() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ name: "", country: "" });

  useEffect(() => {
    // TODO: fetch state by id
    setForm({ name: "Maharashtra", country: "India" });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Update State:", form);
    navigate("/controls/geo/states");
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100">
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Edit State</h1>
          <p className="text-gray-500 text-sm">Update state details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="State Name" name="name" value={form.name} onChange={handleChange} required />
        <Select label="Country" name="country" value={form.country} onChange={handleChange} options={COUNTRIES} required />

        <div className="md:col-span-2 flex justify-end gap-2 mt-4">
          <button type="button" onClick={() => navigate("/controls/geo/states")} className="px-5 py-3 rounded-xl border text-gray-700">Cancel</button>
          <button type="submit" className="px-5 py-3 rounded-xl bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700"><FiSave /> Update</button>
        </div>
      </form>
    </MainLayout>
  );
}

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select {...props} className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="">Select</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);
