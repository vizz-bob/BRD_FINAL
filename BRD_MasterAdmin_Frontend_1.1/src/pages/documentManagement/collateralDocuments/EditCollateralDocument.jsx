import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";

const EditCollateralDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    setForm({
      category: "Immovable",
      type: "Property",
      coverage: "Full",
      mode: "Registered",
      ratio: "80%",
      details: "Residential property",
      status: "Active",
    });
  }, [id]);

  if (!form) return <MainLayout>Loading...</MainLayout>;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <MainLayout>
      <h1 className="text-xl font-semibold mb-6">
        Edit Collateral Document
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/documents/collateral");
        }}
        className="bg-white p-6 rounded-2xl shadow-md max-w-3xl grid grid-cols-2 gap-6"
      >
        <input name="category" value={form.category} onChange={handleChange} />
        <input name="type" value={form.type} onChange={handleChange} />
        <input name="coverage" value={form.coverage} onChange={handleChange} />
        <input name="mode" value={form.mode} onChange={handleChange} />
        <input name="ratio" value={form.ratio} onChange={handleChange} />
        <textarea
          name="details"
          value={form.details}
          onChange={handleChange}
          className="col-span-2"
        />

        <div className="col-span-2">
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
            Update
          </button>
        </div>
      </form>
    </MainLayout>
  );
};

export default EditCollateralDocument;
