import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiSave } from "react-icons/fi";
import { productManagementService, productMixService } from "../../../services/productManagementService";
import {
  SubPageHeader,
  InputField,
  SelectField,
  MultiSelectField,
  Button,
} from "../../../components/Controls/SharedUIHelpers";

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

const AddProductMix = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: "",
    type: "",
    name: "",
    amount: "",
    periodValue: "",
    periodUnit: "MONTHS",
  });

  const [allProducts, setAllProducts] = useState([]); // options for MultiSelect
  const [selectedProducts, setSelectedProducts] = useState([]); // selected products
  const [loading, setLoading] = useState(false);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productManagementService.getProducts();
        if (!Array.isArray(data)) return;

        const options = data.map((p) => ({
          label: p.product_name,
          value: p.id, // ✅ UUID
        }));
        setAllProducts(options);
        console.log(allProducts)
      } catch (err) {
        console.error("Failed to fetch products:", err);
        alert("Cannot load products");
      }
    };
    fetchProducts();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleProductSelect = (selected) => {
  // selected is [{label, value}, ...]
  setSelectedProducts(selected);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(selectedProducts)

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
      products: selectedProducts // array of UUIDs
    };

    console.log("Selected Products:", selectedProducts);
    console.log("Payload:", payload); // check what is being sent

    try {
      await productMixService.createProductMix(payload);
      navigate("/product-mix/list");
    } catch (error) {
      console.error("Failed to create product mix:", error.response?.data || error);
      alert("Error creating product mix");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <SubPageHeader
        title="Add Product Mix"
        subtitle="Create a bundled product offering"
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
            values={selectedProducts} // must be {label, value} array
            onChange={handleProductSelect}
            options={allProducts}
            placeholder="Choose products..."
          />

          <div className="md:col-span-2 pt-4">
            <Button
              type="submit"
              fullWidth
              icon={<FiSave />}
              label={loading ? "Saving..." : "Add Product Mix"}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AddProductMix;
