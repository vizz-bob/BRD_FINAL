import axiosInstance from "../utils/axiosInstance";

const BASE_URL = "adminpanel/occupation-types/";

const occupationTypeService = {
  async getAll() {
    const res = await axiosInstance.get(BASE_URL);
    return res.data;
  },

  async getById(uuid) {
    const res = await axiosInstance.get(`${BASE_URL}${uuid}/`);
    return res.data;
  },

  async create(payload) {
    const res = await axiosInstance.post(BASE_URL, payload);
    return res.data;
  },

  async update(uuid, payload) {
    const res = await axiosInstance.put(`${BASE_URL}${uuid}/`, payload);
    return res.data;
  },

  async delete(uuid) {
    const res = await axiosInstance.delete(`${BASE_URL}${uuid}/`);
    return res.data;
  }
};

export default occupationTypeService;
