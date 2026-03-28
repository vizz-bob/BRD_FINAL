import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { controlsManagementService } from "../../../services/controlsManagementService";

export default function GeoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);

  /* ================= FORM STATE ================= */
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    area: "",
    status: "ACTIVE"
  });

  /* ================= FETCH (EDIT) ================= */
  useEffect(() => {
    if (!isEdit) return;

    const fetchGeo = async () => {
      setLoading(true);
      const data =
        await controlsManagementService.geo_locations.retrieve(id);

      if (data) {
        setFormData({
          country: data.country || "",
          state: data.state || "",
          city: data.city || "",
          area: data.area || "",
          status: data.status || "ACTIVE"
        });
      }
      setLoading(false);
    };

    fetchGeo();
  }, [id, isEdit]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isEdit) {
      await controlsManagementService.geo_locations.update(id, formData);
    } else {
      await controlsManagementService.geo_locations.create(formData);
    }

    setLoading(false);
    navigate("/controls/geo");
  };

  /* ================= UI ================= */
  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? "Edit Geo Location" : "Add Geo Location"}
          </h1>
          <p className="text-sm text-gray-500">
            Country → State → City → Area
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow max-w-3xl space-y-6"
      >
        <InputField
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />

        <InputField
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
        />

        <InputField
          label="District / City"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />

        <InputField
          label="Area / Locality"
          name="area"
          value={formData.area}
          onChange={handleChange}
        />

        {/* Status (Edit-safe) */}
        <SelectField
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={["ACTIVE", "INACTIVE"]}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-gray-100 rounded-xl"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-60"
          >
            <FiSave /> {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

/* ================= COMPONENTS ================= */

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      {...props}
      required
      className="w-full border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
      required
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
