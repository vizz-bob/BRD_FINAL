import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import {
  PageHeader,
  ListView,
  SearchFilterBar
} from "../../components/Controls/SharedUIHelpers";
import { productManagementService } from "../../services/productManagementService";

export default function LoanImprovementList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCTS ================= */
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

   /* ================= FILTER ================= */
  const filtered = products.filter((p) =>
    p.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= LIST COLUMNS ================= */
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

  /* ================= ROW ACTIONS ================= */
  const actions = [
    {
      icon: <FiArrowRight />,
      color: "blue",
      onClick: (row) => navigate(`/loan-improvement/${row.id}`), // Open loan improvement for product
    },
  ];

  return (
    <MainLayout>
      {/* ================= HEADER ================= */}
      <PageHeader
        title="Loan Improvement Management"
        subtitle="Select a product to create/improve a loan"
      />

      {/* ================= SEARCH ================= */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by product name..."
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
    </MainLayout>
  );
}
