import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Share2,
  ThumbsUp,
  MousePointer,
  TrendingUp,
} from "lucide-react";
import { socialMediaCampaignService } from "../../../services/campaignService";

const SocialMediaHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapStatus = (status) => {
    const map = {
      draft: "Draft",
      approval: "In Progress",
      active: "In Progress",
      completed: "Completed",
      rejected: "Rejected",
    };
    return map[status] || "Draft";
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const response = await socialMediaCampaignService.getAll();

        const mappedCampaigns = response.data.map((c) => ({
          id: c.id,
          title: c.campaign_title,
          product: c.product_selection || "N/A",
          platforms: Array.isArray(c.platforms)
            ? c.platforms
            : c.platforms
            ? (() => { try { return JSON.parse(c.platforms); } catch { return [c.platforms]; } })()
            : [],
          status: mapStatus(c.status),
          postType: c.post_type || "N/A",
          approver: c.approver || "N/A",
          messagePreview: c.message_text || "",
          postedDate: c.schedule_date || c.created_at || null,
          // Not in model — all null → N/A
          impressions: null,
          likes: null,
          shares: null,
          comments: null,
          clicks: null,
          engagementRate: null,
          ctr: null,
          leadsGenerated: null,
        }));

        setCampaigns(mappedCampaigns);
      } catch (err) {
        console.error("Failed to fetch social campaigns:", err);
        setError("Failed to load campaigns.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(campaign.id).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;

    const matchesPlatform =
      platformFilter === "all" ||
      campaign.platforms.some((p) => p.toLowerCase() === platformFilter);

    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      Completed: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
      Rejected: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
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
            <h1 className="text-2xl font-bold text-gray-900">Campaign History</h1>
            <p className="text-sm text-gray-500 mt-1">
              View and analyze past social media campaigns
            </p>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="Draft">Draft</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Platforms</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Share2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Campaigns</p>
              <p className="text-xl font-bold text-gray-900">{filteredCampaigns.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ThumbsUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Engagement</p>
              <p className="text-xl font-bold text-gray-400">N/A</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MousePointer className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg CTR</p>
              <p className="text-xl font-bold text-gray-400">N/A</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Leads</p>
              <p className="text-xl font-bold text-gray-400">N/A</p>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Campaign", "Platforms", "Date", "Impressions", "Engagement", "CTR", "Leads", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">
                    No campaigns found.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{campaign.title}</p>
                      <p className="text-xs text-gray-500">#{campaign.id} • {campaign.product}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {campaign.platforms.length > 0 ? (
                          campaign.platforms.map((platform, idx) => (
                            <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                              {platform}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {campaign.postedDate
                            ? new Date(campaign.postedDate).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{na}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{na}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{na}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{na}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(campaign.status)}
                    </td>
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

      {/* Detail Modal */}
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
                    <p className="text-xs text-gray-500">Scheduled Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCampaign.postedDate
                        ? new Date(selectedCampaign.postedDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Post Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{selectedCampaign.postType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Approver</p>
                    <p className="text-sm font-medium text-gray-900">{selectedCampaign.approver}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedCampaign.status)}</div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Message Preview</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {selectedCampaign.messagePreview || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Performance Metrics — all N/A */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Impressions", "Likes", "Shares", "Clicks"].map((label) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className="text-2xl font-bold text-gray-400">N/A</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platforms */}
              {selectedCampaign.platforms?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCampaign.platforms.map((platform, idx) => (
                      <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full capitalize">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedCampaign.status === "Rejected" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    This campaign was rejected and was not posted to social media.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaHistory;




// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   Download,
//   Eye,
//   Calendar,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Share2,
//   ThumbsUp,
//   MousePointer,
//   TrendingUp,
// } from "lucide-react";
// import { socialMediaCampaignService } from "../../../services/campaignService";

// const SocialMediaHistory = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [platformFilter, setPlatformFilter] = useState("all");
//   const [selectedCampaign, setSelectedCampaign] = useState(null);
//   const [campaigns, setCampaigns] = useState([]);

//   // Fetch campaigns from backend
//   useEffect(() => {
//     const fetchCampaigns = async () => {
//       const response = await socialMediaCampaignService.getAll(); // ← fix this line

//       const mappedCampaigns = response.data.map((c) => ({
//         id: c.id,
//         title: c.campaign_title,
//         product: c.product_selection || "N/A",
//         platforms: Array.isArray(c.platforms)
//           ? c.platforms
//           : c.platforms
//             ? JSON.parse(c.platforms)
//             : [],
//         status: mapStatus(c.status),
//         postType: c.post_type,
//         approver: c.approver || "N/A",
//         messagePreview: c.message_text || "",
//         postedDate: c.schedule_date || c.created_at,
//         // Not in model — N/A
//         impressions: 0,
//         likes: 0,
//         shares: 0,
//         comments: 0,
//         clicks: 0,
//         engagementRate: 0,
//         ctr: 0,
//         leadsGenerated: 0,
//       }));
//     };

//     fetchCampaigns();
//   }, []);

//   const filteredCampaigns = campaigns.filter((campaign) => {
//     const matchesSearch =
//       campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       campaign.id.toString().toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus =
//       statusFilter === "all" || campaign.status === statusFilter;
//     const matchesPlatform =
//       platformFilter === "all" ||
//       campaign.platforms.some((p) => p.toLowerCase() === platformFilter);

//     return matchesSearch && matchesStatus && matchesPlatform;
//   });

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       Completed: {
//         bg: "bg-green-100",
//         text: "text-green-800",
//         icon: CheckCircle,
//       },
//       Rejected: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
//       "In Progress": {
//         bg: "bg-indigo-100",
//         text: "text-indigo-800",
//         icon: Clock,
//       },
//     };

//     const config = statusConfig[status] || statusConfig["Completed"];
//     const Icon = config.icon;

//     return (
//       <span
//         className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
//       >
//         <Icon className="w-3 h-3" />
//         <span>{status}</span>
//       </span>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Campaign History
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">
//               View and analyze past social media campaigns
//             </p>
//           </div>

//           <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
//             <Download className="w-4 h-4" />
//             <span>Export Report</span>
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="md:col-span-2 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search campaigns..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//           >
//             <option value="all">All Status</option>
//             <option value="Completed">Completed</option>
//             <option value="In Progress">In Progress</option>
//             <option value="Rejected">Rejected</option>
//           </select>

//           <select
//             value={platformFilter}
//             onChange={(e) => setPlatformFilter(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//           >
//             <option value="all">All Platforms</option>
//             <option value="facebook">Facebook</option>
//             <option value="instagram">Instagram</option>
//             <option value="linkedin">LinkedIn</option>
//             <option value="twitter">Twitter</option>
//           </select>
//         </div>
//       </div>

//       {/* Summary Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-indigo-100 rounded-lg">
//               <Share2 className="w-5 h-5 text-indigo-600" />
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Total Campaigns</p>
//               <p className="text-xl font-bold text-gray-900">
//                 {filteredCampaigns.length}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-green-100 rounded-lg">
//               <ThumbsUp className="w-5 h-5 text-green-600" />
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Total Engagement</p>
//               <p className="text-xl font-bold text-gray-900">
//                 {filteredCampaigns
//                   .reduce((sum, c) => sum + c.likes + c.shares + c.comments, 0)
//                   .toLocaleString()}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-purple-100 rounded-lg">
//               <MousePointer className="w-5 h-5 text-purple-600" />
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Avg CTR</p>
//               <p className="text-xl font-bold text-gray-900">
//                 {(
//                   filteredCampaigns
//                     .filter((c) => c.status === "Completed")
//                     .reduce((sum, c) => sum + c.ctr, 0) /
//                     filteredCampaigns.filter((c) => c.status === "Completed")
//                       .length || 0
//                 ).toFixed(2)}
//                 %
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <div className="flex items-center space-x-3">
//             <div className="p-2 bg-orange-100 rounded-lg">
//               <TrendingUp className="w-5 h-5 text-orange-600" />
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Total Leads</p>
//               <p className="text-xl font-bold text-gray-900">
//                 {filteredCampaigns.reduce(
//                   (sum, c) => sum + c.leadsGenerated,
//                   0,
//                 )}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Campaign List */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Campaign
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Platforms
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Impressions
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Engagement
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   CTR
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Leads
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredCampaigns.map((campaign) => (
//                 <tr key={campaign.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">
//                         {campaign.title}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {campaign.id} • {campaign.product}
//                       </p>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex flex-wrap gap-1">
//                       {campaign.platforms.map((platform) => (
//                         <span
//                           key={platform}
//                           className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded"
//                         >
//                           {platform}
//                         </span>
//                       ))}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center space-x-1 text-sm text-gray-900">
//                       <Calendar className="w-4 h-4 text-gray-400" />
//                       <span>
//                         {new Date(campaign.postedDate).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {campaign.impressions.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     <div className="flex items-center space-x-1">
//                       <span>
//                         {campaign.likes + campaign.shares + campaign.comments}
//                       </span>
//                       <span className="text-xs text-gray-500">
//                         ({campaign.engagementRate}%)
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="text-sm font-medium text-green-600">
//                       {campaign.ctr}%
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {campaign.leadsGenerated}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {getStatusBadge(campaign.status)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <button
//                       onClick={() => setSelectedCampaign(campaign)}
//                       className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1"
//                     >
//                       <Eye className="w-4 h-4" />
//                       <span>View</span>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Campaign Detail Modal */}
//       {selectedCampaign && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-bold text-gray-900">
//                   {selectedCampaign.title}
//                 </h2>
//                 <button
//                   onClick={() => setSelectedCampaign(null)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   ✕
//                 </button>
//               </div>
//               <p className="text-sm text-gray-500 mt-1">
//                 {selectedCampaign.id}
//               </p>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Campaign Details */}
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-900 mb-3">
//                   Campaign Details
//                 </h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-xs text-gray-500">Product</p>
//                     <p className="text-sm font-medium text-gray-900">
//                       {selectedCampaign.product}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Posted Date</p>
//                     <p className="text-sm font-medium text-gray-900">
//                       {new Date(
//                         selectedCampaign.postedDate,
//                       ).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Post Type</p>
//                     <p className="text-sm font-medium text-gray-900">
//                       {selectedCampaign.postType}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Approver</p>
//                     <p className="text-sm font-medium text-gray-900">
//                       {selectedCampaign.approver}
//                     </p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-xs text-gray-500">Message Preview</p>
//                     <p className="text-sm font-medium text-gray-900">
//                       {selectedCampaign.messagePreview}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Performance Metrics */}
//               {/* {selectedCampaign.status === 'Completed' && (
//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-900 mb-3">Performance Metrics</h3>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <div className="bg-indigo-50 rounded-lg p-4">
//                       <p className="text-xs text-gray-600">Impressions</p>
//                       <p className="text-2xl font-bold text-gray-900">{selectedCampaign.impressions.toLocaleString()}</p>
//                     </div>
//                     <div className="bg-green-50 rounded-lg p-4">
//                       <p className="text-xs text-gray-600">Likes</p>
//                       <p className="text-2xl font-bold text-gray-900">{selectedCampaign.likes.toLocaleString()}</p>
//                     </div>
//                     <div className="bg-purple-50 rounded-lg p-4">
//                       <p className="text-xs text-gray-600">Shares</p>
//                       <p className="text-2xl font-bold text-gray-900">{selectedCampaign.shares}</p>
//                     </div>
//                     <div className="bg-orange-50 rounded-lg p-4">
//                       <p className="text-xs text-gray-600">Clicks</p>
//                       <p className="text-2xl font-bold text-gray-900">{selectedCampaign.clicks}</p>
//                       <p className="text-xs text-gray-500 mt-1">{selectedCampaign.ctr}% CTR</p>
//                     </div>
//                   </div>
//                 </div>
//               )} */}

//               {/* Performance Metrics */}
//               {selectedCampaign.status === "Completed" && (
//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-900 mb-3">
//                     Performance Metrics
//                   </h3>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <div className="bg-indigo-50 rounded-lg p-4">
//                       <p className="text-xs text-gray-600">Impressions</p>
//                       <p className="text-2xl font-bold text-gray-900">
//                         {selectedCampaign.impressions.toLocaleString()}
//                       </p>
//                     </div>
//                     <div className="bg-green-50 rounded-lg p-4">
//                       <p className="text-xs text-gray-600">Likes</p>
//                       <p className="text-2xl font-bold text-gray-900">
//                         {selectedCampaign.likes.toLocaleString()}
//                       </p>
//                     </div>
//                     <div className="bg-purple-50 rounded-lg p-4">
//                       <p className="text-xs text-gray-600">Shares</p>
//                       <p className="text-2xl font-bold text-gray-900">
//                         {selectedCampaign.shares}
//                       </p>
//                     </div>
//                     <div className="bg-orange-50 rounded-lg p-4">
//                       <p className="text-xs text-gray-600">Clicks</p>
//                       <p className="text-2xl font-bold text-gray-900">
//                         {selectedCampaign.clicks}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {selectedCampaign.ctr}% CTR
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Platforms */}
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-900 mb-3">
//                   Platforms
//                 </h3>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedCampaign.platforms.map((platform, idx) => (
//                     <span
//                       key={idx}
//                       className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
//                     >
//                       {platform}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {selectedCampaign.status === "Rejected" && (
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                   <p className="text-sm text-red-800">
//                     This campaign was rejected and was not posted to social
//                     media.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SocialMediaHistory;
