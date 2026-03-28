import { useState } from "react";
import { CloudArrowUpIcon, DocumentTextIcon, XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function BulkUploadModal({ isOpen, onClose, onUploadComplete }) {
  const [step, setStep] = useState(1); // 1: Upload, 2: Map, 3: Success
  const [file, setFile] = useState(null);
  const [mapping, setMapping] = useState({ name: "", mobile: "", email: "", source: "" });
  const [uploading, setUploading] = useState(false);

  // Mock Headers from a CSV file
  const csvHeaders = ["Full Name", "Phone Number", "Email Address", "Lead Source", "City", "Loan Amount"];

  if (!isOpen) return null;

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type.includes("csv") || droppedFile?.type.includes("sheet")) {
      setFile(droppedFile);
      setStep(2);
    } else {
      alert("Please upload a CSV or Excel file.");
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setStep(3);
      if (onUploadComplete) onUploadComplete();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-fade-in max-h-[95vh] sm:max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-slate-50 px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-800">Bulk Data Ingestion</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">
              Step {step} of 3: {step === 1 ? "Upload File" : step === 2 ? "Map Columns" : "Finished"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition flex-shrink-0">
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
          </button>
        </div>

        {/* Content — scrollable */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1">

          {/* STEP 1: UPLOAD */}
          {step === 1 && (
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-4 border-dashed border-slate-200 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center hover:bg-slate-50 hover:border-primary-400 transition-all cursor-pointer group flex flex-col items-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <CloudArrowUpIcon className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-700">Drag & Drop your CSV/Excel file here</h4>
              <p className="text-slate-400 text-sm mt-2 font-medium">or tap to browse from your device</p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => { setFile(e.target.files[0]); setStep(2); }}
              />
            </label>
          )}

          {/* STEP 2: MAPPING */}
          {step === 2 && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4 bg-primary-50 p-3 sm:p-4 rounded-xl border border-primary-100">
                <DocumentTextIcon className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-800 truncate text-sm sm:text-base">{file?.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{(file?.size / 1024).toFixed(2)} KB</div>
                </div>
                <button
                  onClick={() => { setFile(null); setStep(1); }}
                  className="ml-auto text-xs font-bold text-rose-600 hover:underline flex-shrink-0"
                >
                  Change
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {['Name', 'Mobile', 'Email', 'Source'].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{field} Column</label>
                    <select
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                      onChange={(e) => setMapping({ ...mapping, [field.toLowerCase()]: e.target.value })}
                    >
                      <option value="">Select Column...</option>
                      {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <div className="text-center py-8 sm:py-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 animate-bounce">
                <CheckCircleIcon className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800">Import Successful!</h3>
              <p className="text-slate-500 font-medium mt-2 text-sm sm:text-base">1,240 leads have been added to the pipeline.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 sm:px-8 py-4 sm:py-6 border-t border-slate-200 flex justify-end gap-3 flex-shrink-0">
          {step === 2 && (
            <>
              <button
                onClick={() => setStep(1)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition text-sm"
              >
                Back
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                {uploading ? "Importing..." : "Start Import"}
              </button>
            </>
          )}
          {step === 3 && (
            <button
              onClick={onClose}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition text-sm"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}