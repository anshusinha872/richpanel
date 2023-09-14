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

const getAllConversations = async (req,res) => {
  try{
    console.log('req.body',req.body);
    const pageId = req.body.id;
    const accessToken = req.body.access_token;
    const pageName = req.body.name;
    
    const url = `https://graph.facebook.com/v11.0/${pageId}/conversations?platform=messenger&access_token=${accessToken}`;
    const response = await axios.get(url);
    const conversations = response.data.data;
    console.log('conversations',conversations);
    for(let i=0;i<conversations.length;i++){
        let conversation = conversations[i];
        let messageIdUrl = `https://graph.facebook.com/v11.0/${conversation.id}?fields=messages&access_token=${accessToken}`;
        let messageIdResponse = await axios.get(messageIdUrl);
        console.log('messageIdResponse',messageIdResponse.data.messages.data);
        for(let j=0;j<messageIdResponse.data.messages.data.length;j++){
            let message = messageIdResponse.data.messages.data[j];
            let messageUrl = `https://graph.facebook.com/v11.0/${message.id}?fields=message,from,created_time&access_token=${accessToken}`;
            let messageResponse = await axios.get(messageUrl);
            console.log('messageResponse',messageResponse.data);
        }
    }
    return resultdb(200, conversations, null);
  }
  catch(err){
    console.log(err);
    return resultdb(500, null, err);
  }
};
const getAllMessages = async (req,res) => {
    try{
        console.log('req.body',req.body);
        const conversationId = req.body.conversationId;
        const access_token = req.body.access_token;
        const url = `https://graph.facebook.com/v11.0/${conversationId}?fields=messages&access_token=${access_token}`;
        const response = await axios.get(url);
        const messagesId = response.data.messages.data;
        console.log('messagesId',messagesId);
        let messages = [];
        for(let i=0;i<messagesId.length;i++){
            let messageUrl = `https://graph.facebook.com/v11.0/${messagesId[i].id}?fields=message,from,created_time&access_token=${access_token}`;
            let messageResponse = await axios.get(messageUrl);
            messages.push(messageResponse.data);
            // console.log('messageResponse',messageResponse.data);
        }
        return resultdb(200, messages, null);
    }
    catch(err){
        console.log(err);
        return resultdb(500, null, err);
    }
};
module.exports = {
    getAllConversations,
    getAllMessages
};
