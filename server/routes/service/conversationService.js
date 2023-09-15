const mysql = require("mysql");
const axios = require("axios");
const SALT_WORK_FACTOR = 10;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const secretKey = "AnshuSinha";
const { v4: uuidv4 } = require("uuid");
const pool = require("../../config/dbConfig");
const fs = require("fs");
const path = require("path");
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

const getAllConversations = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const pageId = req.body.id;
    const accessToken = req.body.access_token;
    // const pageName = req.body.name;
    const selectQuery = `SELECT sender_id, MAX(id) AS max_id FROM messages GROUP BY sender_id;`;
    const response = await pool.query(selectQuery);
    console.log("response", response);
    let conversations = [];
    for (let i = 0; i < response.length; i++) {
      let profileurl = `https://graph.facebook.com/v11.0/${response[i].sender_id}?fields=first_name,last_name,profile_pic,email&access_token=${accessToken}`;
      let profileresponse = await axios.get(profileurl);
      console.log("profileresponse", profileresponse);
      const messageQuery = `SELECT * FROM messages WHERE sender_id = ?;`;
      const messageResponse = await pool.query(messageQuery, [
        response[i].sender_id,
      ]);
      console.log("messageResponse", messageResponse);
      let conversation = {
        id: response[i].sender_id,
        name:
          profileresponse.data.first_name +
          " " +
          profileresponse.data.last_name,
          first_name:profileresponse.data.first_name,
          last_name:profileresponse.data.last_name,
        profile_pic: profileresponse.data.profile_pic,
        message: messageResponse,
      };
      conversations.push(conversation);
    }
    console.log("conversations", conversations);
    return resultdb(200, conversations, null);
  } catch (err) {
    console.log(err);
    return resultdb(500, null, err);
  }
};
const getAllMessages = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const conversationId = req.body.conversationId;
    const access_token = req.body.access_token;
    const url = `https://graph.facebook.com/v11.0/${conversationId}?fields=messages&access_token=${access_token}`;
    const response = await axios.get(url);
    const messagesId = response.data.messages.data;
    console.log("messagesId", messagesId);
    let messages = [];
    for (let i = 0; i < messagesId.length; i++) {
      let messageUrl = `https://graph.facebook.com/v11.0/${messagesId[i].id}?fields=message,from,created_time&access_token=${access_token}`;
      let messageResponse = await axios.get(messageUrl);
      messages.push(messageResponse.data);
      // console.log('messageResponse',messageResponse.data);
    }
    messages.sort((a, b) => {
      const timeA = new Date(a.created_time).getTime();
      const timeB = new Date(b.created_time).getTime();
      return timeA - timeB;
    });
    return resultdb(200, messages, null);
  } catch (err) {
    console.log(err);
    return resultdb(500, null, err);
  }
};
const reponseMessage = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const senderId = req.body.senderId;
    const access_token = req.body.access_token;
    const pageId = req.body.pageId;
    const messageText = req.body.message;
    // const messageData = {
    //   recipient: {
    //     id: senderId,
    //   },
    //   messaging_type: "RESPONSE",
    //   message: {
    //     text: messageText,
    //   },
    // };
    const apiVersion = "v13.0"; // Replace with the desired API version
    const apiUrl = `https://graph.facebook.com/${apiVersion}/${pageId}/messages?recipient={'id':'${senderId}'}&messaging_type=RESPONSE&message={'text':'${messageText}'}&access_token=${access_token}`;

    const response = await axios.post(apiUrl);
    console.log("response", response);
    console.log("response.data", response.data);
    const time = new Date().getTime();
    const insertQuery = "INSERT INTO messages ( sender_id, recipient_id, time_of_message, message) VALUES (?, ?, ?, ?)";
    let insertResponse = await pool.query(insertQuery, [response.data.recipient_id, response.data.recipient_id, time, messageText]);
    if(insertResponse.affectedRows > 0){
      return resultdb(200, null, "Message inserted successfully");
    }
    else{
      return resultdb(400, null, "Message insertion failed");
    }
    return resultdb(200, response.data, null);
  } catch (err) {
    console.log(err);
    return resultdb(500, null, err);
  }
};
module.exports = {
  getAllConversations,
  getAllMessages,
  reponseMessage,
};
