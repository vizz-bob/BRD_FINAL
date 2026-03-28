import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

import { productMixService } from "../../../../services/productManagementService";
import {
  PageHeader,
  SearchFilterBar,
  ListView,
  DeleteConfirmButton,
} from "../../../../components/master/Controls/SharedUIHelpers";
import AddProductMix from "./AddProductMix";

const ProductMixList = () => {
  const navigate = useNavigate();

  const [mixes, setMixes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadMixes = async () => {
    setLoading(true);
    try {
      const data = await productMixService.getProductMixes();
      setMixes(Array.isArray(data) ? data : (data?.results || []));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMixes();
  }, []);

  const confirmDelete = async () => {
    await productMixService.deleteProductMix(deleteId);
    setDeleteId(null);
    loadMixes();
  };

  const filteredMixes = (Array.isArray(mixes) ? mixes : []).filter((m) =>
    m.product_mix_name?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: "product_mix_name", label: "Mix Name" },
    { key: "product_category", label: "Category" },
    { key: "product_type", label: "Type" },
    {
      key: "product_mix_amount",
      label: "Amount",
      render: (v) => `₹${Number(v).toLocaleString()}`,
    },
    {
      key: "product_period_value",
      label: "Period",
      render: (_, row) => `${row.mix_period_value} ${row.mix_period_unit}`,
    },
    { key: "is_active", label: "Status", type: "status" },
  ];

  const actions = [
    {
      icon: <FiEdit />,
      color: "blue",
      onClick: (row) => navigate(`/product-mix/${row.id}/edit`),
    },
    {
      icon: <FiTrash2 />,
      color: "red",
      onClick: (row) => setDeleteId(row.id),
    },
  ];

  return (
    <div className="px-8 py-6">
      <PageHeader
        title="Product Mix Management"
        subtitle="Manage bundled product offerings"
        actionLabel="Add Product Mix"
        actionIcon={<FiPlus />}
        onAction={() => setShowAddModal(true)}
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search product mix..."
      />

      {loading ? (
        <p className="text-gray-500 text-sm">Loading product mixes...</p>
      ) : filteredMixes.length === 0 ? (
        <p className="text-gray-500 text-sm">No product mixes found.</p>
      ) : (
        <ListView
          data={filteredMixes}
          columns={columns}
          actions={actions}
          rowKey="id"
        />
      )}

      {deleteId && (
        <DeleteConfirmButton
          title="Delete Product Mix"
          message="Are you sure you want to delete this product mix?"
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />
      )}

      {showAddModal && (
        <AddProductMix
          onClose={() => setShowAddModal(false)}
          onSuccess={loadMixes}
        />
      )}
    </div>
  );
};

export default ProductMixList;