import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave } from "react-icons/fi";
import {
  productManagementService,
  productMixService,
} from "../../../services/productManagementService";
import {
  SubPageHeader,
  InputField,
  SelectField,
  MultiSelectField,
  Button,
} from "../../../components/Controls/SharedUIHelpers";

/* ================= OPTIONS ================= */
const CATEGORY_OPTIONS = [
  { label: "Loan", value: "Loan" },
  { label: "Credit", value: "Credit" },
];

const TYPE_OPTIONS = [
  { label: "Personal Loan", value: "Personal Loan" },
  { label: "Home Loan", value: "Home Loan" },
];

const PERIOD_UNITS = [
  { label: "Days", value: "DAYS" },
  { label: "Months", value: "MONTHS" },
  { label: "Years", value: "YEARS" },
];

const EditProductMix = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    category: "",
    type: "",
    name: "",
    amount: "",
    periodValue: "",
    periodUnit: "MONTHS",
  });

  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  /* ================= LOAD PRODUCTS AND PRODUCT MIX ================= */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1️⃣ fetch all products
        const products = await productManagementService.getProducts();
        const options = products.map((p) => ({
          label: p.product_name,
          value: p.id,
        }));
        setAllProducts(options);

        // 2️⃣ fetch existing product mix
        const mix = await productMixService.getProductMix(id);

        // 3️⃣ set form fields
        setForm({
          category: mix.product_category || "",
          type: mix.product_type || "",
          name: mix.product_mix_name || "",
          amount: mix.product_mix_amount || "",
          periodValue: mix.product_period_value || "",
          periodUnit: mix.product_period_unit || "MONTHS",
        });

        // 4️⃣ safely map selected products
        const selected = (mix.products || [])
          .map((p) => {
            if (!p) return null;

            // If backend sends objects: {id, product_name}
            if (typeof p === "object" && p.id && p.product_name) {
              return { label: p.product_name, value: p.id };
            }

            // If backend sends UUID string
            if (typeof p === "string") {
              const found = options.find((o) => o.value === p);
              return found || null; // skip if not found
            }

            return null;
          })
          .filter(Boolean); // remove null/undefined

        setSelectedProducts(selected);
      } catch (err) {
        console.error("Failed to load product mix or products:", err);
        alert("Cannot load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProducts.length) {
      alert("Please select at least one product.");
      return;
    }

    setLoading(true);

    const payload = {
      product_category: form.category,
      product_type: form.type,
      product_mix_name: form.name,
      product_mix_amount: parseFloat(form.amount),
      product_period_value: parseInt(form.periodValue, 10),
      product_period_unit: form.periodUnit,
      products: selectedProducts.map((p) => p.value).filter(Boolean), // ✅ only valid UUIDs
    };

    console.log("Payload:", payload);

    try {
      await productMixService.updateProductMix(id, payload);
      alert("Product Mix updated successfully");
      navigate("/product-mix/list");
    } catch (err) {
      console.error(
        "Failed to update product mix:",
        err.response?.data || err
      );
      alert("Error updating product mix");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p className="text-gray-500 text-sm">Loading product mix...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SubPageHeader
        title="Edit Product Mix"
        subtitle="Update bundled product configuration"
        onBack={() => navigate(-1)}
      />

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl">
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
            label="Product Mix Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <InputField
            label="Product Mix Amount"
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Period Value"
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

          {/* MultiSelect for Products */}
          <MultiSelectField
            label="Select Products"
            values={selectedProducts}
            onChange={setSelectedProducts}
            options={allProducts}
            placeholder="Choose products..."
          />

          <div className="md:col-span-2 pt-4">
            <Button
              type="submit"
              fullWidth
              icon={<FiSave />}
              label={loading ? "Saving..." : "Update Product Mix"}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditProductMix;
