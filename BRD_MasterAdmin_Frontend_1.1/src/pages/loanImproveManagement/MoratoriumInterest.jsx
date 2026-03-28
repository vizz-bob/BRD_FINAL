import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

// import { loanService } from "../../../../services/loanService";
// import { loanImprovementService } from "../../../../services/loanImprovementService";

const DURATION_UNITS = ["Days", "Months"];

const MoratoriumInterest = () => {
  const navigate = useNavigate();
  const { loanId } = useParams();

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FORM STATE ---------------- */
  const [form, setForm] = useState({
    revised_interest_rate: "",
    moratorium_period_value: "",
    moratorium_period_unit: "Months",
    effective_date: "",
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
          interest: 12.5,
          emi: 8500,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [loanId]);

  /* ---------------- VALIDATION ---------------- */
  const validate = (v) => {
    const e = {};

    if (v.revised_interest_rate === "") {
      e.revised_interest_rate = "Revised interest rate is required";
    } else if (+v.revised_interest_rate <= 0) {
      e.revised_interest_rate = "Interest rate must be greater than 0";
    }

    if (v.moratorium_period_value === "") {
      e.moratorium_period_value = "Moratorium period is required";
    } else if (+v.moratorium_period_value <= 0) {
      e.moratorium_period_value = "Moratorium period must be greater than 0";
    }

    if (!v.moratorium_period_unit) {
      e.moratorium_period_unit = "Moratorium unit is required";
    }

    if (!v.effective_date) {
      e.effective_date = "Effective date is required";
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
      revised_interest_rate: true,
      moratorium_period_value: true,
      moratorium_period_unit: true,
      effective_date: true,
    });

    if (Object.keys(validationErrors).length) return;

    setSubmitting(true);
    try {
      /*
      const payload = {
        loan_id: loanId,
        change_type: "INTEREST_MORATORIUM",
        revised_interest_rate: Number(form.revised_interest_rate),
        moratorium_period: `${form.moratorium_period_value} ${form.moratorium_period_unit}`,
        effective_date: form.effective_date,
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
            Moratorium of Interest
          </h1>
          <p className="text-sm text-gray-500">
            Apply interest moratorium for the selected loan
          </p>
        </div>
      </div>

      {/* LOAN SNAPSHOT */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <Info label="Loan No" value={loan.loan_no} />
      
        <Info label="Product" value={loan.product} />
        <Info label="Current Interest" value={`${loan.interest}%`} />
        <Info label="Current EMI" value={`₹${loan.emi}`} />
      </div>

      {/* FORM */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* REVISED INTEREST RATE */}
          <InputField
            label="Revised Interest Rate (%)"
            type="number"
            name="revised_interest_rate"
            value={form.revised_interest_rate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.revised_interest_rate}
          />

          {/* MORATORIUM PERIOD */}
          <InputField
            label="Interest Moratorium Period"
            type="number"
            name="moratorium_period_value"
            value={form.moratorium_period_value}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.moratorium_period_value}
          />

          <SelectField
            label="Period Unit"
            name="moratorium_period_unit"
            value={form.moratorium_period_unit}
            onChange={handleChange}
            onBlur={handleBlur}
            options={DURATION_UNITS}
            error={errors.moratorium_period_unit}
          />

          {/* EFFECTIVE DATE */}
          <InputField
            label="Effective Date"
            type="date"
            name="effective_date"
            value={form.effective_date}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.effective_date}
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

export default MoratoriumInterest;

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
