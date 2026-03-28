import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import currencyManagementService from "../../../services/currencyManagementService";

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
    return <p className="text-center mt-10 text-gray-500">Loading currency details...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  if (!data) {
    return <p className="text-center mt-10 text-gray-500">No currency data available.</p>;
  }

  return (
    <>
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

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl space-y-6">

        {/* ---- Section 1: Basic Currency Details ---- */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Basic Currency Details
          </h2>
          <hr className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Detail label="Currency Code"         value={data.currency_code || "-"} />
            <Detail label="Currency Name"         value={data.currency_name || "-"} />
            <Detail label="Currency Symbol"       value={data.currency_symbol || "-"} />
            <Detail label="Conversion to INR"     value={data.conversion_value_to_inr ?? "-"} />
          </div>
        </div>

        {/* ---- Section 2: Globalization & UI Settings ---- */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Globalization & UI Settings
          </h2>
          <hr className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Detail label="Time Zone"      value={data.time_zone || "-"} />
            <Detail label="Decimal Places" value={data.decimal_places ?? "-"} />
            <Detail label="Rounding Rule"  value={data.rounding_rule || "-"} />
          </div>
        </div>

        {/* ---- Section 3: System & Audit Fields ---- */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            System & Audit Fields
          </h2>
          <hr className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Detail label="Status"           value={data.status || "-"} />
            <Detail label="Effective Date"   value={data.effective_date || "-"} />
            <Detail label="Version Number"   value={data.version_number ?? "-"} />
            <Detail label="Created At"       value={data.created_at ? new Date(data.created_at).toLocaleString() : "-"} />
            <Detail label="Updated At"       value={data.updated_at ? new Date(data.updated_at).toLocaleString() : "-"} />
            <Detail label="Performed By"     value={data.performed_by || data.created_by || "-"} />
          </div>
        </div>

      </div>
    </>
  );
}

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-base font-medium">{value}</p>
  </div>
);