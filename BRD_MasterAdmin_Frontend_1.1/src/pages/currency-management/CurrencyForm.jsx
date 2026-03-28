import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import {
  SubPageHeader,
  InputField,
  SelectField,
  Button,
} from "../../components/Controls/SharedUIHelpers";

import currencyManagementService from "../../services/currencyManagementService";

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

/* ================= COMPONENT ================= */

export default function CurrencyForm({ isEdit = false }) {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const [form, setForm] = useState({
    currency_code: "",
    currency_symbol: "",
    conversion_value_to_inr: "",
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
          currency_symbol: res.currency_symbol || "",
          conversion_value_to_inr: res.conversion_value_to_inr || "",
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
    <MainLayout>
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
        <SelectField
          label="Currency Code"
          value={form.currency_code}
          onChange={(e) =>
            handleChange("currency_code", e.target.value)
          }
          options={CURRENCY_OPTIONS}
          placeholder="Select currency"
        />

        <InputField
          label="Currency Symbol"
          value={form.currency_symbol}
          onChange={(e) =>
            handleChange("currency_symbol", e.target.value)
          }
          placeholder="₹, $, €"
        />

        <InputField
          label="Conversion Value to INR"
          type="number"
          value={form.conversion_value_to_inr}
          onChange={(e) =>
            handleChange("conversion_value_to_inr", Number(e.target.value))
          }
          placeholder="0.00"
        />

        <SelectField
          label="Status"
          value={form.status}
          onChange={(e) =>
            handleChange("status", e.target.value)
          }
          options={STATUS_OPTIONS}
        />

        {error && (
          <div className="md:col-span-2 text-sm text-red-600">
            {error}
          </div>
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
    </MainLayout>
  );
}
