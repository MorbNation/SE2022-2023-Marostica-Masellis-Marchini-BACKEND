require('dotenv').config();
const jwt = require('jsonwebtoken');
const token = require('../util/token');

const refreshToken = (req, res, next) => {
    console.log("Refresh Token invoked");
    
    const cookie = req.cookies.tokenEpiOpera;

    if (!cookie){
        return next();
    }

    try{
        const oldToken = jwt.verify(cookie, process.env.TOKEN_KEY);
        token.setCookie(res, { username: oldToken.username });
    } catch (err) {
        return next();
    }

    return next();
};

module.exports =  refreshToken;