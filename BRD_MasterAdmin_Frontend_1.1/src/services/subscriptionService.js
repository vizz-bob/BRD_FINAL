import axiosInstance from "../utils/axiosInstance";

const BASE_URL = "/adminpanel/subscription";

const subscriptionService = {
  /* ===================== GET ALL ===================== */
  async getAll() {
    const res = await axiosInstance.get(`${BASE_URL}/plans/`);
    return res.data;
  },

  /* ===================== GET ONE ===================== */
  async getOne(uuid) {
    const res = await axiosInstance.get(`${BASE_URL}/plans/${uuid}/`);
    return res.data;
  },

  /* ===================== CREATE ===================== */
  async create(data) {
    const payload = {
      subscription_name: data.subscription_name,
      subscription_amount: Number(data.subscription_amount),
      no_of_borrowers: Number(data.no_of_borrowers),
      no_of_users: Number(data.no_of_users),
      subscription_type: data.subscription_type,
      valid_from: data.valid_from,
      valid_to: data.valid_to,
      created_user: data.created_user,
      modified_user: data.modified_user,
      isDeleted: data.isDeleted,
    };

    const res = await axiosInstance.post(`${BASE_URL}/plans/`, payload);
    return res.data;
  },

  /* ===================== UPDATE ===================== */
  async update(uuid, data) {
    const payload = {
      subscription_name: data.subscription_name,
      subscription_amount: Number(data.subscription_amount),
      no_of_borrowers: Number(data.no_of_borrowers),
      no_of_users: Number(data.no_of_users),
      subscription_type: data.subscription_type,
      valid_from: data.valid_from,
      valid_to: data.valid_to,
      modified_user: data.modified_user,
      isDeleted: data.isDeleted,
    };

    const res = await axiosInstance.put(
      `${BASE_URL}/plans/${uuid}/`,
      payload
    );
    return res.data;
  },

  /* ===================== DELETE ===================== */
  async delete(uuid) {
    await axiosInstance.delete(`${BASE_URL}/plans/${uuid}/`);
    return true;
  },
};

export default subscriptionService;
