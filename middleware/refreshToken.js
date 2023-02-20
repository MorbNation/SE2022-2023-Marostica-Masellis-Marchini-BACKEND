require('dotenv').config();
const jwt = require('jsonwebtoken');

const refreshToken = (req, res, next) => {
    console.log("Refresh Token invoked");
    
    const token = req.cookies.tokenEpiOpera;

    if (!token){
        return next();
    }

    const newToken = jwt.sign({ username: token.username }, process.env.TOKEN_KEY, { expiresIn: "15min" });
    res.cookie('tokenEpiOpera', newToken, {maxAge: 900000})

    return next();
};

module.exports =  refreshToken;