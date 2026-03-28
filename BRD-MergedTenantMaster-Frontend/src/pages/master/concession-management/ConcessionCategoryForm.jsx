import React, { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import concessionManagementService from "../../../services/concessionManagementService";

import {
  SubPageHeader,
  InputField,
  SelectField,
  TextAreaField,
  Button,
} from "../../../components/master/Controls/SharedUIHelpers";

const PRODUCTS = [
  { label: "Payday Loan (Short-term Loan)", value: "Payday Loan (Short-term Loan)" },
  { label: "Personal Loan (Unsecured)", value: "Personal Loan (Unsecured)" },
  { label: "Business Loan", value: "Business Loan" },
  { label: "Group Loan (JLG/SHG Model)", value: "Group Loan (JLG/SHG Model)" },
  { label: "Unsecured Education Loan", value: "Unsecured Education Loan" },
  { label: "Consumer Durable Loan", value: "Consumer Durable Loan" },
  { label: "Loan Against Property (LAP)", value: "Loan Against Property (LAP)" },
  { label: "Loan Against Shares/Securities", value: "Loan Against Shares/Securities" },
  { label: "Gold Loan", value: "Gold Loan" },
  { label: "Vehicle Loan", value: "Vehicle Loan" },
  { label: "Secured Education Loan", value: "Secured Education Loan" },
  { label: "Supply Chain Finance", value: "Supply Chain Finance" },
  { label: "Bill/Invoice Discounting", value: "Bill/Invoice Discounting" },
  { label: "Virtual Card (Buy Now, Pay Later)", value: "Virtual Card (Buy Now, Pay Later)" },
  { label: "Credit Line - OD Facility", value: "Credit Line - OD Facility" },
];

const STATUS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

export default function ConcessionCategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [categoryId, setCategoryId] = useState(null);

  const [form, setForm] = useState({
    category_name: "",
    linked_concession_type: "",
    eligibility_criteria: "",
    product_type: "",
    valid_from: "",
    valid_to: "",
    status: "Active",
  });

  /* ---------- LOAD CONCESSION TYPES ---------- */
  useEffect(() => {
    const loadTypes = async () => {
      try {
        const res = await concessionManagementService.getAllTypes();
        setTypes(
          (res || []).map((t) => ({
            label: t.concession_type_name,
            value: t.uuid,
          }))
        );
      } catch {
        setError("Failed to load concession types");
      }
    };
    loadTypes();
  }, []);

  /* ---------- LOAD CATEGORY (EDIT) ---------- */
  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      setFetching(true);
      try {
        const res = await concessionManagementService.getCategory(id);
        setCategoryId(res.category_id || res.id || null);
        setForm({
          category_name: res.category_name || "",
          linked_concession_type: res.linked_concession_type || "",
          eligibility_criteria: res.eligibility_criteria || "",
          product_type: res.product_type || "",
          valid_from: res.valid_from || "",
          valid_to: res.valid_to || "",
          status: res.status || "Active",
        });
      } catch {
        setError("Failed to load category details");
      } finally {
        setFetching(false);
      }
    };

    fetchCategory();
  }, [id]);

  /* ---------- CHANGE HANDLER ---------- */
  const handleChange = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      id
        ? await concessionManagementService.updateCategory(id, form)
        : await concessionManagementService.createCategory(form);

      navigate("/concession-management");
    } catch (err) {
      console.error(err);
      setError("Failed to save concession category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SubPageHeader
        title={id ? "Edit Concession Category" : "Add Concession Category"}
        subtitle="Configure concession category rules"
        onBack={() => navigate(-1)}
      />

      {fetching ? (
        <p className="text-gray-500">Loading category details...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* ---- Section 1: Basic Details ---- */}
          <div className="md:col-span-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Basic Details
            </h2>
            <hr />
          </div>

          {/* Category ID — system-generated, only shown in edit mode */}
          {id && categoryId && (
            <InputField
              label="Category ID"
              value={categoryId}
              disabled
            />
          )}

          <InputField
            label="Category Name"
            value={form.category_name}
            onChange={(e) => handleChange("category_name", e.target.value)}
            placeholder="e.g. Senior Citizen Offer"
          />

          <SelectField
            label="Linked Concession Type"
            value={form.linked_concession_type}
            onChange={(e) =>
              handleChange("linked_concession_type", e.target.value)
            }
            options={types}
            placeholder="Select concession type"
          />

          <SelectField
            label="Product Type"
            value={form.product_type}
            onChange={(e) => handleChange("product_type", e.target.value)}
            options={PRODUCTS}
            placeholder="Select product"
          />

          {/* ---- Section 2: Validity ---- */}
          <div className="md:col-span-2 mt-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Validity
            </h2>
            <hr />
          </div>

          <InputField
            label="Valid From"
            type="date"
            value={form.valid_from}
            onChange={(e) => handleChange("valid_from", e.target.value)}
          />

          <InputField
            label="Valid To"
            type="date"
            value={form.valid_to}
            onChange={(e) => handleChange("valid_to", e.target.value)}
          />

          {/* ---- Section 3: Eligibility & Status ---- */}
          <div className="md:col-span-2 mt-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Eligibility & Status
            </h2>
            <hr />
          </div>

          <TextAreaField
            label="Eligibility Criteria"
            name="eligibility_criteria"
            value={form.eligibility_criteria}
            onChange={(e) =>
              handleChange("eligibility_criteria", e.target.value)
            }
            rows={5}
            maxLength={500}
            helperText="Define eligibility rules (max 500 characters)"
            className="md:col-span-2"
          />

          <SelectField
            label="Status"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
            options={STATUS}
          />

          {error && (
            <div className="md:col-span-2 text-sm text-red-600">{error}</div>
          )}

          <div className="md:col-span-2 flex justify-end">
            <Button
              type="submit"
              label={loading ? "Saving..." : "Save Category"}
              icon={<FiSave />}
              disabled={loading}
              variant="primary"
            />
          </div>
        </form>
      )}
    </>
  );
}