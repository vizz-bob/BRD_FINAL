import { useState } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { leadExpiredService } from "../../../services/pipelineService";

const AddExpiredLeadModal = ({ isOpen, onClose, onAdd }) => {
  const initialForm = {
    id: "",
    name: "",
    phone: "",
    email: "",
    product: "",
    validityExpiryDate: "",
    expiryReason: "",
    agentName: "",
    systemExpiryFlag: true,
    daysExpired: "",
    offerDetails: "",
    lastContactDate: ""
  };

  const [form, setForm] = useState(initialForm);

  // Dropdown options from mock data
  const productOptions = [
    { value: "PERSONAL_LOAN", label: "Personal Loan" },
    { value: "HOME_LOAN", label: "Home Loan" },
    { value: "CAR_LOAN", label: "Car Loan" },
    { value: "BUSINESS_LOAN", label: "Business Loan" },
    { value: "EDUCATION_LOAN", label: "Education Loan" }
  ];

  const expiryReasonOptions = [
    { value: "TIME_BOUND", label: "Time-bound Offer" },
    { value: "VALIDITY_EXPIRED", label: "Offer Validity Expired" },
    { value: "BUDGET_LAPSE", label: "Budget Lapse" },
    { value: "SEASONAL_END", label: "Seasonal Campaign Ended" },
    { value: "ACADEMIC_DEADLINE", label: "Academic Year Deadline" }
  ];

  const agentOptions = [
    { value: "AGENT_A", label: "Agent A" },
    { value: "AGENT_B", label: "Agent B" },
    { value: "AGENT_C", label: "Agent C" },
    { value: "AGENT_D", label: "Agent D" }
  ];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm(initialForm);
    onClose();
  };

  const renderField = (key) => {
    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());

    // System Expiry Flag checkbox
    if (key === "systemExpiryFlag") {
      return (
        <label
          key={key}
          className="flex items-center gap-3 col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-3"
        >
          <input
            type="checkbox"
            checked={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
            className="w-4 h-4 accent-blue-600 rounded"
          />
          <span className="text-sm font-bold text-blue-900">System Auto-Expired</span>
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

    if (key === "expiryReason") {
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
            <option value="">Select Expiry Reason</option>
            {expiryReasonOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      );
    }

    if (key === "agentName") {
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
            <option value="">Select Agent</option>
            {agentOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      );
    }

    // Date fields
    if (key === "validityExpiryDate" || key === "lastContactDate") {
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

    // Textarea for offer details
    if (key === "offerDetails") {
      return (
        <div key={key} className="col-span-2">
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
            {label}
          </label>
          <textarea
            name={key}
            placeholder="Enter offer details and terms"
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

    // Number field
    if (key === "daysExpired") {
      return (
        <div key={key} className="col-span-1">
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">
            {label}
          </label>
          <input
            type="number"
            name={key}
            placeholder="Enter days"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            required
            min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-600/30
                       focus:border-indigo-600"
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
            required
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
            required
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
            Add Expired Lead
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
              Add Expired Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpiredLeadModal;