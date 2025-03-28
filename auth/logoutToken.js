async function Logout(token) {
    try {
      const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
  
      const text = await response.text(); // Read response as text
  
      try {
        return JSON.parse(text); // Try parsing as JSON
      } catch {
        return text; // Return plain text if JSON parsing fails
      }
    } catch (error) {
      console.error("Error during logout:", error);
      return null;
    }
  }
  
module.exports = {
    Logout
}  