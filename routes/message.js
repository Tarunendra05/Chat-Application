const express = require('express');
const {sendMessage, getAllMessage, deleteMessage, getMessageByUUID} = require('../controller/messagecontroller');
const {getUserByUUID} = require('../controller/usercontroller');
const {body} = require('express-validator');

const router = express.Router();

router.get('/:receiver_id', getAllMessage);

router.post('/send', body('text').not().isEmpty().escape().trim(), body('rec_id').custom(async(uuid)=> {
    const user = await getUserByUUID(uuid);

    if(!user) {
        return Promise.reject("User not found");
    }
}), sendMessage);

router.post('/delete', body('message_id').custom(async(uuid)=> {
    const message = await getMessageByUUID(uuid);

    if(!message) {
        return Promise.reject("Message not found");
    }
}), deleteMessage);

exports.messagerouter = router;