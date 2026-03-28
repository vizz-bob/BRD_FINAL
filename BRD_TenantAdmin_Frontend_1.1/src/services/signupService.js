import axiosInstance from "../utils/axiosInstance";

export const signupApi = {
  submit: async (data) => {
    try {
      const res = await axiosInstance.post("tenant/onboarding/signup/", data);
      return { ok: true, data: res.data };
    } catch (err) {
      console.log("Signup Error:", err.response?.data);
      return { ok: false, error: err.response?.data };
    }
  }
};
