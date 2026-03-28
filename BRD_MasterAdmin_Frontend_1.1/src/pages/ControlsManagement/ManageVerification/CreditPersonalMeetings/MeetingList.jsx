import React, { useState } from "react";
import MainLayout from "../../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit3, FiTrash2, FiSearch } from "react-icons/fi";

export default function MeetingList() {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([
    {
      id: 1,
      applicant: "John Doe",
      meetingType: "Home Visit",
      status: "Completed",
    },
    {
      id: 2,
      applicant: "Jane Smith",
      meetingType: "Office Visit",
      status: "Pending",
    },
  ]);

  const [search, setSearch] = useState("");

  const filtered = meetings.filter(
    (m) =>
      m.applicant.toLowerCase().includes(search.toLowerCase()) ||
      m.meetingType.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (!window.confirm("Delete this meeting?")) return;
    setMeetings(meetings.filter((m) => m.id !== id));
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Credit Personal Meetings</h1>
          <p className="text-sm text-gray-500">
            Manage applicant personal meetings
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/controls/verification/credit-personal-meetings/add")
          }
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
          placeholder="Search by applicant or meeting type..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* TABLE HEADER */}
        <div className="hidden md:grid grid-cols-5 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Applicant</div>
          <div>Meeting Type</div>
          <div>Status</div>
          <div className="text-right col-span-2">Actions</div>
        </div>

        {/* ROWS */}
        {filtered.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-5 items-center text-sm gap-y-2"
          >
            {/* Applicant */}
            <div className="font-medium text-gray-900">
              {m.applicant}
            </div>

            {/* Meeting Type */}
            <div className="text-gray-600">{m.meetingType}</div>

            {/* Status */}
            <span
              className={`px-3 py-1 text-xs rounded-full justify-self-start ${
                m.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {m.status}
            </span>

            {/* Actions */}
            <div className="flex justify-end gap-2 col-span-2 md:col-span-2">
              <button
                onClick={() =>
                  navigate(
                    `/controls/verification/credit-personal-meetings/edit/${m.id}`
                  )
                }
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
              >
                <FiEdit3 />
              </button>

              <button
                onClick={() => handleDelete(m.id)}
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
