import React, { useState, useMemo } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { bankFundService } from "../../services/bankFundService";

export default function AddFund() {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fund_type: "",
    fund_source: "",
    available_amount: "",
    fund_allocation_logic: "",
  });

  /* ================= VALIDATION ================= */
  const errors = useMemo(() => {
    const e = {};
    // Ensure .trim() is only called on strings
    if (!form.fund_type || String(form.fund_type).trim() === "") {
      e.fund_type = "Fund type is required";
    }
    if (!form.fund_source || String(form.fund_source).trim() === "") {
      e.fund_source = "Fund source is required";
    }
    if (!form.available_amount || Number(form.available_amount) <= 0) {
      e.available_amount = "Available amount must be greater than 0";
    }
    return e;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;

  /* ================= HANDLERS ================= */
  const handleChange = (e, isNumber = false) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: isNumber ? Number(value) : String(value),
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (hasErrors) return;

  setSubmitting(true);
  try {
    console.log("Payload to save fund:", form);

    // Call backend properly
    await bankFundService.createFund(form);

    // Navigate after success
    navigate("/fund-management");
  } catch (err) {
    console.error("Create fund failed:", err);
    alert("Failed to create fund. See console for details.");
  } finally {
    setSubmitting(false);
  }

};

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100"
        >
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Add Fund</h1>
          <p className="text-gray-500 text-sm">Configure a new fund pool</p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* FUND TYPE */}
        <Input
          label="Fund Type"
          name="fund_type"
          value={form.fund_type}
          onChange={handleChange}
          error={errors.fund_type}
          required
        />

        {/* FUND SOURCE */}
        <Input
          label="Fund Source"
          name="fund_source"
          value={form.fund_source}
          onChange={handleChange}
          error={errors.fund_source}
          required
        />

        {/* AVAILABLE AMOUNT */}
        <NumberInput
          label="Available Amount"
          name="available_amount"
          value={form.available_amount}
          onChange={(e) => handleChange(e, true)}
          error={errors.available_amount}
          required
        />

        {/* ALLOCATION LOGIC */}
        <Textarea
          label="Fund Allocation Logic"
          name="fund_allocation_logic"
          value={form.fund_allocation_logic}
          onChange={handleChange}
          rows={3}
          className="md:col-span-2"
        />

        {/* ACTIONS */}
        <div className="md:col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            disabled={hasErrors || submitting}
            className={`px-5 py-3 rounded-xl text-white flex items-center gap-2 ${
              hasErrors || submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <FiSave /> {submitting ? "Saving..." : "Save Fund"}
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

/* ---------------- REUSABLE INPUTS ---------------- */
const Input = ({ label, error, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className={`mt-2 w-full p-3 bg-gray-50 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const NumberInput = (props) => <Input {...props} type="number" min="0" />;

const Textarea = ({ label, ...props }) => (
  <div className={props.className}>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea
      {...props}
      className="mt-2 w-full p-3 bg-gray-50 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);
