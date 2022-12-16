const User = require('../models/user');

const newUser = (req, res) => {
    console.log(req.body);
    console.log("Trying to register new user...");
    User.findOne({ title: req.body.usernane }, (err, data) => {
        if (!data) {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                psw: req.body.psw,
                description: "Write a description here.",
                proIcon: "placeholder icon path",
                nsfwIconFlag: req.body.nsfwIconFlag,
                banner: "placeholder banner path",
                nsfwBannerFlag: req.body.nsfwBannerFlag,
                userscore: 0,
                lingua: req.body.lingua,
                isAdmin: false,
                nsfwSetting: req.body.nsfwSetting,
                theme: "black",
                followed_users: req.body.followed_users,
                favourites: req.body.favourites,
                timer: 0,
                token: "Ciao"
            });

            newUser.save((err, data) => {
                if (err) return res.json({ Error: err });
                return res.json(data);
            });
        } else {
            if (err) return res.json(`Something went wrong. ${err}`);
            return res.json({ message: "User already exists." })
        }
    });
};

module.exports = { newUser };