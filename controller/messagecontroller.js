const {connect} = require("../connections");
// const {User} = require("../models/usermodel");
const {Message} = require("../models/messagemodel");
const {v4} = require("uuid");
const {validationResult} = require('express-validator');


async function sendMessage(req, res) {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    await connect();

    const message = new Message({
        uuid: v4(), 
        sender: req.user.uuid,
        reciever: req.boyd.rec_id,
        content: req.body.text,
    })

    await message.save();

    res.send("Send message route");
}

async function getAllMessage(req, res) {

    const message = await Message.find({reciever: req.params.reciever_id});
    res.send(message);
}

async function deleteMessage(req, res) {
    await Message.deleteOne({uuid: req.body.uuid})
    res.send("Message deleted successfully!");
}

async function getMessageWithUUID(req, res) {
    await connect();
    return await Message.findOne({uuid : uuid}).exec();
}

exports.sendMessage = sendMessage;
exports.getAllMessage = getAllMessage;
exports.deleteMessage = deleteMessage;