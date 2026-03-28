import React from 'react';
import { Phone, Mail, Users, CheckCircle2 } from 'lucide-react';

const LeadJourneyTimeline = ({ events = [] }) => {
  const icons = {
    call: <Phone className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
    meeting: <Users className="w-4 h-4" />,
    success: <CheckCircle2 className="w-4 h-4" />,
  };

  return (
    <div className="space-y-4">
      {events.map((ev, idx) => (
        <div key={idx} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-blue-600">
              {icons[ev.type]}
            </div>
            {idx !== events.length - 1 && <div className="w-px h-8 bg-gray-200 mt-2" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{ev.title}</p>
                <p className="text-xs text-gray-500">{ev.date} • {ev.agent}</p>
              </div>
              <div className="text-xs text-gray-500">{ev.type}</div>
            </div>
            <p className="mt-1 text-sm text-gray-700">{ev.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadJourneyTimeline;
