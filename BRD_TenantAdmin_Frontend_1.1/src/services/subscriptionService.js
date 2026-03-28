import axiosInstance from "../utils/axiosInstance";

export const subscriptionAPI = {
  getMySubscription: () => axiosInstance.get("adminpanel/subscriptions/my/"),

  takeAction: (action) => axiosInstance.post("adminpanel/subscriptions/action/", { action }),
};
