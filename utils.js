const axios = require("axios").default;

const GetToken = async (email, password) => {
  const url = "https://apiv2.shiprocket.in/v1/external/auth/login";

  const myHeaders = {
    "Content-Type": "application/json",
  };

  const raw = JSON.stringify({ // main connection of the token is here only while testing u can pass any email id.
    email: "sum.itnull@gmail.com",
    password: "Ss@2004",
  });

  const requestOptions = {
    method: "POST",
    url,
    headers: myHeaders,
    data: raw,
    redirect: "follow",
  };

  try {
    const response = await axios(requestOptions);
        const token = response.data.token 
        return token

  } catch (err) {
    console.log(err);  
}

};

module.exports = { GetToken };
