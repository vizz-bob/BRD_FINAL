import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function ViewLanguage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [language, setLanguage] = useState(null);

  useEffect(() => {
    // TODO: fetch language by id
    setLanguage({ name: "English", code: "EN", default: true });
  }, [id]);

  if (!language) return <MainLayout>Loading...</MainLayout>;

  return (
    <MainLayout>
      <div className="flex items-center gap-3 mb-8">
        <button type="button" onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100">
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold">View Language</h1>
          <p className="text-gray-500 text-sm">Platform language details</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl space-y-4">
        <div><span className="font-medium">Name: </span>{language.name}</div>
        <div><span className="font-medium">Code: </span>{language.code}</div>
        <div><span className="font-medium">Default: </span>{language.default ? "Yes" : "No"}</div>

        <button
          onClick={() => navigate("/controls/language")}
          className="mt-4 px-5 py-3 rounded-xl border text-gray-700"
        >
          Back
        </button>
      </div>
    </MainLayout>
  );
}
