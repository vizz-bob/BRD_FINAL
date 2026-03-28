import React, { useEffect, useState } from 'react';
import {
  PlayCircle, FileText, Award, Clock,
  CheckCircle, Search, Filter, ChevronRight,
  Star, TrendingUp
} from 'lucide-react';
import { gettrainings } from '../../../services/trainingService';

const MyTrainings = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const data = [
    {
      id: 'TRN-001',
      title: 'CRM Navigation Basics',
      description: 'Learn how to navigate through the CRM system efficiently',
      format: 'Video',
      duration: '45 mins',
      progress: 100,
      status: 'Completed',
      dueDate: '2025-05-10',
      score: 95,
      feedback: 5,
      thumbnail: '🎥',
      category: 'Onboarding'
    },
    {
      id: 'TRN-002',
      title: 'Loan Product Master',
      description: 'Complete guide to all loan products and their features',
      format: 'PDF + Quiz',
      duration: '2 hrs',
      progress: 76,
      status: 'In Progress',
      dueDate: '2025-05-18',
      score: null,
      feedback: null,
      thumbnail: '📄',
      category: 'Product Knowledge'
    },
    {
      id: 'TRN-003',
      title: 'Customer Communication Excellence',
      description: 'Master the art of professional customer communication',
      format: 'Video',
      duration: '1.5 hrs',
      progress: 0,
      status: 'Not Started',
      dueDate: '2025-05-20',
      score: null,
      feedback: null,
      thumbnail: '🎥',
      category: 'Soft Skills'
    },
    {
      id: 'TRN-004',
      title: 'Escalation SOP',
      description: 'Standard Operating Procedures for handling escalations',
      format: 'PPT',
      duration: '30 mins',
      progress: 45,
      status: 'In Progress',
      dueDate: '2025-05-15',
      score: null,
      feedback: null,
      thumbnail: '📊',
      category: 'Process'
    }
  ];

  const [trainings, setTrainings] = useState(data)

  const fetchTrainings = async () => {
    const res = await gettrainings()
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

  const getStatusBadge = (status) => {
    const styles = {
      'Completed': 'bg-green-100 text-green-700',
      'In Progress': 'bg-yellow-100 text-yellow-700',
      'Not Started': 'bg-gray-100 text-gray-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getFormatIcon = (format) => {
    if (format.includes('Video')) return PlayCircle;
    if (format.includes('PDF') || format.includes('PPT')) return FileText;
    return FileText;
  };

  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || training.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search trainings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Trainings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTrainings.map((training) => {
          const FormatIcon = getFormatIcon(training.format);

          return (
            <div
              key={training.id}
              className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{training.thumbnail}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{training.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{training.category}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(training.status)}`}>
                    {training.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{training.description}</p>

                {/* Progress Bar */}
                {training.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">Progress</span>
                      <span className="text-xs font-medium text-indigo-600">{training.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${training.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <FormatIcon className="w-4 h-4 mr-1" />
                    {training.format}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {training.duration}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-1">📅</span>
                    Due: {new Date(training.dueDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Score and Feedback (if completed) */}
                {training.status === 'Completed' && (
                  <div className="flex items-center gap-4 mb-4 p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center text-sm">
                      <Award className="w-4 h-4 text-green-700 mr-1" />
                      <span className="font-medium text-green-700">Score: {training.score}%</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                      <span className="font-medium text-gray-700">{training.feedback}/5</span>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                  {training.status === 'Completed' ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      View Certificate
                    </>
                  ) : training.status === 'In Progress' ? (
                    <>
                      <PlayCircle className="w-5 h-5" />
                      Continue Learning
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-5 h-5" />
                      Start Training
                    </>
                  )}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTrainings.length === 0 && (
        <div className="text-center py-12">
          {/* <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" /> */}
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trainings found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default MyTrainings;