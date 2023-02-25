require('dotenv').config();
const jwt = require('jsonwebtoken');

const setCookie = (res, data) => {
    const token = jwt.sign(data, process.env.TOKEN_KEY, { expiresIn: "15min" });
    res.cookie('tokenEpiOpera', token, {maxAge: 900000})
} 

module.exports = { setCookie };