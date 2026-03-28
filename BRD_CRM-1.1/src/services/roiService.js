import axiosInstance from "../utils/axiosInstance";
const BASE = "Support_And_Operations/" 

export const getchannels = () => {
  return axiosInstance.get(`${BASE}roi/channels/`);
};

export const enablechannels = (id) => {
  return axiosInstance.post(`${BASE}roi/channels/${id}/enable/`);
}

export const disablechannels = (id) => {
  return axiosInstance.post(`${BASE}roi/channels/${id}/disable/`);
}

export const getchannelsById = (id) => {
  return axiosInstance.get(`${BASE}roi/channels/${id}/`);
};

export const createchannels = (data) => {
  return axiosInstance.post(`${BASE}roi/channels/`, data);
};

export const updatechannels = (id, data) => {
  return axiosInstance.put(`${BASE}roi/channels/${id}/`, data);
};


export const patchchannels = (id, data) => {
  return axiosInstance.patch(`${BASE}roi/channels/${id}/`, data);
};

export const deletechannels= (id) => {
  return axiosInstance.delete(`${BASE}roi/channels/${id}/`);
};

export const getChannelAnalytics = () => {
  return axiosInstance.get(`${BASE}roi/channel-analytics/`);
};
