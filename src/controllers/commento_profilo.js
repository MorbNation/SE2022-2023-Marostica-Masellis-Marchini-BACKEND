const { collection } = require("../models/commento_profilo");
const Commento_Profilo = require("../models/commento_profilo");
const Utente = require("../models/utente");
const Post = require("../models/post");
const { v4: uuidv4 } = require('uuid');

const newCommento_Profilo = async (req, res) => {

    //console.log(req.body);
    //console.log('Trying to add new comment...');

    const newCommento_Profilo = new Commento_Profilo({
        id: uuidv4(),
        profilo_commentato: req.body.profilo_commentato,
        titolo: req.body.titolo,
        data: Date.now(),
        testo: req.body.testo,
        creatore_commento: req.body.username
    });

    newCommento_Profilo.save((err, data) => {
        if (err) { console.log(err); return res.status(500).send()};
        return res.status(200).json({ Id: newCommento_Profilo.id });
    });
};

const getCommento_Profilo = (req, res) => {

    const id = req.body.id;
    const query = { id: id };

    //console.log(`Getting comment with association id ${username}...`);

    Commento_Profilo.findOne(query, (err, commento) => {

        if (err) {
            return res.status(500).send();
        } 

        if (!commento) {
            return res.status(404).json({ Error: "Commento non trovato. "});
        }

        //console.log(`Comment with association id ${username} retrieved successfully.`);
        return res.status(200).json(commento);
    });
};

const getCommenti_Profilo = (req, res) => {

    const profiloUsername = req.body.profiloUsername;

    Commento_Profilo.find({ username: profiloUsername }, (err, data) => {

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

const deleteCommento_Profilo = (req, res) => {

    const commentId = req.body.id;

    //console.log(`Deleting comment with id ${commentId}...`);

    const username = req.body.username;
    const query = { username: username };

    Utente.findOne(query, (err, utente) => {

        if (err){
            return res.status(500).send();
        } else {
            const query = { id: commentId };

            Commento_Profilo.findOne(query, (err, commento) => {

                if (err){
                    return res.status(500).send();
                } else if (!commento) {
                    return res.status(404).json({ Error: "Commento non trovato." });
                } else {
                    // Se l'utente che fa la richiesta non é né l'autore del commento né un amministratore, esce dalla funzione
                    if(!utente.isAmministratore && utente.username != commento.creatore_commento){
                        return res.status(401).json({ Error: "Utente non autorizzato." });
                    }
                    
                    Commento_Profilo.deleteOne(query, (err, data) => {

                        if (err){
                            return res.status(500).send();
                        } else {
                            //console.log(`Comment with id ${commentId} deleted succesfully.`);

                            utente.userscore -= commento.punteggio_commento;
                            utente.save();

                            return res.status(200).send();
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

    //console.log(`Flagging comment with id ${commentId}...`);

    Commento_Profilo.findOne(query, (err,data) => {

        if (err) {
            return res.status(500).send();
        }

        if (!data) {
            return res.status(404).json({ Error: "Commento non trovato." });
        }
        
        //data.segnalato = !data.segnalato;
        data.segnalato = true;
        data.save();

        return res.status(200).send();
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
            return res.status(500).send();
        }

        if (!commento) {
            return res.statuts(404).json({ Error: "Commento non trovato." });
        }

        query = { username: username };

        Utente.findOne(query, (err, utente) => {

            if (err) {
                return res.status(500).send();
            }
    
            if(!utente.isAmministratore && utente.username != commento.creatore_commento){
                return res.status(401).json({ Error: "Utente non autorizzato." });
            }

            commento.titolo = titolo;
            commento.testo = testo;
            commento.save();

            return res.status(200).send();
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

module.exports = { newCommento_Profilo, getCommento_Profilo, getCommenti_Profilo, segnalaCommento_Profilo, valutaCommento_Profilo, modificaCommento_Profilo, deleteCommento_Profilo };