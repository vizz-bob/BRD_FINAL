import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const VINTAGE_UNITS = ["Months", "Years"];

const TopUpManagement = () => {
  const navigate = useNavigate();
  const { loanId } = useParams();

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FORM STATE ---------------- */
  const [form, setForm] = useState({
    topup_limit: "",
    loan_vintage_value: "",
    loan_vintage_unit: "Months",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- LOAD LOAN CONTEXT ---------------- */
  useEffect(() => {
    (async () => {
      try {
        // MOCK DATA – BACKEND READY
        setLoan({
          loan_no: "LN-0001",
          customer: "Rahul Sharma",
          product: "Personal Loan",
          disbursed_amount: 300000,
          tenure: "36 Months",

          topup: {
            allowed: true,
            current_limit: 50000,
            min_vintage: "12 Months",
          },

          loan_vintage: {
            value: 14,
            unit: "Months",
          },
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [loanId]);
  
const isEligible = useMemo(() => {
  if (!loan?.loan_vintage || !loan?.topup) return false;

  const requiredVintage = Number(
    loan.topup.min_vintage.split(" ")[0]
  );

  return loan.loan_vintage.value >= requiredVintage;
}, [loan]);


  /* ---------------- VALIDATION ---------------- */
  const validate = (v) => {
    const e = {};
    if (v.topup_limit === "") e.topup_limit = "Top-up limit is required";
    else if (+v.topup_limit <= 0)
      e.topup_limit = "Top-up amount must be greater than 0";

    if (v.loan_vintage_value === "")
      e.loan_vintage_value = "Loan vintage is required";
    else if (+v.loan_vintage_value <= 0)
      e.loan_vintage_value = "Loan vintage must be greater than 0";

    return e;
  };

  const hasErrors = useMemo(
    () => Object.keys(validate(form)).length > 0,
    [form]
  );

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name]) setErrors(validate(updated));
  };

  const handleBlur = (e) => {
    setTouched((p) => ({ ...p, [e.target.name]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({
      topup_limit: true,
      loan_vintage_value: true,
    });

    if (Object.keys(validationErrors).length) return;

    setSubmitting(true);
    try {
      // API CALL
      navigate(`/loan-improvement/${loanId}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-gray-500">Loading loan details...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 shadow-sm"
        >
          <FiArrowLeft className="text-gray-700 text-xl" />
        </button>
        <div>
          <h1 className="text-xl font-semibold">Top-Up Management</h1>
          <p className="text-sm text-gray-500">
            Current top-up status before modification
          </p>
        </div>
      </div>

      {/* ================= TOP CARD ================= */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <Info label="Loan No" value={loan.loan_no} />
          <Info label="Product" value={loan.product} />
          <Info
            label="Disbursed Amount"
            value={`₹${loan.disbursed_amount}`}
          />
          <Info label="Tenure" value={loan.tenure} />
        </div>

        <hr className="border-gray-100" />

        {/* TOP-UP CONTEXT */}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-3">
            Current Top-Up Configuration
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <Info
              label="Top-Up Allowed"
              value={loan.topup.allowed ? "Yes" : "No"}
            />
            <Info
              label="Current Top-Up Limit"
              value={`₹${loan.topup.current_limit}`}
            />
            <Info
              label="Minimum Vintage Required"
              value={loan.topup.min_vintage}
            />
            <Info
              label="Current Loan Vintage"
              value={`${loan.loan_vintage.value} ${loan.loan_vintage.unit}`}
            />
          </div>

          {!isEligible && (
            <p className="mt-3 text-xs text-red-600">
              Loan is currently not eligible for top-up based on vintage.
            </p>
          )}
        </div>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <InputField
            label="Revised Top-Up Limit"
            type="number"
            name="topup_limit"
            value={form.topup_limit}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.topup_limit}
          />

          <InputField
            label="Required Loan Vintage"
            type="number"
            name="loan_vintage_value"
            value={form.loan_vintage_value}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.loan_vintage_value}
          />

          <SelectField
            label="Vintage Unit"
            name="loan_vintage_unit"
            value={form.loan_vintage_unit}
            onChange={handleChange}
            options={VINTAGE_UNITS}
          />

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={hasErrors || submitting}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-white shadow-md ${
                hasErrors || submitting
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <FiSave />
              Submit Change Request
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default TopUpManagement;

/* ---------------- HELPERS ---------------- */

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  onBlur,
  error,
}) => (
  <div className="flex flex-col">
    <label className="text-gray-700 text-sm font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className="mt-2 p-3 rounded-xl bg-gray-50 shadow-sm outline-none"
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
}) => (
  <div className="flex flex-col">
    <label className="text-gray-700 text-sm font-medium">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="mt-2 p-3 rounded-xl bg-gray-50 shadow-sm outline-none"
    >
      {options.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
  </div>
);
