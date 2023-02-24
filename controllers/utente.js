require('dotenv').config();
const Utente = require('../models/utente');
const Post = require('../models/post');
const Commento_Post = require('../models/commento_post');
const Commento_Profilo = require('../models/commento_profilo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const newUtente = async (req, res) => {

    console.log(req.body);
    console.log("Trying to register new user...");

    let utente = await Utente.findOne({ username: req.body.username }).exec();

    const encPsw = await bcrypt.hash(req.body.password, 10);

    if (!utente) {
        const newUtente = new Utente({
            username: req.body.username,
            email: req.body.email,
            password: encPsw,
            icona_profilo: req.body.icona_profilo,
            iconaNSFW: req.body.iconaNSFW,
            banner: req.body.banner,
            bannerNSFW: req.body.bannerNSFW,
            lingua: req.body.lingua,
            isAmministratore: req.body.isAmministratore,
            nsfw: req.body.nsfw,
            nome_tema_selezionato: req.body.nome_tema_selezionato
        });

        const token = jwt.sign({ username: req.body.username }, process.env.TOKEN_KEY, { expiresIn: "15min" });

        // Il cookie dura 15 min, come il token di JWT
        res.cookie('tokenEpiOpera', token, {maxAge: 900000})

        newUtente.save((err, data) => {
            if (err) return res.json({ Error: err });
            return res.json(data);
        });

    } else {
        return res.json({ message: "User already exists", req: req.body });
    }
};

const getUtente = (req, res) => {

    const username = req.body.username_utente;

    const query = { username: username };

    Utente.find(query, (err, utente) => {

        if (err) {
            return res.json({ Error: err });
        } else {
            return res.json(utente);
        }
    });
};

const getUtenti = (req, res) => {

    console.log("Listing all users...");
    
    Utente.find({}, (err, data) => {

        if (err) {
            return res.json({ Error: err });
        } else {
            return res.json(data);
        }
    });
};

const deleteUtente = async (req, res) => {

    const username_utente = req.body.username_utente;
    const username = req.body.username;

    var query = { username: username };
    const utente = await Utente.findOne(query).exec();

    if(!utente.isAmministratore && utente.username != username_utente){
        res.status(401).send("Utente non autorizzato.");
    }

    query = { username: username_utente };
    Utente.deleteMany(query).exec();

    query = { creatore_post: username_utente };
    Post.deleteMany(query).exec();

    query = { creatore_commento: username_utente };
    Commento_Post.deleteMany(query).exec();
    Commento_Profilo.deleteMany(query).exec();

    res.status(200).send("Utente eliminato con successo.");
};

const login = async (req, res) => {

    var username = req.body.username;
    var psw = req.body.password;

    var query = { username: username };

    Utente.findOne(query, (err, data) => {

        if(err) {
            return res.json({ Error: err });
        }

        console.log(data);

        if(bcrypt.compare(psw, data.password)){
            var token = jwt.sign({ username: data.username }, process.env.TOKEN_KEY, { expiresIn: "15m" });
            data.token = token;
            console.log(data.token);
            data.save();
            res.cookie('tokenEpiOpera', token, {maxAge: 900000});
        }

        /*
        data.forEach(async element => {
            if(await bcrypt.compare(psw, element.password)) {
                var token = jwt.sign({ user_id: element.username }, process.env.TOKEN_KEY, { expiresIn: "2h" });
                element.token = token;
                console.log(element.token);
                element.save();
            }
        });
        */

        return res.json(data);
    })
};

module.exports = { newUtente: newUtente, getUtente, getUtenti, deleteUtente, login };