// ExportModal.jsx
import React, { useState } from 'react';
import { X, Download, FileText, File, CheckCircle } from 'lucide-react';

const ExportModal = ({ onClose, onExport, filters }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onExport(exportFormat, {
      includeCharts,
      includeDetails,
    });
    setIsExporting(false);
  };

  const formats = [
    {
      id: 'csv',
      name: 'CSV Spreadsheet',
      icon: FileText,
      description: 'Best for data import and analysis',
      color: 'blue'
    },
    {
      id: 'excel',
      name: 'Excel Spreadsheet',
      icon: File,
      description: 'Best for analysis with formatting',
      color: 'green'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Download className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Export Forecast Data</h2>
              <p className="text-sm text-gray-500 mt-1">
                Choose format and options for your export
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formats.map((format) => {
                const Icon = format.icon;
                const isSelected = exportFormat === format.id;
                
                return (
                  <button
                    key={format.id}
                    onClick={() => setExportFormat(format.id)}
                    className={`relative p-4 border-2 rounded-xl transition-all text-left ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle className="w-5 h-5 text-indigo-600" />
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <div className={`p-2 bg-${format.color}-100 rounded-lg`}>
                        <Icon className={`w-5 h-5 text-${format.color}-600`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{format.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{format.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Include in Export
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Charts & Visualizations</p>
                  <p className="text-xs text-gray-500">Funnel chart, trends, and pie charts</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                <input
                  type="checkbox"
                  checked={includeDetails}
                  onChange={(e) => setIncludeDetails(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Detailed Agent Data</p>
                  <p className="text-xs text-gray-500">Individual performance metrics and variance</p>
                </div>
              </label>
            </div>
          </div>

          {/* Current Filters Summary */}
          <div className="bg-indigo-50 rounded-xl p-4">
            <p className="text-sm font-medium text-indigo-900 mb-2">
              Applied Filters
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-indigo-600">Period:</span>{' '}
                <span className="text-indigo-900 font-medium">
                  {filters.period.charAt(0).toUpperCase() + filters.period.slice(1)}
                </span>
              </div>
              <div>
                <span className="text-indigo-600">Type:</span>{' '}
                <span className="text-indigo-900 font-medium">
                  {filters.forecastType === 'sales' ? 'Sales Forecast' : 'Recovery Forecast'}
                </span>
              </div>
              {filters.product !== 'all' && (
                <div>
                  <span className="text-indigo-600">Product:</span>{' '}
                  <span className="text-indigo-900 font-medium">{filters.product}</span>
                </div>
              )}
              {filters.team !== 'all' && (
                <div>
                  <span className="text-indigo-600">Team:</span>{' '}
                  <span className="text-indigo-900 font-medium">{filters.team}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export {exportFormat.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;