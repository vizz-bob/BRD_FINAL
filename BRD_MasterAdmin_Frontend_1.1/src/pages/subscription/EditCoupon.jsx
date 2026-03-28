import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import couponService from "../../services/couponService";
import subscriptionService from "../../services/subscriptionService";

export default function EditCoupon() {
  const navigate = useNavigate();
  const { uuid } = useParams(); // route param

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const [form, setForm] = useState({
    promotion_name: "",
    no_of_coupons: "",
    coupon_code: "",
    coupon_value: "",
    valid_from: "",
    valid_to: "",
    subscriptions: [],
    created_user: "",
    modified_user: "master_admin",
    is_deleted: false,
  });


  /* ---------------- LOAD SUBSCRIPTIONS ---------------- */
  const loadSubscriptions = async () => {
    try {
      const data = await subscriptionService.getAll();
      setSubscriptions(data);
    } catch (err) {
      console.error("Failed to load subscriptions", err);
    }
  };

  /* ---------------- LOAD COUPON ---------------- */
  const loadCoupon = async () => {
    try {
      const data = await couponService.getOne(uuid);

      setForm({
        promotion_name: data.promotion_name,
        no_of_coupons: data.no_of_coupons,
        coupon_code: data.coupon_code,
        coupon_value: data.coupon_value,
        valid_from: data.valid_from.split("T")[0],
        valid_to: data.valid_to.split("T")[0],
        subscriptions: data.subscriptions ?? [],
        created_user: data.created_user,
        modified_user: "master_admin",
        is_deleted: data.is_deleted,
      });

    } catch (err) {
      console.error("Failed to load coupon:", err);
    }
  };

  useEffect(() => {
    loadSubscriptions();
    loadCoupon();
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleSubscription = (id) => {
    setForm((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.includes(id)
        ? prev.subscriptions.filter((x) => x !== id)
        : [...prev.subscriptions, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    try {
      await couponService.update(uuid, {
        ...form,
        valid_from: `${form.valid_from}T00:00:00+05:30`,
        valid_to: `${form.valid_to}T23:59:59+05:30`,
      });

      navigate("/coupons");
    } catch (err) {
      console.error("Update error:", err);
      setErrors("Failed to update coupon.");
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
          className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200"
        >
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-xl font-semibold">Edit Coupon</h1>
          <p className="text-gray-500 text-sm">Update coupon details</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-4xl">
        {errors && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {errors}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Coupon Code *"
              name="coupon_code"
              value={form.coupon_code}
              onChange={handleChange}
              required
            />

            <InputField
              label="Coupon Value (₹) *"
              name="coupon_value"
              type="number"
              value={form.coupon_value}
              onChange={handleChange}
              required
            />
            <InputField
              label="Promotion Name *"
              name="promotion_name"
              value={form.promotion_name}
              onChange={handleChange}
              required
            />

            <InputField
              label="Number of Coupons *"
              name="no_of_coupons"
              type="number"
              value={form.no_of_coupons}
              onChange={handleChange}
              required
            />


            <InputField
              label="Valid From *"
              name="valid_from"
              type="date"
              value={form.valid_from}
              onChange={handleChange}
              required
            />

            <InputField
              label="Valid To *"
              name="valid_to"
              type="date"
              value={form.valid_to}
              onChange={handleChange}
              required
            />
          </div>

          {/* SUBSCRIPTIONS */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Applicable Subscriptions *
            </label>

            <div className="mt-3 bg-gray-50 p-4 rounded-xl space-y-2">
              {subscriptions.map((sub) => (
                <label
                  key={sub.id}
                  className="flex items-center gap-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={form.subscriptions.includes(sub.id)}
                    onChange={() => toggleSubscription(sub.id)}
                  />
                  {sub.subscription_name}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700"
          >
            <FiSave />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}

/* ---------------- INPUT FIELD ---------------- */
function InputField({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="w-full mt-2 p-3 rounded-xl bg-gray-50 focus:bg-white outline-none text-sm"
      />
    </div>
  );
}
