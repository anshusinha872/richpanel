const express = require('express');
const router = express.Router();
// const accountService = require('../service/accountService');
const conversationService = require('../service/conversationService');
const jwt = require('jsonwebtoken');

async function getAllConversations(req, res) {
	try {
		// console.log('authenticate');
		let returnData = await conversationService.getAllConversations(req);
		return res.status(200).json(returnData);
	} catch (err) {
		console.log(err);
	}
}
async function getAllMessages(req, res) {
    try {
        let returnData = await conversationService.getAllMessages(req);
        return res.status(200).json(returnData);
    } catch (err) {
        console.log(err);
    }
}
async function reponseMessage(req, res) {
    try {
        let returnData = await conversationService.reponseMessage(req);
        return res.status(200).json(returnData);
    } catch (err) {
        console.log(err);
    }
}
router.post('/conversation/getAll', getAllConversations);
router.post('/conversation/getAllMessages', getAllMessages);
router.post('/conversation/reponseMessage', reponseMessage);
module.exports = router;
