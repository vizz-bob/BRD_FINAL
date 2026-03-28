import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../layout/MainLayout";
import { FiArrowLeft, FiSave } from "react-icons/fi";

export default function ManageVerificationFees() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [fees, setFees] = useState({
    kyc: "",
    address: "",
    valuation: "",
    legal: "",
    fraud: "",
  });

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    if (id) {
      // TODO: replace with API call
      const data = {
        kyc: "500",
        address: "300",
        valuation: "2000",
        legal: "1500",
        fraud: "2500",
      };
      setFees(data);
    }
  }, [id]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFees((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updating verification fees:", fees);
    // API: PUT /verification-agencies/:id/fees
    navigate(-1);
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1 className="text-xl font-semibold">Manage Verification Fees</h1>
          <p className="text-sm text-gray-500">
            Configure service-wise fees for the selected agency
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="KYC Verification Fee"
            name="kyc"
            value={fees.kyc}
            onChange={handleChange}
            placeholder="₹ Amount"
          />

          <Input
            label="Address Verification Fee"
            name="address"
            value={fees.address}
            onChange={handleChange}
            placeholder="₹ Amount"
          />

          <Input
            label="Valuation Fee"
            name="valuation"
            value={fees.valuation}
            onChange={handleChange}
            placeholder="₹ Amount"
          />

          <Input
            label="Legal Opinion Fee"
            name="legal"
            value={fees.legal}
            onChange={handleChange}
            placeholder="₹ Amount"
          />

          <Input
            label="Fraud Investigation Fee"
            name="fraud"
            value={fees.fraud}
            onChange={handleChange}
            placeholder="₹ Amount"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl text-sm border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 rounded-xl text-sm bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <FiSave /> Update Fees
          </button>
        </div>
      </form>
    </MainLayout>
  );
}

/* ---------------- REUSABLE FIELD ---------------- */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);
