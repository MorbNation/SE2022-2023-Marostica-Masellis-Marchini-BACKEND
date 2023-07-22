const { collection } = require("../models/commento_post");
const Commento_Post = require("../models/commento_post");
const Utente = require("../models/utente");
const Post = require("../models/post");
const { v4: uuidv4 } = require('uuid');

const newCommento_Post = async (req, res) => {

    console.log(req.body);
    console.log('Trying to add new comment...');

    const newCommento_Post = new Commento_Post({
        id: uuidv4(),
        id_post: req.body.id_post,
        data: Date.now(),
        testo: req.body.testo,
        creatore_commento: req.body.username
    });

    Post.findOne({ id: req.body.id_post }, (err, post) => {

        if (err) {
            return res.status(500).send();
        }

        console.log(post.numero_commenti);
        post.numero_commenti += 1;
        console.log(post.numero_commenti);

        post.save();

        newCommento_Post.save((err, data) => {
            if (err) return res.status(500).send();
            return res.status(200).json({ Id: newCommento_Post.id });
        });
    })
};

const getCommento_Post = (req, res) => {

    const commentAssoc = req.params.id;
    const query = { id: commentAssoc };

    console.log(`Getting comment with association id ${commentAssoc}...`);

    Commento_Post.findOne(query, (err, commento) => {

        if (err) {
            return res.status(500).send();
        }
        if (!commento) {
            return res.status(404).json({ Error: "Commento non trovato." })
        }

        console.log(`Comment with association id ${commentAssoc} retrieved successfully.`);
        return res.status(200).json(commento);
    });
};

const getCommenti_Post = (req, res) => {

    const postId = req.params.id_post;

    Commento_Post.find({ id_post: postId }, (err, data) => {

        if (err) {
            return res.status(500).send();
        }

        const retval = [];

        data.forEach(element => {
            retval.push(element.id);
        });

        return res.status(200).json(retval);
    });
};

const deleteCommento_Post = (req, res) => {

    const commentId = req.body.id;

    console.log(`Deleting comment with id ${commentId}...`);

    const username = req.body.username;
    const query = { username: username };

    Utente.findOne(query, (err, utente) => {

        if (err){
            throw err
        } else {
            const query = { id: commentId };

            Commento_Post.findOne(query, (err, commento) => {

                if (err){
                    throw err
                } else {
                    // Se l'utente che fa la richiesta non é né l'autore del commento né un amministratore, esce dalla funzione
                    if(!utente.isAmministratore && utente.username != commento.creatore_commento){
                        return res.status(401).json({ Error: "Utente non autorizzato." });
                    }
                    
                    Commento_Post.deleteOne(query, (err, data) => {

                        if (err){
                            throw err
                        } else {
                            console.log(`Comment with id ${commentId} deleted succesfully.`);

                            utente.userscore -= commento.punteggio_commento;
                            utente.save();

                            Post.findOne({ id: commento.id_post }, (err, post) => {

                                if (err) {
                                    console.log(err);
                                }
                                post.numero_commenti -= 1;
                                post.save();
                            })

                            return res.status(200).send();
                        }
                    })
                }
            })
        }
    })
};

const segnalaCommento_Post = (req, res) => {

    commentId = req.body.id;
    var query = { id: commentId };

    console.log(`Flagging comment with id ${commentId}...`);

    Commento_Post.findOne(query, (err,data) => {

        if (err) {
            return res.status(500).send();
        }

        if (!data) {
            return res.status(404).json({ Error: "Il commento non esiste." })
        }
        
        //data.segnalato = !data.segnalato;
        data.segnalato = true;
        data.save();

        return res.status(200).send();
    });
}

const modificaCommento_Post = (req, res) => {
    
    const commentId = req.body.id;
    const testo = req.body.testo;
    const username = req.body.username;

    var query = { id: commentId };

    Commento_Post.findOne(query, (err, commento) => {
        
        if (err) {
            return res.status(500).send();
        }

        query = { username: username };

        Utente.findOne(query, (err, utente) => {

            if (err) {
                return res.status(500).send();
            }
    
            if(!utente.isAmministratore && utente.username != commento.creatore_commento){
                return res.status(401).json({ Error: "Utente non autorizzato." });
            }

            commento.testo = testo;
            commento.save();

            return res.status(200).send();
        })
    })
}

const valutaCommento_Post = (req, res) => {

    const commentId = req.body.id;
    const username = req.body.username;
    const valutazione = req.body.valutazione;
    var query = { id: commentId };

    Commento_Post.findOne(query, (err,data) => {

        if (err) {
            return res.status(500).send();
        }

        if (!data) {
            return res.status(404).json({ Error: "Commento non trovato."});
        }

        if (valutazione != -1 && valutazione != 0 && valutazione != 1) {
            return res.status(400).json({ Error: "Valutazione non valida."});
        }

        var valutazionePrecedente = data.valutazioni.get(username);
        if (isNaN(valutazionePrecedente)) valutazionePrecedente = 0;

        data.valutazioni.set(username, valutazione);
        const cambioPunteggio = valutazione - valutazionePrecedente;
        data.punteggio_commento += cambioPunteggio

        query = { username: data.creatore_commento };

        Utente.findOne(query, (err, utente) => {

            if (err) {
                return res.status(500).send();
            }

            if (utente == null) {
                return res.status(404).json({ Error: "Creatore del commento non trovato."});
            }

            utente.userscore += cambioPunteggio;
            
            utente.save();
            data.save();

            return res.status(200).json({ PunteggioCommento: data.punteggio_commento, ValutazioneAttuale: valutazione });
        })
    })
}

module.exports = { newCommento_Post, getCommento_Post, getCommenti_Post, segnalaCommento_Post, valutaCommento_Post, modificaCommento_Post, deleteCommento_Post };