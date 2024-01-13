const {connect} = require("../connections");
const {User} = require("../models/usermodel");
const bcrypt = require("bcrypt");
const {v4} = require("uuid");
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const {RefreshToken} = require('../models/refreshtokenmodel');

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

    const token = generateToken({email: user.email, uuid: user.uuid})
    const rtoken = await generateRefreshToken({email: user.email, uuid: user.uuid})
    res.cookie('access_token', token, {
        expires: new Date(Date.now() + process.env.ACCESS_TOKEN_EXPIRY * 1000),
        httpOnly: true
    })

    res.cookie('refresh_token', token, {
        expires: new Date(Date.now() + process.env.REFRESH_TOKEN_EXPIRY * 365 * 24 * 3600000),
        httpOnly: true
    })

    res.send({user: exposeUserDetails(user), token: token, refresh_Token: rtoken})
}

async function login(req, res) {
    const email = req.body.email,
    password = req.body.password

    const errors = validationResult(req)
    if(!errors.isEmpty())
    return res.status(400).json({errors: errors.array()})

    
    const user = await getUserByEmail(email)
    const match = await bcrypt.compare(password, user.password)
    if(match){
        const token = generateToken({email: user.email, uuid: user.uuid})
        const rtoken = await generateRefreshToken({email: user.email, uuid: user.uuid})
        res.cookie('access_token', token, {
            expires: new Date(Date.now() + process.env.ACCESS_TOKEN_EXPIRY * 1000),
            httpOnly: true
        })

        res.cookie('refresh_token', token, {
            expires: new Date(Date.now() + process.env.REFRESH_TOKEN_EXPIRY * 365 * 24 * 3600000),
            httpOnly: true
        })

        res.send({user: exposeUserDetails(user), token: token, refresh_Token: rtoken})
    }
    else
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
    return jwt.sign(user, process.env.SECRET_KEY, {expiresIn:'30s'})
}

async function generateRefreshToken(user) {
    const rt = jwt.sign(user, process.env.REFRESH_SECRET_KEY, {expiresIn:'1y'})
    const refreshToken = new RefreshToken({token: rt})
    await refreshToken.save()
    return rt;
}

function grantNewToken(req, res) {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(403).json({errors: errors})
    }
    const token = req.body.rtoken

    jwt.verify(token, process.env.REFRESH_SECRET_KEY, function(err, decoded) {

        if(err){
            return res.status(403).json({errors: "Unauthorized !"})
        }

        const token = generateToken({email: decoded.email, uuid: decoded.uuid})

        res.cookie('token', token, {
            expires: new Date(Date.now() + process.env.ACCESS_TOKEN_EXPIRY * 1000),
            httpOnly: true
        })

        res.send({token: token})
    });
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
exports.grantNewToken = grantNewToken