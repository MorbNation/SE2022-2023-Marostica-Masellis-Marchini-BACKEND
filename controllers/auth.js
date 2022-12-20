const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = async (req, res) => {
    let user = await User.findOne({ email: req.body.email }).exec();

    if (!user) {
        console.log("User not found.");
        res.json({ success: false, message: "Authentication failed, user not found" });
    }

    if (user.password != req.body.password) {
        res.json({ success: false, message: "Authentication failed, wrong password" });
    }

    var payload = {
        email: user.email, id: user._id
    };

    var options = {
        expiresIn: 86400
    };

    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    res.json({
        success: true,
        message: "Authentication successful, enjoy your token!",
        token: token,
        email: user.email,
        id: user._id
    });
};

module.exports = { generateToken };