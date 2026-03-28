import axiosInstance from "../utils/axiosInstance";

const BASE_URL = "tenant/categories/"; // relative to axiosInstance baseURL

export const getCategories = async () => {
  try {
    const res = await axiosInstance.get(BASE_URL);
    // Return array of category objects
    return Array.isArray(res.data) ? res.data : res.data.results || [];
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err;
  }
};

export const createCategory = async (categoryKey, title, description = "") => {
  try {
    const payload = {
      category_key: categoryKey,
      title,
      description,
    };
    const res = await axiosInstance.post(BASE_URL, payload);
    return res.data;
  } catch (err) {
    console.error("Error creating category:", err);
    throw err;
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await axiosInstance.delete(`${BASE_URL}${id}/`);
    return res.data;
  } catch (err) {
    console.error("Error deleting category:", err);
    throw err;
  }
};
