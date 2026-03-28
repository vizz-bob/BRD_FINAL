import React, { useState } from "react";
import { Send, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import { voiceCampaignService } from "../../../services/campaignService";

const LaunchVoiceCampaign = ({
  currentStep,
  steps,
  formData,
  setFormData,
  errors,
  handleNext,
  handlePrevious,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLaunch = async () => {
  try {
    setLoading(true);

    const payload = new FormData();

    payload.append("campaign_title", formData.campaignTitle);
    payload.append("product", formData.product);
    payload.append("timing", formData.timing);
    payload.append("voice_source", formData.voiceSource || "upload");
    payload.append("retry_attempts", formData.retryAttempts || 1);
    payload.append("enable_ivr_tracking", formData.ivrTracking ? "true" : "false");

    // MultiSelectField
    (formData.targetAudience || []).forEach(a =>
      payload.append("target_audience", a)
    );

    if (formData.voiceSource === "tts" && formData.ttsText) {
      payload.append("tts_text", formData.ttsText);
    }

    if (formData.voiceSource === "upload" && formData.audioFile) {
      payload.append("audio_file", formData.audioFile);
    }

    if (formData.timing === "schedule" && formData.scheduleDateTime) {
      payload.append("schedule_datetime", new Date(formData.scheduleDateTime).toISOString());
    }

    const res = await voiceCampaignService.create(payload);
    await voiceCampaignService.launch(res.data.id);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  } catch (err) {
    console.error("Voice Campaign Error:", err.response?.data || err);
    alert("Failed to create voice campaign. Check console.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Voice Campaign Scheduled!
            </h3>
            <p className="text-gray-600">
              Your broadcast will run as configured.
            </p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={idx} className="flex-1 flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep > idx + 1
                    ? "bg-green-500 text-white"
                    : currentStep === idx + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > idx + 1 ? "✓" : idx + 1}
              </div>
              <div className="ml-3 hidden md:block">
                <p className="text-xs font-medium text-gray-500">
                  Step {idx + 1}
                </p>
                <p className="text-sm font-bold text-gray-900">{step}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 min-h-[400px]">
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

      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center px-6 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Previous
        </button>

        {currentStep < 3 ? (
          <button
            onClick={handleNext}
            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Next <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleLaunch}
            disabled={loading}
            className="flex items-center px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
          >
            <Send className="w-4 h-4 mr-2" />
            {loading ? "Launching..." : "Launch Broadcast"}
          </button>
        )}
      </div>
    </div>
  );
};

export default LaunchVoiceCampaign;
