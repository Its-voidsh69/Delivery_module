const axios = require("axios").default;
const generatetoken = require('../auth/generateToken');

async function UpdateOrderAddress({ auth, addressDetails }) {
    if (!auth.email || !auth.password) {
      console.error("Valid auth props are required (email and password).");
      return {
        status: "error",
        message: "Valid auth props are required (email and password).",
      };
    }
  
    const {
      order_id,
      shipping_customer_name,
      shipping_phone,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_country,
      shipping_pincode,
    } = addressDetails;
  
    if (
      !order_id ||
      !shipping_customer_name ||
      !shipping_phone ||
      !shipping_address ||
      !shipping_city ||
      !shipping_state ||
      !shipping_country ||
      !shipping_pincode
    ) {
      console.error("Missing required fields for updating order address.");
      return {
        status: "error",
        message: "Missing required fields for updating order address.",
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
  
    const url = "https://apiv2.shiprocket.in/v1/external/orders/address/update";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const response = await axios.post(url, addressDetails, { headers });
  
      if (response.status === 200 || response.status === 201 || response.status === 202) {
        return {
          status: "success",
          message: "Order address update accepted for processing.",
        };
      } else {
        return {
          status: "error",
          message: `Failed to update order address. HTTP Status: ${response.status}`,
        };
      }
    } catch (err) {
      console.error("Error updating order address:", err.response?.data || err.message);
      return {
        status: "error",
        message: err.response?.data?.message || err.message,
      };
    }
  }

module.exports = {
    UpdateOrderAddress
}  