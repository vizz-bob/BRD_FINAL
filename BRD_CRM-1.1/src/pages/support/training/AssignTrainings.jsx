import React, { useState } from 'react';
import {
  Plus, Upload, X, Users, Calendar,
  AlertCircle, CheckCircle, FileText, Video,
  Save, Send
} from 'lucide-react';
import { createtrainings } from '../../../services/trainingService';

const AssignTrainings = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    format: 'Video',
    duration: '',
    category: '',
    assignTo: [],
    startDate: '',
    endDate: '',
    quizRequired: false,
    autoAssignNewUsers: false,
    passingScore: 70
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const fileInputRef = React.createRef();

  const formatOptions = ['Video', 'PDF', 'PPT', 'Document', 'Live Session'];
  const categoryOptions = ['Onboarding', 'Product Knowledge', 'Soft Skills', 'Process', 'Compliance', 'Technical'];
  const assignOptions = [
    { id: 'all-users', label: 'All Users' },
    { id: 'sales-team', label: 'Sales Team' },
    { id: 'support-team', label: 'Support Team' },
    { id: 'telecaller-team', label: 'Telecaller Team' },
    { id: 'new-users', label: 'New Users Only' }
  ];

  const existingTrainings = [
    {
      id: 'TRN-001',
      title: 'CRM Navigation Basics',
      format: 'Video',
      assignedTo: 'All Users',
      completionRate: 100,
      deadline: '2025-05-10'
    },
    {
      id: 'TRN-002',
      title: 'Loan Product Master',
      format: 'PDF + Quiz',
      assignedTo: 'Sales Team',
      completionRate: 76,
      deadline: '2025-05-18'
    },
    {
      id: 'TRN-003',
      title: 'Customer Communication',
      format: 'Video',
      assignedTo: 'All Users',
      completionRate: 45,
      deadline: '2025-05-20'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAssignToChange = (optionId) => {
    setFormData(prev => ({
      ...prev,
      assignTo: prev.assignTo.includes(optionId)
        ? prev.assignTo.filter(id => id !== optionId)
        : [...prev.assignTo, optionId]
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type
      });
    }
  };

  const addQuizQuestion = () => {
    setQuizQuestions([...quizQuestions, {
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }]);
  };

  const removeQuizQuestion = (id) => {
    setQuizQuestions(quizQuestions.filter(q => q.id !== id));
  };

  const handleSubmit = async () => {
    const formDataObj = new FormData();

    formDataObj.append("training_title", formData.title);
    formDataObj.append("description", formData.description);
    formDataObj.append("training_format", formData.format);
    formDataObj.append("trainer_name", "Admin"); // temporary
    formDataObj.append("duration", "00:45:00");
    formDataObj.append("start_date", formData.startDate);
    formDataObj.append("end_date", formData.endDate);
    formDataObj.append("assessment_required", formData.quizRequired);

    if (fileInputRef.current.files[0]) {
      formDataObj.append(
        "training_material",
        fileInputRef.current.files[0]
      );
    }
    try{
      const res = await createtrainings(formDataObj);
      alert("Training created:", res);
    } catch (error) {
      alert("Error creating training:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create New Training */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <Plus className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Create New Training</h2>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Training Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Advanced Sales Techniques"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Brief overview of what this training covers..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format *
              </label>
              <select
                name="format"
                value={formData.format}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {formatOptions.map(format => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Category</option>
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 45 mins"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passing Score (%)
              </label>
              <input
                type="number"
                name="passingScore"
                value={formData.passingScore}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Training Material *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileUpload}
                className="hidden"
                ref={fileInputRef}
                accept=".pdf,.ppt,.pptx,.mp4,.mov,.avi"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, PPT, Video files (Max 100MB)
                </p>
              </label>
              {uploadedFile && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-700 bg-green-50 py-2 px-4 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span>{uploadedFile.name} ({uploadedFile.size})</span>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Assignment Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Assign To *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {assignOptions.map(option => (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.assignTo.includes(option.id)
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.assignTo.includes(option.id)}
                    onChange={() => handleAssignToChange(option.id)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="quizRequired"
                checked={formData.quizRequired}
                onChange={handleInputChange}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Assessment/Quiz Required
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="autoAssignNewUsers"
                checked={formData.autoAssignNewUsers}
                onChange={handleInputChange}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Auto-assign to new users
              </span>
            </label>
          </div>

          {/* Quiz Builder */}
          {formData.quizRequired && (
            <div className="border-2 border-indigo-200 rounded-xl p-6 bg-indigo-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Quiz Questions</h3>
                <button
                  onClick={addQuizQuestion}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>
              {quizQuestions.map((q, idx) => (
                <div key={q.id} className="bg-white rounded-xl p-4 mb-3">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Question {idx + 1}</span>
                    <button
                      onClick={() => removeQuizQuestion(q.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter question..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg mb-3 text-sm"
                  />
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input type="radio" name={`correct-${q.id}`} className="w-4 h-4" />
                        <input
                          type="text"
                          placeholder={`Option ${optIdx + 1}`}
                          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
            >
              <Save className="w-5 h-5" />
              Create & Assign Training
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              <Send className="w-5 h-5" />
              Save as Draft
            </button>
          </div>
        </div>
      </div>

      {/* Existing Trainings List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Existing Trainings</h2>
        <div className="space-y-3">
          {existingTrainings.map(training => (
            <div key={training.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors gap-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{training.title}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-1">
                  <span className="text-xs text-gray-500">{training.format}</span>
                  <span className="text-xs text-gray-500">Assigned to: {training.assignedTo}</span>
                  <span className="text-xs text-gray-500">Due: {training.deadline}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{training.completionRate}%</div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <button className="px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignTrainings;