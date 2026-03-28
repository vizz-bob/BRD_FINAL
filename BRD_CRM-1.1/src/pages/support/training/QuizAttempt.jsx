import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, Award, Clock, 
  AlertCircle, TrendingUp, RefreshCw, ChevronRight
} from 'lucide-react';

const QuizAttempt = ({ training, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const quizQuestions = [
    {
      id: 1,
      question: "What is the first step in the CRM lead qualification process?",
      options: [
        "Schedule a meeting",
        "Verify contact information",
        "Send product brochure",
        "Request documents"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Which document is mandatory for KYC verification?",
      options: [
        "Driving License only",
        "PAN and Aadhar Card",
        "Passport only",
        "Voter ID only"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "What is the maximum time allowed for following up on a hot lead?",
      options: [
        "Within 1 hour",
        "Within 24 hours",
        "Within 48 hours",
        "Within 1 week"
      ],
      correctAnswer: 1
    },
    {
      id: 4,
      question: "When should a lead be marked as 'Dead'?",
      options: [
        "After 1 failed call",
        "After customer explicitly declines",
        "After 2 days of no response",
        "After first meeting"
      ],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "What is the passing score for this training module?",
      options: [
        "50%",
        "60%",
        "70%",
        "80%"
      ],
      correctAnswer: 2
    }
  ];

  const totalQuestions = quizQuestions.length;
  const passingScore = training?.passingScore || 70;

  useEffect(() => {
    if (!isSubmitted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSubmitted, timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowResults(true);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setTimeRemaining(1800);
    setIsSubmitted(false);
    setShowResults(false);
  };

  const score = calculateScore();
  const passed = score >= passingScore;

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
          <div className="text-center">
            {/* Result Icon */}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {passed ? (
                <CheckCircle className="w-16 h-16 text-green-600" />
              ) : (
                <XCircle className="w-16 h-16 text-red-600" />
              )}
            </div>

            {/* Result Message */}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {passed ? '🎉 Congratulations!' : '😔 Not Quite There'}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {passed 
                ? 'You have successfully passed the assessment!' 
                : `You need ${passingScore}% to pass. Keep learning!`}
            </p>

            {/* Score Display */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Your Score</p>
                  <p className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                    {score}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Correct Answers</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {Object.keys(selectedAnswers).filter(qId => 
                      selectedAnswers[qId] === quizQuestions.find(q => q.id === parseInt(qId))?.correctAnswer
                    ).length}/{totalQuestions}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Passing Score</p>
                  <p className="text-3xl font-bold text-gray-900">{passingScore}%</p>
                </div>
              </div>
            </div>

            {/* Review Answers */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6 max-h-64 overflow-y-auto text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Answer Review</h3>
              <div className="space-y-3">
                {quizQuestions.map((q, idx) => {
                  const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                  return (
                    <div key={q.id} className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Q{idx + 1}: {q.question}
                        </p>
                        {!isCorrect && (
                          <p className="text-xs text-gray-600">
                            <span className="text-red-600">Your answer: {q.options[selectedAnswers[q.id]]}</span>
                            <br />
                            <span className="text-green-600">Correct answer: {q.options[q.correctAnswer]}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!passed && (
                <button
                  onClick={handleRetry}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                >
                  <RefreshCw className="w-5 h-5" />
                  Retry Quiz
                </button>
              )}
              {passed && (
                <button
                  onClick={() => {
                    onComplete?.({ score, passed });
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  <Award className="w-5 h-5" />
                  Claim Certificate
                </button>
              )}
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const allAnswered = Object.keys(selectedAnswers).length === totalQuestions;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{training?.title} - Assessment</h2>
              <p className="text-sm text-gray-500">Passing Score: {passingScore}%</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-xl">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className={`font-mono font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-yellow-600'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentQ.question}
            </h3>
            
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                return (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      checked={isSelected}
                      onChange={() => handleAnswerSelect(currentQ.id, idx)}
                      className="w-5 h-5 text-indigo-600"
                    />
                    <span className="text-gray-900">{option}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Question Navigation Dots */}
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl">
            {quizQuestions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  idx === currentQuestion
                    ? 'bg-indigo-600 text-white'
                    : selectedAnswers[quizQuestions[idx].id] !== undefined
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {Object.keys(selectedAnswers).length} of {totalQuestions} answered
              </p>
            </div>

            {!isLastQuestion ? (
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(totalQuestions - 1, prev + 1))}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                Submit Quiz
              </button>
            )}
          </div>

          {!allAnswered && isLastQuestion && (
            <div className="mt-3 flex items-center gap-2 text-yellow-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Please answer all questions before submitting</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;