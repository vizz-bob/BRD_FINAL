// TasksSection.jsx
import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Calendar, User, Trash2, Edit } from 'lucide-react';

const TasksSection = ({ entityId, entityType }) => {
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    assignedTo: ''
  });

  useEffect(() => {
    // Mock data - replace with API call
    const mockTasks = [
      {
        id: 'TASK-001',
        title: 'Follow up on loan application',
        description: 'Call customer to check if all documents are ready',
        status: 'Pending',
        priority: 'High',
        dueDate: '2025-01-30',
        assignedTo: 'Agent A',
        createdBy: 'Manager',
        createdAt: '2025-01-27T09:00:00',
        completedAt: null
      },
      {
        id: 'TASK-002',
        title: 'Send email with loan options',
        description: 'Share personalized loan options based on eligibility',
        status: 'Completed',
        priority: 'Medium',
        dueDate: '2025-01-28',
        assignedTo: 'Agent A',
        createdBy: 'Agent A',
        createdAt: '2025-01-26T14:00:00',
        completedAt: '2025-01-27T10:30:00'
      },
      {
        id: 'TASK-003',
        title: 'Schedule property visit',
        description: 'Coordinate with customer for property inspection',
        status: 'Pending',
        priority: 'Low',
        dueDate: '2025-02-05',
        assignedTo: 'Agent B',
        createdBy: 'Agent A',
        createdAt: '2025-01-25T11:00:00',
        completedAt: null
      }
    ];
    setTasks(mockTasks);
  }, [entityId]);

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task = {
      id: `TASK-${String(tasks.length + 1).padStart(3, '0')}`,
      ...newTask,
      status: 'Pending',
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    setTasks([task, ...tasks]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      assignedTo: ''
    });
    setShowAddForm(false);
  };

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: task.status === 'Completed' ? 'Pending' : 'Completed',
          completedAt: task.status === 'Completed' ? null : new Date().toISOString()
        };
      }
      return task;
    }));
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'bg-red-100 text-red-700',
      Medium: 'bg-yellow-100 text-yellow-700',
      Low: 'bg-green-100 text-green-700'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'Completed') return false;
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const pendingTasks = tasks.filter(t => t.status === 'Pending');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  return (
    <div className="p-6">
      {/* Add Task Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition mb-4"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      )}

      {/* Add Task Form */}
      {showAddForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="space-y-3">
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Task title"
              className="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Description (optional)"
              rows="2"
              className="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddTask}
              disabled={!newTask.title.trim()}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Add Task
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewTask({
                  title: '',
                  description: '',
                  dueDate: '',
                  priority: 'Medium',
                  assignedTo: ''
                });
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Pending ({pendingTasks.length})
          </h4>
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    <Circle className="w-5 h-5 text-gray-400 hover:text-indigo-600 transition" />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 mb-1">{task.title}</h5>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2">
                      {task.dueDate && (
                        <span className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1 ${
                          isOverdue(task.dueDate, task.status)
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          <Calendar className="w-3 h-3" />
                          {formatDate(task.dueDate)}
                          {isOverdue(task.dueDate, task.status) && ' (Overdue)'}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-lg ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.assignedTo && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {task.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 hover:bg-red-100 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Completed ({completedTasks.length})
          </h4>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </button>
                  
                  <div className="flex-1 min-w-0 opacity-75">
                    <h5 className="font-medium text-gray-900 mb-1 line-through">{task.title}</h5>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-500">
                        Completed {formatDate(task.completedAt)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 hover:bg-red-100 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500">No tasks yet</p>
          <p className="text-sm text-gray-400 mt-1">Create your first task to get started</p>
        </div>
      )}
    </div>
  );
};

export default TasksSection;