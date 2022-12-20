const jwt = require("jsonwebtoken");
require('dotenv').config();

const tokenChecker = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) res.status(401).json({ success: false, message: "No token provided." });

    jwt.verify(token, process.env.SUPER_SECRET, (err, decoded) => {
        if (err) res.status(403).json({ success: false, message: "Invalid token" });
        else {
            req.loggedUser = decoded;
            next();
        }
    });
}

module.exports = tokenChecker;