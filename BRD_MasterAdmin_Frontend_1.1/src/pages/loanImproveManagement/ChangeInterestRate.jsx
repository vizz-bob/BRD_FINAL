import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import { productManagementService } from "../../services/productManagementService";

const ChangeInterestRate = () => {
  const navigate = useNavigate();
  const { loanId } = useParams(); // actually product id

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FORM STATE ---------------- */
  const [form, setForm] = useState({
    revised_rate: "",
    effective_date: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- LOAD PRODUCT ---------------- */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await productManagementService.getProduct(loanId);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [loanId]);

  /* ---------------- VALIDATION ---------------- */
  const validate = (v) => {
    const e = {};
    if (v.revised_rate === "") e.revised_rate = "Revised interest rate is required";
    else if (+v.revised_rate <= 0) e.revised_rate = "Interest rate must be greater than 0";
    if (!v.effective_date) e.effective_date = "Effective date is required";
    return e;
  };

  const hasErrors = useMemo(() => Object.keys(validate(form)).length > 0, [form]);

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
    setTouched({ revised_rate: true, effective_date: true });
    if (Object.keys(validationErrors).length) return;

    setSubmitting(true);
    try {
      // TODO: call loanImprovementService with product info
      // Example payload:
      // const payload = {
      //   product_id: loanId,
      //   change_type: "INTEREST_RATE",
      //   old_value: product.interest_rate, // or whatever field you store
      //   new_value: Number(form.revised_rate),
      //   effective_date: form.effective_date,
      // };
      // await loanImprovementService.createChange(payload);

      navigate(`/loan-improvement/${loanId}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <MainLayout>
        <p className="text-gray-500">Loading product details...</p>
      </MainLayout>
    );

  if (!product)
    return (
      <MainLayout>
        <p className="text-gray-500">Product not found.</p>
      </MainLayout>
    );

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
          <h1 className="text-xl font-semibold">Change in Rate of Interest</h1>
          <p className="text-sm text-gray-500">Update interest rate for selected product</p>
        </div>
      </div>

      {/* PRODUCT SNAPSHOT */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <Info label="Product Name" value={product.product_name} />
        <Info label="Category" value={product.product_category} />
        <Info label="Type" value={product.product_type} />
        <Info label="Amount" value={`₹${Number(product.product_amount).toLocaleString()}`} />
        <Info label="Period" value={`${product.product_period_value} ${product.product_period_unit}`} />
        <Info label="Status" value={product.is_active ? "Active" : "Inactive"} />
      </div>

      {/* FORM */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Revised Interest Rate (%)"
            type="number"
            name="revised_rate"
            value={form.revised_rate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.revised_rate}
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

export default ChangeInterestRate;

/* ---------------- SMALL UI HELPERS ---------------- */
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

const InputField = ({ label, type = "text", name, value, onChange, onBlur, error }) => (
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
