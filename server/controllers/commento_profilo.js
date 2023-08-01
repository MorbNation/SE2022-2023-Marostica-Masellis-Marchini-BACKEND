// Models
const Commento_Profilo = require("../models/commento_profilo");
const Utente = require("../models/utente");

// Dependencies
const { v4: uuidv4 } = require('uuid');

// Post a new profile comment
const newCommento_Profilo = async (req, res) => {

    //console.log(req.body);
    //console.log('Trying to add new comment...');

    // Creates a new profile comment object
    const newCommento_Profilo = new Commento_Profilo({
        id: uuidv4(),
        profilo_commentato: req.body.profilo_commentato,
        titolo: req.body.titolo,
        data: Date.now(),
        testo: req.body.testo,
        creatore_commento: req.body.username
    });

    // Saves to the database and returns the new profile comment
    newCommento_Profilo.save((err, data) => {
        if (err) { console.log(err); return res.status(500).send()};
        return res.status(201).json({ Id: newCommento_Profilo.id });
    });
};

// Get a profile comment by its id
const getCommento_Profilo = (req, res) => {

    const id = req.params.id;
    const query = { id: id };

    //console.log(`Getting comment with association id ${username}...`);

    // Tries to find a profile comment by its id
    Commento_Profilo.findOne(query, (err, commento) => {

        if (err) {
            return res.status(500).send();
        } 

        // If no profile comment is found returns an error
        if (!commento) {
            return res.status(404).json({ Error: "Commento non trovato. "});
        }

        // If comment is found returns it
        return res.status(200).json(commento);
    });
};

// Get all profile comments associated to a specific user
const getCommenti_Profilo = (req, res) => {

    const profiloUsername = req.params.user;

    // Retrieves all profile comments of a specific user by its username
    Commento_Profilo.find({ profilo_commentato: profiloUsername }, (err, data) => {

        if (err) {
            return res.status(500).send();
        }

        const retval = [];

        data.forEach(element => {
            retval.push(element.id);
        });

        // Returns an array with every profile comment found
        return res.status(200).json(retval);
    });
};

// Delete a profile comment by its id
const deleteCommento_Profilo = (req, res) => {

    const commentId = req.body.id;

    //console.log(`Deleting comment with id ${commentId}...`);

    const username = req.body.username;
    const query = { username: username };

    // Tries to retrieve the user trying to delete the profile comment
    Utente.findOne(query, (err, utente) => {

        if (err){
            return res.status(500).send();
        } else {
            const query = { id: commentId };

            // Tries to find the comment to be deleted
            Commento_Profilo.findOne(query, (err, commento) => {

                if (err){
                    return res.status(500).send();
                } else if (!commento) {
                    // If the comment is not found returns an error
                    return res.status(404).json({ Error: "Commento non trovato." });
                } else {
                    // Deletes the comment only if the deleting user is either admin or the user which created the comment itself
                    if(!utente.isAmministratore && utente.username != commento.creatore_commento){
                        return res.status(401).json({ Error: "Utente non autorizzato." });
                    }
                    
                    // Deletes the comment
                    Commento_Profilo.deleteOne(query, async (err, data) => {

                        if (err){
                            return res.status(500).send();
                        } else {
                            //console.log(`Comment with id ${commentId} deleted succesfully.`);

                            utente = await Utente.findOne({ username: commento.creatore_commento }).exec();

                            // Updates the userscore by subtracting the score of the deleted comment
                            utente.userscore -= commento.punteggio_commento;
                            utente.save();

                            // Returns the deleted comment's id
                            return res.status(200).json({ id: commentId });
                        }
                    })
                }
            })
        }
    })
};

// Flags a profile comment
const segnalaCommento_Profilo = (req, res) => {

    commentId = req.body.id;
    var query = { id: commentId };

    //console.log(`Flagging comment with id ${commentId}...`);

    // Tries to find the profile comment by its id
    Commento_Profilo.findOne(query, (err,data) => {

        if (err) {
            return res.status(500).send();
        }

        // If no comment is found return an error
        if (!data) {
            return res.status(404).json({ Error: "Commento non trovato." });
        }
        
        // Sets the segnalato property to true
        data.segnalato = true;
        data.save();

        // Returns the id of the flagged comment
        return res.status(200).json({ id: commentId });
    });
}

// Edit a profile comment
const modificaCommento_Profilo = (req, res) => {
    
    const commentId = req.body.id;
    const titolo = req.body.titolo
    const testo = req.body.testo;
    const username = req.body.username;

    var query = { id: commentId };

    // Tries to find the comment by its id
    Commento_Profilo.findOne(query, (err, commento) => {
        
        if (err) {
            return res.status(500).send();
        }

        // If no comment is found returns an error
        if (!commento) {
            return res.statuts(404).json({ Error: "Commento non trovato." });
        }

        query = { username: username };

        // Tries to retrieve the editing user
        Utente.findOne(query, (err, utente) => {

            if (err) {
                return res.status(500).send();
            }
    
            // Edits comment only if the editing user is either admin or the user which created the comment itself
            if(!utente.isAmministratore && utente.username != commento.creatore_commento){
                return res.status(401).json({ Error: "Utente non autorizzato." });
            }

            // Saves the updated comment to the database
            commento.titolo = titolo;
            commento.testo = testo;
            commento.save();

            // Returns the updated comment
            return res.status(200).json(commento);
        })
    })
}

// Adds an evaluation to a profile comment
const valutaCommento_Profilo = (req, res) => {

    const commentId = req.body.id;
    const username = req.body.username;
    const valutazione = req.body.valutazione;
    var query = { id: commentId };

    // Tries to find the target profile comment
    Commento_Profilo.findOne(query, (err,data) => {

        if (err) {
            return res.status(500).send();
        }

        // If the comment is not found returns an error
        if (!data) {
            return res.status(404).json({ Error: "Commento non trovato."});
        }

        // Checks the validity of the evaluation
        if (valutazione != -1 && valutazione != 0 && valutazione != 1) {
            return res.status(400).json({ Error: "Valutazione non valida."});
        }

        // Evaluations are stored as a map with the user who created the evaluation and the evaluation itself
        // If an entry in the map with the evaluating user is not present it is created here and its value is set to 0
        var valutazionePrecedente = data.valutazioni.get(username);
        if (isNaN(valutazionePrecedente)) valutazionePrecedente = 0;

        // The new evaluation is set and the comment's score is updated
        data.valutazioni.set(username, valutazione);
        const cambioPunteggio = valutazione - valutazionePrecedente;
        data.punteggio_commento += cambioPunteggio

        query = { username: data.creatore_commento };

        // The comment's owner is retrieved from the databaes
        Utente.findOne(query, (err, utente) => {

            if (err) {
                return res.status(500).send();
            }

            // If the user is not found returns an error
            if (utente == null) {
                return res.status(404).json({ Error: "Creatore del commento non trovato."});
            }

            // This user's userscore is updated and saved
            utente.userscore += cambioPunteggio;
            
            utente.save();
            data.save();

            // Both new and old comment's scores are returned
            return res.status(200).json({ PunteggioCommento: data.punteggio_commento, ValutazioneAttuale: valutazione });
        })
    })
}

module.exports = { newCommento_Profilo, getCommento_Profilo, getCommenti_Profilo, segnalaCommento_Profilo, valutaCommento_Profilo, modificaCommento_Profilo, deleteCommento_Profilo };