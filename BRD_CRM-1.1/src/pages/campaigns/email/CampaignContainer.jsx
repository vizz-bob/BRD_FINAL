import React, { useState } from 'react';
import LaunchCampaign from './LaunchCampaign';

const CampaignContainer = () => {
  const steps = ['Basic Info', 'Email Content', 'Schedule & Tracking'];
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleLaunch();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleLaunch = () => {
    console.log('Campaign launched!', formData);
    setShowSuccess(true);
    // Optional: reset or redirect after launch
  };

  return (
    <LaunchCampaign
      currentStep={currentStep}
      steps={steps}
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      handleLaunch={handleLaunch}
      showSuccess={showSuccess}
      setShowSuccess={setShowSuccess}
    />
  );
};

export default CampaignContainer;
