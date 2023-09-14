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
  }
  catch(err){
    console.log(err);
    return resultdb(500, null, err);
  }
};
module.exports = {
    authenticate,
};
