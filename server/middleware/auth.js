//Middleware required to verify a jwt token, called before many APIs are executed

require('dotenv').config();
const jwt = require('jsonwebtoken');

// Verifys the received token
const verifyToken = (req, res, next) => {
    console.log("Verify Token invoked");
    
    // Extracts the cookie from the request
    const token = req.cookies.tokenEpiOpera;

    // If the token is not present returns an error
    if (!token) return res.status(401).send("Login non effettuato.");

    try{
        // Tries to decode the token with JWT and extracts the username of the token's owner
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        console.log(decoded);
        req.body.username = decoded.username;
    } catch (err) {
        // If the token is invalid returns an error
        return res.status(401).send("Invalid token");
    }
    return next();
};

module.exports = verifyToken;