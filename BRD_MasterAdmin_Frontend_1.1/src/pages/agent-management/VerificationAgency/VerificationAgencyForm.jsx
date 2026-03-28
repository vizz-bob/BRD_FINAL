import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft } from "react-icons/fi";
import { AGENT_TYPES } from "./agentTypes";

export default function VerificationAgencyForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // edit mode

  const [formData, setFormData] = useState({
    name: "",
    agentType: "",
    contactPerson: "",
    mobile: "",
    email: "",
    region: "",
    status: "Active",
  });

  /* ---------------- FETCH DATA (EDIT MODE) ---------------- */
  useEffect(() => {
    if (id) {
      // TODO: replace with API call
      const data = {
        name: "ABC Verifications",
        agentType: "Verification Agent",
        contactPerson: "Rahul Sharma",
        mobile: "9876543210",
        email: "abc@verify.com",
        region: "North",
        status: "Active",
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

    if (id) {
      console.log("Updating Verification Agency:", formData);
      // API: PUT /verification-agencies/:id
    } else {
      console.log("Creating Verification Agency:", formData);
      // API: POST /verification-agencies
    }

    navigate("/verification-agency");
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
          <h1 className="text-xl font-semibold">
            {id ? "Edit Verification Agency" : "Add Verification Agency"}
          </h1>
          <p className="text-sm text-gray-500">
            Configure verification, valuation, legal & fraud investigation agencies
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Agency Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter agency name"
          />

          <Select
            label="Agent Type"
            name="agentType"
            value={formData.agentType}
            onChange={handleChange}
            options={AGENT_TYPES}
          />

          <Input
            label="Contact Person"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            placeholder="Full name"
          />

          <Input
            label="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="10-digit mobile number"
          />

          <Input
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
          />

          <Select
            label="Region / Zone"
            name="region"
            value={formData.region}
            onChange={handleChange}
            options={["North", "South", "East", "West"]}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={["Active", "Inactive"]}
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
            {id ? "Update Agency" : "Save Agency"}
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

/* ---------------- REUSABLE FIELDS ---------------- */

const Input = ({ label, full, ...props }) => (
  <div className={full ? "md:col-span-2" : ""}>
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
