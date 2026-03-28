// constants.js
import {
  Phone, Mail, MessageSquare, MessageCircle, Radio, Share2,
  Database, TrendingUp, Users, Globe, Archive, FolderCheck,
  Inbox, Filter, Target, Zap, Calendar, Briefcase,
  UserCheck, ClipboardList, DollarSign, BarChart3, Award,
  Headphones, Send, BookOpen, Settings,
  TrendingDown
} from 'lucide-react';
 
export const menuItems = [
  {
    title: 'Campaigns',
    path: 'campaigns',
    icon: TrendingUp,
    subtabs: [
      { name: 'Dialer campaign', icon: Phone, path: 'dialer' },
      { name: 'Email campaign', icon: Mail, path: 'email' },
      { name: 'SMS campaign', icon: MessageSquare, path: 'sms' },
      { name: 'Whatsapp campaign', icon: MessageCircle, path: 'whatsapp' },
      { name: 'Voice broadcast', icon: Radio, path: 'voice-broadcast' },
      { name: 'Social media campaign', icon: Share2, path: 'social-media' }
    ]
  },
  {
    title: 'Data & Lead',
    path: 'data-and-leads',
    icon: Database,
    subtabs: [
      { name: 'Bulk data upload', icon: Database, path: 'bulk-data' },
      { name: 'Campaign Leads Tracking', icon: TrendingUp, path: 'campaign-leads' },
      { name: 'Third party vendor leads', icon: Users, path: 'third-party-leads' },
      { name: 'Internal referral leads', icon: UserCheck, path: 'internal-referral-leads' },
      { name: 'Online/Landing page leads', icon: Globe, path: 'online-landing-leads' },
      { name: 'Used leads tracking', icon: FolderCheck, path: 'used-leads-tracking' },
      { name: 'Archived Leads (Compliance)', icon: Archive, path: 'archived-leads' }
    ]
  },
  {
    title: 'Pipeline stages',
    path: 'pipeline-stages',
    icon: Filter,
    subtabs: [
      { name: 'Data (ingestion)', icon: Inbox, path: 'data-ingestion' },
      { name: 'Raw Leads (unfiltered)', icon: Database, path: 'raw-leads' },
      { name: 'Qualified Leads (interest checked)', icon: Filter, path: 'qualified-leads' },
      { name: 'Hot leads (High potential)', icon: Zap, path: 'hot-leads' },
      { name: 'Follow up (Nurturing)', icon: Calendar, path: 'follow-up' },
      { name: 'Meetings (interaction)', icon: Users, path: 'meetings' },
      { name: 'Deals (Conversion/Disbursal)', icon: Briefcase, path: 'deals' },
      { name: 'Lead Status', icon: TrendingDown, path: 'lead-status' }
    ]
  },
  {
    title: 'Core CRM',
    path: 'core-crm',
    icon: UserCheck,
    subtabs: [
      { name: 'Contacts & Accounts', icon: UserCheck, path: 'contacts-accounts' },
      { name: 'Task & meeting modules', icon: ClipboardList, path: 'tasks-meetings' },
      // { name: 'Deals sub-modules', icon: Briefcase, path: 'deals-submodules' }
    ]
  },
  {
    title: 'Finance & Analytics',
    path: 'finance-analytics',
    icon: DollarSign,
    subtabs: [
      { name: 'Repayments & collections', icon: DollarSign, path: 'repayments-collections' },
      { name: 'Forecasts', icon: BarChart3, path: 'forecasts' },
      { name: 'Targets', icon: Target, path: 'targets' }
    ]
  },
  {
    title: 'Support & Operations',
    path: 'support-operations',
    icon: Headphones,
    subtabs: [
      { name: 'Support ticketing & SLA', icon: Headphones, path: 'support-ticketing' },
      { name: 'Internal & External communication', icon: Send, path: 'communication' },
      { name: 'Training & knowledge base', icon: BookOpen, path: 'training' },
      { name: 'Channel configuration (ROI analysis)', icon: Settings, path: 'channel-config' }
    ]
  }
];
 
// Qualified Leads specific constants
export const INTEREST_AREAS = [
  { value: 'home-loan', label: 'Home Loan' },
  { value: 'personal-loan', label: 'Personal Loan' },
  { value: 'car-loan', label: 'Car Loan' },
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'business-loan', label: 'Business Loan' },
  { value: 'education-loan', label: 'Education Loan' },
  { value: 'other', label: 'Other Services' }
];
 
export const ELIGIBILITY_STATUS = [
  { value: 'eligible', label: 'Eligible', color: 'green' },
  { value: 'ineligible', label: 'Ineligible', color: 'red' },
  { value: 'pending-docs', label: 'Documents Pending', color: 'yellow' },
  { value: 'under-review', label: 'Under Review', color: 'blue' }
];
 
export const REQUIRED_DOCUMENTS = [
  { id: 'pan', label: 'PAN Card', required: true },
  { id: 'aadhar', label: 'Aadhar Card', required: true },
  { id: 'salary-slip', label: 'Salary Slips (Last 3 months)', required: true },
  { id: 'bank-statement', label: 'Bank Statement (Last 6 months)', required: true },
  { id: 'employment-proof', label: 'Employment Proof', required: false },
  { id: 'address-proof', label: 'Address Proof', required: false }
];
 
export const NEXT_ACTIONS = [
  { value: 'call', label: 'Schedule Call' },
  { value: 'meeting', label: 'Schedule Meeting' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'document-collection', label: 'Collect Documents' },
  { value: 'eligibility-check', label: 'Run Eligibility Check' }
];
 
export const LEAD_PRIORITY = [
  { value: 'high', label: 'High', color: 'red' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'low', label: 'Low', color: 'gray' }
];