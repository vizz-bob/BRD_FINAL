import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardMetrics } from "../../components/DashboardComponents";
import { LineChart, BarChart, PieChart } from "../../components/Charts";
import GenerateReportModal from "../../components/GenerateReportModal";
import { useMessage } from "../../context/MessageContext";
import {
  ClockIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  fetchDashboardSummary,
  fetchDocuments,
  fetchReviews,
} from "../../api/dashboardApi";

const LegalDashboard = () => {
  const navigate = useNavigate();
  const { addMessage } = useMessage();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [isGenerateReportModalOpen, setGenerateReportModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Load dashboard data on mount and set up auto-refresh
  useEffect(() => {
    // Load initial data
    loadDashboardData();
    
    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      console.log('Auto-refreshing dashboard data...');
      loadDashboardData();
    }, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      // Fetch all data in parallel
      const [summaryData, documentsData, reviewsData] = await Promise.all([
        fetchDashboardSummary(),
        fetchDocuments(),
        fetchReviews(),
      ]);

      setDashboardStats(summaryData);
      setLastRefresh(new Date());
      
      // Handle paginated responses from DRF
      const docsList = documentsData.results ? documentsData.results : documentsData;
      
      // Get recent documents (limit to 4)
      const recentDocs = (Array.isArray(docsList) ? docsList : [])
        .slice(0, 4)
        .map(doc => ({
          id: doc.id,
          type: doc.document_type || 'Document',
          status: doc.status || 'Pending',
          priority: doc.priority || 'Medium',
        }));
      
      setRecentDocuments(recentDocs);
      console.log('Dashboard data updated at', new Date().toLocaleTimeString());
      
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      const errorMsg = err.response?.data?.detail || 
                       err.response?.statusText || 
                       err.message || 
                       'Failed to load dashboard data';
      setError(`Error: ${errorMsg}`);
      addMessage(`Error loading dashboard data: ${errorMsg}`, 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleNewReview = () => navigate("/legal/new-review");

  // Prepare chart data from backend statistics
  const prepareTimelineChartData = () => {
    if (!dashboardStats?.reviews_timeline) {
      return {
        labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
        datasets: [
          {
            label: "Reviews Count",
            data: [0, 0, 0, 0, 0, 0],
            borderColor: "rgb(79, 70, 229)",
            backgroundColor: "rgba(79, 70, 229, 0.1)",
            tension: 0.3,
          },
        ],
      };
    }
    return {
      labels: dashboardStats.reviews_timeline.labels,
      datasets: [
        {
          label: "Reviews Count",
          data: dashboardStats.reviews_timeline.values,
          borderColor: "rgb(79, 70, 229)",
          backgroundColor: "rgba(79, 70, 229, 0.1)",
          tension: 0.3,
        },
      ],
    };
  };

  const prepareReviewStatusChartData = () => {
    if (!dashboardStats?.review_status_distribution) {
      return {
        labels: ["Pending", "Approved", "Rejected"],
        datasets: [
          {
            label: "Number of Reviews",
            data: [0, 0, 0],
            backgroundColor: [
              "rgba(234,179,8,0.8)",
              "rgba(34,197,94,0.8)",
              "rgba(239,68,68,0.8)",
            ],
          },
        ],
      };
    }
    const dist = dashboardStats.review_status_distribution;
    return {
      labels: Object.keys(dist),
      datasets: [
        {
          label: "Number of Reviews",
          data: Object.values(dist),
          backgroundColor: [
            "rgba(234,179,8,0.8)",
            "rgba(34,197,94,0.8)",
            "rgba(239,68,68,0.8)",
          ],
        },
      ],
    };
  };

  const prepareDocumentDistributionChartData = () => {
    if (!dashboardStats?.document_type_distribution || Object.keys(dashboardStats.document_type_distribution).length === 0) {
      return {
        labels: ["No Data"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["rgba(107, 114, 128, 0.8)"],
          },
        ],
      };
    }
    const dist = dashboardStats.document_type_distribution;
    return {
      labels: Object.keys(dist),
      datasets: [
        {
          data: Object.values(dist),
          backgroundColor: [
            "rgba(79, 70, 229, 0.8)",
            "rgba(34, 197, 94, 0.8)",
            "rgba(234, 179, 8, 0.8)",
            "rgba(239, 68, 68, 0.8)",
            "rgba(107, 114, 128, 0.8)",
          ],
        },
      ],
    };
  };

  const prepareComplianceTrendChartData = () => {
    if (!dashboardStats?.compliance_trend) {
      return {
        labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
        datasets: [
          {
            label: "Compliance Score (%)",
            data: [0, 0, 0, 0, 0, 0],
            borderColor: "rgb(34, 197, 94)",
            backgroundColor: "rgba(34,197,94,0.1)",
            tension: 0.3,
          },
        ],
      };
    }
    return {
      labels: dashboardStats.compliance_trend.labels,
      datasets: [
        {
          label: "Compliance Score (%)",
          data: dashboardStats.compliance_trend.values,
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34,197,94,0.1)",
          tension: 0.3,
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare metrics from backend data
  const metrics = dashboardStats ? [
    {
      title: "Pending Reviews",
      value: dashboardStats.pending_reviews?.toString() || "0",
      trend: -5,
      color: "yellow",
      icon: ClockIcon,
    },
    {
      title: "Approved Today",
      value: dashboardStats.approved_today?.toString() || "0",
      trend: 4.2,
      color: "green",
      icon: CheckCircleIcon,
    },
    {
      title: "Average TAT",
      value: dashboardStats.average_tat 
        ? `${dashboardStats.average_tat} days`
        : "0 days",
      trend: -8.5,
      color: "blue",
      icon: ArrowPathIcon,
    },
    {
      title: "Compliance Score",
      value: `${dashboardStats.compliance_score || 0}%`,
      trend: 2.1,
      color: "green",
      icon: ShieldCheckIcon,
    },
  ] : [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Legal Dashboard
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-500">
            Document and Agreement Management
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
            onClick={handleNewReview}
          >
            Create New Review
          </button>
          <button
            className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            onClick={() => setGenerateReportModalOpen(true)}
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Metrics */}
      <DashboardMetrics items={metrics} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Document Processing Timeline */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Reviews Timeline
            </h3>
            <LineChart data={prepareTimelineChartData()} />
          </div>

          {/* Review Status Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Review Status</h3>
            <BarChart data={prepareReviewStatusChartData()} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Document Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Document Distribution
            </h3>
            <PieChart data={prepareDocumentDistributionChartData()} />
          </div>

          {/* Compliance Score Trend (New Section) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Compliance Score Trend
            </h3>
            <LineChart data={prepareComplianceTrendChartData()} />
          </div>
        </div>
      </div>

      {/* Recent Documents Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent Documents</h3>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto sm:block hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Document ID", "Type", "Status", "Priority", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {doc.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        doc.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : doc.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : doc.status === "Under Review"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        doc.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : doc.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {doc.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => navigate(`/legal/documents/${doc.id}`)}
                    >
                      Review
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => navigate(`/legal/documents/${doc.id}`)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <div className="sm:hidden p-4 space-y-4">
          {recentDocuments.map((doc) => (
            <div
              key={doc.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-900">{doc.type}</span>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    doc.priority === "High"
                      ? "bg-red-100 text-red-800"
                      : doc.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {doc.priority}
                </span>
              </div>

              <p className="text-sm text-gray-500">
                <strong>ID:</strong> {doc.id}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    doc.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : doc.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : doc.status === "Under Review"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {doc.status}
                </span>
              </p>

              <div className="mt-3 flex gap-3">
                <button
                  className="text-blue-600 text-sm"
                  onClick={() => navigate(`/legal/documents/${doc.id}`)}
                >
                  Review
                </button>
                <button
                  className="text-gray-600 text-sm"
                  onClick={() => navigate(`/legal/documents/${doc.id}`)}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <GenerateReportModal
        isOpen={isGenerateReportModalOpen}
        onRequestClose={() => setGenerateReportModalOpen(false)}
      />
    </div>
  );
};

export default LegalDashboard;
