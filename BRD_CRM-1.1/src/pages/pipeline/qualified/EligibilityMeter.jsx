// EligibilityMeter.jsx
import React from 'react';
import {
  CheckCircle2, XCircle, AlertCircle, Clock,
  TrendingUp, FileCheck, DollarSign, Home
} from 'lucide-react';
import { ELIGIBILITY_STATUS } from '../../../utils/constants';

const EligibilityMeter = ({ lead, isEditing, onChange }) => {
  const eligibilityFactors = [
    {
      id: 'documents',
      label: 'Documents Submitted',
      score: lead.eligibility?.document_score || (lead.documentsCollected.length / 4) * 100,
      status: lead.documentsCollected.length >= 4 ? 'complete' : 'pending',
      icon: FileCheck,
      description: `${lead.documentsCollected.length} of 4 required documents`
    },
    {
      id: 'income',
      label: 'Income Verification',
      score: lead.eligibility?.income_score || 0,
      status: lead.eligibility?.income_score >= 80 ? 'complete' : 'review',
      icon: DollarSign,
      description: 'Salary slips verified'
    },
    {
      id: 'credit',
      label: 'Credit Score',
      score: lead.eligibility?.credit_score || 0,
      status: lead.eligibility?.credit_score >= 75 ? 'complete' : 'review',
      icon: TrendingUp,
      description: `Score: ${lead.eligibility?.credit_score || 'N/A'}`
    },
    {
      id: 'property',
      label: 'Property Details',
      score: lead.interestArea === 'home-loan' ? (lead.eligibility?.property_score || 0) : 100,
      status: lead.interestArea === 'home-loan' ? (lead.eligibility?.property_score >= 80 ? 'complete' : 'pending') : 'na',
      icon: Home,
      description: lead.interestArea === 'home-loan' ? 'Property verified' : 'Not applicable'
    }
  ];

  const overallScore = Math.round(
    eligibilityFactors.reduce((sum, factor) => sum + factor.score, 0) / eligibilityFactors.length
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'review':
        return <Clock className="w-5 h-5 text-indigo-600" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Overall Eligibility</h4>
          <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}%
          </span>
        </div>

        <div className="w-full bg-white rounded-full h-4 mb-3">
          <div
            className={`h-4 rounded-full transition-all ${getProgressColor(overallScore)}`}
            style={{ width: `${overallScore}%` }}
          />
        </div>

        <p className="text-sm text-gray-600">
          {overallScore >= 80 && '✓ Lead is eligible for loan processing'}
          {overallScore >= 60 && overallScore < 80 && '⚠ Additional verification required'}
          {overallScore < 60 && '✗ Lead may not meet eligibility criteria'}
        </p>
      </div>

      {/* Status Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Eligibility Status
        </label>
        <div className="grid grid-cols-2 gap-3">
          {ELIGIBILITY_STATUS.map(status => {
            const isSelected = lead.eligibilityStatus === status.value;
            const colorClasses = {
              green: 'border-green-300 bg-green-50 text-green-700',
              red: 'border-red-300 bg-red-50 text-red-600',
              yellow: 'border-yellow-300 bg-yellow-50 text-yellow-700',
              indigo: 'border-indigo-300 bg-indigo-50 text-indigo-600'
            };

            return (
              <button
                key={status.value}
                onClick={() => isEditing && onChange(status.value)}
                disabled={!isEditing}
                className={`p-3 rounded-xl border-2 transition ${isSelected
                  ? colorClasses[status.color]
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  } ${!isEditing ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
              >
                <div className="font-medium text-sm">{status.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Eligibility Factors */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Eligibility Breakdown</h4>
        <div className="space-y-4">
          {eligibilityFactors.map(factor => {
            const Icon = factor.icon;
            return (
              <div key={factor.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{factor.label}</h5>
                      <p className="text-xs text-gray-500 mt-1">{factor.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${getScoreColor(factor.score)}`}>
                      {factor.score}%
                    </span>
                    {getStatusIcon(factor.status)}
                  </div>
                </div>

                <div className="w-full bg-white rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getProgressColor(factor.score)}`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <h5 className="font-medium text-indigo-900 mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Recommendation
        </h5>
        <p className="text-sm text-indigo-700">
          {overallScore >= 80 && 'This lead is highly qualified. Proceed to Hot Leads stage and schedule a meeting.'}
          {overallScore >= 60 && overallScore < 80 && 'Request additional documents or verification. Follow up within 48 hours.'}
          {overallScore < 60 && 'Lead may not meet minimum criteria. Consider alternative products or mark as ineligible.'}
        </p>
      </div>
    </div>
  );
};

export default EligibilityMeter;