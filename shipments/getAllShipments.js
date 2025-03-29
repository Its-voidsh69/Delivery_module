const axios = require("axios").default;
const generatetoken = require('../auth/generateToken');

async function getShipments(auth) {
    if (!auth.token) {
      console.error("Valid auth token is required.");
      return {
        status: "error",
        message: "Valid auth token is required.",
      };
    }
  
    const url = "https://apiv2.shiprocket.in/v1/external/shipments";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    };
  
    try {
      const response = await axios.get(url, { headers });
  
      if (response.status === 200) {
        return {
          status: "success",
          data: response.data,
        };
      } else {
        return {
          status: "error",
          message: "Failed to fetch shipments.",
        };
      }
    } catch (error) {
      console.error("Error fetching shipments:", error.response?.data || error.message);
      return {
        status: "error",
        message: error.response?.data?.message || error.message,
      };
    }
  }

module.exports = {
    getShipments
}  