const axios = require("axios").default;
const generatetoken = require('../auth/generateToken');

async function UpdatePickupLocation({ auth, orderIds, pickupLocation }) {
    if (!auth.token) {
      console.error("⚠️ Token is missing.");
      return { status: "error", message: "Token is required." };
    }
  
    const url = "https://apiv2.shiprocket.in/v1/external/orders/address/pickup";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    };
  
    // Ensure order_id is an array (even if passing a single order ID)
    const data = { 
      order_id: [String(orderIds)],  // Convert to array of strings
      pickup_location: pickupLocation 
    };
  
    console.log("📌 Sending Request to Shiprocket:");
    console.log("🔹 URL:", url);
    console.log("🔹 Headers:", JSON.stringify(headers, null, 2));
    console.log("🔹 Data:", JSON.stringify(data, null, 2));
  
    try {
      const response = await axios.patch(url, data, { headers });
  
      console.log("✅ API Response:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ API Error Response:", JSON.stringify(err.response?.data, null, 2) || err.message);
      return { status: "error", message: err.response?.data?.message || err.message };
    }
  }
  
module.exports = {
    UpdatePickupLocation
}  