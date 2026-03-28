import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";

export default function VendorMasterEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    type: "",
    category: "",
    constitution: "",
    location: "",
    serviceType: "",
  });

  useEffect(() => {
    // Mock fetch
    setForm({
      type: "Company",
      category: "Legal",
      constitution: "Pvt Ltd",
      location: "Mumbai",
      serviceType: "Documentation",
    });
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = () => {
    console.log("Update Vendor:", id, form);
    navigate("/profile-management/vendor");
  };

  return (
    <MainLayout>
      <h1 className="text-xl font-semibold mb-4">Edit Vendor</h1>

      <div className="bg-white p-6 rounded-2xl shadow grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            name={key}
            value={value}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />
        ))}

        <div className="md:col-span-2 flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl"
          >
            Update Vendor
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
