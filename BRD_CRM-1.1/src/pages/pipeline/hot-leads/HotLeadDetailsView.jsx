import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, CheckCircle2, ExternalLink, ShieldCheck,
  Calendar, Zap, MessageSquare, ArrowRight, Gavel,
  Trophy, MousePointer2, Archive, Clock,
  Phone,
  Tag, X, Video, MapPin, User, FileText, Upload
} from 'lucide-react';

import ScheduleMeetingModal from '../meetings/ScheduleMeetingModal';
import { meetingsService, followUpService, loanApplicationService } from '../../../services/pipelineService';
import leadService from '../../../services/leadService';

const HotLeadDetailsView = ({ lead, onBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...lead });
  const [selectedAction, setSelectedAction] = useState('');

  useEffect(() => {
    if (lead) {
      console.log('HotLeadDetailsView: Syncing lead data', lead.pk, lead.name);
      setFormData({ ...lead });
    }
  }, [lead]);

  const handleSave = async () => {
    try {
      const updated = await leadService.updateHotLead(lead.id, formData);
      setIsEditing(false);
      onUpdate(updated);
    } catch (error) {
      console.error("Error updating hot lead:", error);
    }
  };

  const handleMoveToQualified = async () => {
    try {
      await leadService.moveToQualified(lead.id); // Using lead.id for routing
      onUpdate(); // Refresh the list
      onBack();
    } catch (error) {
      console.error("Error moving to qualified:", error);
    }
  };

  const handleMarkDormant = async () => {
    try {
      await leadService.markAsDormant(lead.id);
      onUpdate();
      onBack();
    } catch (error) {
      console.error("Error marking as dormant:", error);
    }
  };

  const handleMoveToFollowUp = async () => {
    console.log('HotLeadDetailsView: Moving lead to follow-up', lead.id);
    try {
      await leadService.updateHotLeadStatus(lead.id, 'FOLLOW_UP');
      console.log('HotLeadDetailsView: Transition success');
      onUpdate();
      onBack();
    } catch (error) {
      console.error("Error moving to follow-up:", error);
    }
  };

  if (!lead) return (
    <div className="h-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center p-8 text-center">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Lead to View LOS Profile</p>
    </div>
  );

  return (
    <aside className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Top Assignment Badge */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/30">
        <button onClick={onBack} className="lg:hidden p-2 text-gray-400"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-[9px] font-black text-indigo-700 uppercase">Top-Tier Agent Assigned</span>
        </div>
        <div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${isEditing ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
          >
            {isEditing ? 'Save Changes' : 'Edit Lead'}
          </button>
          <button className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors"><ExternalLink className="w-4 h-4" /></button>

        </div>

      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Profile Card */}
        <div className="text-center pb-6 border-b border-gray-50">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-indigo-100">
              <span className="text-3xl font-black text-white">{(lead.name || 'U').charAt(0)}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm border border-emerald-100">
              <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            </div>
          </div>
          {isEditing ? (
            <input
              id="lead-name"
              name="name"
              className="text-xl font-black text-gray-900 mt-2 text-center bg-transparent border-b border-indigo-200 outline-none w-full"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          ) : (
            <h2 className="text-xl font-black text-gray-900 mt-2">{lead.name}</h2>
          )}
          {isEditing ? (
            <div className="flex items-center justify-center gap-2 mt-2">
              <label htmlFor="intent-score" className="text-[11px] font-bold text-indigo-600">Intent:</label>
              <input
                id="intent-score"
                name="intentScore"
                className="bg-indigo-50 text-[11px] font-bold text-indigo-600 outline-none w-16 px-1 rounded border border-indigo-100"
                value={formData.intentScore || ''}
                onChange={(e) => setFormData({ ...formData, intentScore: e.target.value })}
              />
            </div>
          ) : (
            <p className="text-[11px] font-bold text-indigo-600 tracking-widest uppercase">High Intent • {lead.intentScore}</p>
          )}
          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Docs: {lead.docs}</span>
        </div>

        {/* Contact Metadata */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            {isEditing ? (
              <label htmlFor="mobile-number" className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Mobile Number</label>
            ) : (
              <p className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Mobile Number</p>
            )}
            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              {isEditing ? (
                <input
                  id="mobile-number"
                  name="phone"
                  className="bg-transparent text-sm w-full outline-none font-semibold"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              ) : (
                <span className="text-sm font-semibold text-gray-800">{lead.phone}</span>
              )}
            </div>
          </div>
          <div>
            {isEditing ? (
              <label htmlFor="lead-source" className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Lead Source</label>
            ) : (
              <p className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Lead Source</p>
            )}
            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              {isEditing ? (
                <input
                  id="lead-source"
                  name="vendorSource"
                  className="bg-transparent text-sm w-full outline-none font-semibold"
                  value={formData.vendorSource || ''}
                  onChange={(e) => setFormData({ ...formData, vendorSource: e.target.value })}
                />
              ) : (
                <span className="text-sm font-semibold text-gray-800">{lead.vendorSource}</span>
              )}
            </div>
          </div>
        </div>

        {/* FEATURE: Engagement Feed */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MousePointer2 className="w-3 h-3" /> Intent Activity
          </h4>
          <div className="bg-gray-50 rounded-xl p-3 space-y-3 border border-gray-100">
            {lead.activities && lead.activities.length > 0 ? (
              lead.activities.map((act, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full ${act.activity_type === 'WHATSAPP_CLICK' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                  <div>
                    <p className="text-[11px] font-bold text-gray-800">
                      {act.activity_type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-[10px] text-gray-400">{act.note}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-gray-400 text-center py-2">No recent activity detected</p>
            )}
          </div>
        </div>

        {/* FEATURE: LOS Profile Link */}
        <div className="p-4 bg-indigo-700 rounded-2xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                LOS Profile ({isEditing ? (
                  <input
                    id="los-stage"
                    name="losStage"
                    className="bg-transparent border-b border-white/30 outline-none w-20 text-white"
                    value={formData.losStage || ''}
                    onChange={(e) => setFormData({ ...formData, losStage: e.target.value })}
                  />
                ) : (lead.losStage || 'N/A')})
              </span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <input
                  id="los-status"
                  name="losStatus"
                  className="text-2xl font-black bg-transparent border-b border-white/30 outline-none w-full text-white"
                  value={formData.losStatus || ''}
                  onChange={(e) => setFormData({ ...formData, losStatus: e.target.value })}
                />
                <textarea
                  id="los-description"
                  name="losDescription"
                  className="text-[11px] bg-transparent border border-white/20 rounded p-1 outline-none w-full text-gray-100"
                  rows="2"
                  value={formData.losDescription || ''}
                  onChange={(e) => setFormData({ ...formData, losDescription: e.target.value })}
                />
              </div>
            ) : (
              <>
                <p className="text-2xl font-black">{lead.losStatus || 'Pending'}</p>
                <p className="text-[11px] text-gray-200/70">{lead.losDescription || 'No description available'}</p>
              </>
            )}
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
        </div>


        {/* Transition Dropdown */}
        <div className="pt-4 space-y-3">
          <label htmlFor="pipeline-transition" className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">
            Pipeline Transition
          </label>
          <div className="relative">
            <select
              id="pipeline-transition"
              name="pipelineTransition"
              onChange={(e) => setSelectedAction(e.target.value)}
              defaultValue=""
              className="w-full py-4 px-5 bg-indigo-600 text-white rounded-2xl font-black text-sm outline-none appearance-none cursor-pointer hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all border-none"
            >
              <option value="" disabled>Choose Next Action...</option>
              <option value="follow_up" className="bg-white text-gray-900 font-bold py-3">📅 Move to Follow-up / Meetings</option>
              <option value="meeting" className="bg-white text-gray-900 font-bold py-3">📹 Schedule Meeting</option>
              <option value="deal" className="bg-white text-gray-900 font-bold py-3">🚀 Convert to Deal Stage</option>
              <option value="dormant" className="bg-white text-gray-900 font-bold py-3">📁 Mark as Dormant (Dead)</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <ArrowRight className="w-5 h-5 text-indigo-200" />
            </div>
          </div>
        </div>

        {/* FEATURE: 3-Day SLA Warning */}
        <div className="flex items-center justify-center gap-2 py-3 bg-amber-50 rounded-xl border border-amber-100">
          <Clock className="w-4 h-4 text-amber-600" />
          <p className="text-[10px] font-black text-amber-700 uppercase">3D Rule: 42 Hours Left to Convert</p>
        </div>
      </div>

      {/* Modals */}
      {selectedAction === 'meeting' && (
        <ScheduleMeetingModal
          onClose={() => setSelectedAction('')}
          initialData={{
            leadName: lead.name,
            leadId: lead.id || lead.pk,
            phone: lead.phone,
            email: lead.email,
          }}
          onSchedule={async (meetingData) => {
            setSelectedAction('');
            try {
              await meetingsService.create({
                lead_name: lead.name,
                lead_id: lead.id || lead.pk,
                phone_number: lead.phone,
                email: lead.email,
                meeting_type: meetingData.meetingType,
                meeting_mode: meetingData.meetingMode,
                date: meetingData.scheduledDate,
                time: meetingData.scheduledTime,
                duration: meetingData.duration,
                location_or_link: meetingData.location,
                meeting_agenda: meetingData.agenda,
                notes: meetingData.notes,
              });
              await leadService.updateHotLeadStatus(lead.id, 'MEETING_SCHEDULED');
              onUpdate();
              onBack();
            } catch (error) {
              console.error('Error scheduling meeting:', error);
            }
          }}
        />
      )}

      {selectedAction === 'follow_up' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Create Follow-Up Task</h3>
              <button onClick={() => setSelectedAction('')} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              setSelectedAction('');
              try {
                await followUpService.create({
                  lead_name: lead.name,
                  type: formData.get('type'),
                  priority: formData.get('priority'),
                  due: formData.get('due'),
                  call_summary: formData.get('call_summary'),
                  disposition: formData.get('disposition'),
                });
                await leadService.updateHotLeadStatus(lead.id, 'FOLLOW_UP');
                onUpdate();
                onBack();
              } catch (error) {
                console.error('Error creating follow-up:', error);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
                  <select name="type" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select name="priority" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input name="due" type="datetime-local" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Disposition</label>
                  <select name="disposition" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                    <option value="interested">Interested</option>
                    <option value="call_back_later">Call Back Later</option>
                    <option value="not_reachable">Not Reachable</option>
                    <option value="converted_to_meeting">Converted to Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Call Summary</label>
                  <textarea name="call_summary" rows="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Summary of the interaction..."></textarea>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="flex-1 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">Create Follow-Up</button>
                <button type="button" onClick={() => setSelectedAction('')} className="px-5 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAction === 'deal' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Create Loan Application</h3>
              <button onClick={() => setSelectedAction('')} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = {
                lead_name: lead.name,
                product_type: formData.get('product_type'),
                requested_amount: formData.get('requested_amount'),
                tenure_months: formData.get('tenure_months'),
                interest_type: formData.get('interest_type'),
                documents: formData.get('documents'),
              };
              setSelectedAction('');
              try {
                await loanApplicationService.create(data);
                await leadService.moveToQualified(lead.id);
                onUpdate();
                onBack();
              } catch (error) {
                console.error('Error creating loan application:', error);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                  <select name="product_type" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                    <option value="Home Loan">Home Loan</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Car Loan">Car Loan</option>
                    <option value="Business Loan">Business Loan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requested Amount</label>
                  <input name="requested_amount" type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="₹" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tenure (months)</label>
                  <input name="tenure_months" type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 240" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interest Type</label>
                  <select name="interest_type" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                    <option value="Fixed">Fixed</option>
                    <option value="Floating">Floating</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents</label>
                  <input name="documents" type="file" multiple className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="flex-1 px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">Create Application</button>
                <button type="button" onClick={() => setSelectedAction('')} className="px-5 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAction === 'dormant' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Mark as Dormant</h3>
              <button onClick={() => setSelectedAction('')} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Are you sure you want to mark this lead as dormant? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={async () => {
                setSelectedAction('');
                try {
                  await leadService.markAsDormant(lead.id);
                  onUpdate();
                  onBack();
                } catch (error) {
                  console.error('Error marking as dormant:', error);
                }
              }} className="flex-1 px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">Mark as Dormant</button>
              <button onClick={() => setSelectedAction('')} className="px-5 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default HotLeadDetailsView;