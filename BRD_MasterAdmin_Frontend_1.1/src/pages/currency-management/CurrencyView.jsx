import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import currencyManagementService from "../../services/currencyManagementService";

export default function CurrencyView() {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrency = async () => {
      if (!uuid) {
        setLoading(false);
        return;
      }
      try {
        const res = await currencyManagementService.getOne(uuid);
        setData(res);
      } catch (err) {
        console.error("Failed to load currency:", err.response?.data || err);
        setError("Failed to load currency details");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrency();
  }, [uuid]);

  if (loading) {
    return (
      <MainLayout>
        <p className="text-center mt-10 text-gray-500">Loading currency details...</p>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <p className="text-center mt-10 text-red-600">{error}</p>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <p className="text-center mt-10 text-gray-500">No currency data available.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100"
        >
          <FiArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Currency Details</h1>
      </div>

      {/* DETAILS */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl space-y-4">
        <Detail label="Currency Code" value={data.currency_code || "-"} />
        <Detail label="Symbol" value={data.currency_symbol || "-"} />
        <Detail label="Conversion to INR" value={data.conversion_value_to_inr ?? "-"} />
        <Detail label="Status" value={data.status || "-"} />
      </div>
    </MainLayout>
  );
}

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-base font-medium">{value}</p>
  </div>
);
