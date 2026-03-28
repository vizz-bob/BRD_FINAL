export default function CaseTimeline({ stage }) {
  const steps = [
    "Eligibility",
    "KYC",
    "Fraud Check",
    "AML",
    "Underwriting",
    "Document Execution",
    "Disbursement",
  ];

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Case Progress</h2>

      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const completed = index < stage;
          const current = index === stage;

          return (
            <div key={step} className="flex items-center flex-shrink-0">
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-colors
                  ${completed ? "bg-green-600 border-green-600 text-white" : ""}
                  ${current ? "bg-blue-600 border-blue-600 text-white" : ""}
                  ${!completed && !current ? "bg-white border-gray-300 text-gray-400" : ""}`}
                >
                  {completed ? "✓" : current ? index + 1 : index + 1}
                </div>

                <p
                  className={`mt-2 text-xs text-center whitespace-nowrap
                  ${completed || current ? "font-medium text-gray-900" : "text-gray-500"}`}
                >
                  {step}
                </p>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div 
                  className={`h-[2px] flex-1 min-w-[40px] mx-3 transition-colors
                  ${completed ? "bg-green-600" : "bg-gray-300"}`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}