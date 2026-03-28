import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import subscriptionService from "../../services/subscriptionService";
import { FiSave } from "react-icons/fi";

import {
  SubPageHeader,
  FormCard,
  InputField,
  SelectField,
  Button,
} from "../../components/Controls/SharedUIHelpers";


export default function AddSubscription() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subscription_name: "",
    subscription_amount: "",
    no_of_borrowers: "",
    no_of_users: "",
    subscription_type: "MONTHLY",
    valid_from: "",
    valid_to: "",
    created_user: "master_admin",
    modified_user: "master_admin",
    isDeleted: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    try {
      await subscriptionService.create(form);
      navigate("/subscriptions/list");
    } catch (err) {
      setErrors(err?.response?.data || "Failed to save subscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>

      {/* ================= HEADER ================= */}
      <SubPageHeader
        title="Add New Subscription"
        subtitle="Enter subscription details to create a new plan."
        onBack={() => navigate(-1)}
      />

      {/* ================= FORM ================= */}
      <FormCard className="max-w-4xl">

        {errors && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">
            {typeof errors === "string"
              ? errors
              : JSON.stringify(errors)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <InputField
              label="Subscription Name *"
              name="subscription_name"
              value={form.subscription_name}
              onChange={handleChange}
            />

            <InputField
              label="Amount (₹) *"
              name="subscription_amount"
              type="number"
              value={form.subscription_amount}
              onChange={handleChange}
            />

            <InputField
              label="No. of Borrowers *"
              name="no_of_borrowers"
              type="number"
              value={form.no_of_borrowers}
              onChange={handleChange}
            />

            <InputField
              label="No. of Users *"
              name="no_of_users"
              type="number"
              value={form.no_of_users}
              onChange={handleChange}
            />

            <SelectField
              label="Subscription Type *"
              name="subscription_type"
              value={form.subscription_type}
              onChange={handleChange}
              options={[
                { label: "Monthly", value: "MONTHLY" },
                { label: "Quarterly", value: "QUARTERLY" },
                { label: "Annual", value: "ANNUAL" },
              ]}
            />

            <InputField
              label="Valid From *"
              name="valid_from"
              type="date"
              value={form.valid_from}
              onChange={handleChange}
            />

            <InputField
              label="Valid To *"
              name="valid_to"
              type="date"
              value={form.valid_to}
              onChange={handleChange}
            />

          </div>

          {/* ================= ACTION ================= */}
          <div className="flex justify-end">
            <Button
              type="submit"
              icon={<FiSave />}
              label={loading ? "Saving..." : "Save Subscription"}
              disabled={loading}
              size="lg"
            />
          </div>
        </form>
      </FormCard>
    </MainLayout>
  );
}
