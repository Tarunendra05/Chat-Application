const {connect} = require("../connections");
const {User} = require("../models/usermodel");
const bcrypt = require("bcrypt");
const {v4} = require("uuid");
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

async function register(req, res) {

    const errors = validationResult(req)

    if(!errors.isEmpty())
    return res.status(400).json({errors: errors.array()})

    await connect()

    const email = req.body.email;
    password = req.body.password;
    username = req.body.username;

    const user = new User({
        email : email,
        password : bcrypt.hashSync(password, 10),
        username: username,
        uuid : v4()
    })

    await user.save()

    const token = generateToken({email: user.email, uid: user.uid})

    res.send({user: exposeUserDetails(user), token: token})
}

async function login(req, res) {
    const email = req.body.email,
    password = req.body.password

    const errors = validationResult(req)
    if(!errors.isEmpty())
    return res.status(400).json({errors: errors.array()})

    await connect()
    
    const user = await getUserByEmail(email)
    const match = await bcrypt.compare(password, user.password)
    if(match){
        const token = generateToken({email: user.email, uuid: user.uuid})
        res.send({user: exposeUserDetails(user), token: token})
    } else
    return res.status(403).json({errors: "Incorrect credentials"});
}

async function getUserByEmail(email) {
    await connect()
    return User.findOne({email: email}).exec()
}

async function getUserByUUID(uuid) {
    await connect()
    return User.findOne({uuid: uuid}).exec()
}

function generateToken(user) {
    return jwt.sign(user, process.env.REACT_APP_SECRET_KEY, {expiresIn: "1h"})
}

function exposeUserDetails(user) {
    return {
        email: user.email,
        username: user.username,
        contacts: user.contacts,
        uuid: user.uuid
    }
}

exports.register = register
exports.getUserByEmail = getUserByEmail
exports.login = login
exports.getUserByUUID = getUserByUUID