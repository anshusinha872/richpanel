const mysql = require("mysql");
const axios = require('axios');
const SALT_WORK_FACTOR = 10;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const secretKey = "AnshuSinha";
const { v4: uuidv4 } = require("uuid");
const pool = require("../../config/dbConfig");
const fs = require('fs');
const path = require('path');
const resultdb = (statusCode, data = null, error = null) => {
  return {
    statusCode: statusCode,
    data: data,
    error: error,
  };
};
function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}
// const uuid = require("uuid");

const authenticate = async (req,res) => {
  try{
    console.log(req.body);
    const userID = req.body.authResponse.userID;
    const accessToken = req.body.authResponse.accessToken;
    console.log(userID, accessToken);
    console.log(userID, accessToken);
    const url = `https://graph.facebook.com/${userID}/accounts?fields=name,access_token&access_token=${accessToken}`;
    const user_auth_url = `https://graph.facebook.com/v8.0/me?access_token=${accessToken}`;
    const user_auth_response = await axios.get(user_auth_url);
    console.log('user_auth_response',user_auth_response.data);
    const user_auth_data = user_auth_response.data;
    const response = await axios.get(url);
    let pages = response.data.data;
    console.log('pages',pages);
    let returnData = {
      user:user_auth_response.data,
      pages: pages,
    }
    // console.log(response);
    return resultdb(200, returnData, null);
  }
  catch(err){
    console.log(err);
    return resultdb(500, null, err);
  }
};
module.exports = {
    authenticate,
};
