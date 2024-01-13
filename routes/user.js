const express = require("express");

const router = express.Router();
const {register, getUserByEmail, login, grantNewToken} = require('../controller/usercontroller');
const {body} = require('express-validator');
const {RefreshToken} = require('../models/refreshtokenmodel');

router.get('/:id', (req, res) => {
    res.send(req.params.id);
})

router.post('/register', body('email').isEmail().custom(
    async (email) => {
        const user = await getUserByEmail(email)
        if(user)
        return Promise.reject("User already registered")
    }
),
body('password').isLength({min:6, max:14}),
body('username').not().isEmpty(),
register);

router.post('/login', body('email').isEmail().custom(
    async (email) => {
        const user = await getUserByEmail(email)
        if(!user)
        return Promise.reject("Email does not exist.")
    }
),
body('password').isLength({min:6, max:14}),
login);

router.post('/refreshtoken', body('rtoken').custom(async(token)=> {
    await connect()
    const token_details = await RefreshToken.findOne({token: token}).exec()

    if(!token_details) {
        return Promise.reject("Invalid token");
    }
}), grantNewToken)

exports.userrouter = router;