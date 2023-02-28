require('dotenv').config();
const Utente = require('../models/utente');
const Post = require('../models/post');
const Commento_Post = require('../models/commento_post');
const Commento_Profilo = require('../models/commento_profilo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const tokenManager = require('../util/token');
const textRequirements = require('../util/textRequirements');

const newUtente = async (req, res) => {

    console.log(req.body);
    console.log("Trying to register new user...");

    let utente = await Utente.findOne({ username: req.body.username }).exec();

    const encPsw = await bcrypt.hash(req.body.password, 10);

    if (!textRequirements.checkMail(req.body.email)) {
        return res.status(400).send(`La mail usata per la registrazione deve essere del dominio unitn.it`);
    }
    if (!textRequirements.checkUsername(req.body.username)) {
        return res.status(400).send(`L'username deve essere almeno lungo 3 caratteri e non deve contenere i caratteri "@" e "#"`);
    }
    if (!textRequirements.checkPassword(req.body.password)) {
        return res.status(400).send(`La password deve avere almeno una maiuscola, minuscola, numero, carattere speciale ed essere almeno 12 caratteri`);
    }

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

        tokenManager.setCookie(res, { username: req.body.username });

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

const seguiUtente = async (req, res) => {

    const username = req.body.username;
    const utenteDaSeguire = req.body.utenteDaSeguire;

    const query = { username: username };
    var utente = await Utente.findOne(query).exec();

    if (!utente) return res.status(404).send("Utente da seguire non trovato.");

    if (!utente.utenti_seguiti.includes(utenteDaSeguire)) utente.utenti_seguiti.push(utenteDaSeguire);
    else utente.utenti_seguiti = utente.utenti_seguiti.filter(entry => entry != utenteDaSeguire);

    utente.save();

    return res.status(200).send("Utente seguito correttamente.");
}

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

    Utente.findOne(query, (err, utente) => {

        if(err) {
            return res.json({ Error: err });
        }

        console.log(utente);

        if(!utente) {
            return res.status(404).send("Utente non trovato.");
        }

        bcrypt.compare(psw, utente.password, (err, result) => {
            if(result){
                tokenManager.setCookie(res, { username: utente.username });
                return res.status(200).send("Login effettuato con successo.");
            }

            return res.status(401).send("Password sbagliata.")
        })
    })
};

const logout = async (req, res) => {

    res.clearCookie('tokenEpiOpera');

    return res.status(200).send("Logout effettuato con successo.");
}

const modificaMail = async (req, res) => {

    const username = req.body.username;
    const email = req.body.email;

    const query = { username: username };
    const utente = await Utente.findOneAndUpdate(query, { email: email }).exec();

    res.status(200).send("Mail cambiata con sucesso.");
}

const modificaPassword = async (req, res) => {

    const username = req.body.username;
    //const encPsw =  await bcrypt.hash(req.body.password, 10);
    const newPassword = await bcrypt.hash(req.body.newPassword, 10);

    const query = { username: username };
    const utente = await Utente.findOne(query).exec();

    //if (utente.password != encPsw){
    //     res.status(401).send("Password sbagliata.")
    //}

    utente.password = newPassword;
    utente.save();

    return res.status(200).send("Password cambiata con successo.");
}

const modificaNSFW = async (req, res) => {

    const username = req.body.username;
    const nsfw = req.body.nsfw;

    if (nsfw != "no" && nsfw != "blur" && nsfw != "yes"){
        return res.status(400).send("NSFW non valido.");
    }

    const query = { username: username };
    const utente = await Utente.findOneAndUpdate(query, { nsfw: nsfw }).exec();

    return res.status(200).send("NSFW cambiato con successo.");
}

const cambiaLingua = async (req, res) => {

    const username = req.body.username;
    const lingua = req.body.lingua;

    if (lingua != "italiano" && lingua != "inglese"){
        return res.status(400).send("Lingua non valida.");
    }

    const query = { username: username };
    const utente = await Utente.findOneAndUpdate(query, { lingua: lingua }).exec();

    return res.status(200).send("Lingua cambiata con successo.");
}

module.exports = { newUtente: newUtente, getUtente, getUtenti, seguiUtente, deleteUtente, login, logout, modificaMail, modificaPassword, modificaNSFW, cambiaLingua };