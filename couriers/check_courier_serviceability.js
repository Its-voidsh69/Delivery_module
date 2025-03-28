const axios = require("axios").default;
const generatetoken = require('../auth/generateToken');

async function checkCourierServiceability({ auth, orderId, cod, weight, pickupPostalCode, deliveryPostalCode }) { // either provide the order id or other params
    if (!auth.token) {
      console.error("Token is missing.");
      return { status: "error", message: "Token is required." };
    }
  
    const url = "https://apiv2.shiprocket.in/v1/external/courier/serviceability/";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    };
  
    // Prepare parameters (either order_id or cod + weight is required)
    const params = {
      order_id: orderId, // Optional: only if order ID is available
      //cod: cod,          // Optional: required if order_id is not provided
      //weight: weight,    // Optional: required if order_id is not provided
      //pickup_postcode: pickupPostalCode,
      //delivery_postcode: deliveryPostalCode,
    };
  
    //console.log("📌 Sending Request to Shiprocket:");
   // console.log("🔹 URL:", url);
   // console.log("🔹 Headers:", JSON.stringify(headers, null, 2));
   // console.log("🔹 Parameters:", JSON.stringify(params, null, 2));
  
    try {
      const response = await axios.get(url, { headers, params });
  
    //  console.log("✅ API Response:", JSON.stringify(response.data, null, 2));
  
      // Return the relevant data, e.g., available courier companies
      return response.data.data.available_courier_companies;
  
    } catch (err) {
    //  console.error("❌ API Error Response:", JSON.stringify(err.response?.data, null, 2) || err.message);
      return { status: "error", message: err.response?.data?.message || err.message };
    }
  }

module.exports = {
    checkCourierServiceability
}  