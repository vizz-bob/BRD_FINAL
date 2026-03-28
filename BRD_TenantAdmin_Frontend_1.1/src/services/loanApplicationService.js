import axiosInstance from "../utils/axiosInstance";

export const loanApplicationAPI = {
  getAll: (params) => axiosInstance.get("los/loan-applications/", { params }),
  getById: (id) => axiosInstance.get(`los/loan-applications/${id}/`),
  create: (data) => axiosInstance.post("los/loan-applications/", data),
  
  // Status Updates
  updateStatus: (id, status, remarks) => 
    axiosInstance.post(`los/loan-applications/${id}/change-status/`, { status, remarks }),
    
  // Phase 5: Video KYC
  verifyVideo: (id, decision, remarks) => 
    axiosInstance.post(`los/loan-applications/${id}/verify-video/`, { decision, remarks }),

  // ⭐ PHASE 6: SANCTION & DOCS
  generateSanctionLetter: (id) => 
    axiosInstance.post(`los/loan-applications/${id}/generate-sanction-letter/`),
  
  triggerESign: (id) => 
    axiosInstance.post(`los/loan-applications/${id}/trigger-esign/`),
  
  checkESignStatus: (id) => 
    axiosInstance.get(`los/loan-applications/${id}/esign-status/`),

  // ⭐ PHASE 7: DISBURSEMENT
  getDisbursementQueue: () => 
    axiosInstance.get(`los/disbursements/queue/`),
    
  processDisbursement: (id, transactionDetails) => 
    axiosInstance.post(`los/disbursements/${id}/process/`, transactionDetails),
};