
import React, { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import {
  SubPageHeader,
  InputField,
  SelectField,
  Button,
} from "../../../components/master/Controls/SharedUIHelpers";

import currencyManagementService from "../../../services/currencyManagementService";

/* ================= CONSTANTS ================= */

const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

const CURRENCY_OPTIONS = [
  { label: "INR", value: "INR" },
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
];

const TIMEZONE_OPTIONS = [
  { label: "Asia/Kolkata (IST)", value: "Asia/Kolkata" },
  { label: "America/New_York (EST)", value: "America/New_York" },
  { label: "America/Los_Angeles (PST)", value: "America/Los_Angeles" },
  { label: "Europe/London (GMT)", value: "Europe/London" },
  { label: "Europe/Paris (CET)", value: "Europe/Paris" },
  { label: "Asia/Dubai (GST)", value: "Asia/Dubai" },
  { label: "Asia/Singapore (SGT)", value: "Asia/Singapore" },
  { label: "Asia/Tokyo (JST)", value: "Asia/Tokyo" },
  { label: "Australia/Sydney (AEST)", value: "Australia/Sydney" },
  { label: "UTC", value: "UTC" },
];

const ROUNDING_RULE_OPTIONS = [
  { label: "Round to Nearest (Standard)", value: "ROUND_NEAREST" },
  { label: "Round Up", value: "ROUND_UP" },
  { label: "Round Down", value: "ROUND_DOWN" },
];

/* ================= COMPONENT ================= */

export default function CurrencyForm({ isEdit = false }) {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const [form, setForm] = useState({
    currency_code: "",
    currency_name: "",
    currency_symbol: "",
    conversion_value_to_inr: "",
    time_zone: "",
    decimal_places: "",
    rounding_rule: "",
    effective_date: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- LOAD (EDIT MODE) ---------------- */
  useEffect(() => {
    if (!isEdit || !uuid) return;

    setLoading(true);
    currencyManagementService
      .getOne(uuid)
      .then((res) => {
        setForm({
          currency_code: res.currency_code || "",
          currency_name: res.currency_name || "",
          currency_symbol: res.currency_symbol || "",
          conversion_value_to_inr: res.conversion_value_to_inr || "",
          time_zone: res.time_zone || "",
          decimal_places: res.decimal_places || "",
          rounding_rule: res.rounding_rule || "",
          effective_date: res.effective_date || "",
          status: res.status || "Active",
        });
      })
      .catch(() => setError("Failed to load currency details"))
      .finally(() => setLoading(false));
  }, [isEdit, uuid]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      isEdit
        ? await currencyManagementService.update(uuid, form)
        : await currencyManagementService.create(form);

      navigate("/currency-management");
    } catch {
      setError("Failed to save currency. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <SubPageHeader
        title={isEdit ? "Edit Currency" : "Add Currency"}
        subtitle="Configure currency conversion values"
        onBack={() => navigate(-1)}
      />

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md max-w-4xl
                   grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* ---- Section 1: Basic Currency Details ---- */}
        <div className="md:col-span-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Basic Currency Details
          </h2>
          <hr />
        </div>

        <SelectField
          label="Currency Code"
          value={form.currency_code}
          onChange={(e) => handleChange("currency_code", e.target.value)}
          options={CURRENCY_OPTIONS}
          placeholder="Select currency"
          required
        />

        <InputField
          label="Currency Name"
          value={form.currency_name}
          onChange={(e) => handleChange("currency_name", e.target.value)}
          placeholder="e.g. Indian Rupee"
          required
        />

        <InputField
          label="Currency Symbol"
          value={form.currency_symbol}
          onChange={(e) => handleChange("currency_symbol", e.target.value)}
          placeholder="₹, $, €"
          required
        />

        <InputField
          label="Conversion Value to INR"
          type="number"
          value={form.conversion_value_to_inr}
          onChange={(e) =>
            handleChange("conversion_value_to_inr", Number(e.target.value))
          }
          placeholder="0.00"
          required
        />

        {/* ---- Section 2: Globalization & UI Settings ---- */}
        <div className="md:col-span-2 mt-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Globalization & UI Settings
          </h2>
          <hr />
        </div>

        <SelectField
          label="Time Zone"
          value={form.time_zone}
          onChange={(e) => handleChange("time_zone", e.target.value)}
          options={TIMEZONE_OPTIONS}
          placeholder="Select time zone"
          required
        />

        <InputField
          label="Decimal Places"
          type="number"
          value={form.decimal_places}
          onChange={(e) =>
            handleChange("decimal_places", Number(e.target.value))
          }
          placeholder="e.g. 2"
          required
        />

        <SelectField
          label="Rounding Rule"
          value={form.rounding_rule}
          onChange={(e) => handleChange("rounding_rule", e.target.value)}
          options={ROUNDING_RULE_OPTIONS}
          placeholder="Select rounding rule"
          required
        />

        {/* ---- Section 3: System & Audit Fields ---- */}
        <div className="md:col-span-2 mt-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            System & Audit Fields
          </h2>
          <hr />
        </div>

        <InputField
          label="Effective Date"
          type="date"
          value={form.effective_date}
          onChange={(e) => handleChange("effective_date", e.target.value)}
          required
        />

        <SelectField
          label="Status"
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
          options={STATUS_OPTIONS}
          required
        />

        {error && (
          <div className="md:col-span-2 text-sm text-red-600">{error}</div>
        )}

        {/* ================= ACTION ================= */}
        <div className="md:col-span-2 flex justify-end pt-4">
          <Button
            type="submit"
            label={loading ? "Saving..." : "Save Currency"}
            icon={<FiSave />}
            disabled={loading}
            variant="primary"
            size="lg"
          />
        </div>
      </form>
    </>
  );
}
