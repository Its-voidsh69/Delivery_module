const axios = require("axios").default;
const generatetoken = require('../auth/generateToken');

async function getShipmentById(auth, shipment_id) {
    try {
      if (!shipment_id) {
        throw new Error("Shipment ID is required.");
      }
  
      const url = `https://apiv2.shiprocket.in/v1/external/shipments/${shipment_id}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      };
  
      const response = await axios.get(url, { headers });
  
      if (response.status === 200) {
        console.log("✅ Shipment details fetched successfully:", response.data);
        // return response.data;
      } else {
        throw new Error("Failed to fetch shipment details.");
      }
    } catch (error) {
      console.error("❌ Error fetching shipment details:", error.message);
      throw error;
    }
  }
  
module.exports = {
    getShipmentById
}  