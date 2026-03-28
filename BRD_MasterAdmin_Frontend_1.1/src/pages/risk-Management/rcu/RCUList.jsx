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

export default function RCUList() {
  const navigate = useNavigate();

  const [rcuCases, setRcuCases] = useState([]);
  const [search, setSearch] = useState("");

  // DELETE STATE
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ---------------- LOAD RCU CASES ---------------- */
  useEffect(() => {
    // TEMP MOCK DATA (API later)
    setRcuCases([
      {
        id: 1,
        rcu_trigger: "Mismatch in documents",
        investigation_status: "Pending",
        risk_type: "Operational",
        action_taken: "Documents sent for re-verification",
        status: "Active",
      },
      {
        id: 2,
        rcu_trigger: "Frequent loan enquiries",
        investigation_status: "In Progress",
        risk_type: "Behavioral",
        action_taken: "Customer profile under monitoring",
        status: "Active",
      },
      {
        id: 3,
        rcu_trigger: "Unusual transaction pattern",
        investigation_status: "Closed",
        risk_type: "Financial",
        action_taken: "Account flagged and reported",
        status: "Closed",
      },
    ]);
  }, []);

  /* ---------------- SEARCH ---------------- */
  const filteredRCU = rcuCases.filter(
    (r) =>
      r.rcu_trigger.toLowerCase().includes(search.toLowerCase()) ||
      r.investigation_status
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      r.risk_type.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- DELETE HANDLER ---------------- */
  const handleDelete = () => {
    console.log("Delete RCU case id:", deleteId);

    // Later → API
    // await rcuService.delete(deleteId);

    setRcuCases((prev) =>
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
            Risk Containment Unit (RCU)
          </h1>
          <p className="text-sm text-gray-500">
            Monitor early warning signals and investigation actions
          </p>
        </div>

        <button
          onClick={() => navigate("/risk-management/rcu/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Add RCU Case
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search RCU cases..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* COLUMN HEADER */}
        <div className="hidden md:grid grid-cols-6 bg-gray-100 rounded-xl px-6 py-3 text-xs font-semibold text-gray-600">
          <div>RCU Trigger</div>
          <div>Investigation Status</div>
          <div>Risk Type</div>
          <div>Action Taken</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {filteredRCU.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100
                       hover:shadow-md transition
                       grid grid-cols-2 md:grid-cols-6 gap-x-4 items-center text-sm"
          >
            {/* RCU Trigger */}
            <div className="font-semibold text-gray-900">
              {item.rcu_trigger}
              <div className="text-xs text-gray-400 md:hidden">
                {item.investigation_status}
              </div>
            </div>

            {/* Investigation Status */}
            <div>
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  item.investigation_status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : item.investigation_status === "In Progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {item.investigation_status}
              </span>
            </div>

            {/* Risk Type */}
            <div className="text-gray-700 hidden md:block">
              {item.risk_type}
            </div>

            {/* Action Taken (single line) */}
            <div
              title={item.action_taken}
              className="text-gray-600 truncate"
            >
              {item.action_taken}
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
                    `/risk-management/rcu/${item.id}/view`
                  )
                }
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FiEye />
              </button>

              <button
                onClick={() =>
                  navigate(
                    `/risk-management/rcu/${item.id}/edit`
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

        {filteredRCU.length === 0 && (
          <p className="text-gray-500 text-sm">
            No RCU cases found.
          </p>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {showDelete && (
        <DeleteConfirmButton
          title="Delete RCU Case"
          message="Are you sure you want to delete this RCU case? This action cannot be undone."
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
