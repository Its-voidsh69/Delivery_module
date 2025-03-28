const axios = require("axios").default;
const generatetoken = require('../auth/generateToken');

async function GeneratePickupRequest({ auth, shipmentId }) {
    if (!auth.email || !auth.password) {
      console.error("Valid auth props are required (email and password).");
      return;
    }
  
    if (!shipmentId) {
      console.error("Shipment ID is required.");
      return;
    }
  
    let token = auth.token;
    if (!token) {
      try {
        token = await Utils.GetToken(auth.email, auth.password);
      } catch (error) {
        console.error("Failed to fetch token:", error.message);
        return;
      }
    }
  
    // Mocking a scenario when AWB is not assigned yet for testing purposes
    const isAWBGenerated = false; // Set to `true` when AWB is generated
  
    if (!isAWBGenerated) {
      console.log("AWB is not assigned. Simulating pickup request...");
  
      // Return a simulated pickup response in the required format
      return {
        pickup_status: 1,
        response: {
          pickup_scheduled_date: "2021-12-10 12:39:54", // Simulated pickup scheduled date
          pickup_token_number: "Reference No: 194_BIGFOOT 1966840_11122021", // Simulated token number
          status: 3,
          others: JSON.stringify({
            tier_id: 5,
            etd_zone: "z_e",
            etd_hours: "{\"assign_to_pick\":6.9,\"pick_to_ship\":22.6,\"ship_to_deliver\":151.4}",
            actual_etd: "2021-12-18 00:36:03",
            routing_code: "S2/S-69/1B/016",
            addition_in_etd: ["deduction_of_6_and_half_hours"],
            shipment_metadata: {
              type: "ship",
              device: "WebKit",
              platform: "desktop",
              client_ip: "94.237.77.195",
              created_at: "2021-12-10 12:36:03",
              request_type: "web",
            },
            templatized_pricing: 0,
            selected_courier_type: "Best in price",
            recommended_courier_data: {
              etd: "Dec 19, 2021",
              price: 153,
              rating: 3.6,
              courier_id: 54,
            },
            recommendation_advance_rule: null,
            dynamic_weight: "1.00",
          }),
          pickup_generated_date: {
            date: "2021-12-10 12:39:54.034695",
            timezone_type: 3,
            timezone: "Asia/Kolkata",
          },
          data: "Pickup is confirmed by Xpressbees 1kg For AWB :- 143254213727423",
        },
      };
    }
  
    const url = "https://apiv2.shiprocket.in/v1/external/courier/generate/pickup";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  
    const data = {
      shipment_id: shipmentId, // The shipment ID for which pickup is being requested
    };
  
    try {
      const response = await axios.post(url, data, { headers });
  
      // Check if the response status is 1 (success)
      if (response.data.status === 1) {
        return {
          pickup_status: 1,
          response: {
            pickup_scheduled_date: response.data.response.pickup_scheduled_date,
            pickup_token_number: response.data.response.pickup_token_number,
            status: response.data.response.status,
            others: response.data.response.others,
            pickup_generated_date: response.data.response.pickup_generated_date,
            data: response.data.response.data,
          },
        };
      } else {
        return {
          status: "error",
          message: response.data.message || "Failed to generate pickup request",
        };
      }
    } catch (err) {
      console.error("Error generating pickup request:", err.response?.data || err.message);
      return {
        status: err.response?.status || "Unknown Error",
        message: err.response?.data?.message || err.message,
      };
    }
  }

module.exports = {
    GeneratePickupRequest
}  