// Models
const Utente = require('../models/utente');
const Post = require('../models/post');
const Commento_Post = require('../models/commento_post');
const Commento_Profilo = require('../models/commento_profilo');

// Dependencies
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const tokenManager = require('../util/token');
const textRequirements = require('../util/textRequirements');

//Post a new user
const newUtente = async (req, res) => {

    console.log("Trying to register new user...");

    // Tries to find a user with the same username
    let utente = await Utente.findOne({ username: req.body.username }).exec();

    // Enrcypts password
    const encPsw = await bcrypt.hash(req.body.password, 10);

    // Checks password validity
    if (!textRequirements.checkMail(req.body.email)) {
        return res.status(400).json({ Error: `La mail usata per la registrazione deve essere del dominio unitn.it` });
    }
    if (!textRequirements.checkUsername(req.body.username)) {
        return res.status(400).json({ Error: `L'username deve essere almeno lungo 3 caratteri e non deve contenere i caratteri "@" e "#"` });
    }
    if (!textRequirements.checkPassword(req.body.password)) {
        return res.status(400).json({ Error: `La password deve avere almeno una maiuscola, minuscola, numero, carattere speciale ed essere almeno 12 caratteri` });
    }

    // If no user with the given username is found it creates one
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

        // Attaches cookie to response
        const token = tokenManager.setCookie(res, { username: req.body.username });

        // New user is saved to the database
        newUtente.save((err, data) => {
            if (err) return res.status(500).send();
            return res.status(201).json({ username: req.body.username, token: token });
        });

    } else {
        // Returns an error if the user already exists
        return res.status(409).json({ Error: "Utente già esistente." });
    }
};

// Get a user by its username
const getUtente = (req, res) => {

    const username = req.params.user;

    const query = { username: username };

    // Tries to find the user
    Utente.find(query, (err, utente) => {

        // If no user is found returns an error
        if (utente.length <= 0) {
            return res.status(404).json({ Error: "L'utente non esiste." })
        }

        if (err) {
            return res.status(500).json({ Error: "Errore interno al server" });
        } else {
            // Returns the body of the user
            return res.status(200).json(utente);
        }
    });
};

// Get all users
const getUtenti = (req, res) => {

    console.log("Listing all users...");
    
    // Retireves all users
    Utente.find({}, (err, data) => {

        if (err) {
            return res.status(500).send();
        } else {
            var usernames = [];
            data.forEach(user => {
                usernames.push(user.username);
            });

            // Returns an array with all users
            return res.status(200).json({ Utenti: usernames });
        }
    });
};

// Adds a user id to this user's following list
const seguiUtente = async (req, res) => {

    const username = req.body.username;
    const utenteDaSeguire = req.body.utenteDaSeguire;

    // Tries to find the user to be followed
    const query = { username: utenteDaSeguire };
    var utente = await Utente.findOne(query).exec();

    // If no user is found returns an error
    if (!utente) return res.status(404).json({ Error: "Utente da seguire non trovato." });

    utente = await Utente.findOne({ username: username }).exec();

    // If the user isn't already followed it adds it to the user's following list else it removes from the following list
    if (!utente.utenti_seguiti.includes(utenteDaSeguire)) utente.utenti_seguiti.push(utenteDaSeguire);
    else utente.utenti_seguiti = utente.utenti_seguiti.filter(entry => entry != utenteDaSeguire);

    utente.save();

    // Returns a boolean telling if the user is now following the user to be followed
    return res.status(200).json({ IsFollowing: utente.utenti_seguiti.includes(utenteDaSeguire) });
}

// Delete user from the database
const deleteUtente = async (req, res) => {

    const username_utente = req.params.user;
    const username = req.body.username;

    // Tries to find the user
    var query = { username: username };
    const utente = await Utente.findOne(query).exec();

    // Check if the deleting user it either admin or the user itself else returns an error
    if(!utente.isAmministratore && utente.username != username_utente){
        console.log(utente.username + " " + username_utente);
        res.status(401).json({ Error: "Utente non autorizzato." });
    }

    // Deletes the user itself
    query = { username: username_utente };
    Utente.deleteMany(query).exec();

    // Cascade deletes all posts by the user
    query = { creatore_post: username_utente };
    Post.deleteMany(query).exec();

    // Cascade deletes all commenst by the user
    query = { creatore_commento: username_utente };
    Commento_Post.deleteMany(query).exec();
    Commento_Profilo.deleteMany(query).exec();

    res.status(200).send();
};

// Generates a login token for a user
const login = async (req, res) => {

    var username = req.body.username;
    var psw = req.body.password;

    var query = { username: username };

    // Tries to find a user by the username
    Utente.findOne(query, (err, utente) => {

        if(err) {
            return res.status(500).send();
        }

        console.log(utente);

        // If no user is found returns an error
        if(!utente) {
            return res.status(404).json({ Error: "Utente non trovato." });
        }

        // Compares passwords with the bcryptjs dependency
        bcrypt.compare(psw, utente.password, (err, result) => {

            // If password correct generates a token and attaches it to the response
            if(result){
                token = tokenManager.setCookie(res, { username: utente.username });
                // Returns the token and the username
                return res.status(200).json({ token: token, username: username });
            }

            // If wrong password returns an error
            return res.status(401).json({ Error: "Password sbagliata." });
        })
    })
};

// Logs out
const logout = async (req, res) => {

    // Clears the cookie
    res.clearCookie('tokenEpiOpera');

    return res.status(200).send();
}

// Edit a user's email address
const modificaMail = async (req, res) => {

    const username = req.body.username;
    const email = req.body.email;

    // Checks the validity of the mail else returns an error
    if (!textRequirements.checkMail(email)) {
        return res.status(400).json({ Error: `La mail usata deve essere del dominio unitn.it` });
    }

    // Tries to find the user and updates accordingly
    const query = { username: username };
    const utente = await Utente.findOneAndUpdate(query, { email: email }).exec();

    //Returns the new email address
    res.status(200).json({ email: email });
}

// Edit a user's password
const modificaPassword = async (req, res) => {

    // Checks password validity else returns an error
    if (!textRequirements.checkPassword(req.body.newPassword)) {
        return res.status(400).json({ Error: `La password deve avere almeno una maiuscola, minuscola, numero, carattere speciale ed essere almeno 12 caratteri` });
    }

    // Encrypts password
    const username = req.body.username;
    //const encPsw =  await bcrypt.hash(req.body.password, 10);
    const newPassword = await bcrypt.hash(req.body.newPassword, 10);

    // Tries to find a user by its username
    const query = { username: username };
    const utente = await Utente.findOne(query).exec();

    //if (utente.password != encPsw){
    //     res.status(401).send("Password sbagliata.")
    //}

    // Saves new password to the database
    utente.password = newPassword;
    utente.save();

    return res.status(200).send();
}

// Edit a user's NSFW property
const modificaNSFW = async (req, res) => {

    const username = req.body.username;
    const nsfw = req.body.nsfw;

    // Checks inputted setting validity
    if (nsfw != "no" && nsfw != "blur" && nsfw != "yes"){
        return res.status(400).json({ Error: "NSFW non valido." });
    }

    // Tries to find the user by its username and updates accordingly
    const query = { username: username };
    const utente = await Utente.findOneAndUpdate(query, { nsfw: nsfw }).exec();

    // Returns the new setting
    return res.status(200).json({ nsfw: nsfw });
}

// Edit a user's language property
const cambiaLingua = async (req, res) => {

    const username = req.body.username;
    const lingua = req.body.lingua;

    // Checks inputted setting validity
    if (lingua != "italiano" && lingua != "inglese"){
        return res.status(400).json({ Error: "Lingua non valida." });
    }

    // Tries to find the user by its username and updates accordingly
    const query = { username: username };
    const utente = await Utente.findOneAndUpdate(query, { lingua: lingua }).exec();

    // Returns the new setting
    return res.status(200).json({ lingua: lingua });
}

module.exports = { newUtente: newUtente, getUtente, getUtenti, seguiUtente, deleteUtente, login, logout, modificaMail, modificaPassword, modificaNSFW, cambiaLingua };