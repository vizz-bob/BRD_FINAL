import React from "react";
import MainLayout from "../../../layout/MainLayout";
import { FiTrendingUp, FiUsers, FiRefreshCw, FiAlignLeft, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AgentPerformance() {
    const metrics = [
        { label: "Total Leads", value: 120, icon: <FiUsers /> },
        { label: "Conversions", value: 45, icon: <FiTrendingUp /> },
        { label: "Recovery %", value: "92%", icon: <FiRefreshCw /> },
    ];

    const navigate = useNavigate()

    return (
        <MainLayout>
            {/* HEADER */}

            <div className="flex justify-between items-center mb-6">
                {/* LEFT SIDE */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                    >
                        <FiArrowLeft />
                    </button>

                    <div>
                        <h1 className="text-xl font-semibold">Agent Performance</h1>
                        <p className="text-sm text-gray-500">Track referral agent productivity and recovery efficiency</p>
                    </div>
                </div>

            </div>


            {/* KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-w-4xl">
                {metrics.map((m, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4"
                    >
                        <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                            {m.icon}
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500">
                                {m.label}
                            </p>
                            <p className="text-xl font-semibold text-gray-900">
                                {m.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* METRICS TABLE */}
            <div className="bg-white rounded-2xl shadow-sm p-6 max-w-4xl">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Detailed Metrics
                </h3>

                <div className="space-y-3">
                    <MetricRow label="Total Leads Generated" value="120" />
                    <MetricRow label="Total Conversions" value="45" />
                    <MetricRow label="Conversion Rate" value="37.5%" />
                    <MetricRow label="Recovery Efficiency" value="92%" />
                    <MetricRow label="Active Loans" value="38" />
                </div>
            </div>
        </MainLayout>
    );
}

/* ---------------- HELPERS ---------------- */

const MetricRow = ({ label, value }) => (
    <div className="flex justify-between items-center border border-gray-200 rounded-xl px-4 py-3 text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
    </div>
);
