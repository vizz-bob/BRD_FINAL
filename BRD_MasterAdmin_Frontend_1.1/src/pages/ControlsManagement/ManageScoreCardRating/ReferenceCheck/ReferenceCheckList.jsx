import React, { useState } from "react";
import MainLayout from "../../../../layout/MainLayout";
import { FiPlus, FiEdit3 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ReferenceCheckList() {
  const navigate = useNavigate();

  const [data] = useState([
    {
      id: 1,
      criteria: "Employment Verification",
      scale: "0 - 10",
      active: true,
    },
    {
      id: 2,
      criteria: "Address Verification",
      scale: "0 - 100",
      active: false,
    },
  ]);

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Reference Check</h1>
          <p className="text-sm text-gray-500">
            Configure reference-based scoring rules
          </p>
        </div>

        <button
          onClick={() => navigate("add")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
        >
          <FiPlus /> Add Reference Check
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left px-5 py-3">Check Criteria</th>
              <th className="text-left px-5 py-3">Rating Scale</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-5 py-4">{item.criteria}</td>
                <td className="px-5 py-4">{item.scale}</td>
                <td className="px-5 py-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      item.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => navigate(`edit/${item.id}`)}
                    className="p-2 rounded-full bg-blue-100 text-blue-600"
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
