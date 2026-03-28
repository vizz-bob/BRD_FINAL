import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function ManageTenants() {
    const navigate = useNavigate();

    const [tenants, setTenants] = useState([
        { id: 1, name: "Tenant A", selected: false },
        { id: 2, name: "Tenant B", selected: true },
        { id: 3, name: "Tenant C", selected: false },
    ]);

    const toggleTenant = (id) => {
        setTenants(
            tenants.map((t) =>
                t.id === id ? { ...t, selected: !t.selected } : t
            )
        );
    };

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
                        <h1 className="text-xl font-semibold">Manage Tenants</h1>
                        <p className="text-sm text-gray-500">Assign channel partner access across tenants</p>
                    </div>
                </div>

            </div>


            {/* CARD */}
            <div className="bg-white rounded-2xl shadow-sm p-6 max-w-xl">
                <div className="space-y-3">
                    {tenants.map((tenant) => (
                        <label
                            key={tenant.id}
                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition"
                        >
                            <input
                                type="checkbox"
                                checked={tenant.selected}
                                onChange={() => toggleTenant(tenant.id)}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{tenant.name}</span>
                        </label>
                    ))}
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-5 py-2 rounded-xl text-sm border border-gray-300 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button className="px-6 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700 transition">
                        Assign Tenants
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}
