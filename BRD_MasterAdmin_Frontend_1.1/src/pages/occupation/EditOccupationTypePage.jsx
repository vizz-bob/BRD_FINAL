import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import occupationTypeService from "../../services/occupationTypeService";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function EditOccupationTypePage() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const res = await occupationTypeService.getById(uuid);
    setName(res.occ_name);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await occupationTypeService.update(uuid, { occ_name: name });
    alert("Occupation updated successfully!");
    navigate("/occupation-types");
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
        <h1 className="text-xl font-semibold">Edit Occupation Type</h1>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-lg">
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Occupation Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-xl outline-none focus:border-blue-500"
          />

          <div className="mt-6 flex gap-3">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              Update
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
