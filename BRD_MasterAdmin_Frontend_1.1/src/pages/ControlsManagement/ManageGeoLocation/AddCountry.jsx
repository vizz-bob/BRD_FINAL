import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { controlsManagementService } from "../../../services/controlsManagementService";

export default function GeoForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // optional for edit mode
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    area: "",
  });

  /* ===========================
     FETCH MASTER DATA
  ============================ */
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const geoList = await controlsManagementService.geo_locations.list();

      // Assuming backend returns type-based geo structure
      setCountries(geoList.filter((g) => g.type === "COUNTRY"));
      setStates(geoList.filter((g) => g.type === "STATE"));
      setCities(geoList.filter((g) => g.type === "CITY"));

      if (isEdit) {
        const data = await controlsManagementService.geo_locations.retrieve(id);
        if (data) {
          setFormData({
            country: data.country || "",
            state: data.state || "",
            city: data.city || "",
            area: data.area || "",
          });
        }
      }
    } catch (error) {
      console.error("Geo fetch error:", error);
    }
    setLoading(false);
  };

  /* ===========================
     HANDLERS
  ============================ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      country: formData.country,
      state: formData.state,
      city: formData.city,
      area: formData.area,
    };

    try {
      setLoading(true);
      if (isEdit) {
        await controlsManagementService.geo_locations.update(id, payload);
      } else {
        await controlsManagementService.geo_locations.create(payload);
      }
      navigate("/controls/geo");
    } catch (error) {
      console.error("Save error:", error);
    }
    setLoading(false);
  };

  /* ===========================
     UI
  ============================ */
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Edit Geo Location" : "Add Geo Location"}
          </h1>
          <p className="text-sm text-gray-500">
            Manage hierarchical geographic details
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow p-6 space-y-6"
        >
          {/* Country */}
          <FormSelect
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            options={countries}
            placeholder="Select country"
          />

          {/* State */}
          <FormSelect
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            options={states.filter(
              (s) => s.country === formData.country
            )}
            placeholder="Select state"
            disabled={!formData.country}
          />

          {/* City */}
          <FormSelect
            label="District / City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            options={cities.filter(
              (c) => c.state === formData.state
            )}
            placeholder="Select city"
            disabled={!formData.state}
          />

          {/* Area */}
          <FormInput
            label="Area / Locality"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="Enter area or locality"
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/controls/geo")}
              className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

/* ===========================
   REUSABLE CONTROLS
=========================== */

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.name}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
);

const FormInput = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>
);
