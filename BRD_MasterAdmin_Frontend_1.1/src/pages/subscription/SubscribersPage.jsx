import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import subscriberService from "../../services/subscriberService";
import { useNavigate } from "react-router-dom";

import {
  PageHeader,
  SearchFilterBar,
  ListView,
} from "../../components/Controls/SharedUIHelpers";

import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function SubscribersPage() {
  const navigate = useNavigate();

  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const res = await subscriberService.getAll();
      const data = Array.isArray(res) ? res : res?.results || [];
      setSubscribers(data);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (uuid) => {
    if (!window.confirm("Are you sure you want to delete this subscriber?"))
      return;
    await subscriberService.delete(uuid);
    loadSubscribers();
  };

  return (
    <MainLayout>

      {/* HEADER */}
      <PageHeader
        title="Subscribers"
        subtitle="View and manage all subscribers"
        showAction={false}
      />

      {/* SEARCH + FILTER */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by Tenant ID..."
      />

      {/* LIST */}
      {loading ? (
        <p className="text-center py-10 text-gray-500">
          Loading subscribers...
        </p>
      ) : (
        <ListView
          data={subscribers}
          columns={[
            { key: "tenant_id", label: "Tenant ID" },
            { key: "subscription_id", label: "Subscription" },
          ]}
          actions={[
            {
              icon: <FiEye />,
              color: "blue",
              onClick: (row) =>
                navigate(`/subscribers/view/${row.id}`),
            },
            {
              icon: <FiEdit2 />,
              color: "gray",
              onClick: (row) =>
                navigate(`/subscribers/edit/${row.id}`),
            },
            {
              icon: <FiTrash2 />,
              color: "red",
              onClick: (row) => handleDelete(row.uuid),
            },
          ]}
          rowKey="uuid"
        />
      )}
    </MainLayout>
  );
}
