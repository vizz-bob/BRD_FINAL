import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  FiPlus,
  FiEdit3,
  FiEye,
  FiTrash2,
  FiSearch
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { controlsManagementService } from "../../../services/controlsManagementService";

export default function LoginAuthList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  const fetchPolicies = async () => {
    setLoading(true);
    const data =
      await controlsManagementService.login_auth.list();
    setPolicies(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  /* ================= FILTER ================= */
  const filtered = policies.filter((p) =>
    p.authentication_type?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this authentication policy?")) return;

    const success =
      await controlsManagementService.login_auth.delete(id);

    if (success) {
      setPolicies((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Login Authentication</h1>
          <p className="text-sm text-gray-500">
            Manage login access and authentication rules
          </p>
        </div>

        <button
          onClick={() => navigate("/controls/login-auth/add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          <FiPlus /> Add Policy
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
        <FiSearch className="text-gray-400" />
        <input
          placeholder="Search by authentication type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm bg-transparent"
        />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {/* HEADER */}
        <div className="hidden md:grid grid-cols-5 bg-gray-100 rounded-xl px-5 py-3 text-xs font-semibold text-gray-600">
          <div>Auth Type</div>
          <div>Device Restriction</div>
          <div>MFA</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">
            Loading authentication policies...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No authentication policies found
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl px-5 py-4 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-y-2 items-center text-sm"
            >
              <div className="font-medium">
                {p.authentication_type}
              </div>

              <div className="text-gray-600">
                {p.device_restriction ? "Enabled" : "Disabled"}
              </div>

              <div className="text-gray-600">
                {p.multi_factor_enabled ? "Enabled" : "Disabled"}
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full w-fit ${
                  p.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {p.status}
              </span>

              <div className="flex justify-end gap-2 col-span-2 md:col-span-1">
                <IconButton
                  color="gray"
                  onClick={() =>
                    navigate(`/controls/login-auth/view/${p.id}`)
                  }
                >
                  <FiEye />
                </IconButton>

                <IconButton
                  color="blue"
                  onClick={() =>
                    navigate(`/controls/login-auth/edit/${p.id}`)
                  }
                >
                  <FiEdit3 />
                </IconButton>

                <IconButton
                  color="red"
                  onClick={() => handleDelete(p.id)}
                >
                  <FiTrash2 />
                </IconButton>
              </div>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
}

/* ================= ICON BUTTON ================= */

const IconButton = ({ children, onClick, color }) => {
  const map = {
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-600",
    red: "bg-red-100 hover:bg-red-200 text-red-600",
    gray: "bg-gray-100 hover:bg-gray-200 text-gray-600"
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full ${map[color]}`}
    >
      {children}
    </button>
  );
};
