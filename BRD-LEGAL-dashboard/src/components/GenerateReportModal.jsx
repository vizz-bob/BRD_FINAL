import React, { useState } from 'react';
import Modal from 'react-modal';
import { generateReport } from '../api/dashboardApi';
import { useMessage } from '../context/MessageContext';

const GenerateReportModal = ({ isOpen, onRequestClose }) => {
  const { addMessage } = useMessage();
  const [reportType, setReportType] = useState('Daily');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    // Validation
    if (!dateRange.from || !dateRange.to) {
      addMessage('Please select a valid date range.', 'error');
      return;
    }

    // Validate date range
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    
    if (fromDate > toDate) {
      addMessage('Start date must be before end date.', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const reportData = {
        report_type: reportType,
        date_from: dateRange.from,
        date_to: dateRange.to,
      };

      console.log('Generating report with data:', reportData);
      const response = await generateReport(reportData);

      console.log('Report generated successfully:', response);
      addMessage(
        `${reportType} report generated successfully for ${dateRange.from} to ${dateRange.to}!`,
        'success'
      );

      // Reset form
      setReportType('Daily');
      setDateRange({ from: '', to: '' });

      // Close modal after success
      setTimeout(() => {
        onRequestClose();
      }, 1500);
    } catch (error) {
      console.error('Error generating report:', error);
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to generate report';
      addMessage(`Error generating report: ${errorMsg}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Generate New Report"
      className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20 relative z-50"
      overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
    >
      <h2 className="text-xl font-bold mb-4">Generate New Report</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Report Type *
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date Range *
          </label>
          <div className="flex gap-2 mt-1">
            <div className="flex-1">
              <label className="text-xs text-gray-600">From</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={isGenerating}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-600">To</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={isGenerating}
              />
            </div>
          </div>
        </div>

        {/* Info message */}
        <div className="mt-2 p-3 bg-blue-50 text-blue-700 text-sm rounded-md">
          <p>
            This will generate a <strong>{reportType}</strong> report from{' '}
            <strong>{dateRange.from || 'start date'}</strong> to{' '}
            <strong>{dateRange.to || 'end date'}</strong>.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={onRequestClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          disabled={isGenerating}
        >
          Cancel
        </button>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </Modal>
  );
};

export default GenerateReportModal;