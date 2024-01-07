const {connect} = require("../connections");
// const {User} = require("../models/usermodel");
const {Message} = require("../models/messagemodel");
const {v4} = require("uuid");
const {validationResult} = require('express-validator');


async function sendMessage(req, res) {

    const errors = validationResult(req);
    if(!errors.isEmpty())
    return res.status(400).json({errors: errors.array()});

    await connect()

    const message = new Message({
        uuid: v4(), 
        sender: req.user.uuid,
        receiver: req.body.rec_id,
        content: req.body.text,
    })

    await message.save()

    res.send("Send message route");
}

async function getAllMessage(req, res) {

    const messages = await Message.find({receiver: req.params.receiver_id});
    res.send(messages);
}

async function deleteMessage(req, res) {
    await Message.deleteOne({uuid: req.body.uuid})
    res.send("Message deleted successfully!");
}

async function getMessageByUUID(uuid) {
    await connect()
    return await Message.findOne({uuid : uuid}).exec();
}

exports.sendMessage = sendMessage;
exports.getAllMessage = getAllMessage;
exports.deleteMessage = deleteMessage;
exports.getMessageByUUID = getMessageByUUID;