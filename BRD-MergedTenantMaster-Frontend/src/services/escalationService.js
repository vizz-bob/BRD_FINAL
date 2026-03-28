import axiosInstance from "../utils/axiosInstance";

// Helper function to convert display values to backend format
const formatForBackend = (ruleData) => {
  console.log("Original ruleData:", ruleData);
  
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

  const mappedAction = actionMap[ruleData.action];
  console.log(`Mapping action "${ruleData.action}" to "${mappedAction}"`);

  const payload = {
    process_stage: stageMap[ruleData.stage],
    trigger_delay_hours: ruleData.trigger_delay_hours || ruleData.delay_hours,
    action: mappedAction,
    is_active: true
  };
  
  console.log("Final payload:", payload);
  return payload;
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
    console.log("Sending payload to backend:", payload);
    
    try {
      const res = await axiosInstance.post("escalation/rules/", payload);
      return formatForFrontend(res.data);
    } catch (error) {
      // If it's a unique constraint error, provide a more helpful message
      if (error.response?.status === 400 && error.response?.data?.non_field_errors) {
        const nonFieldErrors = error.response.data.non_field_errors;
        const uniqueError = nonFieldErrors.find(err => err.includes('unique') || err.includes('already exists'));
        if (uniqueError) {
          // Create a custom error with the message but preserve the original error structure
          const customError = new Error("This rule combination (stage + action) already exists. Please choose a different combination.");
          customError.isCustomError = true;
          customError.response = error.response;
          throw customError;
        }
      }
      throw error;
    }
  },

  delete: async (id) => {
    const res = await axiosInstance.delete(`escalation/rules/${id}/`);
    return res.data;
  }
};
