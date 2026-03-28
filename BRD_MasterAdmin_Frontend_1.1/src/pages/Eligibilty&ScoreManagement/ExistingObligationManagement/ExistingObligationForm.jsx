import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

/* ===== SHARED UI ===== */
import {
  InputField,
  SelectField,
} from "../../../components/Controls/SharedUIHelpers";

/* ===== SERVICE ===== */
import { obligationsManagementService } from "../../../services/eligibilityManagementService";

/* STATUS OPTIONS (ONLY SELECT ALLOWED) */
const STATUS_OPTIONS = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

const ExistingObligationForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // used in edit mode

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    loan_status: "",
    loan_performance: "",
    card_type: "",
    credit_card_status: "",
    credit_card_performance: "",
    total_loans: "",
    is_active: true,
  });

  /* ================= FETCH (EDIT MODE) ================= */
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchData = async () => {
      setLoading(true);
      const data = await obligationsManagementService.retrieve(id);
      if (data) {
        setForm({
          loan_status: data.loan_status || "",
          loan_performance: data.loan_performance || "",
          card_type: data.card_type || "",
          credit_card_status: data.credit_card_status || "",
          credit_card_performance: data.credit_card_performance || "",
          total_loans: data.total_loans || "",
          is_active: data.is_active,
        });
      }
      setLoading(false);
    };

    fetchData();
  }, [isEdit, id]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setForm((prev) => ({ ...prev, is_active: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const payload = {
      ...form,
      total_loans: Number(form.total_loans),
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
          <InputField
            label="Loan Status"
            name="loan_status"
            value={form.loan_status}
            onChange={handleChange}
            error={errors.loan_status}
          />

          <InputField
            label="Loan Performance"
            name="loan_performance"
            value={form.loan_performance}
            onChange={handleChange}
            error={errors.loan_performance}
          />

          <InputField
            label="Card Type"
            name="card_type"
            value={form.card_type}
            onChange={handleChange}
            error={errors.card_type}
          />

          <InputField
            label="Credit Card Status"
            name="credit_card_status"
            value={form.credit_card_status}
            onChange={handleChange}
            error={errors.credit_card_status}
          />

          <InputField
            label="Credit Card Performance"
            name="credit_card_performance"
            value={form.credit_card_performance}
            onChange={handleChange}
            error={errors.credit_card_performance}
          />

          <InputField
            label="Total Loans"
            name="total_loans"
            type="number"
            value={form.total_loans}
            onChange={handleChange}
            error={errors.total_loans}
          />

          {/* ONLY SELECT */}
          <SelectField
            label="Status"
            value={form.is_active}
            onChange={handleStatusChange}
            options={STATUS_OPTIONS}
          />

          {/* SUBMIT */}
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
    </MainLayout>
  );
};

export default ExistingObligationForm;
