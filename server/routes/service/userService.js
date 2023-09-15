const mysql = require("mysql");
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

const loginUser = async (req) => {
  try{
    console.log(req.body);
    let { email, password, remember } = req.body;
    let query = "SELECT * FROM users WHERE email = ?;";
    let response = await pool.query(query, [email]);
    if(response.length > 0){
      const match = await bcrypt.compare(password, response[0].password);
      if(match){
        const token = jwt.sign(
          {
            id: response[0].id,
            name: response[0].name,
            email: response[0].email,
            remember: remember,
          },
          secretKey,
          { expiresIn: "1h" }
        );
        return resultdb(200, token, "Login successful");
      }
      else{
        return resultdb(400, null, "Incorrect password");
      }
    }
    else{
      return resultdb(400, null, "Email Id does not exist");
    }
  }
  catch(err){
    console.log(err);
    return resultdb(500, null, err);
  }
};
const registerUser = async (req) => {
  try{
    let { name, email, password, remember } = req.body;
    let query = "SELECT * FROM users WHERE email = ?;";
    let response = await pool.query(query, [email]);
    if(response.length > 0){
      return resultdb(400, null, "Email Id already exists");
    }
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(password, salt);
    query = "INSERT INTO users (name, email, password,remember) VALUES (?, ?, ?, ?)";
    let insertResponse = await pool.query(query, [name, email, hash, remember]);
    if(insertResponse.affectedRows > 0){
      return resultdb(200, null, "User registered successfully");
    }
    else{
      return resultdb(400, null, "User registration failed");
    }
  }
  catch(err){
    console.log(err);
    return resultdb(500, null, err);
  }
};
const reponseMessage = async (req) => {
  try{
    console.log('webhook');
	  console.log(req.body);
	  console.log(req.body.entry[0].messaging);
    const pageId = req.body.entry[0].id;
    const senderId = req.body.entry[0].messaging[0].sender.id;
    const recipientId = req.body.entry[0].messaging[0].recipient.id;
    const timeOfMessage = req.body.entry[0].messaging[0].timestamp;
    const message = req.body.entry[0].messaging[0].message.text;
    const messageId = message.mid;
    // const messageText = message.text;
    // const messageAttachments = message.attachments;
    // const accessToken = req.body.access_token;
    // const pageName = req.body.name;
    // const url = `https://graph.facebook.com/v11.0/${senderId}?fields=first_name,last_name,profile_pic&access_token=${accessToken}`;
    // const response = await axios.get(url);
    // const sender = response.data;
    // console.log("sender", sender);
    // const messageData = {
    //   recipient: {
    // }
    const insertQuery = "INSERT INTO messages ( sender_id, recipient_id, time_of_message, message) VALUES (?, ?, ?, ?)";
    let insertResponse = await pool.query(insertQuery, [senderId, recipientId, timeOfMessage, message]);
    if(insertResponse.affectedRows > 0){
      return resultdb(200, null, "Message inserted successfully");
    }
    else{
      return resultdb(400, null, "Message insertion failed");
    }

  }
  catch(err){
    console.log(err);
    return resultdb(500, null, err);
  }
}
module.exports = {
  loginUser,
  registerUser,
  reponseMessage
};
