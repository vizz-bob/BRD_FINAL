import React, { useState } from "react";
import MainLayout from "../../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit3, FiTrash2, FiSearch } from "react-icons/fi";

export default function TeleVerificationList() {
  const navigate = useNavigate();

  const [verifications, setVerifications] = useState([
    { id: 1, applicant: "John Doe", contactMode: "Phone", status: "Pending" },
    { id: 2, applicant: "Jane Smith", contactMode: "Video Call", status: "Success" },
  ]);

  const [search, setSearch] = useState("");

  const filtered = verifications.filter(
    (v) =>
      v.applicant.toLowerCase().includes(search.toLowerCase()) ||
      v.contactMode.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (!window.confirm("Delete this verification?")) return;
    setVerifications(verifications.filter((v) => v.id !== id));
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Tele Verification</h1>
          <p className="text-sm text-gray-500">Manage tele-verification of applicants</p>
        </div>
        <button
          onClick={() => navigate("/controls/verification/tele-verification/add")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        >
          <FiPlus /> Add
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by applicant or mode..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* TABLE */}
      <div className="space-y-3">
        <div className="hidden md:grid grid-cols-5 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Applicant</div>
          <div>Contact Mode</div>
          <div>Status</div>
          <div className="text-right col-span-2">Actions</div>
        </div>

        {filtered.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-5 items-center text-sm gap-y-2"
          >
            <div className="font-medium text-gray-900">{v.applicant}</div>
            <div className="text-gray-600">{v.contactMode}</div>
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                v.status === "Success" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {v.status}
            </span>
            <div className="flex justify-end gap-2 col-span-2 md:col-span-2">
              <button
                onClick={() => navigate(`/controls/verification/tele-verification/edit/${v.id}`)}
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
              >
                <FiEdit3 />
              </button>
              <button
                onClick={() => handleDelete(v.id)}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
