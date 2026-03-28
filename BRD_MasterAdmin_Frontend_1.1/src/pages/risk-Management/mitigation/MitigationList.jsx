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

export default function MitigationList() {
  const navigate = useNavigate();

  const [mitigations, setMitigations] = useState([]);
  const [search, setSearch] = useState("");

  // DELETE STATE
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ---------------- LOAD MITIGATIONS ---------------- */
  useEffect(() => {
    // TEMP MOCK DATA (API later)
    setMitigations([
      {
        id: 1,
        mitigation_type: "Collateral",
        mitigation_action: "Collect property documents as collateral",
        associated_risks: [
          "Credit Risk – Unstable income source",
        ],
        effectiveness_score: 85,
        status: "Active",
      },
      {
        id: 2,
        mitigation_type: "Insurance",
        mitigation_action: "Mandatory credit life insurance",
        associated_risks: [
          "Credit Risk – Unstable income source",
          "Operational Risk – Document mismatch",
        ],
        effectiveness_score: 70,
        status: "Inactive",
      },
    ]);
  }, []);

  /* ---------------- SEARCH ---------------- */
  const filteredMitigations = mitigations.filter(
    (m) =>
      m.mitigation_type
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      m.mitigation_action
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  /* ---------------- DELETE HANDLER ---------------- */
  const handleDelete = () => {
    console.log("Delete mitigation id:", deleteId);

    // Later → API
    // await mitigationService.delete(deleteId);

    setMitigations((prev) =>
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
            Risk Mitigation Management
          </h1>
          <p className="text-sm text-gray-500">
            Define and manage risk mitigation controls
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/risk-management/mitigation/add")
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Add Mitigation
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search mitigation..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* COLUMN HEADER */}
        <div className="hidden md:grid grid-cols-6 bg-gray-100 rounded-xl px-6 py-3 text-xs font-semibold text-gray-600">
          <div>Mitigation Type</div>
          <div>Action</div>
          <div>Associated Risks</div>
          <div>Effectiveness</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {filteredMitigations.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100
                       hover:shadow-md transition
                       grid grid-cols-2 md:grid-cols-6 gap-x-4 items-center text-sm"
          >
            {/* Mitigation Type */}
            <div className="font-semibold text-gray-900">
              {item.mitigation_type}
              <div className="text-xs text-gray-400 md:hidden">
                {item.status}
              </div>
            </div>

            {/* Action (single line only) */}
            <div
              title={item.mitigation_action}
              className="text-gray-600 truncate"
            >
              {item.mitigation_action}
            </div>

            {/* Associated Risks (chips limited) */}
            <div className="hidden md:flex flex-wrap gap-2">
              {item.associated_risks.slice(0, 2).map((risk, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700"
                >
                  {risk}
                </span>
              ))}

              {item.associated_risks.length > 2 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                  +{item.associated_risks.length - 2} more
                </span>
              )}
            </div>

            {/* Effectiveness (compact) */}
            <div className="flex items-center gap-3">
              <div className="w-20 h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-green-500 rounded-full"
                  style={{
                    width: `${item.effectiveness_score}%`,
                  }}
                />
              </div>
              <span className="text-xs font-medium">
                {item.effectiveness_score}%
              </span>
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
                    `/risk-management/mitigation/${item.id}/view`
                  )
                }
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FiEye />
              </button>

              <button
                onClick={() =>
                  navigate(
                    `/risk-management/mitigation/${item.id}/edit`
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

        {filteredMitigations.length === 0 && (
          <p className="text-gray-500 text-sm">
            No mitigations found.
          </p>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {showDelete && (
        <DeleteConfirmButton
          title="Delete Mitigation"
          message="Are you sure you want to delete this mitigation? This action cannot be undone."
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
