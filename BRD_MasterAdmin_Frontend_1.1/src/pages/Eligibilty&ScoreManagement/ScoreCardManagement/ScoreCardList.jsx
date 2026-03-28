import React, { useEffect, useState } from "react";
import { FiPlus, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../../layout/MainLayout";
import {
  PageHeader,
  ListView,
  SearchFilterBar,
  DeleteConfirmButton,
} from "../../../components/Controls/SharedUIHelpers";

import { scoreCardManagementService } from "../../../services/eligibilityManagementService";

export default function ScoreCardList() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteRow, setDeleteRow] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchList = async () => {
    const res = await scoreCardManagementService.list();
    setData(res || []);
  };

  useEffect(() => {
    fetchList();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteRow) return;
    setLoading(true);
    await scoreCardManagementService.delete(deleteRow.id);
    setDeleteRow(null);
    fetchList();
    setLoading(false);
  };

  const filtered = data.filter((i) =>
    i.impact_type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <PageHeader
        title="Score Card Management"
        subtitle="Configure score card templates"
        actionLabel="Add Score Card"
        actionIcon={<FiPlus />}
        onAction={() => navigate("/score-card/add")}
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search impact type..."
      />

      <ListView
        data={filtered}
        rowKey="id"
        columns={[
          { key: "impact_type", label: "Impact Type" },
          { key: "risk_impact", label: "Risk Impact" },
          { key: "is_active", label: "Status", type: "status" },
        ]}
        actions={[
          {
            icon: <FiEye />,
            color: "gray",
            onClick: (row) =>
              navigate(`/score-card/view/${row.id}`),
          },
          {
            icon: <FiEdit />,
            color: "blue",
            onClick: (row) =>
              navigate(`/score-card/edit/${row.id}`),
          },
          {
            icon: <FiTrash2 />,
            color: "red",
            onClick: (row) => setDeleteRow(row),
          },
        ]}
      />

      {deleteRow && (
        <DeleteConfirmButton
          title="Delete Score Card"
          message="Are you sure you want to delete this score card?"
          loading={loading}
          onCancel={() => setDeleteRow(null)}
          onConfirm={handleDelete}
        />
      )}
    </MainLayout>
  );
}
