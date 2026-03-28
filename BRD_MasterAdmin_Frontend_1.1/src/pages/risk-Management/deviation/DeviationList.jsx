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

export default function DeviationList() {
  const navigate = useNavigate();

  const [deviations, setDeviations] = useState([]);
  const [search, setSearch] = useState("");

  // DELETE STATE
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ---------------- LOAD DEVIATIONS ---------------- */
  useEffect(() => {
    // TEMP MOCK DATA (API later)
    setDeviations([
      {
        id: 1,
        deviation_type: "Income",
        justification: "Seasonal income variation for borrower",
        approving_authority: "Branch Manager",
        impact_level: "Medium",
        status: "Active",
      },
      {
        id: 2,
        deviation_type: "Credit Score",
        justification: "Strong collateral backing despite low score",
        approving_authority: "Risk Manager",
        impact_level: "High",
        status: "Inactive",
      },
    ]);
  }, []);

  /* ---------------- SEARCH ---------------- */
  const filteredDeviations = deviations.filter(
    (d) =>
      d.deviation_type
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      d.justification
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      d.approving_authority
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  /* ---------------- DELETE HANDLER ---------------- */
  const handleDelete = () => {
    console.log("Delete deviation id:", deleteId);

    // Later → API
    // await deviationService.delete(deleteId);

    setDeviations((prev) =>
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
            Deviation Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage policy deviations with approval control
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/risk-management/deviations/add")
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Add Deviation
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search deviation..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* COLUMN HEADER */}
        <div className="hidden md:grid grid-cols-6 bg-gray-100 rounded-xl px-6 py-3 text-xs font-semibold text-gray-600">
          <div>Deviation Type</div>
          <div>Justification</div>
          <div>Approving Authority</div>
          <div>Impact Level</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {filteredDeviations.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100
                       hover:shadow-md transition
                       grid grid-cols-2 md:grid-cols-6 gap-x-4 items-center text-sm"
          >
            {/* Deviation Type */}
            <div className="font-semibold text-gray-900">
              {item.deviation_type}
              <div className="text-xs text-gray-400 md:hidden">
                {item.status}
              </div>
            </div>

            {/* Justification (single line) */}
            <div
              title={item.justification}
              className="text-gray-600 truncate"
            >
              {item.justification}
            </div>

            {/* Approving Authority */}
            <div className="text-gray-700 hidden md:block">
              {item.approving_authority}
            </div>

            {/* Impact Level */}
            <div>
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  item.impact_level === "High"
                    ? "bg-red-100 text-red-700"
                    : item.impact_level === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {item.impact_level}
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
                    `/risk-management/deviations/${item.id}/view`
                  )
                }
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FiEye />
              </button>

              <button
                onClick={() =>
                  navigate(
                    `/risk-management/deviations/${item.id}/edit`
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

        {filteredDeviations.length === 0 && (
          <p className="text-gray-500 text-sm">
            No deviations found.
          </p>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {showDelete && (
        <DeleteConfirmButton
          title="Delete Deviation"
          message="Are you sure you want to delete this deviation? This action cannot be undone."
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
