import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiEye,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import currencyManagementService from "../../services/currencyManagementService";
import {
  ListView,
  DeleteConfirmButton,
  SearchFilterBar,
} from "../../components/Controls/SharedUIHelpers";

export default function CurrencyList() {
  const navigate = useNavigate();

  const [currencies, setCurrencies] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const res = await currencyManagementService.getAll();
      setCurrencies(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to fetch currencies", err);
    }
  };

  /* ---------------- TABLE CONFIG ---------------- */
  const columns = [
    { key: "currency_code", label: "Code" },
    { key: "currency_symbol", label: "Symbol" },
    { key: "conversion_value_to_inr", label: "Conversion (INR)" },
    { key: "status", label: "Status", type: "status" },
  ];

  const actions = [
    {
      icon: <FiEye />,
      onClick: (row) =>
        navigate(`/currency-management/view/${row.uuid}`),
    },
    {
      icon: <FiEdit3 />,
      color: "blue",
      onClick: (row) =>
        navigate(`/currency-management/edit/${row.uuid}`),
    },
    {
      icon: <FiTrash2 />,
      color: "red",
      onClick: (row) => setDeleteId(row.uuid),
    },
  ];

  /* ---------------- FILTER ---------------- */
  const filteredData = currencies.filter(
    (c) =>
      c.currency_code?.toLowerCase().includes(search.toLowerCase()) ||
      c.currency_symbol?.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    if (!deleteId) return;
    await currencyManagementService.delete(deleteId);
    setDeleteId(null);
    fetchCurrencies();
  };

  return (
    <MainLayout>
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold">Currency Management</h1>
          <p className="text-sm text-gray-500">
            Manage supported currencies and conversion values
          </p>
        </div>

        <button
          onClick={() => navigate("/currency-management/add")}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 text-sm shadow-sm hover:bg-blue-700"
        >
          <FiPlus />
          Add Currency
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by currency code or symbol"
      />

      {/* ================= LIST ================= */}
      <ListView
        data={filteredData}
        columns={columns}
        actions={actions}
        rowKey="uuid"
      />

      {/* ================= DELETE CONFIRM ================= */}
      {deleteId && (
        <DeleteConfirmButton
          title="Delete Currency"
          message="Are you sure you want to delete this currency?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </MainLayout>
  );
}
