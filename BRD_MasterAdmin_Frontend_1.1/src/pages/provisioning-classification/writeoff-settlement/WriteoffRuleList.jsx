import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiRefreshCcw, FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {DeleteConfirmButton} from "../../../components/Controls/SharedUIHelpers";

export default function WriteoffRuleList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    setData([
      {
        id: 1,
        writeoff_policy: "RBI-NPA-2025",
        min_days_overdue: 180,
        product_type: "Home Loan",
      },
    ]);
  }, []);

  const filtered = data.filter((d) =>
    d.writeoff_policy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Write-off Rules</h1>
          <p className="text-sm text-gray-500">
            Manage write-off eligibility policies
          </p>
        </div>
        <button
          onClick={() => navigate("add")}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm flex items-center gap-2"
        >
          <FiPlus size={16} /> Add Rule
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-md shadow mb-6 flex items-center gap-2">
        <FiSearch size={16} className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search policy..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* Table */}
      <div className="space-y-3">
        <div className="grid grid-cols-4 bg-gray-100 px-4 py-2 rounded-md text-xs font-semibold text-gray-600">
          <div>Policy</div>
          <div>Min Days</div>
          <div>Product</div>
          <div className="text-right">Actions</div>
        </div>

        {filtered.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-4 bg-white px-4 py-3 rounded-md shadow text-sm items-center"
          >
            <div className="font-medium">{row.writeoff_policy}</div>
            <div>{row.min_days_overdue} days</div>
            <div>{row.product_type}</div>

            <div className="flex justify-end gap-2">
              {/* Edit */}
              <button
                onClick={() => navigate(`${row.id}/edit`)}
                className="p-2 rounded-md bg-blue-100 text-blue-600"
                title="Edit Rule"
              >
                <FiEdit size={16} />
              </button>

              {/* Update (2.1) */}
              <button
                onClick={() => navigate(`${row.id}/update`)}
                className="p-2 rounded-md bg-purple-100 text-purple-600"
                title="Update Write-off"
              >
                <FiRefreshCcw size={16} />
              </button>

              {/* Manage (2.3) */}
              <button
                onClick={() => navigate(`${row.id}/manage`)}
                className="p-2 rounded-md bg-gray-100 text-gray-700"
                title="Manage Policy"
              >
                <FiSettings size={16} />
              </button>

              {/* Delete */}
              <button
                onClick={() => setDeleteId(row.id)}
                className="p-2 rounded-md bg-red-100 text-red-600"
                title="Delete"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <DeleteConfirmButton
          title="Delete Write-off Rule"
          message="This policy will be permanently removed."
          onCancel={() => setDeleteId(null)}
          onConfirm={() => {
            setData((prev) => prev.filter((d) => d.id !== deleteId));
            setDeleteId(null);
          }}
        />
      )}
    </MainLayout>
  );
}
