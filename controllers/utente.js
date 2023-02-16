const { collection } = require('../models/utente');
const Utente = require('../models/utente');

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
        const newUtente = new Utente({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
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
            token: "Ciao"
        });

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

module.exports = { newUtente: newUtente, getUtente, deleteUtente };