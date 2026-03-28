import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit3, FiEye, FiTrash2, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { controlsManagementService } from "../../../services/controlsManagementService";

export default function LoginFeeList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFees = async () => {
    setLoading(true);
    const data = await controlsManagementService.login_fees.list();
    setFees(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this login fee?")) return;

    const success = await controlsManagementService.login_fees.delete(id);
    if (success) {
      setFees((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const filtered = fees.filter(
    (f) =>
      f.fee_type?.toLowerCase().includes(search.toLowerCase()) ||
      f.fee_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Login Fee Management</h1>
          <p className="text-sm text-gray-500">
            Configure login / application fee structures
          </p>
        </div>
        <button
          onClick={() => navigate("/controls/login-fees/add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          <FiPlus /> Add Login Fee
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          placeholder="Search fee name or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-3">
          {/* TABLE HEADER */}
          <div className="hidden md:grid grid-cols-5 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
            <div>Fee Name</div>
            <div>Type</div>
            <div>Amount</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>

          {filtered.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-y-2 items-center text-sm"
            >
              <div className="font-medium">{f.fee_name}</div>
              <div className="text-gray-600">{f.fee_type}</div>
              <div>
                {f.fee_type === "Flat" ? `₹${f.amount}` : `${f.amount}%`}
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full justify-self-start ${
                  f.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {f.status === "ACTIVE" ? "Active" : "Inactive"}
              </span>

              <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
                <button
                  onClick={() => navigate(`/controls/login-fees/view/${f.id}`)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                >
                  <FiEye />
                </button>

                <button
                  onClick={() => navigate(`/controls/login-fees/edit/${f.id}`)}
                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
                >
                  <FiEdit3 />
                </button>

                <button
                  onClick={() => handleDelete(f.id)}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}

          {!filtered.length && (
            <p className="text-center text-gray-500 py-6">
              No login fees found
            </p>
          )}
        </div>
      )}
    </MainLayout>
  );
}
