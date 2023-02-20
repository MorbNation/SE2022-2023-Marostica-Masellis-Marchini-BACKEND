const { collection } = require("../models/commento_post");
const Commento_Post = require("../models/commento_post");
const Utente = require("../models/utente");
const Post = require("../models/post");

const newCommento_Post = async (req, res) => {
    console.log(req.body);
    console.log('Trying to add new comment...');

    const newCommento_Post = new Commento_Post({
        id: req.body.id,
        id_post: req.body.id_post,
        data: req.body.data,
        testo: req.body.testo,
        punteggio: 0,
        segnalato: false,
        creatore_commento: req.body.username
    });

    Post.findOne({ id: req.body.id_post }, (err, post) => {
        if (err) {
            return res.json({ Error: err });
        }
        if (post == null) {
            return res.json({ Error: "Nessun post con questo id trovato." });
        }

        console.log(post.numero_commenti);
        post.numero_commenti += 1;
        console.log(post.numero_commenti);

        post.save();

        newCommento_Post.save((err, data) => {
            if (err) return res.json({ Error: err });
            return res.json(data);
        });
    })
};

const getCommento_Post = (req, res) => {
    console.log(req.params);
    let commentAssoc = req.params.id_post;
    var query = { id_post: commentAssoc };
    console.log(`Getting comment with association id ${commentAssoc}...`);

    Commento_Post.find(query, (err, collection) => {
        if (err) {
            throw err;
        } else {
            console.log(`Comment with association id ${commentAssoc} retrieved successfully.`);
            return res.json(collection);
        }
    });
};

const deleteCommento_Post = (req, res) => {
    console.log(req.params);
    let commentId = req.params.id;
    var query = { id: commentId };
    console.log(`Deleting comment with id ${commentId}...`);

    //delete è stupida e a quanto pare non ritorna se la cosa che si prova ad eliminare non esiste, bisognerebbe
    //fare una retireve di support ma chi ha voglia
    Commento_Post.deleteMany(query, (err, collection) => {
        if (err) {
            throw err;
        } else {
            console.log(`Comment with id ${commentId} deleted succesfully.`);
            res.json({ message: "DELETE Comment" });
        }
    });
};

const segnalaCommento_Post = (req, res) => {

    //TODO: CONFERMARE UTENTE CON TOKEN

    commentId = req.params.id;
    var query = { id: commentId };

    console.log(`Flagging comment with id ${commentId}...`);

    Commento_Post.findOne(query, (err,data) => {
        if (err) {
            return res.json({ Error: err });
        }
        
        //data.segnalato = !data.segnalato;
        data.segnalato = true;
        data.save();

        return res.json(data);
    });
}

const valutaCommento_Post = (req, res) => {

    //TODO: CONFERMARE UTENTE CON TOKEN

    const commentId = req.body.id;
    const username = req.body.username;
    const valutazione = req.body.valutazione;
    var query = { id: commentId };

    Commento_Post.findOne(query, (err,data) => {
        if (err) {
            return res.json({ Error: err });
        }
        if (valutazione != -1 && valutazione != 0 && valutazione != 1) {
            return res.json({ Error: "Valutazione non valida."})
        }

        var valutazionePrecedente = data.valutazioni.get(username);
        if (isNaN(valutazionePrecedente)) valutazionePrecedente = 0;

        data.valutazioni.set(username, valutazione);
        const cambioPunteggio = valutazione - valutazionePrecedente;
        data.punteggio_commento += cambioPunteggio

        query = { username: data.creatore_commento };

        Utente.findOne(query, (err, utente) => {
            if (err) {
                return res.json({ Error: err });
            }
            if (utente == null) {
                return res.json({ Error: "Creatore del commento non trovato."})
            }

            utente.userscore += cambioPunteggio;
            
            utente.save();
            data.save();

            return res.json({ Result: "Valutazione effettuata con successo", punteggio_commento: data.punteggio_post});
        })
    })
}

module.exports = { newCommento_Post, getCommento_Post, segnalaCommento_Post, valutaCommento_Post, deleteCommento_Post };