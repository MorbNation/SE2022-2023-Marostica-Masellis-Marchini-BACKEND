require('dotenv').config();
const jwt = require('jsonwebtoken');
const tokenManager = require('../util/token');

const refreshToken = (req, res, next) => {
    console.log("Refresh Token invoked");
    
    const cookie = req.cookies.tokenEpiOpera;

    if (!cookie){
        return next();
    }

    try{
        const oldToken = jwt.verify(cookie, process.env.TOKEN_KEY);
        tokenManager.setCookie(res, { username: oldToken.username });
    } catch (err) {
        return next();
    }

    return next();
};

module.exports =  refreshToken;