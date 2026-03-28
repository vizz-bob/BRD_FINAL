import React, { useState, useEffect  } from 'react';
import {
  MessageCircle,
  BarChart3,
  History,
  Plus,
  TrendingUp,
  Users,
  Send
} from 'lucide-react';

import WhatsAppPerformance from './WhatsAppPerformance';
import WhatsAppCampaignHistory from './WhatsAppCampaignHistory';
import LaunchWhatsAppCampaign from './LaunchWhatsAppCampaign';
import { whatsappCampaignService } from '../../../services/campaignService';

const WhatsAppCampaignDashboard = () => {
  const [activeTab, setActiveTab] = useState('launch');
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    campaignTitle: '',
    product: '',
    targetAudience: [],

    whatsappTemplate: '',
    messageBody: '',

    timing: 'schedule',
    scheduleDateTime: '',
    frequency: '',

    trackingEnabled: true,
    clickTracking: true,
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [campaignCount, setCampaignCount] = useState(null);

useEffect(() => {
  const fetchCount = async () => {
    try {
      const res = await whatsappCampaignService.getAll();
      const active = res.data.filter((c) =>
        ["draft", "active", "scheduled", "in_progress"].includes(c.status)
      ).length;
      setCampaignCount(active);
    } catch (err) {
      console.error("Failed to fetch campaign count", err);
    }
  };
  fetchCount();
}, []);

  const stats = [
  { label: 'Active Campaigns', value: campaignCount !== null ? campaignCount : 'N/A', icon: Send, color: 'green' },
  { label: 'Total Sent', value: 'N/A', icon: MessageCircle, color: 'indigo' },
  { label: 'Avg Read Rate', value: 'N/A', icon: TrendingUp, color: 'purple' },
  { label: 'Engaged Leads', value: 'N/A', icon: Users, color: 'orange' },
];

  const tabs = [
    { id: 'launch', label: 'Launch WhatsApp', icon: Plus },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ];

  const steps = [
    'Identity & Audience',
    'Template & Media',
    'Scheduling & Automation'
  ];

  // --------------------
  // Validation
  // --------------------
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.campaignTitle.trim())
        newErrors.campaignTitle = 'Campaign title is required';
      if (!formData.product)
        newErrors.product = 'Please select a product';
      if (!formData.targetAudience.length)
        newErrors.targetAudience = 'Select at least one audience group';
    }

    if (step === 2) {
      if (!formData.whatsappTemplate)
        newErrors.whatsappTemplate = 'Please select a template';
      if (!formData.messageBody.trim())
        newErrors.messageBody = 'Message content is required';
    }

    if (step === 3) {
      if (!formData.timing)
        newErrors.timing = 'Please select campaign timing';
      if (!formData.frequency)
        newErrors.frequency = 'Please select frequency';
      if (
        formData.timing === 'schedule' &&
        !formData.scheduleDateTime
      ) {
        newErrors.scheduleDateTime =
          'Please select scheduled date & time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // --------------------
  // 🚀 LAUNCH WHATSAPP CAMPAIGN (API)
  // --------------------
  const handleLaunchWhatsApp = async () => {
  if (!validateStep(3)) return;
  setLoading(true);

  try {
    const payload = new FormData();

    payload.append("campaign_title", formData.campaignTitle);
    payload.append("product", formData.product);
    payload.append("message_body", formData.messageBody);
    payload.append("timing", formData.timing);
    payload.append("frequency", formData.frequency);
    payload.append("enable_read_receipts_tracking", formData.trackingEnabled ? "true" : "false");
    payload.append("track_interactive_buttons", formData.clickTracking ? "true" : "false");

    // target_audience — MultiSelectField needs repeated keys
    (formData.targetAudience || []).forEach(a =>
      payload.append("target_audience", a)
    );

    if (formData.timing === "schedule" && formData.scheduleDateTime) {
      payload.append("schedule_datetime", new Date(formData.scheduleDateTime).toISOString());
    }

    const res = await whatsappCampaignService.create(payload);
    await whatsappCampaignService.launch(res.data.id);

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCurrentStep(1);
      setActiveTab("history");
      setFormData({
        campaignTitle: "",
        product: "",
        targetAudience: [],
        whatsappTemplate: "",
        messageBody: "",
        timing: "schedule",
        scheduleDateTime: "",
        frequency: "",
        trackingEnabled: true,
        clickTracking: true,
      });
      setErrors({});
    }, 1500);
  } catch (error) {
    console.error("WhatsApp Campaign Error:", error.response?.data || error);
    alert("Failed to launch WhatsApp campaign");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold">WhatsApp Campaigns</h1>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-50 p-4 rounded-xl border"
                >
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <div className="flex items-center justify-between">
                    <p className={`text-2xl font-bold ${stat.value === 'N/A' ? 'text-gray-400' : 'text-gray-900'}`}>{stat.value}</p>
                    <Icon className="w-6 h-6 text-gray-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TABS */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {activeTab === 'launch' && (
          <LaunchWhatsAppCampaign
            currentStep={currentStep}
            steps={steps}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleNext={handleNext}
            handlePrevious={() =>
              setCurrentStep((prev) => prev - 1)
            }
            handleLaunch={handleLaunchWhatsApp}
            showSuccess={showSuccess}
            setShowSuccess={setShowSuccess}
            loading={loading}
          />
        )}

        {activeTab === 'performance' && <WhatsAppPerformance />}
        {activeTab === 'history' && <WhatsAppCampaignHistory />}
      </div>
    </div>
  );
};

export default WhatsAppCampaignDashboard;
