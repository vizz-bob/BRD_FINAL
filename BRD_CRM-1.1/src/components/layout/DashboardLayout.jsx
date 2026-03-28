import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import EmailCampaignDashboard from '../../pages/campaigns/email/EmailCampaignDashboard';
import SMSCampaignDashboard from '../../pages/campaigns/sms/SMSCampaignDashboard';
import WhatsAppCampaignDashboard from '../../pages/campaigns/whatsapp/WhatsAppCampaignDashboard';
import VoiceCampaignDashboard from '../../pages/campaigns/voice/VoiceCampaignDashboard';
import SocialMediaCampaignDashboard from '../../pages/campaigns/social/SocialMediaCampaignDashboard';
// import BulkUploadDashboard from '../../pages/data&lead/bulkdataupload/BulkUploadDashboard';
// import MappingPage from '../../pages/data&lead/bulkdataupload/MappingGrid';
import DialerCampaignDashboard from '../../pages/campaigns/dialer/DialerCampaignDashboard';
import DashboardPage from '../../pages/dashboard/Dashboard';

import ThirdPartyLeadsDashboard from '../../pages/data&lead/thirdpartylead/ThirdPartyLeadsDashboard';
import UsedLeadsTrackingDashboard from '../../pages/data&lead/usedleadstracking/UsedLeadsTrackingDashboard';
import CompaignLeads from '../../pages/data&lead/campaignleads/CompaignLeads';
import OnlineLeadsDashboard from '../../pages/data&lead/onlinelandingleads/OnlineLeadsDashboard';
import ArchivedLeadsDashboard from '../../pages/data&lead/archivedleads/ArchivedLeadsDashboard';

import RawLeadsDashboard from '../../pages/pipeline/raw-leads/RawLeadsDashboard';
import DataIngestionDashboard from '../../pages/pipeline/dataingestion/DataIngestionDashboard';
import QualifiedLeadsDashboard from '../../pages/pipeline/qualified/QualifiedLeadsDashboard';
import DealsDashboard from '../../pages/pipeline/deals/DealsDashboard';
import MeetingsDashboard from '../../pages/pipeline/meetings/MeetingsDashboard';
import FollowUpDashboard from '../../pages/pipeline/followup/FollowUpDashboard';
import HotLeadsDashboard from '../../pages/pipeline/hot-leads/HotLeadsDashboard';

import TasksMeetingsDashboard from '../../pages/corecrm/task&meetings/TasksMeetingsDashboard';
// import MovedLeads from '../../pages/corecrm/dealsubmodule/MovedLeads';

import RepaymentsDashboard from '../../pages/finance/repayments-collections/RepaymentsDashboard';

import SupportTicketingDashboard from '../../pages/support/support&ticketing/SupportTicketingDashboard';
import CommunicationDashboard from '../../pages/support/communication/CommunicationDashboard';
import TrainingDashboard from '../../pages/support/training/TrainingDashboard';
import TargetsForecastDashboard from '../../pages/finance/targets/TargetsDashboard';
// import ForecastsModule from '../../pages/finance/forecasts/ForecastModule';
import ChannelConfigDashboard from '../../pages/support/channelconfig/ChannelConfigDashboard';
import InternalLeadsDashboard from '../../pages/data&lead/internalleads/InternalLeadsDashboard';

import ContactsAccountsDashboard from '../../pages/corecrm/accounts&contacts/ContactsAccountsDashboard';
import ForecastsDashboard from '../../pages/finance/forecasts/ForecastsDashboard';
import DealsDashboardCore from '../../pages/corecrm/dealsubmodule/DealsDashboard';
import BulkUploadDashboard from '../../pages/data&lead/bulkupload/BulkUploadDashboard';
import LeadStatusDashboard from '../../pages/pipeline/leadstatus/LeadStatusDashboard';


const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      
      {/* Navigation Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<DashboardPage />} />

            
            {/* --- Campaign Routes --- */}
            <Route path="campaigns/dialer/*" element={<DialerCampaignDashboard />} />
            <Route path="campaigns/email/*" element={<EmailCampaignDashboard />} />
            <Route path="campaigns/sms/*" element={<SMSCampaignDashboard />} />
            <Route path="campaigns/whatsapp/*" element={<WhatsAppCampaignDashboard />} />
            <Route path="campaigns/voice-broadcast/*" element={<VoiceCampaignDashboard />} />

            <Route path="campaigns/social-media/*" element={<SocialMediaCampaignDashboard />} />
            {/* <Route path="data-and-leads/bulk-data-upload/mapping" element={<MappingPage />} /> */}
            {/* <Route path="data-and-leads/bulk-data/*" element={<BulkUploadDashboard />} /> */}
              
            <Route path="campaigns/social-media/*" element={<SocialMediaCampaignDashboard />} />

            {/* --- Data & Leads Routes --- */}
            <Route path="data-and-leads/bulk-data/*" element={<BulkUploadDashboard />} />
            {/* Third Party Vendor Leads Route [cite: 222] */}
            <Route path="data-and-leads/third-party-leads/*" element={<ThirdPartyLeadsDashboard />} />
            <Route path="data-and-leads/internal-referral-leads/*" element={<InternalLeadsDashboard />} />
            <Route path="data-and-leads/campaign-leads/*" element={<CompaignLeads />} />
            <Route path="data-and-leads/used-leads-tracking/*" element={<UsedLeadsTrackingDashboard />} />
            <Route path="data-and-leads/online-landing-leads/*" element={<OnlineLeadsDashboard />} />
            <Route path="data-and-leads/archived-leads/*" element={<ArchivedLeadsDashboard />} />



            {/* Pipeline Stages Routes  */}
            <Route path="pipeline-stages/raw-leads/*" element={<RawLeadsDashboard />} />
            <Route path="pipeline-stages/qualified-leads/*" element={<QualifiedLeadsDashboard />} />
            <Route path="pipeline-stages/deals/*" element={<DealsDashboard />} />
            <Route path='pipeline-stages/data-ingestion/*' element={<DataIngestionDashboard />} />
            <Route path="pipeline-stages/meetings/*" element={<MeetingsDashboard />} />
            <Route path='pipeline-stages/follow-up/*' element={<FollowUpDashboard />} />
            <Route path="pipeline-stages/hot-leads/*" element={<HotLeadsDashboard />} />
            <Route path="pipeline-stages/lead-status/*" element={<LeadStatusDashboard />} />
            
            {/* core crm routes */}
            {/* <Route path="core-crm/deals-submodules/*" element={<MovedLeads />} /> */}
            <Route path="core-crm/deals-submodules/*" element={<DealsDashboardCore />} />
            {/* <Route path="core-crm/contacts-accounts/*" element={<LeadStatusModule />} /> */}
            <Route path="core-crm/contacts-accounts/*" element={<ContactsAccountsDashboard />} />
            <Route path="core-crm/tasks-meetings/*" element={<TasksMeetingsDashboard />} />

            {/* finance analytics routes */}
            <Route path="finance-analytics/repayments-collections/*" element={<RepaymentsDashboard />} />
            {/* <Route path="finance-analytics/forecasts/*" element={<ForecastsModule />} /> */}
            <Route path="finance-analytics/forecasts/*" element={<ForecastsDashboard />} />
            <Route path='finance-analytics/targets/*' element={<TargetsForecastDashboard />} />
            
            {/* support operation routes */}
            <Route path="support-operations/support-ticketing/*" element={<SupportTicketingDashboard />} />
            <Route path="support-operations/communication/*" element={<CommunicationDashboard />} />
            <Route path="support-operations/training/*" element={<TrainingDashboard />} />
            <Route path="support-operations/channel-config/*" element={<ChannelConfigDashboard />} />

            {/* Fallback for unmatched dashboard routes */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
