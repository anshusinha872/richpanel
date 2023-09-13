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
const uuid = require("uuid");

const loginUser = async (req) => {
  // try {
  //   console.log("loginUser");
  //   console.log(req.body);
  //   let email = req.body.email;
  //   let password = req.body.password;
  //   let rememberMe = req.body.rememberMe;
  //   const query = "SELECT * FROM users WHERE email = ?;";
  //   const response = await pool.query(query, [email]);
  //   var profileImageBase64 = '';
  //   console.log(response);
  //   if(response.length == 0){
  //     return resultdb(400, null, "Invalid Email Id");
  //   }
  //   if(response[0].profileImg=='assets/images/user/user.png'){
  //       profileImageBase64 = '';
  //   }
  //   else{
  //     // const filePath = path.join(__dirname, '../../uploads/profileImage', `${response[0].uuid}.png`);
  //     const file = fs.readFileSync(response[0].profileImg);
  //     profileImageBase64 = Buffer.from(file).toString('base64');
  //     profileImageBase64 = `data:image/png;base64,${profileImageBase64}`;
  //   }
  //   //check for email verification
  //   if (response[0].status == "pending") {
  //     ourSecretKey = (Math.random() + 1).toString(36).substring(7);

  //     const token = jwt.sign(
  //       {
  //         data: "Token Data",
  //       },
  //       ourSecretKey,
  //       { expiresIn: "10m" }
  //     );
  //     subject = "Vefify your Email";
  //     link = `https://invoicecraft.co.in/api/v1/verify/${email}/${ourSecretKey}/${token}`;
  //     firstName = response[0].firstName;
  //     emailService.sendVerificationEmail(email, firstName, subject, link, -1);
  //     return resultdb(
  //       400,
  //       null,
  //       "Please check your email for verification link"
  //     );
  //   }

  //   if (response.length > 0) {
  //     let isValidPassword = bcrypt.compareSync(password, response[0].password);
  //     if (isValidPassword) {
  //       // GET company uid
  //       let companyUid = await getCompanyUid(response[0].uuid);
  //       let expiresIn = rememberMe ? "7 days" : "30 minutes"; // Set token expiration based on rememberMe value
  //       let rememberToken = uuid.v4(); // Generate a random UUID as the remember token
  //       if (rememberMe) {
  //         await storeRememberTokenInDB(response[0].uuid, rememberToken); // Store the remember token in the database
  //       }
  //       let userData = {
  //         // uuid: response[0].uuid,
  //         uuid: companyUid,
  //         rememberToken: rememberMe ? rememberToken : null,
  //       };
  //       let empty = {};
  //       let token = jwt.sign(userData, secretKey, { expiresIn });
  //       let tempToken = jwt.sign(empty, secretKey, { expiresIn });
  //       console.log(tempToken);
  //       const query1 = "UPDATE users SET tempToken = ? where email=?;";
  //       const response1 = await pool.query(query1, [tempToken, email]);
  //       let returnData = {
  //         token: token,
  //         // uuid: response[0].uuid,
  //         uuid: companyUid,
  //         firstName: response[0].firstName,
  //         lastName: response[0].lastName,
  //         email: response[0].email,
  //         phone: response[0].phone,
  //         profileImg: profileImageBase64,
  //         user_id: response[0].uuid,
  //         company_id: companyUid,
  //         rememberToken: rememberMe ? rememberToken : null,
  //         tempToken: tempToken,
  //       };
  //       const query2 =
  //         "INSERT into userToken (user_uid, company_uid, tempToken) values (?,?,?);";
  //       const response2 = await pool.query(query2, [
  //         response[0].uuid,
  //         companyUid,
  //         tempToken,
  //       ]);
  //       return resultdb(200, returnData);
  //     } else {
  //       return resultdb(400, null, "Invalid Password");
  //     }
  //   } else {
  //     return resultdb(400, null, "Invalid Email Id");
  //   }
  // } catch (err) {
  //   console.log(err);
  //   return resultdb(500, null, err);
  // }
};
const registerUser = async (req) => {
  // try {
  //   let firstName = req.body.firstName;
  //   let lastName = req.body.lastName ? req.body.lastName : "";
  //   let companyName = req.body.companyName;
  //   let email = req.body.email;
  //   let phone = 8292009935;
  //   let password = req.body.password;
  //   if (!firstName || !companyName || !email || !password) {
  //     return resultdb(400, null, "Missing required fields");
  //   }
  //   const uuid = uuidv4();
  //   const genSalt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  //   const hash = await bcrypt.hash(password, genSalt);
  //   const selectQuery = "SELECT * FROM users WHERE email = ?;";
  //   const queryResponse = await pool.query(selectQuery, [email]);
  //   // console.log(queryResponse);
  //   if (queryResponse.length > 0) {
  //     return resultdb(400, null, "Email already exists");
  //   }

  //   const insertQuery =
  //     "INSERT INTO users (uuid, firstName, lastName, email, phone, password, apiToken, rememberToken, createdAt) VALUES (?,?,?,?,?,?,?,?,?)";

  //   const insertCompanyQuery =
  //     "INSERT INTO companies (uuid, name, ownerUuid,createdAt) VALUES (?,?,?,?)";
  //   // Use transactions to handle duplicate UUID scenarios

  //   // await connection.beginTransaction();

  //   try {
  //     await pool.query(insertQuery, [
  //       uuid,
  //       firstName,
  //       lastName,
  //       email,
  //       phone,
  //       hash,
  //       null,
  //       null,
  //       new Date(),
  //     ]);
  //     await pool.query(insertCompanyQuery, [
  //       uuidv4(),
  //       companyName,
  //       uuid,
  //       new Date(),
  //     ]);
  //     return resultdb(200, "User created successfully");
  //   } catch (err) {
  //     if (err.code === "ER_DUP_ENTRY") {
  //       console.log("Duplicate UUID detected, retrying...");
  //       // If duplicate UUID, generate a new UUID and retry insert
  //       const newUuid = uuidv4();

  //       await pool.query(insertQuery, [
  //         newUuid,
  //         firstName,
  //         lastName,
  //         email,
  //         phone,
  //         hash,
  //         null,
  //         null,
  //         new Date(),
  //       ]);
  //       await pool.query(insertCompanyQuery, [
  //         uuidv4(),
  //         companyName,
  //         newUuid,
  //         new Date(),
  //       ]);
  //       return resultdb(200, "User created successfully");
  //     } else {
  //       throw err; // Throw error for other unexpected errors
  //     }
  //   }
  // } catch (err) {
  //   console.log(err);
  //   return resultdb(500, null, err);
  // } finally {
  // }
};
module.exports = {
  loginUser,
  registerUser,
};
