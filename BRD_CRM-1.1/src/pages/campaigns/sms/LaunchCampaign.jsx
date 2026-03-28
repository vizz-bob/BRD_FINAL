import React, { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import { smsCampaignService } from "../../../services/campaignService";

const LaunchCampaign = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    campaignTitle: "",
    product: "",
    targetAudience: [],
    smsTemplate: "",
    senderId: "",
    messageContent: "",
    timing: "now",
    scheduleDateTime: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const handlePrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // -----------------------
  // Validation
  // -----------------------
  const validate = () => {
    const newErrors = {};
    if (!formData.campaignTitle)
      newErrors.campaignTitle = "Campaign Title is required";
    if (!formData.product) newErrors.product = "Product is required";
    if (!formData.targetAudience?.length)
      newErrors.targetAudience = "Select at least one audience group";
    if (!formData.smsTemplate) newErrors.smsTemplate = "Select an SMS template";
    if (!formData.senderId) newErrors.senderId = "Sender ID is required";
    if (!formData.messageContent)
      newErrors.messageContent = "Message content cannot be empty";
    if (formData.timing === "schedule" && !formData.scheduleDateTime)
      newErrors.timing = "Select schedule date & time";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------
  // Launch SMS Campaign API
  // -----------------------
 const handleLaunch = async () => {
  if (!validate()) return;
  setLoading(true);

  try {
    const payload = new FormData();

    payload.append("campaign_title", formData.campaignTitle);
    payload.append("product", formData.product);
    payload.append("sms_template", formData.smsTemplate);
    payload.append("sender_id", formData.senderId);
    payload.append("message_content", formData.messageContent);
    payload.append("timing", formData.timing);

    // MultiSelectField — append each value separately
    (formData.targetAudience || []).forEach(ta =>
      payload.append("target_audience", ta)
    );

    if (formData.timing === "schedule" && formData.scheduleDateTime) {
      payload.append("schedule_datetime", new Date(formData.scheduleDateTime).toISOString());
    }

    const res = await smsCampaignService.create(payload);
    await smsCampaignService.launch(res.data.id);

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        campaignTitle: "",
        product: "",
        targetAudience: [],
        smsTemplate: "",
        senderId: "",
        messageContent: "",
        timing: "now",
        scheduleDateTime: "",
      });
      setCurrentStep(1);
    }, 3000);

  } catch (err) {
    console.error("Failed to launch SMS campaign", err.response?.data || err);
    alert("Something went wrong! Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 relative">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              SMS Campaign Launched!
            </h3>
            <p className="text-gray-600 mb-4">
              Messages are queued and will be sent according to your schedule.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting to analytics...
            </div>
          </div>
        </div>
      )}

      {/* Step Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center flex-1 last:flex-none"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                  currentStep > index + 1
                    ? "bg-green-500 text-white"
                    : currentStep === index + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > index + 1 ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > index + 1 ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Step {currentStep}: {steps[currentStep - 1]}
        </h2>

        {currentStep === 1 && (
          <StepOne
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )}
        {currentStep === 2 && (
          <StepTwo
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )}
        {currentStep === 3 && (
          <StepThree
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1 || loading}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>

        {currentStep < 3 ? (
          <button
            onClick={handleNext}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleLaunch}
            disabled={loading}
            className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? "Launching..." : "Launch SMS Campaign"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LaunchCampaign;
