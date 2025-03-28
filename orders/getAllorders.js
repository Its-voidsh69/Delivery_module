const axios = require("axios").default;
const generatetoken = require('../auth/generateToken');
// Get All Orders
async function GetAllOrders({ auth, filters = {} }) {
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
    } catch (error) {
      console.error("Failed to fetch token:", error.message);
      return {
        status: "error",
        message: "Failed to fetch token: " + error.message,
      };
    }
  }

  const url = "https://apiv2.shiprocket.in/v1/external/orders";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.get(url, { headers, params: filters });

    if (response.status === 200) {
      return {
        status: "success",
        data: response.data,
      };
    } else {
      return {
        status: "error",
        message: "Failed to fetch orders. HTTP Status: " + response.status,
      };
    }
  } catch (err) {
    console.error("Error fetching all orders:", err.response?.data || err.message);
    return {
      status: "error",
      message: err.response?.data?.message || err.message,
    };
  }
}

module.exports = {
    GetAllOrders
}