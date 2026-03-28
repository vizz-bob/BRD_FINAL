import React from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function ViewLoginFee() {
    const navigate = useNavigate();

    const data = {
        "Fee Name": "Application Login Fee",
        "Fee Type": "Flat",
        Amount: "₹1500",
        Status: "Active",
    };

    return (
        <MainLayout>
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100">
                    <FiArrowLeft />
                </button>
                <div>
                    <h1 className="text-2xl font-bold">View Login Fee</h1>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl space-y-4">
                {Object.entries(data).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">{k}</span>
                        <span className="font-medium">{v}</span>
                    </div>
                ))}
            </div>
        </MainLayout>
    );
}
