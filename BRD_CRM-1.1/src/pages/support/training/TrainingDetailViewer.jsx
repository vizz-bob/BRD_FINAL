import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, Pause, ChevronLeft, ChevronRight,
  FileText, BookOpen, CheckCircle, Clock,
  Award, MessageSquare, X, Maximize, Minimize
} from 'lucide-react';

const TrainingDetailViewer = ({ training, onClose, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(training?.progress || 0);
  const [currentPage, setCurrentPage] = useState(1);
  const [notes, setNotes] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQuizPrompt, setShowQuizPrompt] = useState(false);

  const totalPages = 10; // Mock total pages for PDF
  const videoDuration = 2700; // 45 minutes in seconds

  useEffect(() => {
    let interval;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + 1, 100);
          if (newProgress === 100) {
            setIsPlaying(false);
            setShowQuizPrompt(true);
          }
          return newProgress;
        });
      }, 1000); // Update every second
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      const newProgress = Math.min((currentPage / totalPages) * 100, 100);
      setProgress(newProgress);
      if (newProgress === 100) setShowQuizPrompt(true);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleMarkComplete = () => {
    if (training.quizRequired) {
      setShowQuizPrompt(true);
    } else {
      alert('Training marked as complete!');
      onComplete?.();
    }
  };

  const handleStartQuiz = () => {
    alert('Starting quiz assessment...');
    // Navigate to quiz component
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!training) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl ${isFullscreen ? 'w-full h-full' : 'max-w-6xl w-full max-h-[90vh]'} flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">{training.title}</h2>
              <p className="text-sm text-gray-500">{training.category} • {training.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Media/Content Viewer */}
          <div className="flex-1 flex flex-col bg-gray-900 relative">
            {/* Video Player Mock */}
            {training.format === 'Video' && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                    {isPlaying ? (
                      <Pause className="w-16 h-16" />
                    ) : (
                      <PlayCircle className="w-16 h-16" />
                    )}
                  </div>
                  <p className="text-lg mb-2">Video Training</p>
                  <p className="text-sm text-gray-400">{formatTime(Math.floor(videoDuration * (progress / 100)))} / {formatTime(videoDuration)}</p>
                </div>
              </div>
            )}

            {/* PDF Viewer Mock */}
            {(training.format === 'PDF' || training.format === 'PPT') && (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl aspect-[8.5/11] flex items-center justify-center">
                  <div className="text-center p-8">
                    <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-medium text-gray-900 mb-2">
                      Page {currentPage} of {totalPages}
                    </p>
                    <p className="text-gray-500">
                      {training.format} Document Content
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Video Controls */}
            {training.format === 'Video' && (
              <div className="p-4 bg-gray-800">
                <div className="mb-3">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handlePlayPause}
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <PlayCircle className="w-6 h-6 text-white" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* PDF Navigation */}
            {(training.format === 'PDF' || training.format === 'PPT') && (
              <div className="p-4 bg-gray-800 flex items-center justify-between">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 1}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <span className="text-white font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange('next')}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Notes & Progress */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
            {/* Progress Section */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-bold text-indigo-600">{Math.floor(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {progress === 100 && (
                <div className="mt-3 flex items-center gap-2 text-green-700 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Training completed!</span>
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <h3 className="font-medium text-gray-900">Your Notes</h3>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes as you learn..."
                className="w-full h-48 px-3 py-2 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <button className="w-full mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
                Save Notes
              </button>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200 bg-white space-y-2">
              {progress === 100 && training.quizRequired && (
                <button
                  onClick={handleStartQuiz}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-medium"
                >
                  <Award className="w-5 h-5" />
                  Take Assessment
                </button>
              )}
              {progress === 100 && !training.quizRequired && (
                <button
                  onClick={handleMarkComplete}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark as Complete
                </button>
              )}
              {progress < 100 && (
                <div className="text-center text-sm text-gray-500">
                  Complete the training to proceed
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Prompt Modal */}
        {showQuizPrompt && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready for Assessment?</h3>
                <p className="text-gray-600">
                  You've completed the training material. Time to test your knowledge!
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQuizPrompt(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Review Again
                </button>
                <button
                  onClick={handleStartQuiz}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingDetailViewer;