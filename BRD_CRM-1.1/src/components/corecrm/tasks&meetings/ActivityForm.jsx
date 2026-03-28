import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import TaskForm from "./TaskForm";
import MeetingForm from "./MeetingForm";

const ActivityForm = ({ onClose, onSubmit, initialData = null }) => {
  const [activityType, setActivityType] = useState(initialData?.type || "task");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {initialData ? "Edit Activity" : "Create New Activity"}
            </h2>
            <p className="text-sm opacity-90 mt-1">
              {initialData
                ? "Update activity details"
                : "Add a new task or meeting"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Activity Type Selector */}
        {!initialData && (
          <div className="px-6 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Activity Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActivityType("task")}
                className={`p-4 rounded-xl border-2 transition ${
                  activityType === "task"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-gray-900">
                    Task
                  </span>
                  {activityType === "task" && (
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <p className="text-xs text-gray-600">
                  Quick actions like calls, emails, reminders
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActivityType("meeting")}
                className={`p-4 rounded-xl border-2 transition ${
                  activityType === "meeting"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-gray-900">
                    Meeting
                  </span>
                  {activityType === "meeting" && (
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <p className="text-xs text-gray-600">
                  Scheduled in-person or virtual meetings
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {activityType === "task" ? (
            <TaskForm
              initialData={initialData}
              onSuccess={() => {
                onSubmit?.({ type: "task" });
                onClose();
              }}
              onClose={onClose}
            />
          ) : (
            <MeetingForm
              initialData={initialData}
              onSuccess={() => {
                onSubmit?.({ type: "meeting" });
                onClose();
              }}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityForm;
