const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authorise = (req, res, next) => {

    if(!req.headers['authorization']) {
        return req.status(403).json({errors: "inculde the bearer token"});
    }

    const header = req.headers['authorization'];
    const tokenArray = header.split(" "); //bearer
    const token = tokenArray[1];
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    jwt.verify(token, {secretKey}, function(err, decoded) {

        if(err) {
            return res.status(403).json({errors: "Unauthorised !"});
        }

        req.user = {email: decoded.email, uuid: decoded.uuid};
        next();
    });
} 