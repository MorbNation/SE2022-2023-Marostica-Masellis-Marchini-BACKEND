require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log("Verify Token invoked");
    
    const token = req.cookies.tokenEpiOpera;
    console.log(token);

    if (!token) return res.status(401).send("Login non effettuato.");

    try{
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        console.log(decoded);
        req.body.username = decoded.username;
    } catch (err) {
        return res.status(401).send("Invalid token");
    }
    return next();
};

module.exports = verifyToken;