const express = require("express");

const router = express.Router();
const {register, getUserByEmail, login} = require('../controller/usercontroller');
const {body} = require('express-validator');

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

exports.userrouter = router;