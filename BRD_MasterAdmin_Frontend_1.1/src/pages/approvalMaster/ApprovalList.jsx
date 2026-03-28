import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiPlus, FiEdit3, FiTrash2, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { approvalMasterService } from "../../services/approvalMasterService";
import {
  PageHeader,
  SearchFilterBar,
  ListView,
} from "../../components/Controls/SharedUIHelpers";

export default function ApprovalList() {
  const navigate = useNavigate();

  const [approvals, setApprovals] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    try {
      setLoading(true);
      const data = await approvalMasterService.getApprovalList();
      setApprovals(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredData = approvals.filter(
    (a) =>
      a.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.sanction_name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- TABLE CONFIG ---------------- */
  const columns = [
    { key: "product_name", label: "Product" },
    { key: "level", label: "Level" },
    { key: "type", label: "Type" },
    {
      key: "sanction_display",
      label: "Sanction",
    },
    {
      key: "status",
      label: "Status",
      type: "status",
    },
  ];

  const tableData = filteredData.map((a) => ({
    ...a,
    sanction_display: `${a.sanction_name} (${a.approval_range})`,
  }));

  const actions = [
    {
      icon: <FiEye />,
      color: "gray",
      onClick: (row) => navigate(`/approvals/view/${row.id}`),
    },
    {
      icon: <FiEdit3 />,
      color: "blue",
      onClick: (row) => navigate(`/approvals/edit/${row.id}`),
    },
    {
      icon: <FiTrash2 />,
      color: "red",
      onClick: async (row) => {
        await approvalMasterService.deleteApproval(row.id);
        loadApprovals();
      },
    },
  ];

  /* ---------------- UI ---------------- */
  return (
    <MainLayout>
      <PageHeader
        title="Approval Master"
        subtitle="Manage approval rules and sanction levels"
        actionLabel="Add Approval"
        actionIcon={<FiPlus />}
        onAction={() => navigate("/approvals/add")}
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search product or sanction..."
      />

      <ListView
        data={tableData}
        columns={columns}
        actions={actions}
        rowKey="id"
      />
    </MainLayout>
  );
}
