require('dotenv').config();
const { collection } = require('../models/utente');
const Utente = require('../models/utente');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const newUtente = async (req, res) => {
    console.log(req.body);
    console.log("Trying to register new user...");

    //I don't know why, I don't want to know why but for some reason mongodb will not return a valid body to compare
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

    let utente = await Utente.findOne({ username: req.body.username }).exec();

    if (!utente) {

        const encPsw = await bcrypt.hash(req.body.password, 10);

        const newUtente = new Utente({
            username: req.body.username,
            email: req.body.email,
            password: encPsw,
            descrizione: "Write a description here.",
            icona_profilo: "placeholder icon path",
            iconaNSFW: req.body.iconaNSFW,
            banner: "placeholder banner path",
            bannerNSFW: req.body.bannerNSFW,
            userscore: 0,
            lingua: req.body.lingua,
            isAmministratore: false,
            nsfw: req.body.nsfw,
            nome_tema_selezionato: "black",
            utenti_seguiti: req.body.utenti_seguiti,
            post_favoriti: req.body.post_favoriti,
            timer: 0,
        });

        const token = jwt.sign({ user_id: req.body.username }, process.env.TOKEN_KEY, { expiresIn: "2h" });

        newUtente.token = token;

        newUtente.save((err, data) => {
            if (err) return res.json({ Error: err });
            return res.json(data);
        });

    } else {
        return res.json({ message: "User already exists", req: req.body });
    }
};

const getUtente = (req, res) => {
    console.log("Listing all users...");
    Utente.find({}, (err, data) => {
        if (err) {
            return res.json({ Error: err });
        } else {
            return res.json(data);
        }
    });
};

const deleteUtente = (req, res) => {

    // TODO: REWORKARE LA LOGICA PER IL TOKEN

    console.log(req.params);
    let userName = req.params.username;
    var query = { username: userName };
    console.log(`Deleting user ${userName}`);

    Utente.deleteMany(query, (err, collection) => {
        if (err) {
            throw err;
        } else {
            console.log(`User ${userName} deleted succesfully.`);
            res.json({ message: "DELETE User" });
        }
    });
};

const login = async (req, res) => {

    var username = req.body.username;
    var psw = req.body.password;

    var query = { username: username };

    Utente.find(query, (err, data) => {
        if(err) {
            return res.json({ Error: err });
        }

        console.log(data);

        data.forEach(async element => {
            if(await bcrypt.compare(psw, element.password)) {
                element.token = jwt.sign({ user_id: element.username }, process.env.TOKEN_KEY, { expiresIn: "2h" });
                console.log(element.token);
                element.save();
            }
        });

        return res.json(data);
    })
};

module.exports = { newUtente: newUtente, getUtente, deleteUtente, login };