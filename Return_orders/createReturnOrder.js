const axios = require("axios").default;
const generatetoken = require('../auth/generateToken');
const fetch = require('../orders/fetchOrderDetails')

async function createReturnOrderFromExisting(auth, orderId) {
    try {
      const orderDetails = await fetch.fetchOrderDetails(auth, orderId);
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
    createReturnOrderFromExisting
}  