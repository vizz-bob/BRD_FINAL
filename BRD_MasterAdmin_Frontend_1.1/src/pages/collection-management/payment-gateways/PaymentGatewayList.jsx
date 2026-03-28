import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit,FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/* ---------------- COMPONENT ---------------- */

export default function PaymentGatewayList() {
  const navigate = useNavigate();
  const [gateways, setGateways] = useState([]);

  /* ---------------- LOAD GATEWAYS ---------------- */
  useEffect(() => {
    // MOCK DATA (API later)
    setGateways([
      {
        id: 1,
        name: "Razorpay",
        mode: "Live",
        transaction_fee: 2.5,
        status: "Active",
      },
      {
        id: 2,
        name: "Cashfree",
        mode: "Test",
        transaction_fee: 2.0,
        status: "Inactive",
      },
    ]);
  }, []);

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-3">
           <button
                     onClick={() => navigate(-1)}
                     className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                   >
                     <FiArrowLeft />
                   </button> Payment Gateway Management
          </h1>
          <p className="text-sm text-gray-500 pl-12">
            Configure third-party payment gateways for EMI collection
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/collection-management/payment-gateways/add")
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Add Gateway
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* HEADER ROW */}
        <div className="hidden md:grid grid-cols-5 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Gateway</div>
          <div>Mode</div>
          <div>Txn Fee (%)</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {gateways.map((g) => (
          <div
            key={g.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition
                       grid grid-cols-2 md:grid-cols-5 gap-y-2 items-center text-sm"
          >
            {/* Gateway Name */}
            <div className="font-medium text-gray-900">
              {g.name}
            </div>

            {/* Mode */}
            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  g.mode === "Live"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {g.mode}
              </span>
            </div>

            {/* Transaction Fee */}
            <div className="font-medium text-gray-700">
              {g.transaction_fee}%
            </div>

            {/* Status */}
            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  g.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {g.status}
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <button
                onClick={() =>
                  navigate(
                    `/collection-management/payment-gateways/${g.id}/edit`
                  )
                }
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
              >
                <FiEdit />
              </button>
            </div>
          </div>
        ))}

        {gateways.length === 0 && (
          <p className="text-sm text-gray-500">
            No payment gateways configured.
          </p>
        )}
      </div>
    </MainLayout>
  );
}
