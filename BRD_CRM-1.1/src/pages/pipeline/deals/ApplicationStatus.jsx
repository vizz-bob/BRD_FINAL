import React, { useState } from 'react';
import { 
  CheckCircle,
  Clock
} from 'lucide-react';


const ApplicationStatus = () => {
  const [applications, setApplications] = useState([
    {
      id: 'APP-002',
      leadName: 'Priya Sharma',
      productType: 'Personal Loan',
      amount: '₹5,00,000',
      currentStage: 'Under Review',
      assignedUnderwriter: 'Agent A',
      riskCategory: 'Low',
      lastUpdated: '2025-05-16',
      timeline: [
        { stage: 'Submitted', date: '2025-05-14', status: 'completed' },
        { stage: 'Document Verification', date: '2025-05-15', status: 'completed' },
        { stage: 'Under Review', date: '2025-05-16', status: 'current' },
        { stage: 'Approved/Rejected', date: '', status: 'pending' }
      ]
    }
  ]);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Application Status Tracking</h2>

      <div className="space-y-6">
        {applications.map((app) => (
          <div key={app.id} className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{app.id} - {app.leadName}</h3>
                <p className="text-sm text-gray-500">{app.productType} | {app.amount}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Risk Category</p>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{app.riskCategory}</span>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="relative">
              <div className="flex justify-between">
                {app.timeline.map((step, idx) => (
                  <div key={idx} className="flex-1 relative">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === 'completed' ? 'bg-green-500' :
                        step.status === 'current' ? 'bg-indigo-500' :
                        'bg-gray-300'
                      }`}>
                        {step.status === 'completed' && <CheckCircle className="w-5 h-5 text-white" />}
                        {step.status === 'current' && <Clock className="w-5 h-5 text-white" />}
                      </div>
                      <p className={`mt-2 text-xs font-medium text-center ${
                        step.status === 'completed' || step.status === 'current' ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.stage}
                      </p>
                      {step.date && <p className="text-xs text-gray-500 mt-1">{step.date}</p>}
                    </div>
                    {idx < app.timeline.length - 1 && (
                      <div className={`absolute top-5 left-1/2 w-full h-0.5 ${
                        step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                      }`} style={{ transform: 'translateY(-50%)' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Assigned Underwriter</p>
                <p className="text-sm font-medium text-gray-900">{app.assignedUnderwriter}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">{app.lastUpdated}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationStatus;