// Token creation tool

require('dotenv').config();
const jwt = require('jsonwebtoken');

// Generates a new cookie
const setCookie = (res, data) => {
    // Generates a new token starting from data and attaches it to the response
    const token = jwt.sign(data, process.env.TOKEN_KEY, { expiresIn: "15min" });
    res.cookie('tokenEpiOpera', token, {
        maxAge: 900000,
        sameSite: 'strict'
    });
    return token;
} 

module.exports = { setCookie };