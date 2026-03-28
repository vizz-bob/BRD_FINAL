import React, { useEffect, useState } from "react";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

/* ===== SHARED UI ===== */
import {
  InputField,
  SelectField,
} from "../../../../components/master/Controls/SharedUIHelpers";

/* ===== SERVICE ===== */
import { obligationsManagementService } from "../../../../services/eligibilityManagementService";

/* ─────────────────── DROPDOWN OPTIONS ─────────────────── */

const LOAN_STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Closed", value: "Closed" },
  { label: "Settled", value: "Settled" },
  { label: "Defaulted", value: "Defaulted" },
  { label: "Written Off", value: "Written Off" },
  { label: "NPA", value: "NPA" },
];

const LOAN_PERFORMANCE_OPTIONS = [
  { label: "Good", value: "Good" },
  { label: "Average", value: "Average" },
  { label: "Poor", value: "Poor" },
];

const CREDIT_CARD_STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Closed", value: "Closed" },
  { label: "Delinquent", value: "Delinquent" },
];

const CREDIT_CARD_PERFORMANCE_OPTIONS = [
  { label: "Good", value: "Good" },
  { label: "Delayed Payments", value: "Delayed Payments" },
  { label: "Overlimit", value: "Overlimit" },
];

const CARD_TYPE_OPTIONS = [
  { label: "Credit Card", value: "Credit Card" },
  { label: "Charge Card", value: "Charge Card" },
  { label: "Store Card", value: "Store Card" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

/* ─────────────────── SECTION HEADER ─────────────────── */
const SectionHeader = ({ title }) => (
  <div className="md:col-span-2 mt-2">
    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
      {title}
    </h2>
    <hr />
  </div>
);

/* ─────────────────── TOGGLE FIELD ─────────────────── */
const ToggleField = ({ label, name, checked, onChange, helperText }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="flex items-center gap-3 mt-1">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange({ target: { name, value: !checked } })}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-sm text-gray-600">{checked ? "Yes" : "No"}</span>
    </div>
    {helperText && <p className="text-xs text-gray-400 mt-1">{helperText}</p>}
  </div>
);

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
const ExistingObligationForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    // Mandatory — Loan
    loan_status: "",
    loan_performance: "",
    total_loans: "",
    emi_amount: "",

    // Mandatory — Credit Card
    credit_card_status: "",
    credit_card_performance: "",

    // Mandatory — Record Status
    is_active: true,

    // Optional
    card_type: "",
    ignore_rule: false,
  });

  /* ================= FETCH (EDIT MODE) ================= */
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await obligationsManagementService.retrieve(id);
        if (data) {
          setForm({
            loan_status:              data.loan_status || "",
            loan_performance:         data.loan_performance || "",
            total_loans:              data.total_loans || "",
            emi_amount:               data.emi_amount || "",
            credit_card_status:       data.credit_card_status || "",
            credit_card_performance:  data.credit_card_performance || "",
            is_active:                data.is_active ?? true,
            card_type:                data.card_type || "",
            ignore_rule:              data.ignore_rule ?? false,
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEdit, id]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "is_active") {
      setForm((prev) => ({ ...prev, is_active: value === "true" }));
      return;
    }

    if (name === "ignore_rule") {
      setForm((prev) => ({ ...prev, ignore_rule: Boolean(value) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const payload = {
      ...form,
      total_loans: form.total_loans === "" ? null : Number(form.total_loans),
      emi_amount:  form.emi_amount === "" ? null : Number(form.emi_amount),
    };

    try {
      if (isEdit) {
        await obligationsManagementService.update(id, payload);
      } else {
        await obligationsManagementService.create(payload);
      }
      navigate("/obligation");
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition shadow-sm"
        >
          <FiArrowLeft className="text-gray-700 text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Edit" : "Add"} Existing Obligation
          </h1>
          <p className="text-gray-500 text-sm">
            Configure loan and credit card obligations
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          {/* ══ SECTION 1: Loan Obligations ══ */}
          <SectionHeader title="Loan Obligations" />

          <SelectField
            label="Status of Loan"
            name="loan_status"
            value={form.loan_status}
            onChange={handleChange}
            options={LOAN_STATUS_OPTIONS}
            placeholder="Select loan status"
            required
            error={errors.loan_status}
          />

          <SelectField
            label="Loan Performance"
            name="loan_performance"
            value={form.loan_performance}
            onChange={handleChange}
            options={LOAN_PERFORMANCE_OPTIONS}
            placeholder="Select performance"
            required
            error={errors.loan_performance}
          />

          <InputField
            label="Total Loans"
            name="total_loans"
            type="number"
            value={form.total_loans}
            onChange={handleChange}
            placeholder="Count of active loans"
            required
            error={errors.total_loans}
          />

          <InputField
            label="EMI Amount"
            name="emi_amount"
            type="number"
            step="0.01"
            value={form.emi_amount}
            onChange={handleChange}
            placeholder="Monthly EMI commitment"
            required
            error={errors.emi_amount}
          />

          {/* ══ SECTION 2: Credit Card Obligations ══ */}
          <SectionHeader title="Credit Card Obligations" />

          <SelectField
            label="Status of Credit Card"
            name="credit_card_status"
            value={form.credit_card_status}
            onChange={handleChange}
            options={CREDIT_CARD_STATUS_OPTIONS}
            placeholder="Select credit card status"
            required
            error={errors.credit_card_status}
          />

          <SelectField
            label="Credit Card Performance"
            name="credit_card_performance"
            value={form.credit_card_performance}
            onChange={handleChange}
            options={CREDIT_CARD_PERFORMANCE_OPTIONS}
            placeholder="Select performance"
            required
            error={errors.credit_card_performance}
          />

          <SelectField
            label="Card Type"
            name="card_type"
            value={form.card_type}
            onChange={handleChange}
            options={CARD_TYPE_OPTIONS}
            placeholder="Select card type"
            error={errors.card_type}
          />

          {/* ══ SECTION 3: Rule & Status ══ */}
          <SectionHeader title="Rule & Status" />

          <SelectField
            label="Status"
            name="is_active"
            value={form.is_active ? "true" : "false"}
            onChange={handleChange}
            options={STATUS_OPTIONS}
            required
          />

          <ToggleField
            label="Ignore Rule"
            name="ignore_rule"
            checked={form.ignore_rule}
            onChange={handleChange}
            helperText="Exclude this obligation from the total FOIR calculation"
          />

          {/* ══ SUBMIT ══ */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-md disabled:opacity-60"
            >
              <FiSave />
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Obligation"
                : "Save Obligation"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ExistingObligationForm;