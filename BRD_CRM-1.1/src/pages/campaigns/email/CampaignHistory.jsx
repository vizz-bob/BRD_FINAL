import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Mail,
  Users,
  MousePointer,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { emailCampaignService } from "../../../services/campaignService";
const CampaignHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch campaigns from backend
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const res = await emailCampaignService.getAll();

        // const mapped = res.data.map((c) => ({
        //   id: String(c.id), // ensure string for search
        //   title: c.campaign_title || 'Untitled',
        //   product: c.product || 'N/A',
        //   sentDate: c.schedule_datetime || c.created_at,
        //   totalSent: c.total_sent || 0,
        //   status: c.status || 'Draft',
        //   delivered: c.delivered || 0,
        //   opened: c.opened || 0,
        //   clicked: c.clicked || 0,
        //   converted: 0,
        //   openRate: c.open_rate || 12,
        //   clickRate: c.click_rate || 20,
        //   conversionRate: c.conversion_rate || 0,
        //   subject: c.subject_line || 'No Subject',
        //   targetAudience: c.target_audience || [],
        //   sender: c.sender_email || 'N/A'
        // }));

        const statusMap = {
          draft: "Draft",
          active: "In Progress",
          scheduled: "In Progress",
          completed: "Completed",
        };

        const mapped = res.data.map((c) => ({
          id: String(c.id),
          title: c.campaign_title || "Untitled",
          product: c.product || "N/A",
          sentDate: c.created_at, // use created_at, schedule_datetime can be null
          status: statusMap[c.status] || "Draft",
          subject: c.subject_line || "No Subject",
          sender: c.sender_email || "N/A",
          targetAudience: Array.isArray(c.target_audience)
            ? c.target_audience
            : c.target_audience
              ? c.target_audience.split(",").map((s) => s.trim())
              : [],
          // Fields not in model — N/A display
          totalSent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          openRate: 0,
          clickRate: 0,
          conversionRate: 0,
        }));

        setCampaigns(mapped);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const campaignDate = new Date(campaign.sentDate);
      const now = new Date();
      const daysAgo = Math.floor((now - campaignDate) / (1000 * 60 * 60 * 24));

      if (dateFilter === "7days") matchesDate = daysAgo <= 7;
      else if (dateFilter === "30days") matchesDate = daysAgo <= 30;
      else if (dateFilter === "90days") matchesDate = daysAgo <= 90;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      Completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: CheckCircle,
      },
      Failed: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
      "In Progress": {
        bg: "bg-indigo-100",
        text: "text-indigo-800",
        icon: Clock,
      },
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

  return (
    <div className="space-y-6">
      {/* ... everything else unchanged ... */}

      {/* Campaign List Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Open Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Click Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Converted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    Loading campaigns...
                  </td>
                </tr>
              ) : filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No campaigns found
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {campaign.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {campaign.id} • {campaign.product}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {/* <span>{new Date(campaign.sentDate).toLocaleDateString()}</span> */}
                        <span>
                          {campaign.sentDate
                            ? new Date(campaign.sentDate).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.totalSent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${campaign.openRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {campaign.openRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-500 h-2 rounded-full"
                            style={{
                              width: `${Math.min(campaign.clickRate, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {campaign.clickRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {campaign.converted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => setSelectedCampaign(campaign)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1"
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

      {/* Detail Modal */}
{selectedCampaign && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      {/* Modal Header */}
      <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{selectedCampaign.title}</h2>
          <p className="text-sm text-gray-500 mt-1">#{selectedCampaign.id} • {selectedCampaign.product}</p>
        </div>
        <button
          onClick={() => setSelectedCampaign(null)}
          className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          ✕
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Campaign Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Date', value: selectedCampaign.sentDate ? new Date(selectedCampaign.sentDate).toLocaleDateString() : 'N/A' },
              { label: 'Subject', value: selectedCampaign.subject },
              { label: 'Sender', value: selectedCampaign.sender },
              { label: 'Status', value: getStatusBadge(selectedCampaign.status) },
              { label: 'Product', value: selectedCampaign.product },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-500">{label}</p>
                <div className="text-sm font-medium text-gray-900 mt-1">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Stats — N/A since not in model */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Total Sent', 'Opened', 'Clicked', 'Converted'].map(label => (
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
                <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full capitalize">
                  {audience.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Open/Click Rate bars */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Engagement Rates</h3>
          <div className="space-y-3">
            {[
              { label: 'Open Rate', value: selectedCampaign.openRate, color: 'bg-green-500' },
              { label: 'Click Rate', value: selectedCampaign.clickRate, color: 'bg-indigo-500' },
              { label: 'Conversion Rate', value: selectedCampaign.conversionRate, color: 'bg-purple-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-28">{label}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className={`${color} h-2 rounded-full`} style={{ width: `${Math.min(value, 100)}%` }} />
                </div>
                <span className="text-xs font-medium text-gray-700 w-10 text-right">{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default CampaignHistory;
