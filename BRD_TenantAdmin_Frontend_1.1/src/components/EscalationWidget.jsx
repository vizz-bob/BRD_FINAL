import React, { useEffect, useState } from 'react';
import { ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function EscalationWidget() {
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEscalations = async () => {
    try {
      // In production: const res = await workspaceApi.getEscalationMatrix();
      const mockData = [
        { id: 101, title: 'Loan #L-442 Underwriting', agent: 'Rahul S.', delay: '4h 20m', level: 'Critical' },
        { id: 102, title: 'KYC Verification #K-990', agent: 'Priya M.', delay: '1h 05m', level: 'Warning' }
      ];
      setEscalations(mockData);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEscalations();
    const interval = setInterval(fetchEscalations, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || escalations.length === 0) return null;

  return (
    <div className="bg-white border-l-4 border-red-500 shadow-sm rounded-r-xl p-3 sm:p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-red-700">
          <ExclamationTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <h3 className="font-bold text-sm sm:text-base">Escalation Matrix</h3>
          <span className="text-xs text-red-500 font-medium hidden sm:inline">(Action Required)</span>
        </div>
        {/* Pulsing dot */}
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      </div>

      {/* Escalation items */}
      <div className="space-y-2">
        {escalations.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-red-50 p-2.5 sm:p-2 rounded border border-red-100 gap-2 sm:gap-0"
          >
            <div className="text-sm min-w-0">
              <span className="font-bold text-gray-800 break-words">{item.title}</span>
              <span className="text-gray-400 mx-1.5 hidden sm:inline">|</span>
              <span className="text-gray-600 text-xs sm:text-sm block sm:inline mt-0.5 sm:mt-0">
                Assigned: {item.agent}
              </span>
            </div>
            <div className="flex items-center gap-1 text-red-600 font-bold bg-white px-2 py-1 rounded shadow-sm text-xs self-start sm:self-auto flex-shrink-0">
              <ClockIcon className="w-3 h-3" />
              Overdue: {item.delay}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}