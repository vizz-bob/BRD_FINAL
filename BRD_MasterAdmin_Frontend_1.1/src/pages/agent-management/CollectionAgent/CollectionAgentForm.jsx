import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft } from "react-icons/fi";

export default function CollectionAgentForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // detect edit mode

  const [formData, setFormData] = useState({
    name: "",
    contactInfo: "",
    zone: "",
    collectionType: "",
    assignedTenants: "",
    recoveryModel: "",
    bankDetails: "",
  });

  /* ---------------- FETCH DATA (EDIT MODE) ---------------- */
  useEffect(() => {
    if (id) {
      // TODO: replace with API call
      const data = {
        name: "ABC Collections",
        contactInfo: "9876543210",
        zone: "North",
        collectionType: "Hard",
        assignedTenants: "Tenant A, Tenant B",
        recoveryModel: "Standard",
        bankDetails: "XYZ Bank - 123456",
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
      console.log("Updating Collection Agent:", formData);
      // API: PUT /collection-agents/:id
    } else {
      console.log("Creating Collection Agent:", formData);
      // API: POST /collection-agents
    }

    navigate("/collection-agents");
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
            {id ? "Edit Collection Agent" : "Add Collection Agent"}
          </h1>
          <p className="text-sm text-gray-500">
            Configure collection agent details, assigned tenants, and recovery model
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
            label="Agent Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter agent full name"
          />

          <Input
            label="Contact Info"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            placeholder="Phone or email"
          />

          <Select
            label="Zone / Region"
            name="zone"
            value={formData.zone}
            onChange={handleChange}
            options={["North", "South", "East", "West"]}
          />

          <Select
            label="Collection Type"
            name="collectionType"
            value={formData.collectionType}
            onChange={handleChange}
            options={["Soft", "Hard"]}
          />

          <Input
            label="Assigned Tenants"
            name="assignedTenants"
            value={formData.assignedTenants}
            onChange={handleChange}
            placeholder="Tenant A, Tenant B"
            full
          />

          <Input
            label="Recovery Model"
            name="recoveryModel"
            value={formData.recoveryModel}
            onChange={handleChange}
            placeholder="Standard / Aggressive"
          />

          <Input
            label="Bank Details"
            name="bankDetails"
            value={formData.bankDetails}
            onChange={handleChange}
            placeholder="Bank name & account"
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
            {id ? "Update Agent" : "Save Agent"}
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
