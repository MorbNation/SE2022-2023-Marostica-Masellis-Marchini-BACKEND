// Middleware used everytime an acction is made by a user, refreshes the user's token prolonging the user's session

require('dotenv').config();
const jwt = require('jsonwebtoken');
const tokenManager = require('../util/token');

// Refreshes the user's token
const refreshToken = (req, res, next) => {
    console.log("Refresh Token invoked");
    
    // Extracts the token from the request
    const cookie = req.cookies.tokenEpiOpera;

    // If no cookie is present nothing happens
    if (!cookie){
        return next();
    }

    try{
        // Checks validity of the old token
        const oldToken = jwt.verify(cookie, process.env.TOKEN_KEY);
        // Attaches new token to the response
        tokenManager.setCookie(res, { username: oldToken.username });
    } catch (err) {
        // If an error occurs skip forward
        return next();
    }

    return next();
};

module.exports =  refreshToken;