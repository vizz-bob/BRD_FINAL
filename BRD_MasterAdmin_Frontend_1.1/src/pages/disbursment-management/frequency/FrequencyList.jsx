import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {DeleteConfirmButton} from "../../../components/Controls/SharedUIHelpers";
// import { frequencyMasterService } from "../../../services/frequencyMasterService";

export default function FrequencyList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    // TEMP MOCK DATA
    setData([
      { id: 1, label: "Monthly", description: "Disbursement released every month" },
      { id: 2, label: "Milestone", description: "Based on project milestones" }
    ]);
  }, []);

  const filtered = data.filter(f =>
    f.label?.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-xl font-semibold">Frequency Master</h1>
          <p className="text-sm text-gray-500">
            Define how often disbursements are released
          </p>
        </div>

        <button
          onClick={() => navigate("add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FiPlus /> Add Frequency
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search frequency..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">

        {/* HEADER */}
        <div className="hidden md:grid grid-cols-3 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Label</div>
          <div>Description</div>
          <div className="text-right">Actions</div>
        </div>

        {/* ROWS */}
        {filtered.map(row => (
          <div
            key={row.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-3 gap-y-2 items-center text-sm"
          >
            <div className="font-medium text-gray-900">
              {row.label}
              <div className="text-xs text-gray-400 md:hidden">
                {row.description}
              </div>
            </div>

            <div className="hidden md:block text-gray-600">{row.description || "-"}</div>

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
          <p className="text-gray-500 text-sm">No frequency found.</p>
        )}
      </div>

      {/* DELETE MODAL */}
      {showDelete && (
        <DeleteConfirmButton
          title="Delete Frequency"
          message="Are you sure you want to delete this frequency?"
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
