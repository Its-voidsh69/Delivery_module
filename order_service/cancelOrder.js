const axios = require("axios").default;
const generatetoken = require('../auth/generateToken');

async function CancelOrder({ auth, ids }) {
    if (!auth.email || !auth.password) {
      console.error("Valid auth props are required (email and password).");
      return {
        status: "error",
        message: "Valid auth props are required (email and password).",
      };
    }
  
    if (!ids) {
      console.error("The 'ids' parameter is required to cancel orders.");
      return {
        status: "error",
        message: "The 'ids' parameter is required to cancel orders.",
      };
    }
  
    let token = auth.token;
    if (!token) {
      try {
        token = await generatetoken.GetToken(auth.email, auth.password);
      } catch (error) {
        console.error("Failed to fetch token:", error.message);
        return {
          status: "error",
          message: "Failed to fetch token: " + error.message,
        };
      }
    }
  
    const url = "https://apiv2.shiprocket.in/v1/external/orders/cancel";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const data = {
      ids: Array.isArray(ids) ? ids : [ids],
    };
  
    try {
      const response = await axios.post(url, data, { headers });
  
      if (response.data.status === "success") {
        return {
          status: "success",
          message: "Orders canceled successfully.",
        };
      } else {
        return {
          status: "error",
          message: response.data.message || "Failed to cancel orders.",
        };
      }
    } catch (err) {
      console.error("Error canceling orders:", err.response?.data || err.message);
      return {
        status: "error",
        message: err.response?.data?.message || err.message,
      };
    }
  }
  
module.exports = {
    CancelOrder
}  