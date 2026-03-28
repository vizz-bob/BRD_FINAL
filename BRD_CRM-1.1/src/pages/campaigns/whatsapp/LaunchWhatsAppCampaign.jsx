import React from "react";
import { Send, CheckCircle } from "lucide-react";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";

const LaunchWhatsAppCampaign = ({
  currentStep,
  steps,
  formData,
  setFormData,
  errors,
  handleNext,
  handlePrevious,
  handleLaunch,
  showSuccess,
  setShowSuccess,
  loading,
}) => {

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
            <CheckCircle className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              WhatsApp Campaign Launched!
            </h3>
            <p className="text-gray-600 mb-4">
              Your broadcast is being queued for delivery via WhatsApp API.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={idx} className="flex-1 relative text-center">
              <div
                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold relative z-10 transition-colors ${
                  currentStep > idx + 1
                    ? "bg-green-600 text-white"
                    : currentStep === idx + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-[50%] w-full h-0.5 ${currentStep > idx + 1 ? "bg-green-600" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

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

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        {currentStep < 3 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleLaunch}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>
              {loading ? "Launching..." : "Launch WhatsApp Broadcast"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LaunchWhatsAppCampaign;
