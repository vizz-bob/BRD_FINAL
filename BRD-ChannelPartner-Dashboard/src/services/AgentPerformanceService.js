const BASE_URL = "http://localhost:8000/agent";

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────

export const getDashboardList = async () => {
  const response = await fetch(`${BASE_URL}/dashboard/`);
  if (!response.ok) throw new Error("Failed to fetch dashboard list");
  return response.json();
};

export const createDashboard = async (data) => {
  const response = await fetch(`${BASE_URL}/dashboard/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create dashboard");
  return response.json();
};

export const getDashboardById = async (pk) => {
  const response = await fetch(`${BASE_URL}/dashboard/${pk}/`);
  if (!response.ok) throw new Error(`Failed to fetch dashboard with id ${pk}`);
  return response.json();
};

export const updateDashboard = async (pk, data) => {
  const response = await fetch(`${BASE_URL}/dashboard/${pk}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to update dashboard with id ${pk}`);
  return response.json();
};

export const patchDashboard = async (pk, data) => {
  const response = await fetch(`${BASE_URL}/dashboard/${pk}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to patch dashboard with id ${pk}`);
  return response.json();
};

export const deleteDashboard = async (pk) => {
  const response = await fetch(`${BASE_URL}/dashboard/${pk}/`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Failed to delete dashboard with id ${pk}`);
  return true;
};

// ─────────────────────────────────────────────
// NEW AGENT
// ─────────────────────────────────────────────

export const getNewAgentList = async () => {
  const response = await fetch(`${BASE_URL}/`);
  if (!response.ok) throw new Error("Failed to fetch new agent list");
  return response.json();
};

export const createNewAgent = async (data) => {
  const response = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create new agent");
  return response.json();
};

export const getNewAgentById = async (pk) => {
  const response = await fetch(`${BASE_URL}/${pk}/`);
  if (!response.ok) throw new Error(`Failed to fetch new agent with id ${pk}`);
  return response.json();
};

export const updateNewAgent = async (pk, data) => {
  const response = await fetch(`${BASE_URL}/${pk}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to update new agent with id ${pk}`);
  return response.json();
};

export const patchNewAgent = async (pk, data) => {
  const response = await fetch(`${BASE_URL}/${pk}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to patch new agent with id ${pk}`);
  return response.json();
};

export const deleteNewAgent = async (pk) => {
  const response = await fetch(`${BASE_URL}/${pk}/`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Failed to delete new agent with id ${pk}`);
  return true;
};

// ─────────────────────────────────────────────
// ALL AGENT
// ─────────────────────────────────────────────

export const getAllAgentList = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `${BASE_URL}/all-agent/?${query}`
    : `${BASE_URL}/all-agent/`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch all agents");
  return response.json();
};

export const createAllAgent = async (data) => {
  const response = await fetch(`${BASE_URL}/all-agent/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create agent");
  return response.json();
};

export const getAllAgentById = async (pk) => {
  const response = await fetch(`${BASE_URL}/all-agent/${pk}/`);
  if (!response.ok) throw new Error(`Failed to fetch agent with id ${pk}`);
  return response.json();
};

export const updateAllAgent = async (pk, data) => {
  const response = await fetch(`${BASE_URL}/all-agent/${pk}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to update agent with id ${pk}`);
  return response.json();
};

export const patchAllAgent = async (pk, data) => {
  const response = await fetch(`${BASE_URL}/all-agent/${pk}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to patch agent with id ${pk}`);
  return response.json();
};

export const deleteAllAgent = async (pk) => {
  const response = await fetch(`${BASE_URL}/all-agent/${pk}/`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Failed to delete agent with id ${pk}`);
  return true;
};

// ─────────────────────────────────────────────
// EDIT AGENT
// ─────────────────────────────────────────────

export const getEditAgentList = async () => {
  const response = await fetch(`${BASE_URL}/edit-agent/`);
  if (!response.ok) throw new Error("Failed to fetch edit agent list");
  return response.json();
};

export const createEditAgent = async (data) => {
  const response = await fetch(`${BASE_URL}/edit-agent/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create edit agent record");
  return response.json();
};

export const getEditAgentById = async (pk) => {
  const response = await fetch(`${BASE_URL}/edit-agent/${pk}/`);
  if (!response.ok) throw new Error(`Failed to fetch edit agent with id ${pk}`);
  return response.json();
};

export const updateEditAgent = async (pk, data) => {
  const response = await fetch(`${BASE_URL}/edit-agent/${pk}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to update edit agent with id ${pk}`);
  return response.json();
};

export const patchEditAgent = async (pk, data) => {
  const response = await fetch(`${BASE_URL}/edit-agent/${pk}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to patch edit agent with id ${pk}`);
  return response.json();
};

export const deleteEditAgent = async (pk) => {
  const response = await fetch(`${BASE_URL}/edit-agent/${pk}/`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Failed to delete edit agent with id ${pk}`);
  return true;
};

// ─────────────────────────────────────────────
// VIEW AGENT
// ─────────────────────────────────────────────

export const getViewAgentList = async () => {
  const response = await fetch(`${BASE_URL}/view-agent/`);
  if (!response.ok) throw new Error("Failed to fetch view agent list");
  return response.json();
};

export const createViewAgent = async (data) => {
  const response = await fetch(`${BASE_URL}/view-agent/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create view agent record");
  return response.json();
};

export const getViewAgentById = async (pk) => {
  const response = await fetch(`${BASE_URL}/view-agent/${pk}/`);
  if (!response.ok) throw new Error(`Failed to fetch view agent with id ${pk}`);
  return response.json();
};

export const updateViewAgent = async (pk, data) => {
  const response = await fetch(`${BASE_URL}/view-agent/${pk}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to update view agent with id ${pk}`);
  return response.json();
};

export const patchViewAgent = async (pk, data) => {
  const response = await fetch(`${BASE_URL}/view-agent/${pk}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to patch view agent with id ${pk}`);
  return response.json();
};

export const deleteViewAgent = async (pk) => {
  const response = await fetch(`${BASE_URL}/view-agent/${pk}/`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Failed to delete view agent with id ${pk}`);
  return true;
};

// ─────────────────────────────────────────────
// REMOVE AGENT
// ─────────────────────────────────────────────

export const removeAgent = async (data) => {
  const response = await fetch(`${BASE_URL}/remove-agent/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to remove agent");
  return response.json();
};
