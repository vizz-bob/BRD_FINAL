import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {DeleteConfirmButton} from "../../../components/Controls/SharedUIHelpers";

export default function DownPaymentList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    setData([
      { id: 1, percentage: 20, description: "Standard residential loan", refundable: "Yes", status: "Active" },
      { id: 2, percentage: 30, description: "Construction projects", refundable: "No", status: "Inactive" }
    ]);
  }, []);

  const filtered = data.filter(d =>
    d.percentage.toString().includes(search)
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
          <h1 className="text-xl font-semibold">Down Payment Master</h1>
          <p className="text-sm text-gray-500">Configure standard down payment policies</p>
        </div>

        <button
          onClick={() => navigate("add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FiPlus /> Add Down Payment
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by percentage..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">

        {/* HEADER ROW */}
        <div className="hidden md:grid grid-cols-5 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Percentage</div>
          <div>Description</div>
          <div>Refundable</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {filtered.map((row) => (
          <div
            key={row.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-y-2 items-center text-sm"
          >
            {/* Percentage */}
            <div className="font-medium text-gray-900">
              {row.percentage}%
              <div className="md:hidden text-xs text-gray-400">{row.status}</div>
            </div>

            {/* Description */}
            <div className="hidden md:block text-gray-600">{row.description}</div>

            {/* Refundable */}
            <div>
              <span className={`px-3 py-1 text-xs rounded-full ${
                row.refundable === "Yes"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {row.refundable}
              </span>
            </div>

            {/* Status */}
            <div>
              <span className={`px-3 py-1 text-xs rounded-full ${
                row.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {row.status}
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <button onClick={() => navigate(`${row.id}/view`)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <FiEye />
              </button>
              <button onClick={() => navigate(`${row.id}/edit`)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                <FiEdit />
              </button>
              <button onClick={() => { setDeleteId(row.id); setShowDelete(true); }} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE MODAL */}
      {showDelete && (
        <DeleteConfirmButton
          title="Delete Down Payment"
          message="Are you sure you want to delete this down payment?"
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </MainLayout>
  );
}
