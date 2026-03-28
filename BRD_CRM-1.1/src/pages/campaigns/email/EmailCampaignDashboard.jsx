import React, { useState, useEffect } from 'react';
import { Mail, BarChart3, History, Plus, TrendingUp, Users, Send } from 'lucide-react';
import EmailPerformance from './EmailPerformance';
import CampaignHistory from './CampaignHistory';
import LaunchCampaign from './LaunchCampaign';
import { emailCampaignService } from '../../../services/campaignService';

const EmailCampaignDashboard = () => {
  const [activeTab, setActiveTab] = useState('launch');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    trackingEnabled: true,
    utmParameters: false,
    clickTracking: true,
    timing: 'schedule',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeCampaignCount, setActiveCampaignCount] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await emailCampaignService.getAll();
        const active = res.data.filter((c) =>
          ['draft', 'active', 'scheduled', 'in_progress'].includes(c.status)
        ).length;
        setActiveCampaignCount(active);
      } catch (err) {
        console.error('Failed to fetch email campaign count', err);
      }
    };
    fetchCount();
  }, []);

  const stats = [
    { label: 'Active Campaigns', value: activeCampaignCount !== null ? activeCampaignCount : 'N/A', icon: Send,       color: 'indigo' },
    { label: 'Total Sent',       value: 'N/A',                                                       icon: Mail,       color: 'green'  },
    { label: 'Avg Open Rate',    value: 'N/A',                                                       icon: TrendingUp, color: 'purple' },
    { label: 'Engaged Leads',    value: 'N/A',                                                       icon: Users,      color: 'orange' },
  ];

  const tabs = [
    { id: 'launch',      label: 'Launch Campaign', icon: Plus      },
    { id: 'performance', label: 'Performance',     icon: BarChart3 },
    { id: 'history',     label: 'History',         icon: History   },
  ];

  const steps = ['Identity & Audience', 'Content & Personalization', 'Scheduling & Automation'];

  const colorMap = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    green:  { bg: 'bg-green-100',  text: 'text-green-600'  },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.campaignTitle?.trim()) newErrors.campaignTitle = 'Campaign title is required';
      if (!formData.product) newErrors.product = 'Please select a product';
      if (!formData.targetAudience?.length) newErrors.targetAudience = 'Please select at least one audience group';
    }
    if (step === 2) {
      if (!formData.emailTemplate) newErrors.emailTemplate = 'Please select an email template';
      if (!formData.subjectLine?.trim()) newErrors.subjectLine = 'Subject line is required';
      if (!formData.senderEmail?.trim()) newErrors.senderEmail = 'Sender email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.senderEmail)) newErrors.senderEmail = 'Please enter a valid email address';
    }
    if (step === 3) {
      if (!formData.timing) newErrors.timing = 'Please select when to send';
      if (formData.timing === 'schedule' && !formData.scheduleDateTime) newErrors.scheduleDateTime = 'Please select a date and time';
      if (!formData.frequency) newErrors.frequency = 'Please select a frequency';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handleLaunchCampaign();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLaunchCampaign = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setActiveTab('performance');
      setCurrentStep(1);
      setFormData({ trackingEnabled: true, utmParameters: false, clickTracking: true, timing: 'schedule' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Mail className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Email Campaigns</h1>
              <p className="text-sm text-gray-500">Create, track, and manage your email outreach</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              const colors = colorMap[stat.color];
              return (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.value === 'N/A' ? 'text-gray-400' : 'text-gray-900'}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-4 ${colors.bg} rounded-lg`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'launch') { setCurrentStep(1); setErrors({}); }
                  }}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {activeTab === 'launch' && (
          <LaunchCampaign
            currentStep={currentStep}
            steps={steps}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handleLaunch={handleLaunchCampaign}
            showSuccess={showSuccess}
            setShowSuccess={setShowSuccess}
          />
        )}
        {activeTab === 'performance' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <EmailPerformance />
          </div>
        )}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <CampaignHistory />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailCampaignDashboard;