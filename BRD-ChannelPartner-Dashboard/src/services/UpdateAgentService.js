const BASE_URL = "/api";

// ─────────────────────────────────────────────
// AGENT  →  /api/agents/
// ─────────────────────────────────────────────

export const AgentService = {
  /** GET /api/agents/ */
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/agents/`);
    if (!response.ok) throw new Error("Failed to fetch agents");
    return response.json();
  },

  /** GET /api/agents/:id/ */
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/agents/${id}/`);
    if (!response.ok) throw new Error(`Failed to fetch agent ${id}`);
    return response.json();
  },

  /**
   * POST /api/agents/
   * @param {Object} data
   * @param {string} data.full_name
   * @param {string} data.date_of_birth   – "YYYY-MM-DD"
   * @param {string} data.phone_number
   * @param {string} data.email_address
   * @param {"dsa"|"broker"|"lead_partner"} data.agent_type
   * @param {"active"|"inactive"} [data.status]
   */
  create: async (data) => {
    const response = await fetch(`${BASE_URL}/agents/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create agent");
    return response.json();
  },

  /** PUT /api/agents/:id/ */
  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/agents/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to update agent ${id}`);
    return response.json();
  },

  /** PATCH /api/agents/:id/ */
  partialUpdate: async (id, data) => {
    const response = await fetch(`${BASE_URL}/agents/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to partially update agent ${id}`);
    return response.json();
  },

  /** DELETE /api/agents/:id/ */
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/agents/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Failed to delete agent ${id}`);
    return response.status === 204 ? null : response.json();
  },
};

// ─────────────────────────────────────────────
// KYC  →  /api/kyc/
// ─────────────────────────────────────────────

export const KYCService = {
  /** GET /api/kyc/ */
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/kyc/`);
    if (!response.ok) throw new Error("Failed to fetch KYC records");
    return response.json();
  },

  /** GET /api/kyc/:id/ */
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/kyc/${id}/`);
    if (!response.ok) throw new Error(`Failed to fetch KYC record ${id}`);
    return response.json();
  },

  /**
   * POST /api/kyc/
   * Sends multipart/form-data because of the `document` FileField.
   * @param {Object} data
   * @param {number} data.agent            – FK to UpdateAgent
   * @param {string} data.pan_number
   * @param {string} data.aadhaar_number
   * @param {string} data.bank_name
   * @param {string} data.ifsc_code
   * @param {string} data.account_number
   * @param {File}   data.document
   */
  create: async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    const response = await fetch(`${BASE_URL}/kyc/`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to create KYC record");
    return response.json();
  },

  /** PUT /api/kyc/:id/ – also multipart when updating document */
  update: async (id, data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    const response = await fetch(`${BASE_URL}/kyc/${id}/`, {
      method: "PUT",
      body: formData,
    });
    if (!response.ok) throw new Error(`Failed to update KYC record ${id}`);
    return response.json();
  },

  /** PATCH /api/kyc/:id/ */
  partialUpdate: async (id, data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    const response = await fetch(`${BASE_URL}/kyc/${id}/`, {
      method: "PATCH",
      body: formData,
    });
    if (!response.ok) throw new Error(`Failed to partially update KYC record ${id}`);
    return response.json();
  },

  /** DELETE /api/kyc/:id/ */
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/kyc/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Failed to delete KYC record ${id}`);
    return response.status === 204 ? null : response.json();
  },
};

// ─────────────────────────────────────────────
// ADDRESS  →  /api/address/
// ─────────────────────────────────────────────

export const AddressService = {
  /** GET /api/address/ */
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/address/`);
    if (!response.ok) throw new Error("Failed to fetch addresses");
    return response.json();
  },

  /** GET /api/address/:id/ */
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/address/${id}/`);
    if (!response.ok) throw new Error(`Failed to fetch address ${id}`);
    return response.json();
  },

  /**
   * POST /api/address/
   * @param {Object} data
   * @param {number} data.agent            – FK to UpdateAgent
   * @param {string} data.street_address
   * @param {string} data.city
   * @param {string} data.state
   * @param {string} data.pincode
   */
  create: async (data) => {
    const response = await fetch(`${BASE_URL}/address/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create address");
    return response.json();
  },

  /** PUT /api/address/:id/ */
  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/address/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to update address ${id}`);
    return response.json();
  },

  /** PATCH /api/address/:id/ */
  partialUpdate: async (id, data) => {
    const response = await fetch(`${BASE_URL}/address/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to partially update address ${id}`);
    return response.json();
  },

  /** DELETE /api/address/:id/ */
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/address/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Failed to delete address ${id}`);
    return response.status === 204 ? null : response.json();
  },
};

// ─────────────────────────────────────────────
// SETTINGS  →  /api/settings/
// ─────────────────────────────────────────────

export const SettingService = {
  /** GET /api/settings/ */
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/settings/`);
    if (!response.ok) throw new Error("Failed to fetch settings");
    return response.json();
  },

  /** GET /api/settings/:id/ */
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/settings/${id}/`);
    if (!response.ok) throw new Error(`Failed to fetch setting ${id}`);
    return response.json();
  },

  /**
   * POST /api/settings/
   * @param {Object}  data
   * @param {"mumbai"|"delhi"|"bangalore"|"hyderabad"} data.tenant
   * @param {boolean} [data.email_notifications]
   * @param {boolean} [data.sms_notifications]
   * @param {boolean} [data.auto_payout]
   * @param {boolean} [data.performance_report_access]
   * @param {"previous"|"save"} [data.action]
   */
  create: async (data) => {
    const response = await fetch(`${BASE_URL}/settings/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create setting");
    return response.json();
  },

  /** PUT /api/settings/:id/ */
  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/settings/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to update setting ${id}`);
    return response.json();
  },

  /** PATCH /api/settings/:id/ */
  partialUpdate: async (id, data) => {
    const response = await fetch(`${BASE_URL}/settings/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to partially update setting ${id}`);
    return response.json();
  },

  /** DELETE /api/settings/:id/ */
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/settings/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Failed to delete setting ${id}`);
    return response.status === 204 ? null : response.json();
  },
};