import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {DeleteConfirmButton} from "../../../components/Controls/SharedUIHelpers";
// import { disbursementMasterService } from "../../../services/disbursementMasterService";

export default function DisbursementList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    // TEMP MOCK DATA
    setData([
      {
        id: 1,
        disbursement_name: "Standard Loan Disbursement",
        agency_name: "State Bank",
        frequency_label: "Monthly",
        down_payment_percentage: 20,
        stage_name: "Pre-Approval",
        status: "Active"
      },
      {
        id: 2,
        disbursement_name: "Construction Disbursement",
        agency_name: "ABC Finance",
        frequency_label: "Milestone",
        down_payment_percentage: 30,
        stage_name: "Foundation",
        status: "Inactive"
      }
    ]);
  }, []);

  const filtered = data.filter(d =>
    d.disbursement_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    setData(prev => prev.filter(r => r.id !== deleteId));
    setShowDelete(false);
    setDeleteId(null);
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Disbursement Master</h1>
          <p className="text-sm text-gray-500">
            Configure disbursement workflow rules
          </p>
        </div>

        <button
          onClick={() => navigate("add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FiPlus /> Add Disbursement
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search disbursement..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">

        {/* HEADER */}
        <div className="hidden md:grid grid-cols-7 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Name</div>
          <div>Agency</div>
          <div>Frequency</div>
          <div>DP %</div>
          <div>DP Stage</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {filtered.map(row => (
          <div
            key={row.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-7 gap-y-2 items-center text-sm"
          >
            <div className="font-medium text-gray-900">
              {row.disbursement_name}
              <div className="text-xs text-gray-400 md:hidden">
                {row.agency_name} • {row.status}
              </div>
            </div>

            <div className="hidden md:block text-gray-600">{row.agency_name}</div>
            <div className="hidden md:block text-gray-600">{row.frequency_label}</div>
            <div className="text-gray-600">{row.down_payment_percentage}%</div>
            <div className="hidden md:block text-gray-600">{row.stage_name}</div>

            <div>
              <span className={`px-3 py-1 text-xs rounded-full ${
                row.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {row.status}
              </span>
            </div>

            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <button
                onClick={() => navigate(`${row.id}/view`)}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <FiEye />
              </button>

              <button
                onClick={() => navigate(`${row.id}/edit`)}
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
              >
                <FiEdit />
              </button>

              <button
                onClick={() => {
                  setDeleteId(row.id);
                  setShowDelete(true);
                }}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm">No disbursement found.</p>
        )}
      </div>

      {/* DELETE MODAL */}
      {showDelete && (
        <DeleteConfirmButton
          title="Delete Disbursement"
          message="Are you sure you want to delete this disbursement?"
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
