import React, { useState, useEffect } from 'react';
import { MessageSquare, BarChart3, History, Plus, TrendingUp, Users, Send } from 'lucide-react';
import SMSPerformance from './SMSPerformance';
import CampaignHistory from './CampaignHistory';
import LaunchCampaign from './LaunchCampaign';
import { smsCampaignService } from '../../../services/campaignService';

const SMSCampaignDashboard = () => {
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
        const res = await smsCampaignService.getAll();
        const active = res.data.filter((c) =>
          ['draft', 'active', 'scheduled', 'in_progress'].includes(c.status)
        ).length;
        setActiveCampaignCount(active);
      } catch (err) {
        console.error('Failed to fetch SMS campaign count', err);
      }
    };
    fetchCount();
  }, []);

  const stats = [
    { label: 'Active SMS Campaigns',  value: activeCampaignCount !== null ? activeCampaignCount : 'N/A', icon: Send,           color: 'indigo' },
    { label: 'Messages Sent Today',   value: 'N/A',                                                        icon: MessageSquare,  color: 'green'  },
    { label: 'Avg Click Rate',        value: 'N/A',                                                        icon: TrendingUp,     color: 'purple' },
    { label: 'Active Subscribers',    value: 'N/A',                                                        icon: Users,          color: 'orange' },
  ];

  const tabs = [
    { id: 'launch',      label: 'Launch SMS',  icon: Plus      },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'history',     label: 'History',     icon: History   },
  ];

  const steps = ['Identity & Audience', 'SMS Content', 'Review & Schedule'];

  const colorMap = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-500' },
    green:  { bg: 'bg-green-100',  text: 'text-green-500'  },
    purple: { bg: 'bg-purple-100', text: 'text-purple-500' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-500' },
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.campaignTitle?.trim()) newErrors.campaignTitle = 'Campaign title is required';
      if (!formData.product) newErrors.product = 'Please select a product';
      if (!formData.targetAudience?.length) newErrors.targetAudience = 'Select at least one audience group';
    }
    if (step === 2) {
      if (!formData.smsTemplate) newErrors.smsTemplate = 'Please select a template';
      if (!formData.messageContent?.trim()) newErrors.messageContent = 'SMS message is required';
      if (!formData.senderId?.trim()) newErrors.senderId = 'Sender ID/Number is required';
    }
    if (step === 3) {
      if (formData.timing === 'schedule' && !formData.scheduleDateTime) {
        newErrors.timing = 'Please select a date and time';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => setCurrentStep(prev => prev - 1);

  const handleLaunchCampaign = () => {
    if (validateStep(currentStep)) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setActiveTab('performance');
        setCurrentStep(1);
        setFormData({ trackingEnabled: true, utmParameters: false, clickTracking: true, timing: 'schedule' });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 pt-8 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SMS Campaigns</h1>
              <p className="text-sm text-gray-500">Create, track, and manage your SMS outreach</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              const colors = colorMap[stat.color];
              return (
                <div key={idx} className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.value === 'N/A' ? 'text-gray-400' : 'text-gray-900'}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 pb-4 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
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
          />
        )}
        {activeTab === 'performance' && <SMSPerformance />}
        {activeTab === 'history' && <CampaignHistory />}
      </div>
    </div>
  );
};

export default SMSCampaignDashboard;