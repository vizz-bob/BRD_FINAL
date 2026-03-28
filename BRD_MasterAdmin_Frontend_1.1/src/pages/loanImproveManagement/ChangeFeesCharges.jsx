import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const ChangeFeesCharges = () => {
  const navigate = useNavigate();
  const { loanId } = useParams();

  const [loan, setLoan] = useState(null);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FORM STATE ---------------- */
  const [form, setForm] = useState({
    fee_type: "",
    revised_fee_amount: "",
    effective_date: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    (async () => {
      try {
        // MOCK DATA – BACKEND READY
        setLoan({
          loan_no: "LN-0001",
          customer: "Rahul Sharma",
          product: "Personal Loan",
          emi: 8500,

          current_fees: [
            { id: 1, name: "Processing Fee", amount: 5000 },
            { id: 2, name: "Legal Fee", amount: 2500 },
            { id: 3, name: "Late Payment Fee", amount: 300 },
          ],
        });

        setFees([
          { id: 1, name: "Processing Fee" },
          { id: 2, name: "Legal Fee" },
          { id: 3, name: "Late Payment Fee" },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, [loanId]);

  /* ---------------- DERIVED DATA ---------------- */
  const selectedFee = loan?.current_fees?.find(
    (f) => String(f.id) === String(form.fee_type)
  );

  /* ---------------- VALIDATION ---------------- */
  const validate = (v) => {
    const e = {};
    if (!v.fee_type) e.fee_type = "Please select a fee type";
    if (v.revised_fee_amount === "")
      e.revised_fee_amount = "Revised fee amount is required";
    else if (+v.revised_fee_amount <= 0)
      e.revised_fee_amount = "Fee amount must be greater than 0";
    if (!v.effective_date)
      e.effective_date = "Effective date is required";
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
      fee_type: true,
      revised_fee_amount: true,
      effective_date: true,
    });
    if (Object.keys(validationErrors).length) return;

    setSubmitting(true);
    try {
      // submit API
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
          <h1 className="text-xl font-semibold">Change Fees & Charges</h1>
          <p className="text-sm text-gray-500">
            Current fees before modification
          </p>
        </div>
      </div>

      {/* ================= LOAN SNAPSHOT ================= */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <Info label="Loan No" value={loan.loan_no} />
          <Info label="Customer" value={loan.customer} />
          <Info label="Product" value={loan.product} />
          <Info label="Current EMI" value={`₹${loan.emi}`} />
        </div>

        <hr className="border-gray-100" />

        {/* CURRENT FEES */}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-3">
            Current Fees & Charges
          </p>
          <table className="w-full text-sm border rounded-xl overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2">Fee Type</th>
                <th className="text-right px-4 py-2">Current Amount</th>
              </tr>
            </thead>
            <tbody>
              {loan.current_fees.map((f) => (
                <tr key={f.id} className="border-t">
                  <td className="px-4 py-2">{f.name}</td>
                  <td className="px-4 py-2 text-right font-medium">
                    ₹{f.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <SelectField
            label="Fee Type to Revise"
            name="fee_type"
            value={form.fee_type}
            onChange={handleChange}
            onBlur={handleBlur}
            options={fees}
            error={errors.fee_type}
          />

          {/* CURRENT AMOUNT (AUTO) */}
          <InfoBox
            label="Current Amount"
            value={
              selectedFee ? `₹${selectedFee.amount}` : "Select fee type"
            }
          />

          <InputField
            label="Revised Fee Amount"
            type="number"
            name="revised_fee_amount"
            value={form.revised_fee_amount}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.revised_fee_amount}
          />

          <InputField
            label="Effective Date"
            type="date"
            name="effective_date"
            value={form.effective_date}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.effective_date}
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

export default ChangeFeesCharges;

/* ---------------- HELPERS ---------------- */

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

const InfoBox = ({ label, value }) => (
  <div className="flex flex-col">
    <label className="text-gray-700 text-sm font-medium">{label}</label>
    <div className="mt-2 p-3 rounded-xl bg-gray-100 text-gray-800">
      {value}
    </div>
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
      <option value="">Select fee type</option>
      {options.map((op) => (
        <option key={op.id} value={op.id}>
          {op.name}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);
