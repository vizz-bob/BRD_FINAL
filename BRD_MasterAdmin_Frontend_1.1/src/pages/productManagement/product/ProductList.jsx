import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit, FiTrash2, FiEye } from "react-icons/fi";

import { productManagementService } from "../../../services/productManagementService";
import {
  PageHeader,
  SearchFilterBar,
  ListView,
  DeleteConfirmButton,
} from "../../../components/Controls/SharedUIHelpers";

export default function ProductList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productManagementService.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    await productManagementService.deleteProduct(deleteId);
    setDeleteId(null);
    loadProducts(); // ✅ correct function
  };

  /* ================= FILTER ================= */
  const filtered = products.filter((p) =>
    p.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= LIST CONFIG ================= */
  const columns = [
    { key: "product_name", label: "Product" },
    { key: "product_category", label: "Category" },
    { key: "product_type", label: "Type" },
    {
      key: "product_amount",
      label: "Amount",
      render: (v) => `₹${Number(v).toLocaleString()}`,
    },
    {
      key: "product_period_value",
      label: "Period",
      render: (_, row) =>
        `${row.product_period_value} ${row.product_period_unit}`,
    },
    { key: "is_active", label: "Status", type: "status" },
  ];

  const actions = [
    {
      icon: <FiEye />,
      color: "gray",
      onClick: (row) => navigate(`/product-management/${row.id}/view`),
    },
    {
      icon: <FiEdit />,
      color: "blue",
      onClick: (row) => navigate(`/product-management/${row.id}/edit`),
    },
    {
      icon: <FiTrash2 />,
      color: "red",
      onClick: (row) => setDeleteId(row.id),
    },
  ];

  return (
    <MainLayout>
      {/* ================= HEADER ================= */}
      <PageHeader
        title="Loan Products"
        subtitle="View and manage loan products"
        actionLabel="Add Product"
        actionIcon={<FiPlus />}
        onAction={() => navigate("/product-management/add")}
      />

      {/* ================= SEARCH ================= */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search product name..."
      />

      {/* ================= LIST ================= */}
      {loading ? (
        <p className="text-center py-6 text-gray-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-6 text-gray-500">No products found</p>
      ) : (
        <ListView
          data={filtered}
          columns={columns}
          actions={actions}
          rowKey="id"
        />
      )}

      {/* ================= DELETE CONFIRM ================= */}
      {deleteId && (
        <DeleteConfirmButton
          title="Delete Product"
          message="Are you sure you want to delete this product?"
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </MainLayout>
  );
}
