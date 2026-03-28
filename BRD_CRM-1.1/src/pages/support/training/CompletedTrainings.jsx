import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, Award, Download, Star, 
  Calendar, Clock, TrendingUp, Filter,
  FileText, Search
} from 'lucide-react';
import { getCompletedTrainings } from '../../../services/trainingService';

const CompletedTrainings = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const data = [
    {
      id: 'TRN-001',
      title: 'CRM Navigation Basics',
      category: 'Onboarding',
      completedDate: '2025-04-15',
      score: 95,
      feedback: 5,
      duration: '45 mins',
      certificate: true,
      trainer: 'John Smith',
      format: 'Video'
    },
    {
      id: 'TRN-005',
      title: 'Loan Documentation Process',
      category: 'Process',
      completedDate: '2025-04-20',
      score: 88,
      feedback: 4,
      duration: '1.5 hrs',
      certificate: true,
      trainer: 'Sarah Johnson',
      format: 'PDF + Quiz'
    },
    {
      id: 'TRN-008',
      title: 'Compliance & Legal Guidelines',
      category: 'Compliance',
      completedDate: '2025-04-25',
      score: 92,
      feedback: 5,
      duration: '2 hrs',
      certificate: true,
      trainer: 'Michael Brown',
      format: 'Video'
    },
    {
      id: 'TRN-012',
      title: 'Advanced Sales Techniques',
      category: 'Soft Skills',
      completedDate: '2025-05-01',
      score: 85,
      feedback: 4,
      duration: '1 hr',
      certificate: true,
      trainer: 'Emily Davis',
      format: 'Live Session'
    }
  ];

  const [completedTrainings, setTrainings] = useState(data)
  
    const fetchTrainings = async () => {
      const res = await getCompletedTrainings()
      const trainings = res.data.map(t => ({
        id: t.training_code || `TRN-${String(t.training_id).padStart(3, '0')}`,
        title: t.training_title,
        description: t.description,
        format: t.training_format,
        duration: t.duration,
        progress: t.progress,
        status: t.completion_status,
        dueDate: t.due_date || t.end_date,
        score: t.score,
        feedback: t.feedback_rating,
        thumbnail: t.thumbnail || '🎥',
        category: t.category || 'General'
      }));
      setTrainings(trainings)
    }
  
    useEffect(() => {
      fetchTrainings()
    }, [])

  const categories = ['all', 'Onboarding', 'Product Knowledge', 'Soft Skills', 'Process', 'Compliance'];
  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' }
  ];

  const filteredTrainings = completedTrainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || training.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalScore = filteredTrainings.reduce((sum, t) => sum + t.score, 0);
  const avgScore = filteredTrainings.length > 0 ? (totalScore / filteredTrainings.length).toFixed(1) : 0;
  const avgFeedback = filteredTrainings.length > 0 
    ? (filteredTrainings.reduce((sum, t) => sum + t.feedback, 0) / filteredTrainings.length).toFixed(1) 
    : 0;

  const downloadCertificate = (training) => {
    alert(`Downloading certificate for: ${training.title}`);
  };

  const exportReport = () => {
    alert('Exporting completion report...');
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-700" />
            </div>
            <span className="text-sm text-gray-500">Total Completed</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{filteredTrainings.length}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Award className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-sm text-gray-500">Avg Score</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">Avg Feedback</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{avgFeedback} ⭐</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search completed trainings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {dateRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Completed Trainings List */}
      <div className="space-y-4">
        {filteredTrainings.map(training => (
          <div key={training.id} className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{training.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {training.format}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {training.duration}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {training.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => downloadCertificate(training)}
                  className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  <Award className="w-5 h-5" />
                  Get Certificate
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Completed On</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(training.completedDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Score</p>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <p className="text-sm font-bold text-indigo-600">{training.score}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Feedback</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < training.feedback 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Trainer</p>
                  <p className="text-sm font-medium text-gray-900">{training.trainer}</p>
                </div>
              </div>

              {/* Achievement Badge */}
              {training.score >= 90 && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    🎉 High Achiever - Scored {training.score}%!
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTrainings.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No completed trainings found</h3>
          <p className="text-gray-500">Complete trainings to see them here with your certificates and scores</p>
        </div>
      )}

      {/* Performance Summary */}
      {filteredTrainings.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">Your Performance Summary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Trainings Completed</p>
              <p className="text-3xl font-bold text-indigo-600">{filteredTrainings.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Average Score</p>
              <p className="text-3xl font-bold text-green-600">{avgScore}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Certificates Earned</p>
              <p className="text-3xl font-bold text-yellow-600">{filteredTrainings.filter(t => t.certificate).length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedTrainings;