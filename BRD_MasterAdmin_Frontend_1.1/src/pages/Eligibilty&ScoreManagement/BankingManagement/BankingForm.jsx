import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave } from "react-icons/fi";

/* ===== SERVICES ===== */
import { bankingManagementService } from "../../../services/eligibilityManagementService";

/* ===== SHARED UI ===== */
import {
  SubPageHeader,
  FormCard,
  InputField,
  SelectField,
  Button,
} from "../../../components/Controls/SharedUIHelpers";

/* ===== OPTIONS ===== */
const STATUS_OPTIONS = ["Active", "Inactive"];

export default function BankingForm({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();

  /* ===== FORM STATE ===== */
  const [form, setForm] = useState({
    bank_account_type: "",
    average_banking_from: "",
    average_banking_to: "",
    average_banking_criteria: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  /* ================= LOAD EDIT DATA ================= */
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchBankingRule = async () => {
      setLoading(true);
      try {
        const data = await bankingManagementService.retrieve(id);

        if (data) {
          setForm({
            bank_account_type: data.bank_account_type || "",
            average_banking_from: data.average_banking_from || "",
            average_banking_to: data.average_banking_to || "",
            average_banking_criteria: data.average_banking_criteria || "",
            is_active: data.is_active ?? true,
          });
        }
      } catch (error) {
        console.error("Failed to load banking rule", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBankingRule();
  }, [isEdit, id]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "is_active"
          ? value === "Active"
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      bank_account_type: form.bank_account_type,
      average_banking_from: form.average_banking_from,
      average_banking_to: form.average_banking_to,
      average_banking_criteria: form.average_banking_criteria,
      is_active: form.is_active,
    };

    try {
      if (isEdit && id) {
        await bankingManagementService.update(id, payload);
      } else {
        await bankingManagementService.create(payload);
      }

      navigate("/banking");
    } catch (error) {
      console.error("Error saving banking rule", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <MainLayout>
      <SubPageHeader
        title={isEdit ? "Edit Banking Rule" : "Add Banking Rule"}
        subtitle="Define banking eligibility criteria"
        onBack={() => navigate(-1)}
      />

      <FormCard className="max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <InputField
            label="Bank Account Type"
            name="bank_account_type"
            value={form.bank_account_type}
            onChange={handleChange}
            required
          />

          <InputField
            label="Average Banking Criteria"
            name="average_banking_criteria"
            placeholder="Last 6 Months"
            value={form.average_banking_criteria}
            onChange={handleChange}
            required
          />

          <InputField
            label="Average Banking From"
            name="average_banking_from"
            type="date"
            value={form.average_banking_from}
            onChange={handleChange}
            required
          />

          <InputField
            label="Average Banking To"
            name="average_banking_to"
            type="date"
            value={form.average_banking_to}
            onChange={handleChange}
            required
          />


          <SelectField
            label="Status"
            name="is_active"
            value={form.is_active ? "Active" : "Inactive"}
            onChange={handleChange}
            options={STATUS_OPTIONS}
          />

          {/* ===== ACTION ===== */}
          <div className="md:col-span-2 flex justify-end pt-4">
            <Button
              type="submit"
              icon={<FiSave />}
              label={isEdit ? "Update Banking Rule" : "Save Banking Rule"}
              loading={loading}
            />
          </div>
        </form>
      </FormCard>
    </MainLayout>
  );
}
