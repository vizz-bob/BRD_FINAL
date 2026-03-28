import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import subscribersService from "../../services/subscriberService";
import subscriptionService from "../../services/subscriptionService";

export default function EditSubscriber() {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const [subscriptions, setSubscriptions] = useState([]);

  const [form, setForm] = useState({
    subscription_id: "",
    tenant_id: "",
    created_user: "",
    modified_user: "master_admin",
    isDeleted: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  // Load subscription dropdown list
  const loadSubscriptions = async () => {
    const res = await subscriptionService.getAll();
    setSubscriptions(res.data);
  };

  // Load existing subscriber data
  const loadSubscriber = async () => {
    const res = await subscribersService.getById(uuid);
    setForm({
      subscription_id: res.data.subscription_id,
      tenant_id: res.data.tenant_id,
      created_user: res.data.created_user,
      modified_user: "master_admin",
      isDeleted: res.data.isDeleted,
    });
  };

  useEffect(() => {
    loadSubscriptions();
    loadSubscriber();
  }, []);

  // Handle form change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    try {
      await subscribersService.update(uuid, form);

      navigate("/subscribers");
    } catch (err) {
      setErrors("Something went wrong while updating subscriber.");
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
          className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition border border-gray-200"
        >
          <FiArrowLeft className="text-gray-700 text-lg" />
        </button>

        <div>
          <h1 className="text-[22px] font-semibold text-gray-900">
            Edit Subscriber
          </h1>
          <p className="text-gray-500 text-sm">
            Update subscriber details.
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm max-w-4xl">
        {errors && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
            {errors}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Subscription */}
            <div>
              <label className="text-gray-700 text-sm font-medium">
                Subscription *
              </label>
              <select
                name="subscription_id"
                value={form.subscription_id}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white outline-none text-sm"
              >
                <option value="">Select Subscription</option>
                {subscriptions.map((sub) => (
                  <option key={sub.uuid} value={sub.uuid}>
                    {sub.subscription_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tenant ID */}
            <InputField
              label="Tenant ID *"
              name="tenant_id"
              placeholder="USER123"
              value={form.tenant_id}
              onChange={handleChange}
              required
            />
          </div>

          {/* SAVE BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition text-sm"
          >
            <FiSave className="text-lg" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}

/* ---------------- INPUT COMPONENT ---------------- */
function InputField({ label, ...props }) {
  return (
    <div>
      <label className="text-gray-700 text-sm font-medium">{label}</label>
      <input
        {...props}
        className="w-full mt-2 p-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white outline-none text-sm"
      />
    </div>
  );
}
