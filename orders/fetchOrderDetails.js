const axios = require("axios").default;

async function fetchOrderDetails(auth, orderId) {
    try {
      if (!orderId) {
        throw new Error("Order ID is required.");
      }
  
      console.log("Fetching order details for orderId:", orderId);
     // console.log("Using token:", auth.token);
  
      const url = `https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      };
  
      const response = await axios.get(url, { headers });
  
      if (response.status >= 200 && response.status < 300) {
        console.log("✅ Order details fetched successfully:");
        return response.data;
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Error fetching order details:", error.message, error.response?.data || "");
      throw error;
    }
  }

module.exports = {
    fetchOrderDetails
}  