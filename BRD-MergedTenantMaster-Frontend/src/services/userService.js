import axiosInstance from "../utils/axiosInstance";

const BASE_URL = "tenantuser/users/";  // Changed from "users/users/" to "user/users/"

export const userService = {
  // GET ALL USERS
  async getAll() {
    return axiosInstance.get(BASE_URL);
  },

  // ALIAS FOR GET ALL
  async getUsers() {
    return this.getAll().then(res => res.data);
  },

  // CREATE USER
  async create(data) {
    return axiosInstance.post(BASE_URL, data);
  },

  // UPDATE USER
  async update(id, data) {
    return axiosInstance.patch(`${BASE_URL}${id}/`, data);
  },

  // DELETE USER
  async delete(id) {
    return axiosInstance.delete(`${BASE_URL}${id}/`);
  }
};

export const userAPI = userService;
export default userService;