import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import employmentTypeService from "../../services/employementTypeService";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AddEmploymentTypePage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Employment type name is required.");
      return;
    }

    await employmentTypeService.create({ emp_name: name });

    alert("Employment type added successfully!");
    navigate("/employment-types");
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white border hover:bg-gray-100">
          <FiArrowLeft />
        </button>
        <h1 className="text-xl font-semibold">Add Employment Type</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-lg">
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Employment Type Name</label>
          <input
            type="text"
            placeholder="Enter employment type"
            className="w-full p-3 border rounded-xl outline-none focus:border-blue-500"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="mt-6 flex gap-3">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Save</button>
            <button
              type="button"
              onClick={() => navigate("/employment-types")}
              className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
