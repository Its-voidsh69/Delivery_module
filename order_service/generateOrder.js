const axios = require("axios").default;
const generatetoken = require('../auth/generateToken');

async function GenerateOrder({ auth, orderDetails }) {
    if (!auth.email || !auth.password) {
      console.error("Valid auth props are required (email and password).");
      return;
    }
  
    if (!orderDetails) {
      console.error("Order details are required.");
      return;
    }
  
    let token = auth.token;
    if (!token) {
      try {
        token = await generatetoken.GetToken(auth.email, auth.password);
      } catch (error) {
        console.error("Failed to fetch token:", error.message);
        return;
      }
    }
  
    const url = "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const response = await axios.post(url, orderDetails, { headers });
  
      if (response.data.status_code === 1) {
        return {
          status: "success",
          message: "Order Created Successfully",
          order_id: response.data.order_id,
          shipment_id: response.data.shipment_id,
        };
      } else {
        return {
          status: "error",
          message: response.data.message || "Failed to create the order",
        };
      }
    } catch (err) {
      console.error("Error occurred:", err.response?.data || err.message);
      return {
        status: err.response?.status || "Unknown Error",
        message: err.response?.data?.message || err.message,
      };
    }
  }

module.exports = {
    GenerateOrder
}  