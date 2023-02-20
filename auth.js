require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log("Verify Token invoked");
    
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) return res.status(403).send("A token is required for authentication");

    try{
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.body.username = decoded.user_id;
    } catch (err) {
        return res.status(401).send("Invalid token");
    }
    return next();
};

module.exports =  verifyToken;