import axiosInstance from "../utils/axiosInstance";

// Helper function to convert display values to backend format
const formatForBackend = (ruleData) => {
  // Map display stage names to backend constants
  const stageMap = {
    'Underwriting': 'UNDERWRITING',
    'Document Verification': 'DOC_VERIFICATION',
    'Disbursement': 'DISBURSEMENT'
  };

  // Map display action names to backend constants
  const actionMap = {
    'Notify Supervisor': 'NOTIFY_SUPERVISOR',
    'Notify Admin': 'NOTIFY_ADMIN',
    'Auto-Reassign': 'AUTO_REASSIGN'
  };

  return {
    process_stage: stageMap[ruleData.stage],
    trigger_delay_hours: ruleData.delay_hours,
    action: actionMap[ruleData.action],
    is_active: true
  };
};

// Helper function to convert backend data to display format
const formatForFrontend = (backendRule) => {
  const stageMap = {
    'UNDERWRITING': 'Underwriting',
    'DOC_VERIFICATION': 'Document Verification',
    'DISBURSEMENT': 'Disbursement'
  };

  const actionMap = {
    'NOTIFY_SUPERVISOR': 'Notify Supervisor',
    'NOTIFY_ADMIN': 'Notify Admin',
    'AUTO_REASSIGN': 'Auto-Reassign'
  };

  return {
    ...backendRule,
    stage: stageMap[backendRule.process_stage],
    action: actionMap[backendRule.action],
    condition: `Delayed ${backendRule.trigger_delay_hours}h`
  };
};

export const escalationAPI = {
  getAll: async () => {
    const res = await axiosInstance.get("escalation/rules/");
    // Convert backend format to frontend format
    return res.data.map(formatForFrontend);
  },

  create: async (ruleData) => {
    const payload = formatForBackend(ruleData);
    const res = await axiosInstance.post("escalation/rules/", payload);
    return formatForFrontend(res.data);
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(`escalation/rules/${id}/`);
    return res.data;
  }
};
