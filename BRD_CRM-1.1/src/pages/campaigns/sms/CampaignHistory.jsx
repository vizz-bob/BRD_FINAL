import React, { useEffect, useState } from "react";
import { smsCampaignService } from "../../../services/campaignService";
import {
  Search,
  Download,
  Eye,
  Calendar,
  MessageSquare,
  Users,
  MousePointer,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const CampaignHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSmsCampaigns();
  }, []);

  const fetchSmsCampaigns = async () => {
    setLoading(true);
    try {
      const res = await smsCampaignService.getAll();

      const apiCampaigns = res.data.map((c) => ({
        id: c.id,
        title: c.campaign_title,
        product: (c.product || "").replace(/_/g, " ").toUpperCase(),
        sentDate: c.created_at,
        status: mapStatus(c.status),
        messageBody: c.message_content,
        targetAudience: Array.isArray(c.target_audience)
          ? c.target_audience
          : c.target_audience
          ? c.target_audience.split(",").map((s) => s.trim())
          : [],
        senderId: c.sender_id,
        // Not in model — null = show N/A
        totalSent: null,
        delivered: null,
        clicked: null,
        converted: null,
        deliveryRate: null,
        clickRate: null,
        conversionRate: null,
      }));

      setCampaigns(apiCampaigns);
    } catch (err) {
      console.error("Failed to load SMS campaigns", err);
      setError("Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  };

  const mapStatus = (status) => {
    const map = {
      draft: "Draft",
      active: "In Progress",
      scheduled: "In Progress",
      in_progress: "In Progress",
      completed: "Completed",
    };
    return map[status] || "Draft";
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(campaign.id).includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const campaignDate = new Date(campaign.sentDate);
      const daysAgo = Math.floor(
        (Date.now() - campaignDate) / (1000 * 60 * 60 * 24)
      );
      if (dateFilter === "7days") matchesDate = daysAgo <= 7;
      else if (dateFilter === "30days") matchesDate = daysAgo <= 30;
      else if (dateFilter === "90days") matchesDate = daysAgo <= 90;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      Completed: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
      Failed: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
      "In Progress": { bg: "bg-indigo-100", text: "text-indigo-800", icon: Clock },
      Draft: { bg: "bg-gray-100", text: "text-gray-800", icon: Clock },
    };
    const config = statusConfig[status] || statusConfig["Draft"];
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="w-3 h-3" />
        <span>{status}</span>
      </span>
    );
  };

  const na = <span className="text-gray-400 text-sm">N/A</span>;

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading campaigns...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SMS Campaign History</h1>
            <p className="text-sm text-gray-500 mt-1">View and analyze past SMS broadcasts</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="Draft">Draft</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total SMS Campaigns", value: filteredCampaigns.length, icon: MessageSquare, color: "indigo" },
          { label: "Total Sent", value: "N/A", icon: Users, color: "green" },
          { label: "Avg Click Rate", value: "N/A", icon: MousePointer, color: "purple" },
          { label: "Total Conversions", value: "N/A", icon: TrendingUp, color: "orange" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 bg-${color}-100 rounded-lg`}>
                <Icon className={`w-5 h-5 text-${color}-600`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Campaign", "Date", "Sent", "Delivery Rate", "Click Rate", "Converted", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    No campaigns found.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{campaign.title}</p>
                      <p className="text-xs text-gray-500">
                        #{campaign.id} • {campaign.product}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {campaign.sentDate
                            ? new Date(campaign.sentDate).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{na}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{na}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{na}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{na}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(campaign.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedCampaign(campaign)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedCampaign.title}</h2>
                <p className="text-sm text-gray-500 mt-1">#{selectedCampaign.id}</p>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Campaign Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Campaign Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Product</p>
                    <p className="text-sm font-medium text-gray-900">{selectedCampaign.product}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date Created</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCampaign.sentDate
                        ? new Date(selectedCampaign.sentDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sender ID</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCampaign.senderId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedCampaign.status)}</div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Message Content</p>
                    <p className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded mt-1">
                      {selectedCampaign.messageBody || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Performance Metrics — N/A */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Total Sent", "Delivered", "Click Rate", "Conversions"].map((label) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className="text-2xl font-bold text-gray-400">N/A</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              {selectedCampaign.targetAudience?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Target Audience</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCampaign.targetAudience.map((audience, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full capitalize"
                      >
                        {audience.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignHistory;
