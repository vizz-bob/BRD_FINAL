import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit, FiTrash2, FiSearch,FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ProvisioningRuleList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setData([
      {
        id: 1,
        classification_type: "NPA",
        days_overdue: 90,
        provision_percent: 25,
        product_type: "Home Loan",
      },
      {
        id: 2,
        classification_type: "Loss Asset",
        days_overdue: 180,
        provision_percent: 50,
        product_type: "Business Loan",
      },
    ]);
  }, []);

  const filtered = data.filter((d) =>
    d.product_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Provisioning & NPA Criteria</h1>
          <p className="text-sm text-gray-500">
            Configure provisioning percentages by delinquency & product
          </p>
        </div>

        <button
          onClick={() => navigate("add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus size={16} /> Add Rule
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch size={16} className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        <div className="hidden md:grid grid-cols-5 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Classification</div>
          <div>Days Overdue</div>
          <div>Provision %</div>
          <div>Product</div>
          <div className="text-right">Actions</div>
        </div>

        {filtered.map((row) => (
          <div
            key={row.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-y-2 items-center text-sm"
          >
            <div className="font-medium">{row.classification_type}</div>
            <div>{row.days_overdue} days</div>
            <div>{row.provision_percent}%</div>
            <div className="hidden md:block">{row.product_type}</div>

            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <FiSettings
  onClick={() => navigate(`${row.id}/manage`)}
  className="icon-btn bg-purple-100 text-purple-600"
/>

              <button
                onClick={() => navigate(`${row.id}/edit`)}
                className="icon-btn bg-blue-100 text-blue-600 hover:scale-105 transition"
              >
                <FiEdit size={16} />
              </button>

              <button
                className="icon-btn bg-red-100 text-red-600 hover:scale-105 transition"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
