import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {DeleteConfirmButton} from "../../../components/Controls/SharedUIHelpers";

/* ---------------- COMPONENT ---------------- */

export default function PortfolioLimitList() {
  const navigate = useNavigate();

  const [limits, setLimits] = useState([]);

  // DELETE STATE
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ---------------- LOAD LIMITS ---------------- */
  useEffect(() => {
    // MOCK DATA (API later)
    setLimits([
      {
        id: 1,
        product_limit: 500000000,
        geo_limit: 200000000,
        borrower_segment_limit: 150000000,
        threshold_alert: 80,
        status: "Active",
      },
      {
        id: 2,
        product_limit: 300000000,
        geo_limit: 100000000,
        borrower_segment_limit: 120000000,
        threshold_alert: 75,
        status: "Inactive",
      },
    ]);
  }, []);

  /* ---------------- DELETE ---------------- */
  const handleDelete = () => {
    setLimits((prev) =>
      prev.filter((item) => item.id !== deleteId)
    );
    setShowDelete(false);
    setDeleteId(null);
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">
            Portfolio Limits
          </h1>
          <p className="text-sm text-gray-500">
            Manage exposure limits and threshold alerts
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/risk-management/portfolio-limits/add")
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Add Portfolio Limit
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* HEADER ROW */}
        <div className="hidden md:grid grid-cols-6 bg-gray-100 rounded-xl px-6 py-3 text-xs font-semibold text-gray-600">
          <div>Product Limit</div>
          <div>Geo Limit</div>
          <div>Segment Limit</div>
          <div>Threshold</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {limits.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100
                       hover:shadow-md transition
                       grid grid-cols-2 md:grid-cols-6 items-center text-sm"
          >
            <div className="font-medium">
              ₹{item.product_limit.toLocaleString()}
            </div>

            <div>
              ₹{item.geo_limit.toLocaleString()}
            </div>

            <div>
              ₹{item.borrower_segment_limit.toLocaleString()}
            </div>

            <div className="font-medium">
              {item.threshold_alert}%
            </div>

            <div>
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  item.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {item.status}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <button
                onClick={() =>
                  navigate(
                    `/risk-management/portfolio-limits/${item.id}/view`
                  )
                }
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FiEye />
              </button>

              <button
                onClick={() =>
                  navigate(
                    `/risk-management/portfolio-limits/${item.id}/edit`
                  )
                }
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
              >
                <FiEdit />
              </button>

              <button
                onClick={() => {
                  setDeleteId(item.id);
                  setShowDelete(true);
                }}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}

        {limits.length === 0 && (
          <p className="text-gray-500 text-sm">
            No portfolio limits defined.
          </p>
        )}
      </div>

      {/* DELETE CONFIRM */}
      {showDelete && (
        <DeleteConfirmButton
          title="Delete Portfolio Limit"
          message="Are you sure you want to delete this portfolio limit?"
          onCancel={() => {
            setShowDelete(false);
            setDeleteId(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </MainLayout>
  );
}
