import React, { useEffect, useState } from 'react';
import { 
  FireIcon, 
  SparklesIcon, 
  BoltIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { workspaceApi } from '../services/workspaceService';

export default function PersonaFocusWidget() {
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const res = await workspaceApi.getWorkspaceContext();
        setContext(res.data);
      } catch (err) {
        console.error("Workspace Context Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContext();
  }, []);

  if (loading || !context || context.mode === 'standard') return null;

  // Dynamic Styles based on Mode
  const isUrgent = context.urgencyLevel === 'high';
  const containerStyle = isUrgent 
    ? "bg-red-50 border-red-200 text-red-900" 
    : "bg-indigo-50 border-indigo-200 text-indigo-900";
  
  const Icon = isUrgent ? FireIcon : SparklesIcon;

  return (
    <div className={`rounded-xl border p-4 mb-6 shadow-sm animate-fade-in ${containerStyle}`}>
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className={`p-2 rounded-lg ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              {context.label}
              {isUrgent && <span className="text-[10px] uppercase bg-red-600 text-white px-2 py-0.5 rounded-full tracking-wider">Priority</span>}
            </h3>
            <p className="text-sm opacity-80 mt-1">{context.reason}</p>
          </div>
        </div>
        <button className={`text-sm font-bold underline ${isUrgent ? 'text-red-700' : 'text-indigo-700'}`}>
          Switch to Standard View
        </button>
      </div>

      {/* Suggested Actions (The "Next Best Action" Logic) */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {context.suggestedActions?.map((action, idx) => (
          <div key={idx} className="bg-white/60 p-3 rounded-lg flex items-center justify-between hover:bg-white transition cursor-pointer border border-transparent hover:border-gray-200">
             <div className="flex items-center gap-2">
                <BoltIcon className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-sm">{action.title}</span>
             </div>
             <CheckCircleIcon className="w-5 h-5 opacity-40 hover:opacity-100 hover:text-green-600 transition" />
          </div>
        ))}
      </div>
    </div>
  );
}