import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Phone,
  Mail,
  MessageSquare,
  Target,
  Calendar,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  Clock,
  Award,
  Filter,
  Database,
  Activity,
  Briefcase,
  FileText,
  AlertCircle,
  BarChart3,
  PieChart
} from 'lucide-react';

export default function DashboardPage() {
  // Campaign Performance Data
  const campaignStats = [
    { channel: 'Dialer', calls: 1250, connected: 890, interested: 234, icon: Phone, color: 'indigo' },
    { channel: 'Email', sent: 5420, opened: 2156, clicked: 543, icon: Mail, color: 'blue' },
    { channel: 'SMS', sent: 3200, delivered: 3150, clicked: 876, icon: MessageSquare, color: 'green' },
    { channel: 'WhatsApp', sent: 1840, read: 1620, replied: 450, icon: MessageSquare, color: 'emerald' }
  ];

  // Channel ROI Comparison
  const channelROI = [
    { name: 'Facebook', cpl: 120, leads: 212, conversion: 5.3, status: 'Active' },
    { name: 'JustDial', cpl: 65, leads: 412, conversion: 6.9, status: 'Active' },
    { name: 'Field Visits', cpl: 40, leads: 112, conversion: 10.5, status: 'Inactive' },
    { name: 'WhatsApp', cpl: 0, leads: 315, conversion: 8.2, status: 'Active' }
  ];

  // Lead Source & Quality
  const leadSources = [
    { source: 'Bulk Upload', count: 450, quality: 'Medium', rejected: 12 },
    { source: 'Third Party', count: 320, quality: 'High', rejected: 8 },
    { source: 'Internal', count: 180, quality: 'High', rejected: 3 },
    { source: 'Online', count: 540, quality: 'Medium', rejected: 25 }
  ];

  // Pipeline Funnel
  const pipelineStages = [
    { stage: 'Raw Leads', count: 1850, avg_age: 2.3 },
    { stage: 'Qualified', count: 980, avg_age: 4.1 },
    { stage: 'Hot', count: 340, avg_age: 6.5 },
    { stage: 'Follow-up', count: 220, avg_age: 8.2 },
    { stage: 'Meetings', count: 145, avg_age: 10.1 },
    { stage: 'Deals', count: 78, avg_age: 15.3 }
  ];

  // CRM Activities
  const activities = {
    tasks: { pending: 156, completed: 892, missed: 23 },
    meetings: { scheduled: 89, completed: 67, noshow: 12 },
    escalations: 18
  };

  // Financial Health
  const financials = {
    emi_paid: 2340,
    emi_unpaid: 145,
    emi_partial: 34,
    emi_overdue: 89,
    ptp_count: 56,
    ptp_success: 41,
    recovery: { soft: 12, legal: 8, field: 5, court: 3 }
  };

  // Targets & Support
  const targets = {
    calls: { target: 5000, achieved: 4230, percent: 84.6 },
    leads: { target: 800, achieved: 890, percent: 111.25 },
    revenue: { target: 5000000, achieved: 4650000, percent: 93 }
  };

  const support = {
    open_tickets: 23,
    sla_compliant: 89,
    sla_overdue: 4,
    training_completion: 78
  };

  // Forecast
  const forecast = {
    expected_deals: 125,
    projected_revenue: 8500000,
    hot_leads: 340
  };

  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-700'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Overall Performance Dashboard</h1>
          <p className="text-gray-500">Comprehensive view of all CRM modules</p>
        </div>

        {/* 1. CAMPAIGNS MODULE - Outreach Performance */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">1. Campaign Performance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {campaignStats.map((campaign, idx) => {
              const Icon = campaign.icon;
              const engagementRate = campaign.channel === 'Dialer' 
                ? ((campaign.interested / campaign.calls) * 100).toFixed(1)
                : campaign.channel === 'Email'
                ? ((campaign.clicked / campaign.sent) * 100).toFixed(1)
                : ((campaign.clicked / campaign.sent) * 100).toFixed(1);
              
              return (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl ${colorClasses[campaign.color]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${colorClasses.green}`}>
                      {engagementRate}%
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{campaign.channel}</h3>
                  <div className="space-y-1 text-sm text-gray-500">
                    {campaign.channel === 'Dialer' && (
                      <>
                        <div className="flex justify-between">
                          <span>Calls:</span>
                          <span className="font-medium text-gray-900">{campaign.calls}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Connected:</span>
                          <span className="font-medium text-gray-900">{campaign.connected}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interested:</span>
                          <span className="font-medium text-green-700">{campaign.interested}</span>
                        </div>
                      </>
                    )}
                    {campaign.channel === 'Email' && (
                      <>
                        <div className="flex justify-between">
                          <span>Sent:</span>
                          <span className="font-medium text-gray-900">{campaign.sent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Opened:</span>
                          <span className="font-medium text-gray-900">{campaign.opened}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Clicked:</span>
                          <span className="font-medium text-green-700">{campaign.clicked}</span>
                        </div>
                      </>
                    )}
                    {(campaign.channel === 'SMS' || campaign.channel === 'WhatsApp') && (
                      <>
                        <div className="flex justify-between">
                          <span>Sent:</span>
                          <span className="font-medium text-gray-900">{campaign.sent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{campaign.channel === 'WhatsApp' ? 'Read:' : 'Delivered:'}</span>
                          <span className="font-medium text-gray-900">
                            {campaign.channel === 'WhatsApp' ? campaign.read : campaign.delivered}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>{campaign.channel === 'WhatsApp' ? 'Replied:' : 'Clicked:'}</span>
                          <span className="font-medium text-green-700">
                            {campaign.channel === 'WhatsApp' ? campaign.replied : campaign.clicked}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Channel ROI */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Channel ROI Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">Channel</th>
                    <th className="text-right py-2 px-3 text-gray-500 font-medium">CPL (₹)</th>
                    <th className="text-right py-2 px-3 text-gray-500 font-medium">Leads</th>
                    <th className="text-right py-2 px-3 text-gray-500 font-medium">Conversion</th>
                    <th className="text-center py-2 px-3 text-gray-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {channelROI.map((channel, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-900">{channel.name}</td>
                      <td className="py-3 px-3 text-right text-gray-900">₹{channel.cpl}</td>
                      <td className="py-3 px-3 text-right text-gray-900">{channel.leads}</td>
                      <td className="py-3 px-3 text-right text-green-700 font-medium">{channel.conversion}%</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          channel.status === 'Active' ? colorClasses.green : colorClasses.red
                        }`}>
                          {channel.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 2. LEADS & DATA MODULE */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">2. Leads & Data Quality</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600" />
                Lead Source Attribution
              </h3>
              {leadSources.map((source, idx) => {
                const qualityColor = source.quality === 'High' ? 'green' : source.quality === 'Medium' ? 'yellow' : 'red';
                const rejectionRate = ((source.rejected / source.count) * 100).toFixed(1);
                
                return (
                  <div key={idx} className="mb-3 last:mb-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{source.source}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${colorClasses[qualityColor]}`}>
                        {source.quality}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${(source.count / 540) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{source.count}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Rejected: {source.rejected} ({rejectionRate}%)
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-600" />
                Data Hygiene Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-3xl font-bold text-green-700">96.8%</p>
                  <p className="text-sm text-gray-600 mt-1">Valid Records</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <p className="text-3xl font-bold text-red-600">3.2%</p>
                  <p className="text-sm text-gray-600 mt-1">Duplicates/Invalid</p>
                </div>
                <div className="col-span-2 mt-2">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-900">Pending Verification</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-700">234</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PIPELINE STAGES - Sales Funnel */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">3. Sales Pipeline Funnel</h2>
          </div>
          
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
              {pipelineStages.map((stage, idx) => {
                const conversionRate = idx > 0 
                  ? ((stage.count / pipelineStages[idx - 1].count) * 100).toFixed(1)
                  : 100;
                
                return (
                  <div key={idx} className="relative">
                    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-4 border border-indigo-100">
                      <p className="text-xs text-gray-500 mb-1">{stage.stage}</p>
                      <p className="text-2xl font-bold text-indigo-600">{stage.count}</p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {stage.avg_age}d avg
                      </p>
                      {idx > 0 && (
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            parseFloat(conversionRate) > 50 ? colorClasses.green : colorClasses.yellow
                          }`}>
                            {conversionRate}%
                          </span>
                        </div>
                      )}
                    </div>
                    {idx < pipelineStages.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-1.5 transform -translate-y-1/2">
                        <div className="w-3 h-3 rotate-45 bg-indigo-200"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Bottleneck Alert</p>
                <p className="text-xs text-gray-600 mt-1">
                  156 Hot Leads have been in stage for 10+ days without meetings scheduled
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CORE CRM ACTIVITIES */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">4. Team Activities & Engagement</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Tasks</h3>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Completed</span>
                  <span className="text-lg font-bold text-green-700">{activities.tasks.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Pending</span>
                  <span className="text-lg font-bold text-yellow-600">{activities.tasks.pending}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Missed</span>
                  <span className="text-lg font-bold text-red-600">{activities.tasks.missed}</span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-bold text-indigo-600">
                      {((activities.tasks.completed / (activities.tasks.completed + activities.tasks.pending + activities.tasks.missed)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Meetings</h3>
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Scheduled</span>
                  <span className="text-lg font-bold text-gray-900">{activities.meetings.scheduled}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Completed</span>
                  <span className="text-lg font-bold text-green-700">{activities.meetings.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">No-shows</span>
                  <span className="text-lg font-bold text-red-600">{activities.meetings.noshow}</span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-bold text-indigo-600">
                      {((activities.meetings.completed / activities.meetings.scheduled) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Escalations</h3>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-center py-6">
                <p className="text-5xl font-bold text-red-600 mb-2">{activities.escalations}</p>
                <p className="text-sm text-gray-500">Requires immediate attention</p>
              </div>
              <div className="mt-4 p-3 bg-red-50 rounded-xl">
                <p className="text-xs text-gray-600">
                  <span className="font-medium text-red-700">12</span> from missed follow-ups,{' '}
                  <span className="font-medium text-red-700">6</span> from customer complaints
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FINANCIALS & COLLECTIONS */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">5. Loan Servicing & Collections</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm lg:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Repayment Health
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-700">{financials.emi_paid}</p>
                  <p className="text-xs text-gray-600 mt-1">Paid EMIs</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <p className="text-2xl font-bold text-yellow-600">{financials.emi_partial}</p>
                  <p className="text-xs text-gray-600 mt-1">Partial Paid</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-700">{financials.emi_unpaid}</p>
                  <p className="text-xs text-gray-600 mt-1">Unpaid</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <p className="text-2xl font-bold text-red-600">{financials.emi_overdue}</p>
                  <p className="text-xs text-gray-600 mt-1">Overdue</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Promise to Pay (PTP)</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    {((financials.ptp_success / financials.ptp_count) * 100).toFixed(0)}% Success
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">Total: <strong>{financials.ptp_count}</strong></span>
                  <span className="text-green-700">Kept: <strong>{financials.ptp_success}</strong></span>
                  <span className="text-red-600">Broken: <strong>{financials.ptp_count - financials.ptp_success}</strong></span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Recovery Stages
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl">
                  <span className="text-sm text-gray-700">Soft Notice</span>
                  <span className="text-lg font-bold text-yellow-700">{financials.recovery.soft}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                  <span className="text-sm text-gray-700">Legal Notice</span>
                  <span className="text-lg font-bold text-orange-700">{financials.recovery.legal}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                  <span className="text-sm text-gray-700">Field Visit</span>
                  <span className="text-lg font-bold text-red-600">{financials.recovery.field}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-100 rounded-xl">
                  <span className="text-sm text-gray-700">Court Case</span>
                  <span className="text-lg font-bold text-red-700">{financials.recovery.court}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. STRATEGY & SUPPORT */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">6. Targets, Support & Team Readiness</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Target Achievement
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Calls', ...targets.calls, color: 'blue' },
                  { label: 'Leads', ...targets.leads, color: 'green' },
                  { label: 'Revenue', ...targets.revenue, color: 'purple', format: 'currency' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                      <div className="text-right">
                        <span className={`text-sm font-bold ${
                          item.percent >= 100 ? 'text-green-700' : item.percent >= 80 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {item.percent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span>Target: {item.format === 'currency' ? `₹${(item.target / 100000).toFixed(1)}L` : item.target.toLocaleString()}</span>
                      <span>•</span>
                      <span>Achieved: {item.format === 'currency' ? `₹${(item.achieved / 100000).toFixed(1)}L` : item.achieved.toLocaleString()}</span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          item.percent >= 100 ? 'bg-green-600' : item.percent >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(item.percent, 100)}%` }}
                      />
                    </div>
                    {item.percent > 100 && (
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-700 font-medium">
                          Exceeded by {(item.percent - 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Support & SLA
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Open Tickets</span>
                    <span className="text-2xl font-bold text-blue-700">{support.open_tickets}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-white p-2 rounded-lg">
                      <p className="text-xs text-gray-500">SLA Met</p>
                      <p className="text-lg font-bold text-green-700">{support.sla_compliant}</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg">
                      <p className="text-xs text-gray-500">Overdue</p>
                      <p className="text-lg font-bold text-red-600">{support.sla_overdue}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      Training Completion
                    </span>
                    <span className="text-2xl font-bold text-purple-700">{support.training_completion}%</span>
                  </div>
                  <div className="relative w-full h-2 bg-white rounded-full overflow-hidden mt-2">
                    <div 
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${support.training_completion}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Team readiness score</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                  <p className="text-xs text-gray-500 mb-1">SLA Compliance Rate</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {((support.sla_compliant / (support.sla_compliant + support.sla_overdue)) * 100).toFixed(1)}%
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600">Industry standard: 95%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Forecast */}
          <div className="mt-4 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Revenue Forecast
              </h3>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Next 30 Days</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-sm text-white/80 mb-1">Expected Deals</p>
                <p className="text-3xl font-bold">{forecast.expected_deals}</p>
                <p className="text-xs text-white/70 mt-2">Based on current pipeline</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-sm text-white/80 mb-1">Projected Revenue</p>
                <p className="text-3xl font-bold">₹{(forecast.projected_revenue / 10000000).toFixed(1)}Cr</p>
                <p className="text-xs text-white/70 mt-2">From hot leads + deals</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-sm text-white/80 mb-1">Hot Leads</p>
                <p className="text-3xl font-bold">{forecast.hot_leads}</p>
                <p className="text-xs text-white/70 mt-2">Ready for conversion</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm bg-white/10 backdrop-blur rounded-xl p-3">
              <Activity className="w-4 h-4" />
              <span>Conversion probability based on {((forecast.expected_deals / forecast.hot_leads) * 100).toFixed(1)}% historical closing ratio</span>
            </div>
          </div>
        </section>

        {/* Quick Actions Footer */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 text-left transition-colors group">
            <AlertTriangle className="w-5 h-5 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-gray-900">View Escalations</p>
            <p className="text-xs text-gray-500 mt-1">{activities.escalations} pending</p>
          </button>
          
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 text-left transition-colors group">
            <Clock className="w-5 h-5 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-gray-900">Overdue Tasks</p>
            <p className="text-xs text-gray-500 mt-1">{activities.tasks.missed} need attention</p>
          </button>
          
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 text-left transition-colors group">
            <DollarSign className="w-5 h-5 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-gray-900">Overdue EMIs</p>
            <p className="text-xs text-gray-500 mt-1">{financials.emi_overdue} accounts</p>
          </button>
          
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 text-left transition-colors group">
            <TrendingUp className="w-5 h-5 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-gray-900">Hot Leads</p>
            <p className="text-xs text-gray-500 mt-1">{forecast.hot_leads} ready to close</p>
          </button>
        </div>
      </div>
    </div>
  );
}
