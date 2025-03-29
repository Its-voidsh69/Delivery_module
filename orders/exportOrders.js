const axios = require("axios").default;

async function exportOrders(auth) {
    if (!auth.token) {
      console.error("Authorization token is required.");
      return;
    }
  
    const url = "https://apiv2.shiprocket.in/v1/external/orders/export";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    };
  
    try {
      const response = await axios.post(url, {}, { headers });
  
      if (response.status === 200) {
        return {
          status: "success",
          message: "Order export initiated. You will receive an email with the download link.",
          isBackgroundDownloading: response.data.is_background_downloading,
        };
      } else {
        return {
          status: "error",
          message: "Failed to export orders",
        };
      }
    } catch (error) {
      console.error("Error exporting orders:", error.response?.data || error.message);
      return {
        status: "error",
        message: error.response?.data?.message || error.message,
      };
    }
  }
  
module.exports = {
  exportOrders
}  