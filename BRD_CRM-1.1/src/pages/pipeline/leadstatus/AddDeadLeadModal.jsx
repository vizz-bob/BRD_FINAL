import { useState } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { leadDeadService } from "../../../services/pipelineService";

const AddDeadLeadModal = ({ isOpen, onClose, fetchDeadLeads }) => {
  const initialForm = {
    id: "",
    name: "",
    phone: "",
    email: "",
    product: "",
    reasonForDead: "",
    dateMarkedDead: "",
    verifiedBy: "",
    notes: "",
    dataSource: "",
    fraudFlag: false
  };

  const [form, setForm] = useState(initialForm);

  // Dropdown options from mock data
  const productOptions = [
    { value: "HOME_LOAN", label: "Home Loan" },
    { value: "CAR_LOAN", label: "Car Loan" },
    { value: "PERSONAL_LOAN", label: "Personal Loan" },
    { value: "EDUCATION_LOAN", label: "Education Loan" },
    { value: "BUSINESS_LOAN", label: "Business Loan" }
  ];

  const reasonForDeadOptions = [
    { value: "INVALID_DATA", label: "Invalid Data" },
    { value: "FRAUD_DETECTION", label: "Fraud Detection" },
    { value: "FRAUD", label: "Fraud" },
    { value: "MISSING_DATA", label: "Missing Critical Data" },
    { value: "NON_VERIFIABLE", label: "Non-Verifiable" }
  ];

  const verifiedByOptions = [
    { value: "SARAH", label: "QA Manager - Sarah" },
    { value: "PRIYA", label: "QA Manager - Priya" },
    { value: "SECURITY", label: "Security Team" },
    { value: "SYSTEM", label: "System Auto-Reject" }
  ];

  const dataSourceOptions = [
    { value: "PURCHASE_LIST", label: "Purchase List" },
    { value: "WEB_FORM", label: "Web Form" },
    { value: "LEGACY_IMPORT", label: "Legacy Import" },
    { value: "MANUAL_ENTRY", label: "Manual Entry" },
    { value: "API", label: "API Integrations" }
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      lead_id: form.id,
      name: form.name,
      phone: form.phone,
      email: form.email,
      product_type: form.product,
      reason_for_dead: form.reasonForDead,
      date_marked_dead: form.dateMarkedDead,
      verified_by: form.verifiedBy,
      notes: form.notes,
      data_source: form.dataSource,
      mark_as_fraud: form.fraudFlag
    };

    try {
      await leadDeadService.create(payload);

      fetchDeadLeads();
      onClose();
      setForm(initialForm);

    } catch (error) {
      console.error("Create dead lead failed:", error);
    }
  };

  const renderField = (key) => {
    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());

    // Fraud Flag checkbox
    if (key === "fraudFlag") {
      return (
        <label key={key} className="flex items-center gap-3 col-span-2 bg-red-50 border border-red-200 rounded-lg p-3">
          <input
            type="checkbox"
            checked={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
            className="w-4 h-4 accent-red-600 rounded"
          />
          <span className="text-sm font-bold text-red-900">Mark as Fraud</span>
        </label>
      );
    }

    // Dropdown fields
    if (key === "product") {
      return (
        <div key={key} className="col-span-1">
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
            {label}
          </label>
          <select
            name={key}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-600/30
                       focus:border-indigo-600 bg-white"
          >
            <option value="">Select Product</option>
            {productOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      );
    }

    if (key === "reasonForDead") {
      return (
        <div key={key} className="col-span-1">
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
            {label}
          </label>
          <select
            name={key}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-600/30
                       focus:border-indigo-600 bg-white"
          >
            <option value="">Select Reason</option>
            {reasonForDeadOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      );
    }

    if (key === "verifiedBy") {
      return (
        <div key={key} className="col-span-1">
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
            {label}
          </label>
          <select
            name={key}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-600/30
                       focus:border-indigo-600 bg-white"
          >
            <option value="">Select Verifier</option>
            {verifiedByOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      );
    }

    if (key === "dataSource") {
      return (
        <div key={key} className="col-span-1">
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
            {label}
          </label>
          <select
            name={key}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-600/30
                       focus:border-indigo-600 bg-white"
          >
            <option value="">Select Data Source</option>
            {dataSourceOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      );
    }

    // Date field
    if (key === "dateMarkedDead") {
      return (
        <div key={key} className="col-span-1">
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
            {label}
          </label>
          <div className="relative">
            <input
              type="date"
              name={key}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-600/30
                         focus:border-indigo-600"
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      );
    }

    // Textarea for notes
    if (key === "notes") {
      return (
        <div key={key} className="col-span-2">
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
            {label}
          </label>
          <textarea
            name={key}
            placeholder="Enter detailed notes about why this lead is marked dead"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-600/30
                       focus:border-indigo-600 resize-none"
          />
        </div>
      );
    }

    // Email field
    if (key === "email") {
      return (
        <div key={key} className="col-span-1">
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
            {label}
          </label>
          <input
            type="email"
            name={key}
            placeholder="email@example.com"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-600/30
                       focus:border-indigo-600"
          />
        </div>
      );
    }

    // Phone field
    if (key === "phone") {
      return (
        <div key={key} className="col-span-1">
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
            {label}
          </label>
          <input
            type="tel"
            name={key}
            placeholder="10-digit phone number"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            pattern="[0-9]{10}"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-600/30
                       focus:border-indigo-600"
          />
        </div>
      );
    }

    // Default text input
    return (
      <div key={key} className="col-span-1">
        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
          {label}
        </label>
        <input
          type="text"
          name={key}
          placeholder={`Enter ${label.toLowerCase()}`}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-600/30
                     focus:border-indigo-600"
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center px-4">
      <div className="bg-white w-full max-w-2xl rounded-t-2xl md:rounded-2xl
                      max-h-[90vh] flex flex-col overflow-hidden shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-indigo-600">
          <h2 className="text-sm font-black text-white uppercase tracking-wider">
            Add Dead Lead
          </h2>
          <button onClick={onClose} className="text-white hover:bg-indigo-700 rounded-lg p-1 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(form).map((key) => renderField(key))}
          </div>

          <div className="pt-6 border-t mt-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg
                         font-black hover:bg-indigo-700 active:scale-95 transition-all"
            >
              Add Dead Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeadLeadModal;