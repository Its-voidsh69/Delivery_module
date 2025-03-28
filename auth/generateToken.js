const axios = require("axios").default;
const Utils = require("../utils");

async function GetToken({ email, password }) {
    const token = await Utils.GetToken(email, password);
    return token;
  }

module.exports = {
    GetToken
}  