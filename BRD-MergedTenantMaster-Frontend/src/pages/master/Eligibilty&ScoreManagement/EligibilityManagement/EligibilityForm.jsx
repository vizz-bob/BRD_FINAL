import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave } from "react-icons/fi";

import {
  SubPageHeader,
  FormCard,
  InputField,
  SelectField,
  Button,
} from "../../../../components/master/Controls/SharedUIHelpers";

import { eligibilityManagementService } from "../../../../services/eligibilityManagementService";

/* ─────────────────── DROPDOWN OPTIONS ─────────────────── */

const APPLICANT_TYPE_OPTIONS = [
  { label: "Individual", value: "Individual" },
  { label: "Business", value: "Business" },
  { label: "Professional", value: "Professional" },
];

const INCOME_TYPE_OPTIONS = [
  { label: "Salary", value: "Salary" },
  { label: "Business", value: "Business" },
  { label: "Rent", value: "Rent" },
  { label: "Self-Employed", value: "Self-Employed" },
  { label: "Other", value: "Other" },
];

const CATEGORY_OPTIONS = [
  { label: "Salaried", value: "Salaried" },
  { label: "Self-Employed", value: "Self-Employed" },
  { label: "MSME", value: "MSME" },
];

const SALARY_RECEIPT_MODE_OPTIONS = [
  { label: "Cash", value: "Cash" },
  { label: "Bank Transfer", value: "Bank Transfer" },
  { label: "Cheque", value: "Cheque" },
];

const QUALIFICATION_OPTIONS = [
  { label: "Graduate", value: "Graduate" },
  { label: "Postgraduate", value: "Postgraduate" },
  { label: "Professional Degree", value: "Professional Degree" },
  { label: "Diploma", value: "Diploma" },
  { label: "Other", value: "Other" },
];

const EMPLOYER_TYPE_OPTIONS = [
  { label: "Public Sector", value: "Public Sector" },
  { label: "Private Sector", value: "Private Sector" },
  { label: "Government", value: "Government" },
  { label: "PSU", value: "PSU" },
  { label: "Freelancer", value: "Freelancer" },
];

const CONSTITUTION_OPTIONS = [
  { label: "Proprietorship", value: "Proprietorship" },
  { label: "LLP", value: "LLP" },
  { label: "Pvt Ltd", value: "Pvt Ltd" },
  { label: "Partnership", value: "Partnership" },
  { label: "Other", value: "Other" },
];

const OCCUPATION_OPTIONS = [
  { label: "White Collar", value: "White Collar" },
  { label: "Blue Collar", value: "Blue Collar" },
  { label: "Doctor", value: "Doctor" },
  { label: "Lawyer", value: "Lawyer" },
  { label: "Professional", value: "Professional" },
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
const ToggleField = ({ label, name, checked, onChange, required }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
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
      <span className="text-sm text-gray-600">{checked ? "Enabled" : "Disabled"}</span>
    </div>
  </div>
);

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
const EligibilityForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    // ── Mandatory Core Fields ──
    applicant_type: "",
    income_type: "",
    category: "",
    min_age: "",
    max_age: "",
    salary: "",
    pincode: "",
    is_active: true,
    duplicate_pan_check: false,
    data_mismatch_flag: false,

    // ── Profile & Employment ──
    qualification: "",
    employer_type: "",
    constitution: "",
    salary_receipt_mode: "",
    occupation: "",

    // ── Financial & Business ──
    update_turnover: "",
    margin: "",
    business_age: "",
    other_income: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= FETCH FOR EDIT ================= */
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchEligibility = async () => {
      try {
        setLoading(true);
        const data = await eligibilityManagementService.retrieve(id);

        setForm({
          applicant_type:       data.applicant_type ?? "",
          income_type:          data.income_type ?? "",
          category:             data.category ?? "",
          min_age:              data.min_age ?? "",
          max_age:              data.max_age ?? "",
          salary:               data.salary ?? "",
          pincode:              data.pincode ?? "",
          is_active:            data.is_active ?? true,
          duplicate_pan_check:  data.duplicate_pan_check ?? false,
          data_mismatch_flag:   data.data_mismatch_flag ?? false,
          qualification:        data.qualification ?? "",
          employer_type:        data.employer_type ?? "",
          constitution:         data.constitution ?? "",
          salary_receipt_mode:  data.salary_receipt_mode ?? "",
          occupation:           data.occupation ?? "",
          update_turnover:      data.update_turnover ?? "",
          margin:               data.margin ?? "",
          business_age:         data.business_age ?? "",
          other_income:         data.other_income ?? "",
        });
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEligibility();
  }, [isEdit, id]);

  /* ================= CHANGE HANDLER ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "is_active") {
      setForm((prev) => ({ ...prev, is_active: value === "true" }));
      return;
    }

    if (name === "duplicate_pan_check" || name === "data_mismatch_flag") {
      setForm((prev) => ({ ...prev, [name]: Boolean(value) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const toNullableNum = (v) => (v === "" ? null : v);

    const payload = {
      // Mandatory
      applicant_type:       form.applicant_type.trim(),
      income_type:          form.income_type.trim(),
      category:             form.category.trim(),
      min_age:              toNullableNum(form.min_age),
      max_age:              toNullableNum(form.max_age),
      salary:               toNullableNum(form.salary),
      pincode:              form.pincode.trim(),
      is_active:            form.is_active,
      duplicate_pan_check:  form.duplicate_pan_check,
      data_mismatch_flag:   form.data_mismatch_flag,

      // Profile & Employment
      qualification:        form.qualification,
      employer_type:        form.employer_type,
      constitution:         form.constitution,
      salary_receipt_mode:  form.salary_receipt_mode,
      occupation:           form.occupation,

      // Financial
      update_turnover:      toNullableNum(form.update_turnover),
      margin:               form.margin,
      business_age:         toNullableNum(form.business_age),
      other_income:         toNullableNum(form.other_income),
    };

    try {
      setLoading(true);
      if (isEdit && id) {
        await eligibilityManagementService.partialUpdate(id, payload);
      } else {
        await eligibilityManagementService.create(payload);
      }
      navigate("/eligibility");
    } catch (err) {
      console.error("Save error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SubPageHeader
        title={isEdit ? "Edit Eligibility" : "Add Eligibility"}
        subtitle="Configure eligibility rules"
        onBack={() => navigate(-1)}
      />

      <FormCard className="max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* ══ SECTION 1: Mandatory Core Fields ══ */}
          <SectionHeader title="Core Eligibility" />

          <SelectField
            label="Applicant Type"
            name="applicant_type"
            value={form.applicant_type}
            onChange={handleChange}
            options={APPLICANT_TYPE_OPTIONS}
            placeholder="Select applicant type"
            required
          />

          <SelectField
            label="Income Type"
            name="income_type"
            value={form.income_type}
            onChange={handleChange}
            options={INCOME_TYPE_OPTIONS}
            placeholder="Select income type"
            required
          />

          <SelectField
            label="Category (Client Type)"
            name="category"
            value={form.category}
            onChange={handleChange}
            options={CATEGORY_OPTIONS}
            placeholder="Select category"
            required
          />

          <InputField
            label="Monthly Salary / Income"
            name="salary"
            type="number"
            step="0.01"
            value={form.salary}
            onChange={handleChange}
            placeholder="e.g. 50000"
            required
          />

          <InputField
            label="Min Age"
            name="min_age"
            type="number"
            value={form.min_age}
            onChange={handleChange}
            placeholder="e.g. 21"
            required
          />

          <InputField
            label="Max Age"
            name="max_age"
            type="number"
            value={form.max_age}
            onChange={handleChange}
            placeholder="e.g. 60"
            required
          />

          <InputField
            label="Pincode / City"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="e.g. 110001"
            required
          />

          <SelectField
            label="Status"
            name="is_active"
            value={form.is_active ? "true" : "false"}
            onChange={handleChange}
            options={STATUS_OPTIONS}
            required
          />

          {/* ══ SECTION 2: System & Logic Controls ══ */}
          <SectionHeader title="System & Logic Controls" />

          <ToggleField
            label="Duplicate PAN / Aadhaar Check"
            name="duplicate_pan_check"
            checked={form.duplicate_pan_check}
            onChange={handleChange}
            required
          />

          <ToggleField
            label="Data Mismatch Flag"
            name="data_mismatch_flag"
            checked={form.data_mismatch_flag}
            onChange={handleChange}
            required
          />

          {/* ══ SECTION 3: Profile & Employment ══ */}
          <SectionHeader title="Profile & Employment Details" />

          <SelectField
            label="Qualification"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            options={QUALIFICATION_OPTIONS}
            placeholder="Select qualification"
          />

          <SelectField
            label="Employer Type"
            name="employer_type"
            value={form.employer_type}
            onChange={handleChange}
            options={EMPLOYER_TYPE_OPTIONS}
            placeholder="Select employer type"
          />

          <SelectField
            label="Constitution"
            name="constitution"
            value={form.constitution}
            onChange={handleChange}
            options={CONSTITUTION_OPTIONS}
            placeholder="Select constitution"
          />

          <SelectField
            label="Salary Receipt Mode"
            name="salary_receipt_mode"
            value={form.salary_receipt_mode}
            onChange={handleChange}
            options={SALARY_RECEIPT_MODE_OPTIONS}
            placeholder="Select receipt mode"
          />

          <SelectField
            label="Occupation"
            name="occupation"
            value={form.occupation}
            onChange={handleChange}
            options={OCCUPATION_OPTIONS}
            placeholder="Select occupation"
          />

          {/* ══ SECTION 4: Financial & Business ══ */}
          <SectionHeader title="Financial & Business Eligibility" />

          <InputField
            label="Annual Turnover"
            name="update_turnover"
            type="number"
            step="0.01"
            value={form.update_turnover}
            onChange={handleChange}
            placeholder="Required if Business / Self-Employed"
          />

          <InputField
            label="Margin Contribution (%)"
            name="margin"
            type="number"
            step="0.01"
            value={form.margin}
            onChange={handleChange}
            placeholder="e.g. 20"
          />

          <InputField
            label="Business Age (Years)"
            name="business_age"
            type="number"
            step="1"
            value={form.business_age}
            onChange={handleChange}
            placeholder="e.g. 5"
          />

          <InputField
            label="Other Income"
            name="other_income"
            type="number"
            step="0.01"
            value={form.other_income}
            onChange={handleChange}
            placeholder="e.g. 10000"
          />

          {/* ══ ACTIONS ══ */}
          <div className="md:col-span-2 flex justify-end pt-2">
            <Button
              type="submit"
              label={loading ? "Saving..." : isEdit ? "Update" : "Create"}
              icon={<FiSave />}
              size="lg"
              disabled={loading}
            />
          </div>
        </form>
      </FormCard>
    </>
  );
};

export default EligibilityForm;