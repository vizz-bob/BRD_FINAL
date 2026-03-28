import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {DeleteConfirmButton} from "../../../components/Controls/SharedUIHelpers";

export default function IncentiveRuleList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    setData([
      {
        id: 1,
        product_type: "Home Loan",
        incentive_rate: 1.5,
        condition: "Applicable on full settlement",
      },
      {
        id: 2,
        product_type: "Personal Loan",
        incentive_rate: 2.0,
        condition: "Only for NPA recovery",
      },
    ]);
  }, []);

  const filtered = data.filter((d) =>
    d.product_type.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-xl font-semibold">Incentive Rules</h1>
          <p className="text-sm text-gray-500">
            Configure incentive distribution rules
          </p>
        </div>

        <button
          onClick={() => navigate("add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Add Rule
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product type..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        <div className="hidden md:grid grid-cols-4 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Product Type</div>
          <div>Incentive %</div>
          <div>Condition</div>
          <div className="text-right">Actions</div>
        </div>

        {filtered.map((row) => (
          <div
            key={row.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-y-2 items-center text-sm"
          >
            <div className="font-medium">{row.product_type}</div>
            <div className="hidden md:block text-gray-600">
              {row.incentive_rate} %
            </div>
            <div className="hidden md:block text-gray-600">{row.condition}</div>

            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <button
                onClick={() => navigate(`${row.id}/edit`)}
                className="icon-btn bg-blue-100 text-blue-600"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => setDeleteId(row.id)}
                className="icon-btn bg-red-100 text-red-600"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <DeleteConfirmButton
          title="Delete Incentive Rule"
          message="This rule will be permanently removed."
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
    </MainLayout>
  );
}
