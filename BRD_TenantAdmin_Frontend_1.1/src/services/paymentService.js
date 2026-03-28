import axios from "axios";

const TEST_PAYMENT_API = "https://httpbin.org/post";

const paymentService = {
  async createOrder(planId) {
    // Simulated order creation
    const res = await axios.post(TEST_PAYMENT_API, {
      plan_id: planId,
      amount: 149,
      currency: "INR",
      status: "ORDER_CREATED",
    });

    return {
      order_id: "test_order_" + Date.now(),
      amount: 149,
      currency: "INR",
      raw: res.data, // optional (for debugging)
    };
  },

  async verifyPayment(payload) {
    // Simulated payment verification
    await axios.post(TEST_PAYMENT_API, {
      ...payload,
      status: "PAYMENT_SUCCESS",
    });

    return {
      success: true,
      payment_id: "test_payment_" + Date.now(),
    };
  },
};

export default paymentService;
