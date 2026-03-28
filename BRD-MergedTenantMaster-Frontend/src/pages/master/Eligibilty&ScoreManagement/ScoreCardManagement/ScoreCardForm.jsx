import React, { useEffect, useState } from "react";
import { FiSave, FiUpload } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import {
  SubPageHeader,
  InputField,
  SelectField,
  FormCard,
  Button,
} from "../../../../components/master/Controls/SharedUIHelpers";

import { scoreCardManagementService } from "../../../../services/eligibilityManagementService";

/* ─────────────────── DROPDOWN OPTIONS ─────────────────── */

const IMPACT_TYPE_OPTIONS = [
  { label: "Positive", value: "Positive" },
  { label: "Negative", value: "Negative" },
];

const RISK_IMPACT_OPTIONS = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

const CREDIT_BUREAU_OPTIONS = [
  { label: "CIBIL", value: "CIBIL" },
  { label: "Experian", value: "Experian" },
  { label: "Equifax", value: "Equifax" },
  { label: "CRIF", value: "CRIF" },
];

const REFERENCE_CHECK_CRITERIA_OPTIONS = [
  { label: "Employment", value: "Employment" },
  { label: "Address", value: "Address" },
  { label: "Personal", value: "Personal" },
];

const INVESTIGATION_REPORT_TYPE_OPTIONS = [
  { label: "Legal", value: "Legal" },
  { label: "Technical", value: "Technical" },
  { label: "Fraud", value: "Fraud" },
];

const INVESTIGATION_OUTCOME_OPTIONS = [
  { label: "Clean", value: "Clean" },
  { label: "Flagged", value: "Flagged" },
  { label: "Pending", value: "Pending" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

/* ─────────────────── HELPERS ─────────────────── */

const SectionHeader = ({ title }) => (
  <div className="md:col-span-2 mt-2">
    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
      {title}
    </h2>
    <hr />
  </div>
);

const AuditField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-500">{label}</label>
    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 min-h-[38px]">
      {value || <span className="italic text-gray-300">Auto-generated</span>}
    </div>
  </div>
);

const FileUploadField = ({ label, name, onChange, helperText }) => {
  const [fileName, setFileName] = useState("");
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange({ target: { name, value: file } });
    }
  };
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <label className="flex items-center gap-3 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
        <FiUpload className="text-gray-400 shrink-0" />
        <span className="text-sm text-gray-500 truncate">
          {fileName || "Click to upload PDF"}
        </span>
        <input
          type="file"
          name={name}
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      {helperText && <p className="text-xs text-gray-400 mt-1">{helperText}</p>}
    </div>
  );
};

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
export default function ScoreCardForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // ── Core Configuration ──
    impact_type: "",
    risk_impact: "",
    professionals: "",
    employees: "",
    groups: "",
    corporates: "",
    others: "",

    // ── Credit History ──
    credit_bureau: "",
    credit_score: "",
    delayed_payments: "",
    write_offs_settlements: "",
    no_of_enquiries: "",

    // ── Reference & Investigation ──
    reference_check_criteria: "",
    reference_rating_scale: "",
    investigation_report_type: "",
    investigation_outcome: "",
    investigation_report_pdf: null,

    // ── Geographic & Internal ──
    geo_location: "",
    internal_score: "",

    // ── Status ──
    is_active: true,
  });

  const [audit, setAudit] = useState({
    version_number: "",
    created_at: "",
    updated_at: "",
  });

  /* ================= FETCH (EDIT) ================= */
  useEffect(() => {
    if (!isEdit) return;

    const fetchData = async () => {
      const data = await scoreCardManagementService.retrieve(id);
      if (!data) return;

      setForm({
        impact_type:                data.impact_type || "",
        risk_impact:                data.risk_impact || "",
        professionals:              data.professionals_config?.score || "",
        employees:                  data.employees_config?.score || "",
        groups:                     data.groups_config?.score || "",
        corporates:                 data.corporates_config?.score || "",
        others:                     data.others_config?.score || "",
        credit_bureau:              data.credit_bureau || "",
        credit_score:               data.credit_score || "",
        delayed_payments:           data.delayed_payments || "",
        write_offs_settlements:     data.write_offs_settlements || "",
        no_of_enquiries:            data.no_of_enquiries || "",
        reference_check_criteria:   data.reference_check_criteria || "",
        reference_rating_scale:     data.reference_rating_scale || "",
        investigation_report_type:  data.investigation_report_type || "",
        investigation_outcome:      data.investigation_outcome || "",
        investigation_report_pdf:   null,
        geo_location:               data.geo_location || "",
        internal_score:             data.internal_score || "",
        is_active:                  data.is_active ?? true,
      });

      setAudit({
        version_number: data.version_number || "",
        created_at:     data.created_at || "",
        updated_at:     data.updated_at || "",
      });
    };

    fetchData();
  }, [id, isEdit]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "is_active") {
      setForm((p) => ({ ...p, is_active: value === "true" }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toNum = (v) => (v === "" ? null : Number(v));

    const hasPdf = form.investigation_report_pdf instanceof File;
    let payload;

    if (hasPdf) {
      payload = new FormData();
      const fields = {
        impact_type:               form.impact_type,
        risk_impact:               form.risk_impact,
        professionals_config:      JSON.stringify({ score: toNum(form.professionals) }),
        employees_config:          JSON.stringify({ score: toNum(form.employees) }),
        groups_config:             JSON.stringify({ score: toNum(form.groups) }),
        corporates_config:         JSON.stringify({ score: toNum(form.corporates) }),
        others_config:             JSON.stringify({ score: toNum(form.others) }),
        credit_bureau:             form.credit_bureau,
        credit_score:              toNum(form.credit_score),
        delayed_payments:          toNum(form.delayed_payments),
        write_offs_settlements:    toNum(form.write_offs_settlements),
        no_of_enquiries:           toNum(form.no_of_enquiries),
        reference_check_criteria:  form.reference_check_criteria,
        reference_rating_scale:    toNum(form.reference_rating_scale),
        investigation_report_type: form.investigation_report_type,
        investigation_outcome:     form.investigation_outcome,
        geo_location:              form.geo_location,
        internal_score:            toNum(form.internal_score),
        is_active:                 form.is_active,
      };
      Object.entries(fields).forEach(([k, v]) => {
        if (v !== null && v !== undefined) payload.append(k, v);
      });
      payload.append("investigation_report_pdf", form.investigation_report_pdf);
    } else {
      payload = {
        impact_type:               form.impact_type,
        risk_impact:               form.risk_impact,
        professionals_config:      { score: toNum(form.professionals) },
        employees_config:          { score: toNum(form.employees) },
        groups_config:             { score: toNum(form.groups) },
        corporates_config:         { score: toNum(form.corporates) },
        others_config:             { score: toNum(form.others) },
        credit_bureau:             form.credit_bureau,
        credit_score:              toNum(form.credit_score),
        delayed_payments:          toNum(form.delayed_payments),
        write_offs_settlements:    toNum(form.write_offs_settlements),
        no_of_enquiries:           toNum(form.no_of_enquiries),
        reference_check_criteria:  form.reference_check_criteria,
        reference_rating_scale:    toNum(form.reference_rating_scale),
        investigation_report_type: form.investigation_report_type,
        investigation_outcome:     form.investigation_outcome,
        geo_location:              form.geo_location,
        internal_score:            toNum(form.internal_score),
        is_active:                 form.is_active,
      };
    }

    try {
      if (isEdit) {
        await scoreCardManagementService.update(id, payload);
      } else {
        await scoreCardManagementService.create(payload);
      }
      navigate("/score-card");
    } catch (err) {
      console.error("Save error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <SubPageHeader
        title={`${isEdit ? "Edit" : "Add"} Score Card`}
        subtitle="Configure score card rules"
        onBack={() => navigate(-1)}
      />

      <FormCard className="max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          {/* ══ SECTION 1: Core Configuration ══ */}
          <SectionHeader title="Core Scorecard Configuration" />

          <SelectField
            label="Impact Type"
            name="impact_type"
            value={form.impact_type}
            onChange={handleChange}
            options={IMPACT_TYPE_OPTIONS}
            placeholder="Select impact type"
            required
          />

          <SelectField
            label="Risk Impact"
            name="risk_impact"
            value={form.risk_impact}
            onChange={handleChange}
            options={RISK_IMPACT_OPTIONS}
            placeholder="Select risk impact"
            required
          />

          <InputField
            label="Professionals Score"
            name="professionals"
            type="number"
            value={form.professionals}
            onChange={handleChange}
            placeholder="e.g. 80"
          />

          <InputField
            label="Employees Score"
            name="employees"
            type="number"
            value={form.employees}
            onChange={handleChange}
            placeholder="e.g. 75"
          />

          <InputField
            label="Groups Score"
            name="groups"
            type="number"
            value={form.groups}
            onChange={handleChange}
            placeholder="e.g. 70"
          />

          <InputField
            label="Corporates Score"
            name="corporates"
            type="number"
            value={form.corporates}
            onChange={handleChange}
            placeholder="e.g. 85"
          />

          <InputField
            label="Others Score"
            name="others"
            type="number"
            value={form.others}
            onChange={handleChange}
            placeholder="e.g. 60"
          />

          {/* ══ SECTION 2: Credit History Parameters ══ */}
          <SectionHeader title="Credit History Parameters" />

          <SelectField
            label="Credit Bureau"
            name="credit_bureau"
            value={form.credit_bureau}
            onChange={handleChange}
            options={CREDIT_BUREAU_OPTIONS}
            placeholder="Select bureau"
            required
          />

          <InputField
            label="Credit Score"
            name="credit_score"
            type="number"
            value={form.credit_score}
            onChange={handleChange}
            placeholder="e.g. 750"
            required
          />

          <InputField
            label="Delayed Payments"
            name="delayed_payments"
            type="number"
            value={form.delayed_payments}
            onChange={handleChange}
            placeholder="Count of overdue payments"
            required
          />

          <InputField
            label="Write-offs & Settlements"
            name="write_offs_settlements"
            type="number"
            value={form.write_offs_settlements}
            onChange={handleChange}
            placeholder="Count of write-offs"
            required
          />

          <InputField
            label="No. of Enquiries"
            name="no_of_enquiries"
            type="number"
            value={form.no_of_enquiries}
            onChange={handleChange}
            placeholder="Count of credit enquiries"
            required
          />

          {/* ══ SECTION 3: Reference & Investigation ══ */}
          <SectionHeader title="Reference & Investigation Ratings" />

          <SelectField
            label="Check Criteria (Reference)"
            name="reference_check_criteria"
            value={form.reference_check_criteria}
            onChange={handleChange}
            options={REFERENCE_CHECK_CRITERIA_OPTIONS}
            placeholder="Select criteria"
          />

          <InputField
            label="Rating Scale (Reference)"
            name="reference_rating_scale"
            type="number"
            min="0"
            max="100"
            value={form.reference_rating_scale}
            onChange={handleChange}
            placeholder="Score out of 100"
          />

          <SelectField
            label="Report Type (Investigation)"
            name="investigation_report_type"
            value={form.investigation_report_type}
            onChange={handleChange}
            options={INVESTIGATION_REPORT_TYPE_OPTIONS}
            placeholder="Select report type"
          />

          <SelectField
            label="Investigation Outcome"
            name="investigation_outcome"
            value={form.investigation_outcome}
            onChange={handleChange}
            options={INVESTIGATION_OUTCOME_OPTIONS}
            placeholder="Select outcome"
          />

          <div className="md:col-span-2">
            <FileUploadField
              label="Upload Investigation Report (PDF)"
              name="investigation_report_pdf"
              onChange={handleChange}
              helperText="Optional — attach legal, technical, or fraud report"
            />
          </div>

          {/* ══ SECTION 4: Geographic & Internal Logic ══ */}
          <SectionHeader title="Geographic & Internal Logic" />

          <InputField
            label="Geo Location"
            name="geo_location"
            value={form.geo_location}
            onChange={handleChange}
            placeholder="City, Pincode, or Blacklist Zone"
            required
          />

          <InputField
            label="Internal Score"
            name="internal_score"
            type="number"
            value={form.internal_score}
            onChange={handleChange}
            placeholder="Company-specific score value"
            required
          />

          {/* ══ SECTION 5: Status ══ */}
          <SectionHeader title="Status" />

          <SelectField
            label="Status"
            name="is_active"
            value={form.is_active ? "true" : "false"}
            onChange={handleChange}
            options={STATUS_OPTIONS}
            required
          />

          {/* ══ SECTION 6: Audit Information ══ */}
          <SectionHeader title="Audit Information" />

          <AuditField label="Version Number *" value={audit.version_number} />
          <AuditField label="Created At *"     value={audit.created_at} />
          <AuditField label="Updated At *"     value={audit.updated_at} />

          {/* ══ ACTION ══ */}
          <div className="md:col-span-2">
            <Button
              type="submit"
              fullWidth
              icon={<FiSave />}
              label={loading ? "Saving..." : isEdit ? "Update Score Card" : "Save Score Card"}
              disabled={loading}
            />
          </div>
        </form>
      </FormCard>
    </>
  );
}