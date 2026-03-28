import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {DeleteConfirmButton} from "../../../components/Controls/SharedUIHelpers";

export default function ThirdPartyList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    setData([
      {
        id: 1,
        name: "Verifier Ltd",
        role: "Auditor",
        contact_info: "verifier@gmail.com",
        associated_stages_names: ["Pre-Approval", "Disbursement"],
        status: "Active",
      },
    ]);
  }, []);

  const filtered = data.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    setData((prev) => prev.filter((r) => r.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Third Party Master</h1>
          <p className="text-sm text-gray-500">
            Configure verification & validation partners
          </p>
        </div>

        <button
          onClick={() => navigate("add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Add Third Party
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search third party..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        <div className="hidden md:grid grid-cols-5 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Name</div>
          <div>Role</div>
          <div>Contact</div>
          <div>Stages</div>
          <div className="text-right">Actions</div>
        </div>

        {filtered.map((row) => (
          <div
            key={row.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-y-2 items-center text-sm"
          >
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="hidden md:block text-gray-600">{row.role}</div>
            <div className="hidden md:block text-gray-600">
              {row.contact_info}
            </div>
            <div className="hidden md:block text-gray-600">
              {row.associated_stages_names.join(", ")}
            </div>

            {/* PREMIUM ACTION BUTTONS */}
            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <button
                onClick={() => navigate(`${row.id}/view`)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-600"
              >
                <FiEye />
              </button>

              <button
                onClick={() => navigate(`${row.id}/edit`)}
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition text-blue-600"
              >
                <FiEdit />
              </button>

              <button
                onClick={() => setDeleteId(row.id)}
                className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition text-red-600"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <DeleteConfirmButton
          title="Delete Third Party"
          message="This third party will be permanently removed."
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
    </MainLayout>
  );
}
