import React, { useState, useEffect  } from 'react';
import { Phone, BarChart3, History, Plus, TrendingUp, Users, Send, CheckCircle } from 'lucide-react';
import VoicePerformance from './VoicePerformance';
import VoiceHistory from './VoiceHistory';
import LaunchVoiceCampaign from './LaunchVoiceCampaign';
import { voiceCampaignService } from '../../../services/campaignService';

const VoiceCampaignDashboard = () => {
  const [activeTab, setActiveTab] = useState('launch');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    trackingEnabled: true,
    ivrTracking: true,
    timing: 'now',
    voiceSource: 'upload',
    retryAttempts: 1
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const [activeBroadcastCount, setActiveBroadcastCount] = useState(null);

useEffect(() => {
  const fetchCount = async () => {
    try {
      const res = await voiceCampaignService.getAll();
      const active = res.data.filter((c) =>
        ["draft", "active", "scheduled", "in_progress"].includes(c.status)
      ).length;
      setActiveBroadcastCount(active);
    } catch (err) {
      console.error("Failed to fetch voice campaign count", err);
    }
  };
  fetchCount();
}, []);

  const stats = [
  { label: 'Active Broadcasts', value: activeBroadcastCount !== null ? activeBroadcastCount : 'N/A', icon: Send, color: 'indigo' },
  { label: 'Total Calls Made', value: 'N/A', icon: Phone, color: 'green' },
  { label: 'Avg Answer Rate', value: 'N/A', icon: TrendingUp, color: 'purple' },
  { label: 'Keypad Responses', value: 'N/A', icon: Users, color: 'orange' },
];

  const steps = ['Identity & Audience', 'Audio Content', 'Scheduling & Retries'];

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.campaignTitle?.trim()) newErrors.campaignTitle = 'Campaign title is required';
      if (!formData.product) newErrors.product = 'Please select a product';
      if (!formData.targetAudience?.length) newErrors.targetAudience = 'Select at least one group';
    }
    if (step === 2) {
      if (formData.voiceSource === 'tts' && !formData.ttsText?.trim()) newErrors.ttsText = 'Script is required';
      if (formData.voiceSource === 'upload' && !formData.audioFile) newErrors.audioFile = 'Audio file is required';
    }
    if (step === 3) {
      if (formData.timing === 'schedule' && !formData.scheduleDateTime) newErrors.scheduleDateTime = 'Date/Time required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) setCurrentStep(prev => prev + 1);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 px-4 py-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                    {/* Phone icon for Voice */}
                    <Phone className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Voice Broadcasts</h1>
                    <p className="text-sm text-gray-500">Automate call outreach and manage IVR responses</p>
                </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.value === 'N/A' ? 'text-gray-400' : 'text-gray-900'}`}>{stat.value}</p>
                        </div>
                        <div className={`p-4 bg-${stat.color}-100 rounded-lg`}>
                            <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                        </div>
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>
        </div>




      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'launch', label: 'Launch Campaign', icon: Plus },
              { id: 'performance', label: 'Performance', icon: BarChart3 },
              { id: 'history', label: 'History', icon: History }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium transition-all ${
                  activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {activeTab === 'launch' && (
          <LaunchVoiceCampaign
            currentStep={currentStep}
            steps={steps}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleNext={handleNext}
            handlePrevious={() => setCurrentStep(prev => prev - 1)}
          />
        )}
        {activeTab === 'performance' && <VoicePerformance />}
        {activeTab === 'history' && <VoiceHistory />}
      </div>
    </div>
  );
};

export default VoiceCampaignDashboard;