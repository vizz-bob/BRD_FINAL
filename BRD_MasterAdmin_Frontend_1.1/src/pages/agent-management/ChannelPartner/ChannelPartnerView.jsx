import React from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import {
    FiEdit3,
    FiDollarSign,
    FiRefreshCw,
    FiTrendingUp,
    FiUsers,
    FiArrowLeft,
} from "react-icons/fi";

export default function ChannelPartnerView() {
    const { id } = useParams();
    const navigate = useNavigate();

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
                        <h1 className="text-xl font-semibold">Channel Partner Details</h1>
                        <p className="text-sm text-gray-500">View agent profile and manage configurations</p>
                    </div>
                </div>
            </div>


            {/* DETAILS CARD */}
            <div className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DetailItem label="Agent Name" value="Rahul Sharma" />
                    <DetailItem label="Agent Type" value="DSA" />
                    <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">Status</p>
                        <span className="inline-flex px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                            Active
                        </span>
                    </div>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                <ActionCard
                    title="Edit Agent"
                    description="Update agent profile and status"
                    icon={<FiEdit3 />}
                    onClick={() => navigate(`/channel-partners/edit/${id}`)}
                />

                <ActionCard
                    title="Update Payout"
                    description="Configure commissions & incentives"
                    icon={<FiDollarSign />}
                    onClick={() => navigate(`/channel-partners/payout/${id}`)}
                />

                <ActionCard
                    title="Update Recovery"
                    description="Assign repayment recovery rules"
                    icon={<FiRefreshCw />}
                    onClick={() => navigate(`/channel-partners/recovery/${id}`)}
                />

                <ActionCard
                    title="Agent Performance"
                    description="View performance metrics"
                    icon={<FiTrendingUp />}
                    onClick={() => navigate(`/channel-partners/performance/${id}`)}
                />

                <ActionCard
                    title="Manage Tenants"
                    description="Assign agent to tenants"
                    icon={<FiUsers />}
                    onClick={() => navigate(`/channel-partners/tenants/${id}`)}
                />
            </div>
        </MainLayout>
    );
}

/* ---------------- HELPERS ---------------- */

const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
);

const ActionCard = ({ title, description, icon, onClick }) => (
    <div
        onClick={onClick}
        className="cursor-pointer bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition group"
    >
        <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            </div>
        </div>
    </div>
);
