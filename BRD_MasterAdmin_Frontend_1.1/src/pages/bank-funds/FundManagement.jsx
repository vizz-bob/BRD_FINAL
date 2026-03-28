import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiSearch,
  FiEye,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { bankFundService } from "../../services/bankFundService";
import { IconButton } from "../../components/Controls/SharedUIHelpers";

export default function FundManagement() {
  const navigate = useNavigate();
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ---------------- FETCH FUNDS ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await bankFundService.getFunds();
        setFunds(data);
        console.log(data)
      } catch (err) {
        console.error("Failed to load funds:", err);
        alert("Failed to load fund data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredFunds = funds.filter(
    (f) =>
      f.fund_type?.toLowerCase().includes(search.toLowerCase()) ||
      f.fund_source?.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this fund?")) return;
    try {
      await bankFundService.deleteFund(id);
      setFunds((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Delete fund failed:", err);
      alert("Failed to delete fund.");
    }
  };

  if (loading) return <MainLayout>Loading fund data...</MainLayout>;

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Fund Management</h1>
          <p className="text-sm text-gray-500">
            Configure fund types and manage available fund pools
          </p>
        </div>

        <button
          onClick={() => navigate("/fund-management/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FiPlus /> Add Fund
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by fund type or source..."
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* TABLE HEADER */}
        <div className="hidden md:grid grid-cols-6 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Fund Type</div>
          <div>Fund Source</div>
          <div>Available Amount</div>
          <div>Allocation Logic</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* TABLE ROWS */}
        {filteredFunds.map((fund) => (
          <div
            key={fund.id}
            className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-6 gap-y-2 items-center text-sm"
          >
            {/* Fund Type */}
            <div className="font-medium text-gray-900">{fund.fund_type}</div>

            {/* Source */}
            <div className="text-gray-600">{fund.fund_source}</div>

            {/* Amount */}
            <div className="text-gray-600">
              ₹ {Number(fund.available_amount || 0).toLocaleString()}
            </div>

            {/* Allocation Logic */}
            <div className="text-gray-600 truncate">{fund.fund_allocation_logic}</div>

            {/* Status */}
            <span
              className={`px-3 py-1 text-xs rounded-full justify-self-start ${
                fund.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {fund.status}
            </span>

            {/* Actions */}
            <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
              <IconButton
                color="gray"
                onClick={() => navigate(`/fund-management/view/${fund.id}`)}
              >
                <FiEye />
              </IconButton>

              <IconButton
                color="blue"
                onClick={() => navigate(`/fund-management/edit/${fund.id}`)}
              >
                <FiEdit3 />
              </IconButton>

              <IconButton color="red" onClick={() => handleDelete(fund.id)}>
                <FiTrash2 />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
