const express = require('express');
const router = express.Router();
// const userService = require('../service/userService');
const accountService = require('../service/accountService');
const jwt = require('jsonwebtoken');

async function authenticate(req, res) {
	try {
		// console.log('authenticate');
		let returnData = await accountService.authenticate(req);
		return res.status(200).json(returnData);
	} catch (err) {
		console.log(err);
	}
}

router.post('/accounts/authenticate', authenticate);
module.exports = router;
