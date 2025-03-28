const {
  GetPickupLocations,
  GetOrderDetails,
  exportOrders,
  createReturnOrder,
  fetchOrderDetails,
  getShipments,
  getShipmentById,
  getOrderDetails,
  checkOrderExists,
  createReturnOrderFromExisting,
  // createExchangeOrder
} = require("./index");

const {
  GenerateOrder
} = require("./order_service/generateOrder")
const {
  GetToken,
} = require("./auth/generateToken")
const {
  Logout,
} = require("./auth/logoutToken")
const {
  UpdateOrderAddress,
} = require("./order_service/update_cus_del_add")
const {
  UpdatePickupLocation,
} = require("./order_service/updatePickup_locations")
const {
  CancelOrder,
} = require("./order_service/cancelOrder")
const {
  GenerateAWB,
} = require("./couriers/generate_AWB_for_ship")

const {
  checkCourierServiceability,
} = require("./couriers/check_courier_serviceability")
const {
  GeneratePickupRequest,
} = require("./couriers/request_for_pickup")
const {
  GetAllOrders,
} = require('./orders/getAllorders')

async function testGetToken() {
  try {
    const token = await GetToken({
      email: "sum.itnull@2004",
      password: "Ss@204",
    });
    console.log("Token:", token);
  } catch (error) {
    console.error("Error fetching token:", error.message);
  }
}

async function testPickupLocations() {
  try {
    const auth = {
      email: "sum.itnull@2004",
      password: "Ss@2004",
    };
    const pickupLocations = await GetPickupLocations({ auth });

    console.log("Pickup Locations:", pickupLocations);

    if (!pickupLocations.length) {
      console.log("No pickup locations found for your account.");
      return null;
    }

    const primaryLocation = pickupLocations.find(
      (location) => location.is_primary_location === 1
    );

    if (primaryLocation) {
      console.log("Using Primary Pickup Location:", primaryLocation.pickup_location);
      return primaryLocation.pickup_location;
    } else {
      console.log("No primary pickup location found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching pickup locations:", error.message);
  }
}

async function testGenerateOrder() {
  try {
    const authDetails = {
      email: "sum.itnull@2004",
      password: "Ss@2004",
    };
    const token = await GetToken(authDetails);
    const auth = { ...authDetails, token };

    const pickupLocation = "Home";

    const orderDetails = {
      order_id: `ORDER-${Date.now()}`,
      order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      pickup_location: pickupLocation,
      billing_customer_name: "Naruuuuu",
      billing_last_name: "Uzumaki",
      billing_address: "IT park",
      billing_address_2: "Near Bongora",
      billing_city: "Guwahati",
      billing_pincode: 781015,
      billing_state: "Assam",
      billing_country: "India",
      billing_email: "sum.itvoid00@gmail.com",
      billing_phone: 9876543210,
      shipping_is_billing: true,
      order_items: [
        {
          name: "momomomomo",
          sku: "chakra123",
          units: 10,
          selling_price: 900,
          hsn: 441122,
        },
      ],
      payment_method: "Prepaid",
      shipping_charges: 0,
      sub_total: 900,
      length: 10.5,
      breadth: 15.5,
      height: 20.5,
      weight: 2.5,
    };

    const result = await GenerateOrder({ auth, orderDetails });

    if (result.status === "success") {
      console.log("Order Creation Success:", result);
    } else {
      console.error("Order Creation Failed:", result.message);
    }
  } catch (error) {
    console.error("Error generating order:", error.message);
  }
}

async function testCheckCourierServiceability() {
  try {
    const auth = {
      email: "sum.itnull@2004", 
      password: "Ss@2004",      
    };

    const token = await GetToken(auth);
    const authDetails = { ...auth, token };
    const orderId = "748853394"; 
    //const cod = 1;               
    //const weight = 2.5;        
    //const pickupPostalCode = "781015";
    //const deliveryPostalCode = "781015"; 

    console.log("🚀 Running CheckCourierServiceability Test...");

    const result = await checkCourierServiceability({
      auth: authDetails,
      orderId,
      //cod,
      //weight,
     // pickupPostalCode,
     // deliveryPostalCode,
    });

    if (result) {
      console.log("✅ Courier Serviceability Results:", result);
    } else {
      console.log("No available courier service found.");
    }
  } catch (error) {
    console.error("⚠️ Error checking courier serviceability:", error.message);
  }
}

async function testGenerateAWB() {
  try {
    const authDetails = {
      email: "sum.itnull@2004",
      password: "Ss@2004",
    };
    const token = await GetToken(authDetails);
    const auth = { ...authDetails, token };

    const shipmentId = "733847495"; 
    const courierId = "737321173"; 
    const result = await GenerateAWB({ auth, shipmentId, courierId });

    // Handle if the response contains the predefined structure with awb_assign_status
    if (result.awb_assign_status === 1) {
      console.log("AWB Generation Success:", result.response.data);
    } else {
      console.error("AWB Generation Failed:", result.message);
    }
  } catch (error) {
    console.error("Error generating AWB:", error.message);
  }
}

async function testUpdateOrderAddress() {
  const auth = {
    email: "sum.itnull@gmail.com", // Replace with your actual email
    password: "Ss@2004", // Replace with your actual password
  };

  const addressDetails = {
    order_id: "748259396", // Replace with an actual order ID
    shipping_customer_name: "Sasuke Uchiha",
    shipping_phone: "7017123456",
    shipping_address: "IIITG Boys Hostel",
    shipping_address_2: "", // Optional field
    shipping_city: "Guwahati",
    shipping_state: "Assam",
    shipping_country: "India",
    shipping_pincode: "781015", // Replace with a valid postal code
  };

  try {
    const result = await UpdateOrderAddress({ auth, addressDetails });
    console.log("Update Address Result:", result);
  } catch (error) {
    console.error("Error while testing UpdateOrderAddress:", error.message);
  }
}

async function testCancelOrder() {
  const authDetails = {
    email: "sum.itnull@2004", // Replace with your email
    password: "Ss@2004", // Replace with your password
  };

  try {
    console.log("Testing GetToken...");
    const token = await GetToken(authDetails);
    console.log("Token fetched successfully:", token);

    const auth = { ...authDetails, token };

    console.log("\nTesting CancelOrder...");
    const orderIds = 737220816; // Replace with the actual Shiprocket order ID to cancel
    const result = await CancelOrder({ auth, ids: orderIds });

    if (result.status === "success") {
      console.log("CancelOrder Success:", result.message);
    } else {
      console.error("CancelOrder Failed:", result.message);
    }
  } catch (error) {
    console.error("Error during CancelOrder test:", error.message);
  }
}

// Test GetAllOrders
async function testGetAllOrders() {
  try {
    const auth = {
      email: "sum.itnull@2004", // Replace with your Shiprocket account email
      password: "Ss@2004",       // Replace with your Shiprocket account password
    };

    const token = await GetToken(auth);
    const authWithToken = { ...auth, token };

    const filters = {
      page: 1,
      per_page: 10,
    };

    const result = await GetAllOrders({ auth: authWithToken, filters });

    if (result.status === "success") {
      console.log("Fetched Orders Successfully:", result.data);
    } else {
      console.error("Failed to fetch orders:", result.message);
    }
  } catch (error) {
    console.error("Error testing GetAllOrders:", error.message);
  }
}

async function testGetOrderDetails() {
  try {
    const auth = {
      email: "sum.itnull@2004", // Replace with your Shiprocket account email
      password: "Ss@2004",       // Replace with your Shiprocket account password
    };

    const token = await GetToken(auth);
    const authWithToken = { ...auth, token };

    const orderId = "769058749"; // Replace with the order ID you want to fetch
//     🚀 Return Order Test Result:
//  {
//   order_id: 755779280,
//   shipment_id: 752264096,
//   status: 'RETURN PENDING',
//   status_code: 21,
//   company_name: 'Sumit',
//   company_id: 5446977,
//   is_qc_check: 0
// }

    const result = await GetOrderDetails({ auth: authWithToken, orderId });

    if (result.status === "success") {
      console.log("Fetched Order Details Successfully:", result.data);
    } else {
      console.error("Failed to fetch order details:", result.message);
    }
  } catch (error) {
    console.error("Error testing GetOrderDetails:", error.message);
  }
}  

// testUpdateOrderAddress();

async function testUpdatePickupLocation() {
  try {
    const auth = {
      email: "sum.itnull@2004",
      password: "Ss@2004",       
    };

    const token = await GetToken(auth);
    const authDetails = { ...auth, token };
    const orderIds = "123"; 
    const pickupLocation = "Primary"; // this should exist in shiprocket account

    console.log(" Running UpdatePickupLocation Test...");
    
    const result = await UpdatePickupLocation({ auth: authDetails, orderIds, pickupLocation });

    if (result?.status === "success") {
      console.log(JSON.stringify({ message: "Pickup location Updated" }, null, 2));
      return { message: "Pickup location Updated" };
    } else {
      console.error("Pickup Location Update Failed:", result?.message || "Unknown error");
      return { message: "Pickup location update failed", error: result?.message };
    }
  } catch (error) {
    console.error("Error updating pickup location:", error.message);
    return { message: "Pickup location update failed", error: error.message };
  }
}

async function testGeneratePickupRequest() {
  const auth = {
    email: "sum.itnull@2004",
    password: "Ss@2004",
  };

  const token = await GetToken(auth.email, auth.password);

  const shipmentId = 16091084; 

  try {
    const response = await GeneratePickupRequest({ auth: { ...auth, token }, shipmentId });
    console.log("🚀 GeneratePickupRequest Test Result:", response);
  } catch (error) {
    console.error("❌ Test Failed:", error.message);
  }
}

async function testExportOrders() {
  const auth = {
    email: "sum.itnull@2004",
    password: "Ss@2004",
    token: await GetToken("sum.itnull@2004", "Ss@2004"), // Fetch token dynamically
  };

  try {
    const response = await exportOrders(auth);
    console.log("🚀 Export Orders Test Result:", response);
  } catch (error) {
    console.error("❌ Test Failed:", error.message);
  }
}

async function testGetShipments() {
  const auth = {
    email: "sum.itnull@2004",
    password: "Ss@2004",
    token: await GetToken("sum.itnull@2004", "Ss@2004"), // Fetch token dynamically
  };

  try {
    const response = await getShipments(auth);
    console.log("🚀 Get Shipments Test Result:\n", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("❌ Test Failed:", error.message);
  }
}

async function testGetShipmentById() {
  const auth = {
    email: "sum.itnull@2004",
    password: "Ss@2004",
    token: await GetToken("sum.itnull@2004", "Ss@2004"), // Fetch token dynamically
  };

  const shipment_id = "764484503"; // Replace with a valid shipment ID

  try {
    const response = await getShipmentById(auth, shipment_id);
    console.log("🚀 Get Shipment Test Result:", response);
  } catch (error) {
    console.error("❌ Test Failed:", error.message);
  }
}

async function testCreateReturnOrder() {
  const auth = {
    email: "sum.itnull@2004",
    password: "Ss@2004",
    token: await GetToken("sum.itnull@2004", "Ss@2004"), // Fetch token dynamically
  };
  const orderId = "769058749";
  try {
    // Call the create return order function
   const response = await createReturnOrderFromExisting(auth, orderId);
    
    console.log("🚀 CreateReturnOrder Test Result:", response);
  } catch (error) {
    console.error("❌ Test Failed:", error.message);
  }
}

async function testLogout() {
  const auth = {
    email: "sum.itnull@2004",
    password: "Ss@2004",
    token: await GetToken({ email: "sum.itnull@2004", password: "Ss@2004" }), // Fetch token dynamically
  };

  try {
    // Call the Logout function
    const response = await Logout(auth.token);
    
    console.log("🚀 Logout Test Result:", response);
  } catch (error) {
    console.error("❌ Test Failed:", error.message);
  }
}


(async () => {
    // await testGetToken();
    // await testLogout();
//  await testCancelOrder(); // we can cross check with the update order function since its cancelled so it shouldn't update.
  //  await testPickupLocations();                       //      not working
    //  await testGenerateOrder();
    //  await testCheckCourierServiceability();               
  //  await testGenerateAWB();
 await testGetAllOrders();
//  await testUpdateOrderAddress();
  // await testGetOrderDetails(); // working as expected
  //  await testUpdatePickupLocation();
  //  await testGeneratePickupRequest();
 // await testExportOrders();     // this will create the csv file of all the user in the report section under tool
    //  await testGetShipments();
    // await testGetShipmentById();
    //  await testCreateReturnOrder(); // working finally
})();

// Order Creation Success: {
//   status: 'success',
//   message: 'Order Created Successfully',
//   order_id: 769058749,
//   shipment_id: 765524663
// }
