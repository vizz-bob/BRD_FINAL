import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSave } from "react-icons/fi";

import MainLayout from "../../layout/MainLayout";
import { approvalMasterService } from "../../services/approvalMasterService";

import {
  SubPageHeader,
  InputField,
  SelectField,
  Button,
} from "../../components/Controls/SharedUIHelpers";

/* ================= OPTIONS ================= */

const LEVELS = [
  { label: "L1", value: "L1" },
  { label: "L2", value: "L2" },
  { label: "L3", value: "L3" },
  { label: "L4", value: "L4" },
  { label: "FINAL", value: "FINAL" },
];

const TYPES = [
  { label: "Individual", value: "INDIVIDUAL" },
  { label: "Team", value: "TEAM" },
];

const STATUS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

/* ================= MAIN ================= */

export default function AddApproval() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    level: "",
    type: "",
    product_type: "",
    product_name: "",
    sanction_name: "",
    rate_inc: "",
    rate_dec: "",
    fees_inc: "",
    fees_dec: "",
    tenure_inc: "",
    tenure_dec: "",
    moratorium_interest: "",
    moratorium_period: "",
    approval_range: "",
    status: "ACTIVE",
  });

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await approvalMasterService.createApproval(form);
    navigate("/approvals");
  };

  return (
    <MainLayout>
      {/* ================= HEADER ================= */}
      <SubPageHeader
        title="Add Approval"
        subtitle="Create approval rule"
        onBack={() => navigate(-1)}
      />

      {/* ================= FORM ================= */}
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-5xl space-y-10">

        {/* ===== BASIC DETAILS ===== */}
        <Section title="Basic Details">
          <SelectField
            label="Level"
            value={form.level}
            options={LEVELS}
            placeholder="Select level"
            onChange={(e) => handleChange("level", e.target.value)}
          />

          <SelectField
            label="Type"
            value={form.type}
            options={TYPES}
            placeholder="Select type"
            onChange={(e) => handleChange("type", e.target.value)}
          />

          <InputField
            label="Product Type"
            value={form.product_type}
            onChange={(e) =>
              handleChange("product_type", e.target.value)
            }
          />

          <InputField
            label="Product Name"
            value={form.product_name}
            onChange={(e) =>
              handleChange("product_name", e.target.value)
            }
          />

          <InputField
            label="Sanction Name"
            value={form.sanction_name}
            onChange={(e) =>
              handleChange("sanction_name", e.target.value)
            }
          />
        </Section>

        {/* ===== RATE & FEES ===== */}
        <Section title="Rate & Fees">
          <InputField
            label="Rate Increase (%)"
            type="number"
            value={form.rate_inc}
            onChange={(e) => handleChange("rate_inc", e.target.value)}
          />

          <InputField
            label="Rate Decrease (%)"
            type="number"
            value={form.rate_dec}
            onChange={(e) => handleChange("rate_dec", e.target.value)}
          />

          <InputField
            label="Fees Increase"
            type="number"
            value={form.fees_inc}
            onChange={(e) => handleChange("fees_inc", e.target.value)}
          />

          <InputField
            label="Fees Decrease"
            type="number"
            value={form.fees_dec}
            onChange={(e) => handleChange("fees_dec", e.target.value)}
          />
        </Section>

        {/* ===== TENURE & MORATORIUM ===== */}
        <Section title="Tenure & Moratorium">
          <InputField
            label="Tenure Increase"
            type="number"
            value={form.tenure_inc}
            onChange={(e) => handleChange("tenure_inc", e.target.value)}
          />

          <InputField
            label="Tenure Decrease"
            type="number"
            value={form.tenure_dec}
            onChange={(e) => handleChange("tenure_dec", e.target.value)}
          />

          <InputField
            label="Moratorium Interest"
            type="number"
            value={form.moratorium_interest}
            onChange={(e) =>
              handleChange("moratorium_interest", e.target.value)
            }
          />

          <InputField
            label="Moratorium Period"
            type="number"
            value={form.moratorium_period}
            onChange={(e) =>
              handleChange("moratorium_period", e.target.value)
            }
          />

          <InputField
            label="Approval Range"
            type="number"
            value={form.approval_range}
            onChange={(e) =>
              handleChange("approval_range", e.target.value)
            }
          />

          <SelectField
            label="Status"
            value={form.status}
            options={STATUS}
            onChange={(e) => handleChange("status", e.target.value)}
          />
        </Section>

        {/* ===== ACTION ===== */}
        <div className="flex justify-end">
          <Button
            label="Save Approval"
            icon={<FiSave />}
            onClick={handleSubmit}
            size="lg"
          />
        </div>
      </div>
    </MainLayout>
  );
}

/* ================= SECTION WRAPPER ================= */

const Section = ({ title, children }) => (
  <div>
    <h3 className="mb-4 text-sm font-semibold text-gray-700">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);
