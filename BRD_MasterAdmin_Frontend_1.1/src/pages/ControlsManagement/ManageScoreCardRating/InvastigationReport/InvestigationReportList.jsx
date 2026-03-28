import React, { useState } from "react";
import MainLayout from "../../../../layout/MainLayout";
import { FiPlus, FiEdit3 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function InvestigationReportList() {
  const navigate = useNavigate();

  const [rows] = useState([
    {
      id: 1,
      type: "Legal",
      outcome: "Clean",
      active: true,
    },
    {
      id: 2,
      type: "Fraud",
      outcome: "Flagged",
      active: false,
    },
  ]);

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Investigation Report</h1>
          <p className="text-sm text-gray-500">
            Configure investigation-based scoring rules
          </p>
        </div>

        <button
          onClick={() => navigate("add")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
        >
          <FiPlus /> Add Report Rule
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left">Report Type</th>
              <th className="px-5 py-3 text-left">Outcome</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-5 py-4">{r.type}</td>
                <td className="px-5 py-4">{r.outcome}</td>
                <td className="px-5 py-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      r.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {r.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => navigate(`edit/${r.id}`)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-full"
                  >
                    <FiEdit3 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
