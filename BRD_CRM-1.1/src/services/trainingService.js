import axiosInstance from "../utils/axiosInstance";
const BASE = "Support_And_Operations/" 

export const gettrainings = () => {
  return axiosInstance.get(`${BASE}training/trainings/`);
};

export const getStats = () => {
  return axiosInstance.get(`${BASE}training/trainings/stats/`)
}

export const getCompletedTrainings = () => {
  return axiosInstance.get(`${BASE}training/trainings/completed/`)
}

export const getOverdueTrainings = () => {
  return axiosInstance.get(`${BASE}training/trainings/overdue/`)
}

export const gettrainingById = (id) => {
  return axiosInstance.get(`${BASE}training/trainings/${id}/`);
};

export const createtrainings = (data) => {
  return axiosInstance.post(`${BASE}training/trainings/`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
};


export const updatetrainings = (id, data) => {
  return axiosInstance.put(`${BASE}training/trainings/${id}/`, data);
};


export const patchtrainings= (id, data) => {
  return axiosInstance.patch(`${BASE}training/trainings/${id}/`, data);
};

export const deletetrainings = (id) => {
  return axiosInstance.delete(`${BASE}training/trainings/${id}/`);
};
