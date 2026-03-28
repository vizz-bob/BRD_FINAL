import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
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

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: "",
    type: "",
    name: "",
    amount: "",
    periodValue: "",
    periodUnit: "MONTHS",
  });

  const [loading, setLoading] = useState(false);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        product_category: form.category,
        product_type: form.type,
        product_name: form.name,
        product_amount: parseFloat(form.amount),
        product_period_value: parseInt(form.periodValue, 10),
        product_period_unit: form.periodUnit,
      };


      await productManagementService.createProduct(payload);
      navigate("/product-management/list");
    } catch (error) {
      console.error("Failed to create product:", error?.response?.data || error);
      alert("Error creating product. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <SubPageHeader
        title="Add New Product"
        subtitle="Enter product details and configuration"
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
            placeholder="Select Product Category"
            required
          />

          <SelectField
            label="Product Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            options={TYPE_OPTIONS}
            placeholder="Select Product Type"
            required
          />

          <InputField
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />

          <InputField
            label="Product Amount"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Product Period"
              name="periodValue"
              type="number"
              value={form.periodValue}
              onChange={handleChange}
              placeholder="Enter value"
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
              label={loading ? "Saving..." : "Add Product"}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AddProduct;
