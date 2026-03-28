import React, { useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import { CampaignROIService } from "../../../services/financeService";

const CampaignROI = () => {

  const [channelsData, setChannelsData] = React.useState([]);
  const fetchData = async () => {
    try {
      const response = await CampaignROIService.getAll();

      const channels = response.data.map(item => ({
        channel: item.channel,
        spend: item.spend,
        leads: item.leads,
        deals: item.conversions,
        revenue: item.revenue
      }));

      setChannelsData(channels);

    } catch (error) {
      console.error("Error fetching campaign ROI:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  const getMetrics = (c) => {
    const cpl = c.spend / c.leads;
    const conversionRate = (c.deals / c.leads) * 100;
    const roi = ((c.revenue - c.spend) / c.spend) * 100;

    let status = "Needs Attention";
    if (roi > 25) status = "Profitable";
    if (roi < 0) status = "Loss";

    return { cpl, conversionRate, roi, status };
  };

  const statusMeta = {
    Profitable: {
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    "Needs Attention": {
      icon: AlertTriangle,
      color: "text-yellow-600",
      bg: "bg-yellow-100"
    },
    Loss: {
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-100"
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Campaign ROI Analysis
          </h2>
          <p className="text-sm text-gray-500">
            Evaluate marketing efficiency by cost, conversion, and revenue.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Channel
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Spend
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                CPL
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Conversion
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Revenue
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                ROI
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {channelsData.map((c, idx) => {
              const { cpl, conversionRate, roi, status } = getMetrics(c);
              const MetaIcon = statusMeta[status].icon;

              return (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {c.channel}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    ₹{c.spend.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    ₹{cpl.toFixed(0)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    {conversionRate.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    ₹{c.revenue.toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-medium text-right ${roi >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {roi.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div
                      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${statusMeta[status].bg} ${statusMeta[status].color}`}
                    >
                      <MetaIcon className="w-4 h-4" />
                      <span>{status}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignROI;
