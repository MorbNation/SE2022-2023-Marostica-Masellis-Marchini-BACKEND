require('dotenv').config();
const jwt = require('jsonwebtoken');

const refreshToken = (req, res, next) => {
    console.log("Refresh Token invoked");
    
    const cookie = req.cookies.tokenEpiOpera;

    if (!cookie){
        return next();
    }

    try{
        const token = jwt.verify(cookie, process.env.TOKEN_KEY);
        console.log(token.username);
        const newToken = jwt.sign({ username: token.username }, process.env.TOKEN_KEY, { expiresIn: "15min" });
        res.cookie('tokenEpiOpera', newToken, {maxAge: 900000})
        console.log(newToken);
    } catch (err) {
        return next();
    }

    return next();
};

module.exports =  refreshToken;