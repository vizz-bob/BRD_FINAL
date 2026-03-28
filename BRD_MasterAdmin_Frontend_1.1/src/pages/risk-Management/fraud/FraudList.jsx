import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiEye,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {DeleteConfirmButton} from "../../../components/Controls/SharedUIHelpers";

/* ---------------- COMPONENT ---------------- */

export default function FraudList() {
  const navigate = useNavigate();

  const [frauds, setFrauds] = useState([]);
  const [search, setSearch] = useState("");

  // DELETE STATE
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ---------------- LOAD FRAUD CASES ---------------- */
  useEffect(() => {
    // TEMP MOCK DATA (API later)
    setFrauds([
      {
        id: 1,
        fraud_category: "Identity Fraud",
        modus_operandi: "Fake Aadhaar and PAN documents submitted",
        fraud_status: "Suspected",
        reporting_authority: "Internal Risk Team",
        status: "Active",
      },
      {
        id: 2,
        fraud_category: "Documentation Fraud",
        modus_operandi: "Forged income statements",
        fraud_status: "Confirmed",
        reporting_authority: "Compliance Team",
        status: "Active",
      },
      {
        id: 3,
        fraud_category: "Digital Footprint Fraud",
        modus_operandi: "Manipulated device and IP history",
        fraud_status: "Cleared",
        reporting_authority: "External Agency",
        status: "Closed",
      },
    ]);
  }, []);

  /* ---------------- SEARCH ---------------- */
  const filteredFrauds = frauds.filter(
    (f) =>
      f.fraud_category
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      f.modus_operandi
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      f.fraud_status
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  /* ---------------- DELETE HANDLER ---------------- */
  const handleDelete = () => {
    console.log("Delete fraud id:", deleteId);

    // Later → API
    // await fraudService.delete(deleteId);

    setFrauds((prev) =>
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
            Fraud Management
          </h1>
          <p className="text-sm text-gray-500">
            Track and manage suspected or confirmed fraud cases
          </p>
        </div>

        <button
          onClick={() => navigate("/risk-management/fraud/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Add Fraud Case
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search fraud cases..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* COLUMN HEADER */}
        <div className="hidden md:grid grid-cols-6 bg-gray-100 rounded-xl px-6 py-3 text-xs font-semibold text-gray-600">
          <div>Fraud Category</div>
          <div>Modus Operandi</div>
          <div>Fraud Status</div>
          <div>Reporting Authority</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {filteredFrauds.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100
                       hover:shadow-md transition
                       grid grid-cols-2 md:grid-cols-6 gap-x-4 items-center text-sm"
          >
            {/* Fraud Category */}
            <div className="font-semibold text-gray-900">
              {item.fraud_category}
              <div className="text-xs text-gray-400 md:hidden">
                {item.fraud_status}
              </div>
            </div>

            {/* Modus Operandi (single line) */}
            <div
              title={item.modus_operandi}
              className="text-gray-600 truncate"
            >
              {item.modus_operandi}
            </div>

            {/* Fraud Status */}
            <div>
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  item.fraud_status === "Suspected"
                    ? "bg-yellow-100 text-yellow-700"
                    : item.fraud_status === "Confirmed"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {item.fraud_status}
              </span>
            </div>

            {/* Reporting Authority */}
            <div className="text-gray-700 hidden md:block">
              {item.reporting_authority}
            </div>

            {/* Status */}
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

            {/* Actions */}
            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <button
                onClick={() =>
                  navigate(
                    `/risk-management/fraud/${item.id}/view`
                  )
                }
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FiEye />
              </button>

              <button
                onClick={() =>
                  navigate(
                    `/risk-management/fraud/${item.id}/edit`
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

        {filteredFrauds.length === 0 && (
          <p className="text-gray-500 text-sm">
            No fraud cases found.
          </p>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {showDelete && (
        <DeleteConfirmButton
          title="Delete Fraud Case"
          message="Are you sure you want to delete this fraud case? This action cannot be undone."
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
