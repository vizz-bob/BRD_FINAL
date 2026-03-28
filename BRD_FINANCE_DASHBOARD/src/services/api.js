// API Service for Finance Dashboard
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1/finance'

class APIService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.token = localStorage.getItem('token')
  }

  setToken(token) {
    this.token = token
    localStorage.setItem('token', token)
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    }
    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`
    }
    return headers
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token')
        // Don't redirect - just throw error to be caught by components
        // window.location.href = '/login'
      }
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // ===== LOAN ENDPOINTS =====
  async getLoans(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/loans/${queryString ? '?' + queryString : ''}`)
  }

  async getLoan(id) {
    return this.request(`/loans/${id}/`)
  }

  async createLoan(data) {
    return this.request(`/loans/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateLoan(id, data) {
    return this.request(`/loans/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteLoan(id) {
    return this.request(`/loans/${id}/`, { method: 'DELETE' })
  }

  // ===== DISBURSEMENT ENDPOINTS =====
  async getDisbursements(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/disbursements/${queryString ? '?' + queryString : ''}`)
  }

  async getDisbursement(id) {
    return this.request(`/disbursements/${id}/`)
  }

  async createDisbursement(data) {
    return this.request(`/disbursements/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateDisbursement(id, data) {
    return this.request(`/disbursements/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteDisbursement(id) {
    return this.request(`/disbursements/${id}/`, { method: 'DELETE' })
  }

  async getDisbursementDashboard() {
    return this.request(`/disbursements/dashboard/`)
  }

  // ===== RECONCILIATION ENDPOINTS =====
  async getReconciliationTransactions(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/reconciliation/${queryString ? '?' + queryString : ''}`)
  }

  async getReconciliationTransaction(id) {
    return this.request(`/reconciliation/${id}/`)
  }

  async createReconciliationTransaction(data) {
    return this.request(`/reconciliation/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateReconciliationTransaction(id, data) {
    return this.request(`/reconciliation/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteReconciliationTransaction(id) {
    return this.request(`/reconciliation/${id}/`, { method: 'DELETE' })
  }

  // ===== REPAYMENT ENDPOINTS =====
  async getRepayments(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/repayments/${queryString ? '?' + queryString : ''}`)
  }

  async getRepayment(id) {
    return this.request(`/repayments/${id}/`)
  }

  async createRepayment(data) {
    return this.request(`/repayments/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateRepayment(id, data) {
    return this.request(`/repayments/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteRepayment(id) {
    return this.request(`/repayments/${id}/`, { method: 'DELETE' })
  }

  async getRepaymentDashboard() {
    return this.request(`/repayments/dashboard/`)
  }

  async recordPayment(id, amount) {
    return this.request(`/repayments/${id}/record_payment/`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  }

  async sendReminder(id, method = 'email') {
    return this.request(`/repayments/${id}/send_reminder/`, {
      method: 'POST',
      body: JSON.stringify({ method }),
    })
  }

  // ===== PAYMENT RECORD ENDPOINTS =====
  async getPaymentRecords(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/payment-records/${queryString ? '?' + queryString : ''}`)
  }

  async getPaymentRecord(id) {
    return this.request(`/payment-records/${id}/`)
  }

  async createPaymentRecord(data) {
    return this.request(`/payment-records/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ===== REMINDER ENDPOINTS =====
  async getReminders(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/reminders/${queryString ? '?' + queryString : ''}`)
  }

  async getReminder(id) {
    return this.request(`/reminders/${id}/`)
  }

  async createReminder(data) {
    return this.request(`/reminders/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ===== DASHBOARD ENDPOINTS =====
  async getDashboards() {
    return this.request(`/dashboards/`)
  }

  async getDashboardSummary() {
    return this.request(`/dashboards/summary/`)
  }

  async getDashboardLatest() {
    return this.request(`/dashboards/get_latest/`)
  }

  // ===== TENANT ENDPOINTS =====
  async getTenants() {
    return this.request(`/tenants/`)
  }

  async getTenant(id) {
    return this.request(`/tenants/${id}/`)
  }

  async createTenant(data) {
    return this.request(`/tenants/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTenant(id, data) {
    return this.request(`/tenants/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteTenant(id) {
    return this.request(`/tenants/${id}/`, { method: 'DELETE' })
  }

  // ===== SETTING ENDPOINTS =====
  async getSettings() {
    return this.request(`/settings/`)
  }

  async getSetting(id) {
    return this.request(`/settings/${id}/`)
  }

  async updateSetting(id, data) {
    return this.request(`/settings/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // ===== LEGACY ENDPOINTS (Backward Compatibility) =====
  async getLegacyDashboard() {
    return this.request(`/dashboard/`)
  }

  async getLegacyDisbursementDashboard() {
    return this.request(`/disbursement/dashboard/`)
  }

  async getLegacyReconciliationList(params = {}) {
    // Use the dashboard endpoint which returns properly formatted reconciliation data
    return this.request(`/reconciliation/dashboard/`)
  }

  async updateReconciliationBulk(updates) {
    return this.request(`/reconciliation/bulk-update`, {
      method: 'POST',
      body: JSON.stringify({ updates }),
    })
  }

  async getLegacyRepaymentList(params = {}) {
    // Use the dashboard endpoint which returns properly formatted repayment data
    return this.request(`/repayments/dashboard/`)
  }

  async generateReport() {
    const response = await fetch(
      `${this.baseURL}/report/generate`,
      {
        method: 'POST',
        headers: this.getHeaders(),
      }
    )
    if (!response.ok) throw new Error('Failed to generate report')
    return response.json()
  }

  async downloadRepaymentsReport() {
    const response = await fetch(
      `${this.baseURL}/repayments/report/download`,
      {
        headers: this.getHeaders(),
      }
    )
    if (!response.ok) throw new Error('Failed to download report')
    return { blob: await response.blob(), filename: 'repayments-report' }
  }

  async downloadDisbursementsReport() {
    const response = await fetch(
      `${this.baseURL}/disbursements/report/download`,
      {
        headers: this.getHeaders(),
      }
    )
    if (!response.ok) throw new Error('Failed to download report')
    return { blob: await response.blob(), filename: 'disbursements-report' }
  }
}

export default new APIService()
