const { collection } = require("../models/commento_profilo");
const Commento_Profilo = require("../models/commento_profilo");
const Utente = require("../models/utente");
const Post = require("../models/post");

const newCommento_Profilo = async (req, res) => {

    console.log(req.body);
    console.log('Trying to add new comment...');

    const newCommento_Profilo = new Commento_Profilo({
        id: req.body.id,
        profilo_commentato: req.body.profilo_commentato,
        titolo: req.body.titolo,
        data: Date.now(),
        testo: req.body.testo,
        punteggio: 0,
        segnalato: false,
        creatore_commento: req.body.username
    });

    newCommento_Profilo.save((err, data) => {
        if (err) return res.json({ Error: err });
        return res.json(data);
    });
};

const getCommento_Profilo = (req, res) => {

    const username = req.body.username;
    const query = { profilo_commentato: username };

    console.log(`Getting comment with association id ${username}...`);

    Commento_Profilo.find(query, (err, collection) => {

        if (err) {
            throw err;
        } else {
            console.log(`Comment with association id ${username} retrieved successfully.`);
            return res.json(collection);
        }
    });
};

const deleteCommento_Profilo = (req, res) => {

    const commentId = req.body.id;

    console.log(`Deleting comment with id ${commentId}...`);

    const username = req.body.username;
    const query = { username: username };

    Utente.findOne(query, (err, utente) => {

        if (err){
            throw err
        } else {
            const query = { id: commentId };

            Commento_Profilo.findOne(query, (err, commento) => {

                if (err){
                    throw err
                } else {
                    // Se l'utente che fa la richiesta non é né l'autore del commento né un amministratore, esce dalla funzione
                    if(!utente.isAmministratore && utente.username != commento.creatore_commento){
                        return res.status(401).send("Utente non autorizzato.");
                    }
                    
                    Commento_Profilo.deleteOne(query, (err, data) => {

                        if (err){
                            throw err
                        } else {
                            console.log(`Comment with id ${commentId} deleted succesfully.`);

                            utente.userscore -= commento.punteggio_commento;
                            utente.save();

                            return res.json({ message: "DELETE Comment" });
                        }
                    })
                }
            })
        }
    })
};

const segnalaCommento_Profilo = (req, res) => {

    commentId = req.body.id;
    var query = { id: commentId };

    console.log(`Flagging comment with id ${commentId}...`);

    Commento_Profilo.findOne(query, (err,data) => {

        if (err) {
            return res.json({ Error: err });
        }
        
        //data.segnalato = !data.segnalato;
        data.segnalato = true;
        data.save();

        return res.json(data);
    });
}

const modificaCommento_Profilo = (req, res) => {
    
    const commentId = req.body.id;
    const titolo = req.body.titolo
    const testo = req.body.testo;
    const username = req.body.username;

    var query = { id: commentId };

    Commento_Profilo.findOne(query, (err, commento) => {
        
        if (err) {
            return res.json({ Error: err });
        }

        query = { username: username };

        Utente.findOne(query, (err, utente) => {

            if (err) {
                return res.json({ Error: err });
            }
    
            if(!utente.isAmministratore && utente.username != commento.creatore_commento){
                return res.status(401).send("Utente non autorizzato.");
            }

            commento.titolo = titolo;
            commento.testo = testo;
            commento.save();

            return res.status(201).send("Modifica commento effettuata con successo.")
        })
    })
}

const valutaCommento_Profilo = (req, res) => {

    const commentId = req.body.id;
    const username = req.body.username;
    const valutazione = req.body.valutazione;
    var query = { id: commentId };

    Commento_Profilo.findOne(query, (err,data) => {

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

module.exports = { newCommento_Profilo, getCommento_Profilo, segnalaCommento_Profilo, valutaCommento_Profilo, modificaCommento_Profilo, deleteCommento_Profilo };