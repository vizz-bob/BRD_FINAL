import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import { productManagementService } from "../../../services/productManagementService";

import {
  SubPageHeader,
  StatusBadge,
  Button,
  FormCard,
} from "../../../components/Controls/SharedUIHelpers";

const ViewProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await productManagementService.getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        alert("Unable to load product details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <p className="text-gray-500">Loading product...</p>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <p className="text-red-500">Product not found</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SubPageHeader
        title="View Product"
        subtitle="Product configuration details"
        onBack={() => navigate(-1)}
        right={
          <Button
            icon={<FiEdit />}
            label="Edit Product"
            onClick={() =>
              navigate(`/product-management/edit/${product.id}`)
            }
          />
        }
      />

      <FormCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Detail label="Product Name" value={product.product_name} />
          <Detail label="Category" value={product.product_category} />
          <Detail label="Type" value={product.product_type} />

          <Detail
            label="Amount"
            value={`₹ ${Number(product.product_amount).toLocaleString()}`}
          />

          <Detail
            label="Tenure"
            value={`${product.product_period_value} ${product.product_period_unit}`}
          />

          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <StatusBadge
              status={product.is_active ? "Active" : "Inactive"}
              variant={product.is_active ? "success" : "danger"}
            />
          </div>

          <Detail
            label="Created At"
            value={new Date(product.created_at).toLocaleString()}
          />
        </div>
      </FormCard>
    </MainLayout>
  );
};

/* ---------- Reusable Row ---------- */
const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-gray-800 font-medium">{value || "-"}</p>
  </div>
);

export default ViewProduct;
