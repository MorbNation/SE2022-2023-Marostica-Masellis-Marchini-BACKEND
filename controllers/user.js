const { collection } = require('../models/user');
const User = require('../models/user');

const newUser = async (req, res) => {
    console.log(req.body);
    console.log("Trying to register new user...");
    // User.findOne({ where: { "username": req.body.username } }, (err, data) => {
    //     if (!data) {
    //         const newUser = new User({
    //             username: req.body.username,
    //             email: req.body.email,
    //             psw: req.body.psw,
    //             description: "Write a description here.",
    //             proIcon: "placeholder icon path",
    //             nsfwIconFlag: req.body.nsfwIconFlag,
    //             banner: "placeholder banner path",
    //             nsfwBannerFlag: req.body.nsfwBannerFlag,
    //             userscore: 0,
    //             lingua: req.body.lingua,
    //             isAdmin: false,
    //             nsfwSetting: req.body.nsfwSetting,
    //             theme: "black",
    //             followed_users: req.body.followed_users,
    //             favourites: req.body.favourites,
    //             timer: 0,
    //             token: "Ciao"
    //         });

    //         newUser.save((err, data) => {
    //             if (err) return res.json({ Error: err });
    //             return res.json(data);
    //         });
    //     } else {
    //         if (err) return res.json(`Something went wrong. ${err}`);
    //         return res.json({ message: "User already exists.", req: req.body })
    //     }
    // });

    let user = await User.findOne({ username: req.body.username }).exec();

    if (!user) {
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
        return res.json({ message: "User already exists", req: req.body });
    }
};

const getUser = (req, res) => {
    console.log("Listing all users...");
    User.find({}, (err, data) => {
        if (err) {
            return res.json({ Error: err });
        } else {
            return res.json(data);
        }
    });
};

const deleteUser = (req, res) => {
    console.log(req.params);
    let userName = req.params.username;
    var query = { username: userName };
    console.log(`Deleting user ${userName}`);

    User.deleteOne(query, (err, collection) => {
        if (err) {
            throw err;
        } else {
            console.log(`User ${userName} deleted succesfully.`);
            res.json({ message: "DELETE User" });
        }
    });
};

module.exports = { newUser, getUser, deleteUser };