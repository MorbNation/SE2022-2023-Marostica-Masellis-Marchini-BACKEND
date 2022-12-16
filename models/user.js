const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    psw: String,
    description: String,
    proIcon: String, //placeholder for media
    nsfwIconFlag: Boolean,
    banner: String, //placeholder for media
    nsfwBannerFlag: Boolean,
    userscore: Number,
    lingua: { type: String, enum: ["italiano", "inglese"] },
    isAdmin: Boolean,
    nsfwSetting: { type: String, enum: ["no", "blur", "yes"] },
    theme: String,
    followed_users: [String], //forse dovremmo mettere una lista di User
    favourites: [String],
    timer: Number,
    token: String
});

const User = mongoose.model('User', UserSchema);
module.exports = User;