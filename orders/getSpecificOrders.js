const axios = require("axios").default;
const generatetoken = require('../auth/generateToken');

async function GetOrderDetails({ auth, orderId }) {
    // Validate auth props
    if (!auth.email || !auth.password) {
      console.error("Valid auth props are required (email and password).");
      return {
        status: "error",
        message: "Valid auth props are required (email and password).",
      };
    }
  
    let token = auth.token;
    if (!token) {
      try {
        token = await generatetoken.GetToken(auth.email, auth.password);
        console.log("✅ Token fetched successfully:", token.slice(0, 10) + "...");
      } catch (error) {
        console.error("Failed to fetch token:", error.message);
        return {
          status: "error",
          message: "Failed to fetch token: " + error.message,
        };
      }
    }
  
    const url = `https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const response = await axios.get(url, { headers });
  
      if (response.status === 200) {
        const orderData = response.data.data;
  
        // Explicitly log and extract product details for debugging
        console.log("✅ Order Details Fetched:");
        console.log("🔹 Order ID:", orderData.id);
        console.log("🔹 Customer:", orderData.customer_name);
        console.log("🔹 Products:", JSON.stringify(orderData.products, null, 2));
        console.log("🔹 Order Items:", JSON.stringify(orderData.others?.order_items || [], null, 2));
  
        return {
          status: "success",
          data: orderData,
          products: orderData.products || [], // Ensure products are explicitly returned
          orderItems: orderData.others?.order_items || [], // Include order_items if available
        };
      } else {
        console.error("Unexpected status code:", response.status);
        return {
          status: "error",
          message: "Failed to fetch order details. HTTP Status: " + response.status,
        };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      console.error("Error fetching order details:", errorMsg);
      return {
        status: "error",
        message: errorMsg,
      };
    }
  }
 
module.exports = {
    GetOrderDetails
}  