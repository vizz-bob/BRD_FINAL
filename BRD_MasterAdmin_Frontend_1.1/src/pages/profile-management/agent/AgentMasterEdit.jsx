import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";

export default function AgentMasterEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    type: "",
    category: "",
    level: "",
    constitution: "",
    location: "",
    serviceType: "",
    responsibilities: [],
  });

  useEffect(() => {
    setForm({
      type: "DSA",
      category: "Freelance",
      level: "Tier 1",
      constitution: "Individual",
      location: "Pune",
      serviceType: "Lead Generation",
      responsibilities: ["Sourcing", "Support"],
    });
  }, [id]);

  const toggle = (value) => {
    setForm((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.includes(value)
        ? prev.responsibilities.filter((v) => v !== value)
        : [...prev.responsibilities, value],
    }));
  };

  const handleUpdate = () => {
    console.log("Update Agent:", id, form);
    navigate("/profile-management/agent");
  };

  return (
    <MainLayout>
      <h1 className="text-xl font-semibold mb-4">Edit Agent</h1>

      <div className="bg-white p-6 rounded-2xl shadow grid md:grid-cols-2 gap-4">
        {Object.entries(form).map(
          ([key, value]) =>
            key !== "responsibilities" && (
              <input
                key={key}
                value={value}
                className="border p-2 rounded-lg"
                readOnly
              />
            )
        )}

        <div className="md:col-span-2">
          <p className="text-sm font-medium mb-2">Responsibilities</p>
          <div className="grid grid-cols-2 gap-2">
            {["Sourcing", "Collection", "Support"].map((r) => (
              <label key={r} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.responsibilities.includes(r)}
                  onChange={() => toggle(r)}
                />
                {r}
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl"
          >
            Update Agent
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
