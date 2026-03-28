import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

import couponService from "../../services/couponService";

import {
  PageHeader,
  SearchFilterBar,
  ListView,
} from "../../components/Controls/SharedUIHelpers";

export default function CouponPage() {
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");

  /* ---------------- DATE FORMAT ---------------- */
  const formatDate = (date) => (date ? date.split("T")[0] : "-");

  /* ---------------- LOAD ---------------- */
  const loadCoupons = async () => {
    try {
      const res = await couponService.getAll();
      const data = Array.isArray(res) ? res : res?.results || [];
      setList(data);
    } catch (err) {
      console.error("Failed to load coupons:", err);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredData = list.filter((c) =>
    c.coupon_code?.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (row) => {
    if (!window.confirm("Delete this coupon?")) return;
    await couponService.delete(row.id);
    loadCoupons();
  };

  /* ---------------- TABLE CONFIG ---------------- */
  const columns = [
    { key: "coupon_code", label: "Code" },
    {
      key: "coupon_value",
      label: "Value",
      render: (row) => `₹${row.coupon_value}`,
    },
    {
      key: "validity",
      label: "Validity",
      render: (row) =>
        `${formatDate(row.valid_from)} → ${formatDate(row.valid_to)}`,
    },
    {
      key: "subscription_names",
      label: "Subscriptions",
      render: (row) =>
        row.subscription_names?.length
          ? row.subscription_names.join(", ")
          : "-",
    },
  ];

  const actions = [
    {
      icon: <FiEdit2 />,
      color: "blue",
      onClick: (row) => navigate(`/coupons/edit/${row.id}`),
    },
    {
      icon: <FiTrash2 />,
      color: "red",
      onClick: handleDelete,
    },
  ];

  return (
    <MainLayout>

      {/* PAGE HEADER */}
      <PageHeader
        title="Coupons"
        subtitle="Manage discount coupons"
        actionLabel="Add Coupon"
        actionIcon={<FiPlus />}
        onAction={() => navigate("/coupons/add")}
      />

      {/* SEARCH */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search coupon code..."
      />

      {/* LIST */}
      {filteredData.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-sm">
          No coupons found
        </div>
      ) : (
        <ListView
          data={filteredData}
          columns={columns}
          actions={actions}
          rowKey="id"
        />
      )}
    </MainLayout>
  );
}
