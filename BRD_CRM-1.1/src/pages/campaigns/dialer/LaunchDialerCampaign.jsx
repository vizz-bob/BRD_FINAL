// import React from 'react';
// import { PhoneOutgoing, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
// import StepOne from './steps/StepOne';
// import StepTwo from './steps/StepTwo';
// import StepThree from './steps/StepThree';

// const LaunchDialerCampaign = ({ currentStep, steps, formData, setFormData, errors, handleNext, handlePrevious, handleLaunch, showSuccess }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//       {/* Success Modal */}
//       {showSuccess && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
//             <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Dialer Campaign Launched!</h3>
//             <p className="text-gray-600 mb-4">Your agents are being notified and calls will begin as scheduled.</p>
//             <div className="text-sm text-gray-500">Redirecting...</div>
//           </div>
//         </div>
//       )}

//       {/* Stepper Logic */}
//       <div className="mb-10">
//         <div className="flex items-center justify-between max-w-2xl mx-auto">
//           {steps.map((step, idx) => (
//             <div key={idx} className="flex items-center flex-1 last:flex-none">
//               <div className={`flex flex-col items-center`}>
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
//                   currentStep > idx + 1 ? 'bg-green-500 text-white' : 
//                   currentStep === idx + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
//                 }`}>
//                   {currentStep > idx + 1 ? <CheckCircle className="w-6 h-6" /> : idx + 1}
//                 </div>
//                 <span className="text-xs mt-2 font-medium text-gray-600">{step}</span>
//               </div>
//               {idx < steps.length - 1 && (
//                 <div className={`flex-1 h-1 mx-4 rounded ${currentStep > idx + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Step Content */}
//       <div className="mb-8 min-h-[400px]">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold text-gray-900">Step {currentStep}: {steps[currentStep-1]}</h2>
//           <span className="text-sm text-gray-500">Dialer Campaign Setup</span>
//         </div>
//         {currentStep === 1 && <StepOne formData={formData} setFormData={setFormData} errors={errors} />}
//         {currentStep === 2 && <StepTwo formData={formData} setFormData={setFormData} errors={errors} />}
//         {currentStep === 3 && <StepThree formData={formData} setFormData={setFormData} errors={errors} />}
//       </div>

//       {/* Footer Navigation */}
//       <div className="flex justify-between items-center pt-6 border-t border-gray-200">
//         <button
//           onClick={handlePrevious}
//           disabled={currentStep === 1}
//           className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" /> Previous
//         </button>
//         {currentStep === steps.length ? (
//           <button
//             onClick={handleLaunch}
//             className="flex items-center px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-all font-semibold"
//           >
//             Launch Campaign <PhoneOutgoing className="w-4 h-4 ml-2" />
//           </button>
//         ) : (
//           <button
//             onClick={handleNext}
//             className="flex items-center px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
//           >
//             Next <ArrowRight className="w-4 h-4 ml-2" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LaunchDialerCampaign;


// src/components/campaigns/LaunchDialerCampaign.jsx
import React from "react";
import { PhoneOutgoing, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";

const LaunchDialerCampaign = ({
  currentStep,
  steps,
  formData,
  setFormData,
  errors,
  handleNext,
  handlePrevious,
  handleLaunch,
  showSuccess,
}) => {
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne formData={formData} setFormData={setFormData} errors={errors} />;
      case 2:
        return <StepTwo formData={formData} setFormData={setFormData} errors={errors} />;
      case 3:
        return <StepThree formData={formData} setFormData={setFormData} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Dialer Campaign Launched!</h3>
            <p className="text-gray-600 mb-4">Your agents are being notified and calls will begin as scheduled.</p>
            <div className="text-sm text-gray-500">Redirecting...</div>
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    currentStep > idx + 1
                      ? "bg-green-500 text-white"
                      : currentStep === idx + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > idx + 1 ? <CheckCircle className="w-6 h-6" /> : idx + 1}
                </div>
                <span className="text-xs mt-2 font-medium text-gray-600">{step}</span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded ${
                    currentStep > idx + 1 ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8 min-h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Step {currentStep}: {steps[currentStep - 1]}
          </h2>
          <span className="text-sm text-gray-500">Dialer Campaign Setup</span>
        </div>
        {renderStep()}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={() => handlePrevious(currentStep - 1)}
          disabled={currentStep === 1}
          className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </button>

        {currentStep === steps.length ? (
          <button
            onClick={handleLaunch}
            className="flex items-center px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-all font-semibold"
          >
            Launch Campaign <PhoneOutgoing className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button
            onClick={() => handleNext(currentStep + 1)}
            className="flex items-center px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
          >
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LaunchDialerCampaign;
