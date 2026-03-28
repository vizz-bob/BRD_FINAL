// src/pages/products/EditProduct.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { productManagementService } from "../../../services/productManagementService";

import {
  SubPageHeader,
  InputField,
  SelectField,
  Button,
} from "../../../components/Controls/SharedUIHelpers";

/* ================= OPTIONS ================= */
const CATEGORY_OPTIONS = [
  { label: "Loan", value: "Loan" },
  { label: "Credit", value: "Credit" },
];

const TYPE_OPTIONS = [
  { label: "Secure Loan", value: "Secure Loan" },
  { label: "Unsecure Loan", value: "Unsecure Loan" },
];

const PERIOD_UNITS = [
  { label: "Days", value: "DAYS" },
  { label: "Months", value: "MONTHS" },
  { label: "Years", value: "YEARS" },
];

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [form, setForm] = useState({
    category: "",
    type: "",
    name: "",
    amount: "",
    periodValue: "",
    periodUnit: "MONTHS",
  });

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await productManagementService.getProduct(id);

        setForm({
          category: data.product_category || "",
          type: data.product_type || "",
          name: data.product_name || "",
          amount: data.product_amount || "",
          periodValue: data.product_period_value || "",
          periodUnit: data.product_period_unit || "MONTHS",
        });
      } catch (error) {
        console.error("Failed to fetch product:", error);
        alert("Error fetching product data");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const payload = {
        product_category: form.category,
        product_type: form.type,
        product_name: form.name,
        product_amount: parseFloat(form.amount),
        product_period_value: parseInt(form.periodValue, 10),
        product_period_unit: form.periodUnit,
      };

      console.log("Updating Payload:", payload);

      await productManagementService.updateProduct(id, payload);
      navigate("/product-management/list");
    } catch (error) {
      console.error("Failed to update product:", error?.response?.data || error);
      alert("Error updating product");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-gray-500">Loading product...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SubPageHeader
        title="Edit Product"
        subtitle="Update product configuration"
        onBack={() => navigate(-1)}
      />

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <SelectField
            label="Product Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            options={CATEGORY_OPTIONS}
            required
          />

          <SelectField
            label="Product Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            options={TYPE_OPTIONS}
            required
          />

          <InputField
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <InputField
            label="Product Amount"
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Product Period"
              type="number"
              name="periodValue"
              value={form.periodValue}
              onChange={handleChange}
              required
            />

            <SelectField
              label="Unit"
              name="periodUnit"
              value={form.periodUnit}
              onChange={handleChange}
              options={PERIOD_UNITS}
              required
            />
          </div>

          <div className="md:col-span-2 pt-4">
            <Button
              type="submit"
              fullWidth
              icon={<FiSave />}
              label={submitLoading ? "Updating..." : "Update Product"}
              disabled={submitLoading}
            />
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditProduct;
