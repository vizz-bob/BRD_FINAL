import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { bankFundService } from "../../../services/bankFundService";

const MODEL_TYPES = [
  "Mark-up Model",
  "Payout Model",
  "Lease Model",
  "Co-Lending Model",
];
const STATUS = ["ACTIVE", "INACTIVE"];

const BusinessModelFormPage = ({ modeType }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    model_name: "",
    model_type: "",
    revenue_value: "",
    linked_partners: [],
    description: "",
    status: "ACTIVE",
  });

  const [partnersList, setPartnersList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch partners/DSA from Agent/Vendor master
  useEffect(() => {
    async function fetchPartners() {
      try {
        const data = await bankFundService.getAgents();
        setPartnersList(Array.isArray(data) ? data : (data?.results || []));
      } catch (err) {
        console.error("Failed to fetch partners:", err);
      }
    }
    fetchPartners();
  }, []);

  // Fetch existing business model if in edit mode
  useEffect(() => {
    if (modeType === "edit" && id) {
      fetchBusinessModel(id);
    }
  }, [id, modeType]);

  const fetchBusinessModel = async (modelId) => {
    setLoading(true);
    try {
      const data = await bankFundService.getBusinessModel(modelId);
      setForm({
        model_name:      data.model_name      || "",
        model_type:      data.model_type      || "",
        revenue_value:   data.revenue_value   || "",
        linked_partners: data.linked_partners || [],
        description:     data.description     || "",
        status:          data.status          || "ACTIVE",
      });
    } catch (err) {
      console.error("Failed to fetch business model:", err);
      alert("Error fetching business model");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePartner = (partnerId) => {
    setForm((prev) => ({
      ...prev,
      linked_partners: prev.linked_partners.includes(partnerId)
        ? prev.linked_partners.filter((p) => p !== partnerId)
        : [...prev.linked_partners, partnerId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modeType === "add") {
        await bankFundService.createBusinessModel({ ...form });
        alert("Business model created successfully");
      } else if (modeType === "edit" && id) {
        await bankFundService.updateBusinessModel(id, { ...form });
        alert("Business model updated successfully");
      }
      navigate("/business-model");
    } catch (err) {
      console.error("Error saving business model:", err);
      alert("Failed to save business model");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate("/business-model")}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100"
        >
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold">
            {modeType === "add" ? "Add Business Model" : "Edit Business Model"}
          </h1>
          <p className="text-gray-500 text-sm">
            Configure business model details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* BUSINESS MODEL DETAILS CARD */}
        <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b pb-2">
            Model Details
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model Name */}
            <Input
              label={<>Model Name <span style={{ color: "red" }}>*</span></>}
              name="model_name"
              placeholder="e.g. Gold Loan Mark-up FY25"
              value={form.model_name}
              onChange={handleChange}
              required
            />

            {/* Model Type */}
            <Select
              label={<>Model Type <span style={{ color: "red" }}>*</span></>}
              name="model_type"
              value={form.model_type}
              onChange={handleChange}
              options={MODEL_TYPES}
              required
            />

            {/* Revenue Share / Margin Value */}
            <Input
              label={
                <>
                  Revenue Share / Margin Value (%)
                  <span style={{ color: "red" }}> *</span>
                </>
              }
              name="revenue_value"
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="e.g. 2.50"
              value={form.revenue_value}
              onChange={handleChange}
              required
            />

            {/* Status */}
            <Select
              label={<>Status <span style={{ color: "red" }}>*</span></>}
              name="status"
              value={form.status}
              onChange={handleChange}
              options={STATUS}
              required
            />
          </div>

          {/* Linked Partner / DSA — full width */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Linked Partner / DSA{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
              {partnersList.length > 0 ? (
                partnersList.map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="accent-blue-600"
                      checked={form.linked_partners.includes(p.id)}
                      onChange={() => togglePartner(p.id)}
                    />
                    {p.name || p.agent_name || p.id}
                  </label>
                ))
              ) : (
                <p className="text-gray-400 text-sm col-span-3">
                  No partners available.
                </p>
              )}
            </div>
          </div>

          {/* Description — full width */}
          <Textarea
            label={
              <>
                Model Description{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </>
            }
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Define the engagement logic for this model..."
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/business-model")}
            className="px-5 py-3 rounded-xl border hover:bg-gray-50 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 text-sm disabled:opacity-60"
          >
            <FiSave />
            {loading ? "Saving..." : modeType === "add" ? "Save Model" : "Update Model"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessModelFormPage;

/* ---------------- REUSABLE ---------------- */
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      {...props}
      className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea
      {...props}
      className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);