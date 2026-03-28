import { useState } from "react";
import { loanApplicationAPI } from "../services/loanApplicationService";
import { 
  XMarkIcon, DocumentTextIcon, PencilSquareIcon, 
  CheckBadgeIcon, ArrowPathIcon 
} from "@heroicons/react/24/outline";

export default function SanctionLetterModal({ appId, customerName, onClose }) {
  const [step, setStep] = useState(1); // 1: Generate, 2: E-Sign Wait, 3: Done
  const [loading, setLoading] = useState(false);
  const [letterUrl, setLetterUrl] = useState(null);

  // Step 1: Generate the Letter
  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Simulate Backend PDF Generation
      await new Promise(r => setTimeout(r, 2000)); 
      // const res = await loanApplicationAPI.generateSanctionLetter(appId);
      setLetterUrl("https://via.placeholder.com/600x800.png?text=Sanction+Letter+Preview");
      setStep(2);
    } catch (err) {
      alert("Failed to generate sanction letter.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Trigger E-Sign
  const handleTriggerESign = async () => {
    setLoading(true);
    try {
      // Simulate sending E-Sign Link via Email/SMS
      await new Promise(r => setTimeout(r, 1500));
      // await loanApplicationAPI.triggerESign(appId);
      alert(`E-Sign Link sent to ${customerName}`);
      setStep(3);
    } catch (err) {
      alert("Failed to send E-Sign request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5 text-primary-600" />
            Sanction & Documentation (Phase 6)
          </h3>
          <button onClick={onClose}><XMarkIcon className="h-6 w-6 text-gray-400" /></button>
        </div>

        {/* Body */}
        <div className="p-8">
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-0"></div>
            <StepIndicator num={1} label="Generate KFS" active={step >= 1} />
            <StepIndicator num={2} label="Customer E-Sign" active={step >= 2} />
            <StepIndicator num={3} label="Ready to Disburse" active={step >= 3} />
          </div>

          <div className="mt-8 text-center min-h-[200px] flex flex-col items-center justify-center">
            
            {loading && <ArrowPathIcon className="h-10 w-10 text-primary-600 animate-spin mb-4" />}

            {!loading && step === 1 && (
              <>
                <DocumentTextIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h4 className="text-lg font-bold text-gray-900">Generate Sanction Letter</h4>
                <p className="text-sm text-gray-500 mb-6 max-w-sm">
                  Create the Key Fact Statement (KFS) and Sanction Letter with the final approved amount and interest rate.
                </p>
                <button 
                  onClick={handleGenerate}
                  className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-700 transition"
                >
                  Generate PDF
                </button>
              </>
            )}

            {!loading && step === 2 && (
              <>
                <div className="w-full bg-gray-100 rounded-lg p-4 mb-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-red-100 p-2 rounded text-red-600"><DocumentTextIcon className="h-6 w-6"/></div>
                    <div className="text-left">
                      <div className="font-bold text-gray-800">Sanction_Letter_{appId}.pdf</div>
                      <div className="text-xs text-gray-500">Generated Just Now • 1.2 MB</div>
                    </div>
                  </div>
                  <a href={letterUrl} target="_blank" rel="noreferrer" className="text-xs text-primary-600 font-bold hover:underline">Preview Document</a>
                </div>
                
                <button 
                  onClick={handleTriggerESign}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                  Send for E-Sign
                </button>
              </>
            )}

            {!loading && step === 3 && (
              <>
                <CheckBadgeIcon className="h-20 w-20 text-green-500 mb-4" />
                <h4 className="text-xl font-bold text-gray-900">Documentation Initiated!</h4>
                <p className="text-sm text-gray-500 mb-6">
                  The customer has received the link. Once signed, the case will move to the Disbursement Queue.
                </p>
                <button 
                  onClick={onClose}
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-gray-800"
                >
                  Close & Refresh
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const StepIndicator = ({ num, label, active }) => (
  <div className={`relative z-10 flex flex-col items-center gap-2 ${active ? 'opacity-100' : 'opacity-50'}`}>
    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
      active ? 'bg-primary-600 text-white shadow-lg scale-110' : 'bg-gray-300 text-gray-600'
    } transition-all`}>
      {num}
    </div>
    <span className="text-xs font-bold text-gray-700 bg-white px-2 py-0.5 rounded">{label}</span>
  </div>
);
