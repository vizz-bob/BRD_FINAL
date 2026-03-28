import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

// import { loanService } from "../../../../services/loanService";
// import { loanImprovementService } from "../../../../services/loanImprovementService";

const RATIONALISATION_TYPES = [
  "Interest-only",
  "Deferred EMI",
  "Step-up EMI",
  "Step-down EMI",
];

const DURATION_UNITS = ["Days", "Months"];

const RepaymentRationalisation = () => {
  const navigate = useNavigate();
  const { loanId } = useParams();

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FORM STATE ---------------- */
  const [form, setForm] = useState({
    rationalisation_type: "",
    duration_value: "",
    duration_unit: "Months",
    remarks: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- LOAD LOAN CONTEXT ---------------- */
  useEffect(() => {
    (async () => {
      try {
        /*
        const data = await loanService.getLoanById(loanId);
        setLoan(data);
        */

        // TEMP MOCK DATA
        setLoan({
          loan_no: "LN-0001",
          customer: "Rahul Sharma",
          product: "Personal Loan",
          emi: 8500,
          tenure: "36 Months",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [loanId]);

  /* ---------------- VALIDATION ---------------- */
  const validate = (v) => {
    const e = {};

    if (!v.rationalisation_type) {
      e.rationalisation_type = "Please select rationalisation type";
    }

    if (v.duration_value === "") {
      e.duration_value = "Duration is required";
    } else if (+v.duration_value <= 0) {
      e.duration_value = "Duration must be greater than 0";
    }

    if (!v.duration_unit) {
      e.duration_unit = "Duration unit is required";
    }

    if (!v.remarks.trim()) {
      e.remarks = "Remarks are mandatory for audit purpose";
    } else if (v.remarks.length < 10) {
      e.remarks = "Remarks should be at least 10 characters";
    }

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

    if (touched[name]) {
      setErrors(validate(updated));
    }
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
      rationalisation_type: true,
      duration_value: true,
      duration_unit: true,
      remarks: true,
    });

    if (Object.keys(validationErrors).length) return;

    setSubmitting(true);
    try {
      /*
      const payload = {
        loan_id: loanId,
        change_type: "REPAYMENT_RATIONALISATION",
        rationalisation_type: form.rationalisation_type,
        duration: `${form.duration_value} ${form.duration_unit}`,
        remarks: form.remarks,
      };

      await loanImprovementService.createChange(payload);
      */

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

  if (!loan) {
    return (
      <MainLayout>
        <p className="text-gray-500">Loan not found.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition shadow-sm"
        >
          <FiArrowLeft className="text-gray-700 text-xl" />
        </button>

        <div>
          <h1 className="text-xl font-semibold">
            Repayment Rationalisation
          </h1>
          <p className="text-sm text-gray-500">
            Restructure repayment plan for the selected loan
          </p>
        </div>
      </div>

      {/* LOAN SNAPSHOT */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <Info label="Loan No" value={loan.loan_no} />
       
        <Info label="Product" value={loan.product} />
        <Info label="Current EMI" value={`₹${loan.emi}`} />
        <Info label="Tenure" value={loan.tenure} />
      </div>

      {/* FORM */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* TYPE */}
          <SelectField
            label="Rationalisation Type"
            name="rationalisation_type"
            value={form.rationalisation_type}
            onChange={handleChange}
            onBlur={handleBlur}
            options={RATIONALISATION_TYPES}
            error={errors.rationalisation_type}
          />

          {/* DURATION */}
          <InputField
            label="Duration"
            type="number"
            name="duration_value"
            value={form.duration_value}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.duration_value}
          />

          <SelectField
            label="Duration Unit"
            name="duration_unit"
            value={form.duration_unit}
            onChange={handleChange}
            onBlur={handleBlur}
            options={DURATION_UNITS}
            error={errors.duration_unit}
          />

          {/* REMARKS */}
          <TextAreaField
            label="Remarks"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.remarks}
          />

          {/* SUBMIT */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={hasErrors || submitting}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-white shadow-md transition ${
                hasErrors || submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <FiSave />
              {submitting ? "Submitting..." : "Submit Change Request"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default RepaymentRationalisation;

/* ---------------- SMALL UI HELPERS ---------------- */

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

const InputField = ({
  label,
  type = "text",
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
      className="mt-2 p-3 rounded-xl bg-gray-50 focus:bg-white shadow-sm outline-none"
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  error,
}) => (
  <div className="flex flex-col">
    <label className="text-gray-700 text-sm font-medium">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className="mt-2 p-3 rounded-xl bg-gray-50 shadow-sm outline-none"
    >
      <option value="">Select</option>
      {options.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
}) => (
  <div className="flex flex-col md:col-span-2">
    <label className="text-gray-700 text-sm font-medium">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      rows={4}
      className="mt-2 p-3 rounded-xl bg-gray-50 focus:bg-white shadow-sm outline-none resize-none"
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);
