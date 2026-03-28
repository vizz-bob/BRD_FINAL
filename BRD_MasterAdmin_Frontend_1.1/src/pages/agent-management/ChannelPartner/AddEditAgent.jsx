import React, { useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function AddEditAgent() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        type: "",
        email: "",
        phone: "",
        status: "Active",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
                        <h1 className="text-xl font-semibold">Add / Edit Agent</h1>
                        <p className="text-sm text-gray-500">Manage referral agent details and activation status</p>
                    </div>
                </div>
            </div>


            {/* FORM CARD */}
            <div className="bg-white rounded-2xl shadow-sm p-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Agent Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Agent Name
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter agent name"
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Agent Type */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Agent Type
                        </label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select type</option>
                            <option>DSA</option>
                            <option>Broker</option>
                            <option>Lead Partner</option>
                        </select>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Email Address
                        </label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Phone Number
                        </label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Enter mobile number"
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Status
                        </label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                    </div>
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
                        Save Agent
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}
