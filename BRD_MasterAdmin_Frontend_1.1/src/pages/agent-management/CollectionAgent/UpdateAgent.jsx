import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft } from "react-icons/fi";

export default function UpdateAgent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    agentType: "",
    status: "",
    contactInfo: "",
    roles: "",
    performanceRating: "",
  });

  /* ---------------- FETCH AGENT DETAILS ---------------- */
  useEffect(() => {
    if (id) {
      // TODO: replace with API call
      const data = {
        agentType: "Collection",
        status: "Active",
        contactInfo: "9876543210",
        roles: "Collection, Recovery",
        performanceRating: "4.5",
      };
      setFormData(data);
    }
  }, [id]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Updating Agent:", formData);
    // API: PUT /agents/:id

    navigate(-1);
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
        >
          <FiArrowLeft />
        </button>

        <div>
          <h2 className="text-xl font-semibold">Update Agent</h2>
          <p className="text-sm text-gray-500">
            Update agent details, status, roles, and performance rating
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Agent Type */}
          <Select
            label="Agent Type"
            name="agentType"
            value={formData.agentType}
            onChange={handleChange}
            options={["Collection", "Legal"]}
          />

          {/* Status */}
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={["Active", "Inactive"]}
          />

          {/* Contact Info */}
          <Input
            label="Contact Info"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            placeholder="Phone or email"
          />

          {/* Associated Roles */}
          <Input
            label="Associated Roles"
            name="roles"
            value={formData.roles}
            onChange={handleChange}
            placeholder="Collection, Legal"
          />

          {/* Performance Rating */}
          <Input
            label="Performance Rating"
            name="performanceRating"
            value={formData.performanceRating}
            onChange={handleChange}
            placeholder="1 – 5"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl text-sm border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Update Agent
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

/* ---------------- REUSABLE COMPONENTS ---------------- */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">
      {label}
    </label>
    <select
      {...props}
      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);
