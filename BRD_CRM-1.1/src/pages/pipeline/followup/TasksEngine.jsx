import React, { useEffect, useState } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
  Clock,
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Filter
} from 'lucide-react';
import { followUpService } from '../../../services/pipelineService';

const TasksEngine = ({tasksData}) => {
  const [activeTask, setActiveTask] = useState(null);
  const [formData, setFormData] = useState({
    call_summary: "",
    disposition: "Interested",
    status: "Done",
    reschedule_date: "",
    repeat_reminder: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  

  const handleCompleteTask = async () => {
    if (!activeTask) return;

    try {
      await followUpService.patch({
        ...formData,
        disposition: formData.disposition.toLowerCase().replace(/ /g, "_"),
        is_completed: true,
        is_archived: true
      }, activeTask.id);
      fetchTasks()
      setActiveTask(null);

      setFormData({
        call_summary: "",
        disposition: "Interested",
        status: "Done",
        reschedule_date: "",
        repeat_reminder: false
      });

    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };

  const getPriorityStyle = (p) => {
    if (p === 'High') return 'bg-red-50 text-red-700 border-red-100';
    if (p === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-indigo-50 text-indigo-700 border-indigo-100';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Call': return <Phone size={14} className="text-indigo-600" />;
      case 'WhatsApp': return <MessageSquare size={14} className="text-green-600" />;
      case 'Email': return <Mail size={14} className="text-purple-600" />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:h-[600px] overflow-hidden rounded-2xl bg-white">
      {/* Task List Section */}
      <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-100 overflow-y-auto bg-white max-h-[400px] lg:max-h-full">
        <div className="p-4 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white z-10">
          <h4 className="text-sm font-bold text-gray-900">Nurturing Queue</h4>
          <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"><Filter size={18} /></button>
        </div>

        <div className="divide-y divide-gray-50">
          {tasksData.map((task) => (
            <div
              key={task.id}
              onClick={() => setActiveTask(task)}
              className={`p-4 cursor-pointer transition-all hover:bg-indigo-50/30 ${activeTask?.id === task.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-bold text-gray-900">{task.lead}</p>
                  <p className="text-[10px] text-gray-400 font-medium">Task ID: {task.id}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${getPriorityStyle(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                    {getTypeIcon(task.type)} {task.type}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                  <Clock size={12} /> {task.due}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action/Engagement Section */}
      <div className="flex-1 bg-gray-50/50 p-4 sm:p-6 overflow-y-auto">
        {activeTask ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg font-bold text-gray-900">Engagement Panel</h3>
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none p-2 bg-white border border-gray-200 rounded-lg text-green-600 hover:shadow-md flex justify-center"><MessageSquare size={18} /></button>
                <button className="flex-1 sm:flex-none p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 shadow-md flex justify-center"><Phone size={18} /></button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
                <AlertCircle size={16} />
                <p className="text-xs font-bold">Status: {activeTask.status}</p>
              </div>
              <p className="text-xs text-gray-500 italic">Last Activity: {activeTask.lastInteraction}</p>
            </div>

            {/* Outcome Form */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <label htmlFor="call-summary" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Call Summary & Outcome</label>
              <textarea
                id="call-summary"
                name="call_summary"
                value={formData.call_summary}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                placeholder="What happened during the conversation?"
              ></textarea>
              <input type="hidden" id="task-status" value={formData.status} name='status' />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="disposition-select" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Disposition</label>
                  <select 
                    id="disposition-select"
                    name='disposition' 
                    value={formData.disposition}
                    onChange={handleChange} 
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>Interested</option>
                    <option>Call Back Later</option>
                    <option>Not Reachable</option>
                    <option>Converted to Meeting</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="reschedule-date" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reschedule Date</label>
                  <input 
                    id="reschedule-date"
                    name="reschedule_date" 
                    value={formData.reschedule_date}
                    onChange={handleChange} 
                    type="date" 
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl">
                <label htmlFor="repeat-reminder" className="flex items-center gap-2 cursor-pointer">
                  <Calendar size={16} className="text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-900">Repeat Reminder?</span>
                </label>
                <input 
                  id="repeat-reminder"
                  name="repeat_reminder" 
                  checked={formData.repeat_reminder}
                  onChange={handleChange} 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 cursor-pointer" 
                />
              </div>

              <button onClick={handleCompleteTask} className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg">
                <CheckCircle2 size={18} />
                Complete Task & Archive
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
            <Clock size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">Select a lead from the queue to begin nurturing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksEngine;