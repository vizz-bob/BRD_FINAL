import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { useNavigate } from "react-router-dom";

import couponService from "../../services/couponService";
import subscriptionService from "../../services/subscriptionService";

import {
  SubPageHeader,
  InputField,
  MultiSelectField,
  Button,
  FormCard,
} from "../../components/Controls/SharedUIHelpers";

export default function AddCoupon() {
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const [form, setForm] = useState({
    coupon_code: "",
    coupon_value: "",
    promotion_name: "",
    no_of_coupons: "",
    valid_from: "",
    valid_to: "",
    subscriptions: [],
    created_user: "master_admin",
    modified_user: "master_admin",
    is_deleted: false,
  });

  /* ---------------- LOAD SUBSCRIPTIONS ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await subscriptionService.getAll();
        const data = Array.isArray(res) ? res : res?.results || [];
        setSubscriptions(
          data.map((s) => ({
            label: s.subscription_name,
            value: s.id,
          }))
        );
      } catch (err) {
        console.error("Failed to load subscriptions", err);
      }
    })();
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors("");

    try {
      await couponService.create({
        ...form,
        valid_from: `${form.valid_from}T00:00:00+05:30`,
        valid_to: `${form.valid_to}T23:59:59+05:30`,
      });

      navigate("/coupons");
    } catch (err) {
      console.error("Coupon Save Error:", err.response?.data || err);
      setErrors("Something went wrong while saving coupon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>

      {/* HEADER */}
      <SubPageHeader
        title="Add New Coupon"
        subtitle="Create a new discount coupon"
        onBack={() => navigate(-1)}
      />

      <FormCard className="max-w-4xl">
        {errors && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {errors}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Coupon Code"
              name="coupon_code"
              value={form.coupon_code}
              onChange={handleChange}
              placeholder="FIRST100"
            />

            <InputField
              label="Coupon Value (₹)"
              name="coupon_value"
              type="number"
              value={form.coupon_value}
              onChange={handleChange}
              placeholder="100"
            />

            <InputField
              label="Promotion Name"
              name="promotion_name"
              value={form.promotion_name}
              onChange={handleChange}
              placeholder="NEWYEAR_PROMO"
            />

            <InputField
              label="Number of Coupons"
              name="no_of_coupons"
              type="number"
              value={form.no_of_coupons}
              onChange={handleChange}
              placeholder="100"
            />

            <InputField
              label="Valid From"
              name="valid_from"
              type="date"
              value={form.valid_from}
              onChange={handleChange}
            />

            <InputField
              label="Valid To"
              name="valid_to"
              type="date"
              value={form.valid_to}
              onChange={handleChange}
            />
          </div>

          {/* SUBSCRIPTIONS */}
          <MultiSelectField
            label="Applicable Subscriptions"
            values={form.subscriptions}
            onChange={(values) =>
              setForm({ ...form, subscriptions: values })
            }
            options={subscriptions}
          />

          {/* SUBMIT */}
          <div className="pt-4">
            <Button
              type="submit"
              label={loading ? "Saving..." : "Save Coupon"}
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
            />
          </div>
        </form>
      </FormCard>
    </MainLayout>
  );
}
