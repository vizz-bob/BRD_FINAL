import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiSave,FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/* ---------------- COMPONENT ---------------- */

export default function CollectionControl() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    collection_types: [],
    security_deposit: "",
    cash_collection_limit: "",
  });

  const COLLECTION_TYPES = [
    "Online",
    "Offline",
    "Legal",
  ];

  /* ---------------- LOAD CURRENT CONFIG ---------------- */
  useEffect(() => {
    // MOCK DATA (API later)
    const config = {
      collection_types: ["Online", "Offline"],
      security_deposit: 10000,
      cash_collection_limit: 20000,
    };

    setFormData(config);
  }, []);

  /* ---------------- HANDLERS ---------------- */

  const toggleCollectionType = (type) => {
    setFormData((prev) => ({
      ...prev,
      collection_types: prev.collection_types.includes(type)
        ? prev.collection_types.filter((t) => t !== type)
        : [...prev.collection_types, type],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Update Collection Control:", formData);

    // API later
    // await collectionControlService.update(formData);

    alert("Collection control settings updated");
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="mb-6">
           
        <h1 className="text-xl font-semibold flex items-center gap-3">
           <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <FiArrowLeft />
                </button>Collection Control Management
        </h1>
        <p className="text-sm text-gray-500">
          Define collection rules, security deposit, and cash limits
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl space-y-6"
      >
        {/* COLLECTION TYPES */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Allowed Collection Types
          </label>

          <div className="flex flex-wrap gap-3">
            {COLLECTION_TYPES.map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => toggleCollectionType(type)}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  formData.collection_types.includes(type)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-1">
            These collection modes will be available system-wide
          </p>
        </div>

        {/* SECURITY DEPOSIT */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Security Deposit (₹)
          </label>
          <input
            type="number"
            name="security_deposit"
            value={formData.security_deposit}
            onChange={handleChange}
            placeholder="Enter security deposit amount"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {/* CASH COLLECTION LIMIT */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Cash Collection Limit per Agent (₹)
          </label>
          <input
            type="number"
            name="cash_collection_limit"
            value={formData.cash_collection_limit}
            onChange={handleChange}
            placeholder="Maximum cash allowed per agent"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {/* ACTION */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm flex items-center gap-2 hover:bg-blue-700"
          >
            <FiSave /> Save Settings
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
