import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import employmentTypeService from "../../services/employementTypeService";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function EditEmploymentTypePage() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [empName, setEmpName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Load existing employment type details
  const loadDetails = async () => {
    const res = await employmentTypeService.getById(uuid);
    if (res) {
      setEmpName(res.emp_name);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!empName.trim()) {
      setError("Employment type name is required.");
      return;
    }

    try {
      const payload = {
        emp_name: empName,
      };

      await employmentTypeService.update(uuid, payload);

      alert("Employment type updated successfully!");
      navigate("/employment-types");
    } catch (err) {
      console.error(err);
      alert("Failed to update employment type.");
    }
  };

  if (loading) return <MainLayout>Loading...</MainLayout>;

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white border hover:bg-gray-100"
        >
          <FiArrowLeft />
        </button>
        <h1 className="text-xl font-semibold">Edit Employment Type</h1>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-lg">
        <form onSubmit={handleSubmit}>
          {/* EMPLOYMENT NAME */}
          <label className="block mb-2 font-medium">Employment Type Name</label>
          <input
            type="text"
            placeholder="Enter employment type name"
            value={empName}
            onChange={(e) => {
              setEmpName(e.target.value);
              setError("");
            }}
            className="w-full p-3 border rounded-xl outline-none focus:border-blue-500"
          />

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          {/* BUTTONS */}
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Update
            </button>

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
