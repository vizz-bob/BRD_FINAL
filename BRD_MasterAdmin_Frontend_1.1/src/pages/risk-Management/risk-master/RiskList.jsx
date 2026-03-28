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

/* ---------------- RISK LIST ---------------- */
export default function RiskList() {
  const navigate = useNavigate();

  const [risks, setRisks] = useState([]);
  const [search, setSearch] = useState("");

  // DELETE STATE
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ---------------- LOAD RISKS ---------------- */
  useEffect(() => {
    // MOCK DATA (replace with API later)
    setRisks([
      {
        id: 1,
        category: "Credit Risk",
        parameter: "Unstable income source",
        severity: "High",
        trigger: "Income mismatch",
        status: "Active",
      },
      {
        id: 2,
        category: "Operational Risk",
        parameter: "Document mismatch",
        severity: "Medium",
        trigger: "KYC inconsistency",
        status: "Inactive",
      },
    ]);
  }, []);

  /* ---------------- SEARCH ---------------- */
  const filteredRisks = risks.filter(
    (r) =>
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.parameter.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- DELETE HANDLER ---------------- */
  const handleDelete = () => {
    console.log("Delete risk id:", deleteId);

    // Later → API
    // await riskService.delete(deleteId);

    setRisks((prev) =>
      prev.filter((risk) => risk.id !== deleteId)
    );

    setShowDelete(false);
    setDeleteId(null);
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Risk Master</h1>
          <p className="text-sm text-gray-500">
            Define and manage lending risks
          </p>
        </div>

        <button
          onClick={() => navigate("/risk-management/risks/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FiPlus /> Add Risk
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search risk..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* COLUMN HEADER */}
        <div className="hidden md:grid grid-cols-6 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Category</div>
          <div>Risk Parameter</div>
          <div>Severity</div>
          <div>Trigger</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {filteredRisks.map((risk) => (
          <div
            key={risk.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-6 gap-y-2 items-center text-sm"
          >
            {/* Category */}
            <div className="font-medium text-gray-900">
              {risk.category}
              <div className="text-xs text-gray-400 md:hidden">
                {risk.severity} • {risk.status}
              </div>
            </div>

            {/* Parameter */}
            <div className="text-gray-600">
              {risk.parameter}
            </div>

            {/* Severity */}
            <div>
              <SeverityBadge value={risk.severity} />
            </div>

            {/* Trigger */}
            <div className="text-gray-600 hidden md:block">
              {risk.trigger}
            </div>

            {/* Status */}
            <div>
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  risk.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {risk.status}
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <button
                onClick={() =>
                  navigate(`/risk-management/risks/${risk.id}/view`)
                }
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <FiEye />
              </button>

              <button
                onClick={() =>
                  navigate(`/risk-management/risks/${risk.id}/edit`)
                }
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
              >
                <FiEdit />
              </button>

              <button
                onClick={() => {
                  setDeleteId(risk.id);
                  setShowDelete(true);
                }}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}

        {filteredRisks.length === 0 && (
          <p className="text-gray-500 text-sm">
            No risks found.
          </p>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {showDelete && (
        <DeleteConfirmButton
          title="Delete Risk"
          message="Are you sure you want to delete this risk? This action cannot be undone."
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

/* ---------------- HELPERS ---------------- */

const SeverityBadge = ({ value }) => {
  const colors = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colors[value]}`}
    >
      {value}
    </span>
  );
};
