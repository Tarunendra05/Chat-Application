const jwt = require('jsonwebtoken');

exports.authorise = (req, res, next) => {

    if(!req.headers['authorization'])
    return res.status(403).json({errors: "Inculde the bearer token"});

    const header = req.headers['authorization']
    const tokenArray = header.split(" ") //bearer
    const token = tokenArray[1]

    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {

        if(err){
            const erro = err.message;
            return res.status(403).json({errors: erro})
        }

        req.user = {email: decoded.email, uuid: decoded.uuid};
        next()
    });
}