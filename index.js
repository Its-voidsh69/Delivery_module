const axios = require("axios").default;
const Utils = require("./utils");

// Get Order Details by ID
// async function GetOrderDetails({ auth, orderId }) {
//   if (!auth.email || !auth.password) {
//     console.error("Valid auth props are required (email and password).");
//     return {
//       status: "error",
//       message: "Valid auth props are required (email and password).",
//     };
//   }

//   let token = auth.token;
//   if (!token) {
//     try {
//       token = await Utils.GetToken(auth.email, auth.password);
//     } catch (error) {
//       console.error("Failed to fetch token:", error.message);
//       return {
//         status: "error",
//         message: "Failed to fetch token: " + error.message,
//       };
//     }
//   }

//   const url = `https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`;
//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };

//   try {
//     const response = await axios.get(url, { headers });

//     if (response.status === 200) {
//       return {
//         status: "success",
//         data: response.data,
//       };
//     } else {
//       return {
//         status: "error",
//         message: "Failed to fetch order details. HTTP Status: " + response.status,
//       };
//     }
//   } catch (err) {
//     console.error("Error fetching order details:", err.response?.data || err.message);
//     return {
//       status: "error",
//       message: err.response?.data?.message || err.message,
//     };
//   }
// }

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
      token = await Utils.GetToken(auth.email, auth.password);
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

// Function to generate a pickup request


async function exportOrders(auth) {
  if (!auth.token) {
    console.error("Authorization token is required.");
    return;
  }

  const url = "https://apiv2.shiprocket.in/v1/external/orders/export";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth.token}`,
  };

  try {
    const response = await axios.post(url, {}, { headers });

    if (response.status === 200) {
      return {
        status: "success",
        message: "Order export initiated. You will receive an email with the download link.",
        isBackgroundDownloading: response.data.is_background_downloading,
      };
    } else {
      return {
        status: "error",
        message: "Failed to export orders",
      };
    }
  } catch (error) {
    console.error("Error exporting orders:", error.response?.data || error.message);
    return {
      status: "error",
      message: error.response?.data?.message || error.message,
    };
  }
}

// Function to fetch shipment details
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

// Function to get shipment details by shipment_id
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


// Function to get order details using order_id
async function getOrderDetails(auth, orderId) {
  if (!auth.token) {
    console.error("Valid auth token is required.");
    return null;
  }

  const url = `https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth.token}`,
  };

  try {
    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch order details.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching order details:", error.response?.data || error.message);
    return null;
  }
}
async function checkOrderExists(auth, orderId) {
  if (!auth.token) {
    console.error("Valid auth token is required.");
    return null;
  }

  const url = `https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth.token}`,
  };

  try {
    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      // console.log("✅ Order exists:", response.data);
      return response.data;
    } else {
      console.error("❌ Order not found.");
      return null;
    }
  } catch (error) {
    // console.error("❌ Error fetching order:", error.response?.data || error.message);
    return null;
  }
}

async function fetchOrderDetails(auth, orderId) {
  try {
    if (!orderId) {
      throw new Error("Order ID is required.");
    }

    console.log("Fetching order details for orderId:", orderId);
   // console.log("Using token:", auth.token);

    const url = `https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    };

    const response = await axios.get(url, { headers });

    if (response.status >= 200 && response.status < 300) {
      console.log("✅ Order details fetched successfully:");
      return response.data;
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    console.error("❌ Error fetching order details:", error.message, error.response?.data || "");
    throw error;
  }
}

async function createReturnOrderFromExisting(auth, orderId) {
  try {
    const orderDetails = await fetchOrderDetails(auth, orderId);
    console.log("Fetched order details:", JSON.stringify(orderDetails.data, null, 2));

    const orderData = {
      order_id: String(orderDetails.data?.order_id || orderId),
      order_date: orderDetails.data?.order_date || new Date().toISOString().split('T')[0], 
      pickup_customer_name: orderDetails.data?.customer_name || "Default Customer",
      pickup_address: orderDetails.data?.customer_address || "Default Address",
      pickup_city: orderDetails.data?.customer_city || "Kamrup",
      pickup_state: orderDetails.data?.customer_state || "Assam",
      pickup_country: orderDetails.data?.customer_country || "India",
      pickup_pincode: String(parseInt(orderDetails.data?.customer_pincode) || 781015),
      pickup_email: orderDetails.data?.customer_email || "default@example.com",
      pickup_phone: String(orderDetails.data?.customer_phone || "9876543210"),
      
      shipping_customer_name: orderDetails.data?.pickup_customer_name || orderDetails.data?.customer_name || "Default Warehouse",
      shipping_address: orderDetails.data?.pickup_address?.address || orderDetails.data?.pickup_address || "Default Warehouse Address",
      shipping_city: orderDetails.data?.pickup_city || "Kamrup",
      shipping_country: orderDetails.data?.pickup_country || "India",
      shipping_pincode: String(parseInt(orderDetails.data?.pickup_pincode) || 781011),
      shipping_state: orderDetails.data?.pickup_state || "Assam",
      shipping_phone: String(orderDetails.data?.pickup_phone || "7017101772"),
      
      order_items: orderDetails.data?.products?.length > 0
        ? orderDetails.data.products.map(item => ({
            name: item.name || "Default Product",
            sku: item.sku || "DEFAULT-SKU",
            units: Number(item.quantity || 1),
            selling_price: Number(item.selling_price || 1)
          }))
        : [{ name: "Default Product", sku: "DEFAULT-SKU", units: 1, selling_price: 1 }],
      
      payment_method: "Prepaid",
      sub_total: orderDetails.data?.sub_total || orderDetails.data?.products?.reduce((sum, item) => sum + (item.quantity * item.selling_price), 0) || 9000, // Match your items
      length: Number(orderDetails.data?.length || 10),
      breadth: Number(orderDetails.data?.breadth || 15),
      height: Number(orderDetails.data?.height || 20),
      weight: Number(orderDetails.data?.weight || 0.5)
    };

    const requiredFields = [
      'order_id', 'order_date', 'pickup_customer_name', 'pickup_address',
      'pickup_city', 'pickup_state', 'pickup_country', 'pickup_pincode',
      'pickup_email', 'pickup_phone', 'shipping_customer_name',
      'shipping_address', 'shipping_city', 'shipping_country',
      'shipping_pincode', 'shipping_state', 'shipping_phone',
      'order_items', 'payment_method', 'sub_total', 'length',
      'breadth', 'height', 'weight'
    ];

    for (const field of requiredFields) {
      if (!orderData[field] || 
          (typeof orderData[field] === 'string' && orderData[field].trim() === '') || 
          (Array.isArray(orderData[field]) && orderData[field].length === 0)) {
        throw new Error(`Missing or invalid required field: ${field}`);
      }
    }

    const url = 'https://apiv2.shiprocket.in/v1/external/orders/create/return';
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    };

    console.log("Sending orderData to Shiprocket:", JSON.stringify(orderData, null, 2));
    const response = await axios.post(url, orderData, { headers });

    if (response.status === 200 || response.status === 201) {
      console.log("✅ Return order created successfully:", response.data);
      return response.data;
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    console.error("❌ Error creating return order:", error.message, error.response?.status, error.response?.data || "No additional error details");
    throw error;
  }
}

module.exports = {
  GetOrderDetails,
  exportOrders,
  fetchOrderDetails,
  getShipments,
  getShipmentById,
  checkOrderExists,
  getOrderDetails,
  createReturnOrderFromExisting,
 // createExchangeOrder,
};
