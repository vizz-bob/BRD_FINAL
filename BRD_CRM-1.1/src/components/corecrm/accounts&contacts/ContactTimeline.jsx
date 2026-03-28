// ContactTimeline.jsx
import React, { useState, useEffect } from 'react';
import { 
  Phone, Mail, MessageSquare, Calendar, 
  FileText, UserPlus, Edit, TrendingUp,
  Clock
} from 'lucide-react';
import ActivityItem from './ActivityItem';

const ContactTimeline = ({ contactId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    const mockActivities = [
      {
        id: 'ACT-001',
        type: 'call',
        title: 'Outbound call made',
        description: 'Discussed loan requirements and eligibility criteria',
        timestamp: '2025-01-27T15:30:00',
        user: 'Agent A',
        metadata: {
          duration: '8 mins',
          status: 'Connected'
        }
      },
      {
        id: 'ACT-002',
        type: 'email',
        title: 'Email sent',
        description: 'Sent loan application form and required documents list',
        timestamp: '2025-01-26T10:15:00',
        user: 'Agent A',
        metadata: {
          subject: 'Loan Application - Next Steps',
          status: 'Delivered'
        }
      },
      {
        id: 'ACT-003',
        type: 'meeting',
        title: 'Meeting scheduled',
        description: 'In-person meeting to discuss loan terms',
        timestamp: '2025-01-25T14:00:00',
        user: 'Agent A',
        metadata: {
          location: 'Branch Office',
          duration: '30 mins'
        }
      },
      {
        id: 'ACT-004',
        type: 'whatsapp',
        title: 'WhatsApp message',
        description: 'Shared interest rate calculator link',
        timestamp: '2025-01-24T09:45:00',
        user: 'Agent B',
        metadata: {
          status: 'Read'
        }
      },
      {
        id: 'ACT-005',
        type: 'note',
        title: 'Note added',
        description: 'Customer interested in home loan. Salary: 8L/year. CIBIL: 750',
        timestamp: '2025-01-23T16:20:00',
        user: 'Agent A',
        metadata: {}
      },
      {
        id: 'ACT-006',
        type: 'status',
        title: 'Status updated',
        description: 'Lead status changed from Raw to Qualified',
        timestamp: '2025-01-23T11:00:00',
        user: 'System',
        metadata: {
          from: 'Raw Lead',
          to: 'Qualified Lead'
        }
      },
      {
        id: 'ACT-007',
        type: 'created',
        title: 'Contact created',
        description: 'Contact added to CRM from website inquiry',
        timestamp: '2025-01-22T08:30:00',
        user: 'System',
        metadata: {
          source: 'Website Form'
        }
      }
    ];

    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 500);
  }, [contactId]);

  const getActivityIcon = (type) => {
    const icons = {
      call: Phone,
      email: Mail,
      whatsapp: MessageSquare,
      meeting: Calendar,
      note: FileText,
      status: TrendingUp,
      created: UserPlus,
      edit: Edit
    };
    return icons[type] || FileText;
  };

  const getActivityColor = (type) => {
    const colors = {
      call: 'bg-green-100 text-green-600',
      email: 'bg-blue-100 text-blue-600',
      whatsapp: 'bg-green-100 text-green-600',
      meeting: 'bg-purple-100 text-purple-600',
      note: 'bg-yellow-100 text-yellow-600',
      status: 'bg-indigo-100 text-indigo-600',
      created: 'bg-gray-100 text-gray-600',
      edit: 'bg-orange-100 text-orange-600'
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">Loading timeline...</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Clock className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500">No activity recorded yet</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Activities */}
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              icon={getActivityIcon(activity.type)}
              color={getActivityColor(activity.type)}
              isLast={index === activities.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactTimeline;