const User = require('../models/utente');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = async (req, res) => {
    await console.log(req.body);

    const user = await User.findOne({ email: req.body.email }).exec();

    await console.log(user);

    if (!user) {
        console.log("User not found.");
        res.json({ success: false, message: "Authentication failed, user not found" });
    }

    if (user.psw != req.body.psw) {
        res.json({ success: false, message: "Authentication failed, wrong password" });
    }

    var payload = {
        email: user.email, id: user._id
    };

    var options = {
        expiresIn: 86400
    };

    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    //Non so se queste due cose sono necessarie, non explained
    user.token = token;
    await user.save();

    res.json({
        success: true,
        message: "Authentication successful, enjoy your token!",
        token: token,
        email: user.email,
        id: user._id
    });
};

module.exports = { generateToken };