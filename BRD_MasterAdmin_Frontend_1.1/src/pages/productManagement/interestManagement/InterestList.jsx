import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiPlus, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  PageHeader,
  SearchFilterBar,
  ListView,
} from "../../../components/Controls/SharedUIHelpers";

import { interestService } from "../../../services/productManagementService";

const InterestList = () => {
  const navigate = useNavigate();

  const [interests, setInterests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD LIST ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await interestService.getInterests();
        setInterests(data || []);
      } catch (err) {
        console.error("Failed to fetch interests:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------------- SEARCH ---------------- */
  const filtered = interests.filter(
    (i) =>
      i.benchmark_type.toLowerCase().includes(search.toLowerCase()) ||
      i.interest_type.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- TABLE CONFIG ---------------- */
  const columns = [
    { key: "benchmark_type", label: "Benchmark" },
    { key: "interest_type", label: "Interest Type" },
    { key: "accrual_method", label: "Accrual Method" },
    { key: "benchmark_rate", label: "Benchmark Rate" },
    { key: "mark_up", label: "Mark Up" },
    { key: "interest_rate", label: "APR (%)" },
    { key: "is_active", label: "Status", type: "status" },
  ];

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interest?")) return;
    try {
      await interestService.deleteInterest(id);
      setInterests((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const actions = [
    {
      icon: <FiEye />,
      onClick: (row) => navigate(`/interest/${row.id}`),
    },
    {
      icon: <FiEdit />,
      color: "blue",
      onClick: (row) => navigate(`/interest/${row.id}/edit`),
    },
    {
      icon: <FiTrash2 />,
      color: "red",
      onClick: (row) => handleDelete(row.id),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Interest Management"
        subtitle="Manage interest, benchmark and APR configurations"
        actionLabel="Add Interest"
        actionIcon={<FiPlus />}
        onAction={() => navigate("/interest/add")}
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search benchmark or interest type..."
      />

      {loading ? (
        <p className="text-gray-500 text-sm">Loading interest configurations...</p>
      ) : (
        <ListView data={filtered} columns={columns} actions={actions} rowKey="id" />
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-gray-500 text-sm mt-4">
          No interest configurations found.
        </p>
      )}
    </MainLayout>
  );
};

export default InterestList;
