import axiosInstance from "../utils/axiosInstance";

export const workspaceApi = {
  // ✅ Detects the user's current "Persona Mode" based on activity & backlog
  // Returns: { mode: 'sales_hunting' | 'risk_firefighting' | 'standard', score: 85, topPriority: '...' }
  getWorkspaceContext: () => {
    // In a real app, this calls an ML/Analytics backend.
    // We will simulate the API call here or mock it if the backend isn't ready.
    return axiosInstance.get("adminpanel/workspace/context/").catch(() => ({
      // ✅ FIX: Default to 'standard' so the UI is clean. Uncomment the block below to test Firefighting mode.
      data: {
        mode: 'standard', 
        label: 'Standard Workspace',
        reason: 'Operations Normal',
        urgencyLevel: 'normal',
        suggestedActions: []
      }

      /* // UNCOMMENT THIS TO TEST POINT 8 (FIRE-FIGHTING MODE)
      data: {
        mode: 'risk_firefighting', 
        label: 'Escalation Protocol Active',
        reason: '12 Loan Approvals breached SLA (>48hrs)',
        urgencyLevel: 'high',
        suggestedActions: [
          { id: 1, type: 'review', title: 'Approve Pending Disbursal #L-902' },
          { id: 2, type: 'call', title: 'Call Branch Manager - Delhi South' }
        ]
      }
      */
    }));
  },

  // Fetch real-time escalations for the hierarchy view
  getEscalationMatrix: () => axiosInstance.get("adminpanel/workspace/escalations/"),
};