import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import subscribersService from "../../services/subscribersService";
import subscriptionService from "../../services/subscriptionService";

export default function ViewSubscriber() {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const [subscriber, setSubscriber] = useState(null);
  const [subscriptionName, setSubscriptionName] = useState("");

  // Load subscriber by ID
  const loadSubscriber = async () => {
    const res = await subscribersService.getOne(uuid);
    setSubscriber(res.data);

    // Fetch subscription name (optional improvement)
    if (res.data.subscription_id) {
      const subRes = await subscriptionService.getOne(res.data.subscription_id);
      setSubscriptionName(subRes.data.subscription_name);
    }
  };

  useEffect(() => {
    loadSubscriber();
  }, []);

  if (!subscriber) {
    return (
      <MainLayout>
        <div className="text-center text-gray-500 mt-20">Loading...</div>
      </MainLayout>
    );
  }

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
            Subscriber Details
          </h1>
          <p className="text-gray-500 text-sm">
            Complete details of subscriber.
          </p>
        </div>
      </div>

      {/* VIEW CARD */}
      <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm max-w-3xl">

        {/* TOP SECTION */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Subscriber Information
          </h2>

          {/* EDIT BUTTON */}
          <button
            onClick={() => navigate(`/subscribers/edit/${uuid}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition text-sm"
          >
            <FiEdit /> Edit
          </button>
        </div>

        {/* DETAILS */}
        <div className="space-y-5 text-gray-700 text-[15px]">
          <Detail label="Tenant ID" value={subscriber.tenant_id} />

          <Detail
            label="Subscription"
            value={subscriptionName || subscriber.subscription_id}
          />

          <Detail label="Created User" value={subscriber.created_user} />
          <Detail label="Modified User" value={subscriber.modified_user} />

          <Detail label="Created At" value={subscriber.created_at} />
          <Detail label="Modified At" value={subscriber.modified_at} />

          <Detail
            label="Status"
            value={subscriber.isDeleted ? "Deleted" : "Active"}
          />

          <Detail label="UUID" value={subscriber.uuid} />
        </div>
      </div>
    </MainLayout>
  );
}

/* ---------------- DETAIL REUSABLE COMPONENT ---------------- */
function Detail({ label, value }) {
  return (
    <div className="flex items-start">
      <span className="w-40 font-medium text-gray-900">{label}:</span>
      <span className="text-gray-700">{value || "—"}</span>
    </div>
  );
}
