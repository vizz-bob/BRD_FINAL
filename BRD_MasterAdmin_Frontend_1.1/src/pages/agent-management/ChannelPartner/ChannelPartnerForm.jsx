import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import { agentManagementService } from "../../services/agentManagementService";
import axiosInstance from "../../utils/axiosInstance";

export default function ChannelPartnerForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const [loading, setLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    agent_name: "",
    contact_no: "",
    email: "",
    agent_type: "",
    status: "ACTIVE",
  });

  const [agentTypes, setAgentTypes] = useState([]);

  // Fetch Agent Types on mount
  useEffect(() => {
    async function fetchAgentTypes() {
      try {
        const res = await axiosInstance.get("/api/v1/adminpanel/profile-management/agent-types/");
        setAgentTypes(res.data);
      } catch (err) {
        console.error("Failed to load agent types", err);
      }
    }

    fetchAgentTypes();
  }, []);

  // If editing, fetch the channel partner data
  useEffect(() => {
    if (id) {
      setLoading(true);
      agentManagementService
        .getChannelPartnerById(id)
        .then((data) => setForm({
          agent_name: data.agent_name,
          contact_no: data.contact_no,
          email: data.email,
          agent_type: data.agent_type, // assuming API returns ID
          status: data.status,
        }))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await agentManagementService.updateChannelPartner(id, form);
      } else {
        await agentManagementService.createChannelPartner(form);
      }
      navigate("/channel-partners"); // go back to listing
    } catch (err) {
      console.error("Error saving agent", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          {id ? "Edit" : "Add"} Channel Partner
        </h2>
        <p className="text-sm text-gray-500">
          Configure referral agent details and status
        </p>
      </div>

      {/* FORM CARD */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Agent Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Agent Name
            </label>
            <input
              name="agent_name"
              value={form.agent_name}
              onChange={handleChange}
              placeholder="Enter agent full name"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Agent Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Agent Type
            </label>
            <select
              name="agent_type"
              value={form.agent_type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select type</option>
              {agentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              name="contact_no"
              value={form.contact_no}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
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
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/channel-partners")}
            className="px-5 py-2 rounded-xl text-sm border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {loading ? "Saving..." : "Save Agent"}
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
