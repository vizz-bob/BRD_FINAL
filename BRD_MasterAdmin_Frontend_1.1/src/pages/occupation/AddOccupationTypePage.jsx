import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import occupationTypeService from "../../services/occupationTypeService";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AddOccupationTypePage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Occupation name is required.");
      return;
    }

    try {
      await occupationTypeService.create({ occ_name: name });
      alert("Occupation added successfully!");
      navigate("/occupation-types");
    } catch (error) {
      alert("Failed to add occupation.");
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white border hover:bg-gray-100"
        >
          <FiArrowLeft />
        </button>
        <h1 className="text-xl font-semibold">Add Occupation Type</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-lg">
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Occupation Name</label>
          <input
            type="text"
            placeholder="Enter occupation name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            className="w-full p-3 border rounded-xl outline-none focus:border-blue-500"
          />

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <div className="mt-6 flex gap-3">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              Save
            </button>

            <button
              type="button"
              onClick={() => navigate("/occupation-types")}
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
