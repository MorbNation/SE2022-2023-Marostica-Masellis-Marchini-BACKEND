// Models
const Commento_Post = require("../models/commento_post");
const Utente = require("../models/utente");
const Post = require("../models/post");

// Dependencies
const { v4: uuidv4 } = require('uuid');

// Post a new post comment
const newCommento_Post = async (req, res) => {

    console.log(req.body);
    console.log('Trying to add new comment...');

    // New post comment object is created
    const newCommento_Post = new Commento_Post({
        id: uuidv4(),
        id_post: req.body.id_post,
        data: Date.now(),
        testo: req.body.testo,
        creatore_commento: req.body.username
    });

    // Finds the post to which the comment should be associated
    Post.findOne({ id: req.body.id_post }, (err, post) => {

        if (err) {
            return res.status(500).send();
        }

        console.log(post.numero_commenti);
        post.numero_commenti += 1;
        console.log(post.numero_commenti);

        post.save();

        // New comment is saved to the database
        newCommento_Post.save((err, data) => {
            if (err) return res.status(500).send();
            // Returns the id of the created post
            return res.status(200).json({ Id: newCommento_Post.id });
        });
    })
};

// Get a specific post comment by its id
const getCommento_Post = (req, res) => {

    const commentAssoc = req.params.id;
    const query = { id: commentAssoc };

    console.log(`Getting comment with association id ${commentAssoc}...`);

    // Tries to find the post comment by its id
    Commento_Post.findOne(query, (err, commento) => {

        if (err) {
            return res.status(500).send();
        }

        // If no comment is found returns an error
        if (!commento) {
            return res.status(404).json({ Error: "Commento non trovato." })
        }

        // Returns the comment object
        console.log(`Comment with association id ${commentAssoc} retrieved successfully.`);
        return res.status(200).json(commento);
    });
};

// Get all comments associated to a specific post
const getCommenti_Post = (req, res) => {

    const postId = req.params.id_post;

    // Retrieves the post comments by the the post's id
    Commento_Post.find({ id_post: postId }, (err, data) => {

        if (err) {
            return res.status(500).send();
        }

        const retval = [];

        data.forEach(element => {
            retval.push(element.id);
        });

        // Returns an array containing the retrieved comments
        return res.status(200).json(retval);
    });
};

// Delete a specific post comment
const deleteCommento_Post = (req, res) => {

    const commentId = req.params.id;

    console.log(`Deleting comment with id ${commentId}...`);

    const username = req.body.username;
    const query = { username: username };

    // Retrieves the user trying to delete the post comment
    Utente.findOne(query, (err, utente) => {

        if (err){
            throw err
        } else {
            const query = { id: commentId };

            // Retrieves the comment to be deleted by its id
            Commento_Post.findOne(query, (err, commento) => {

                if (err){
                    throw err
                } else {
                    // Deletes comment only if the user trying to delete is either admin or the comment's creator itself, else returns an error
                    if(!utente.isAmministratore && utente.username != commento.creatore_commento){
                        return res.status(401).json({ Error: "Utente non autorizzato." });
                    }
                    
                    // Delets the post comment itself
                    Commento_Post.deleteOne(query, async (err, data) => {

                        if (err){
                            throw err
                        } else {
                            console.log(`Comment with id ${commentId} deleted succesfully.`);

                            utente = await Utente.findOne({ username: commento.creatore_commento}).exec();

                            // Subtracts the post's score form the total user's userscore
                            utente.userscore -= commento.punteggio_commento;
                            utente.save();

                            // Edit's the number of comments from the post
                            Post.findOne({ id: commento.id_post }, (err, post) => {

                                if (err) {
                                    console.log(err);
                                }
                                post.numero_commenti -= 1;
                                post.save();
                            })

                            // Returns the deleted comment's id
                            return res.status(200).json({ id: commentId });
                        }
                    })
                }
            })
        }
    })
};

// Flag a post comment by its id
const segnalaCommento_Post = (req, res) => {comment

    const commentId = req.body.id;
    var query = { id: commentId };

    console.log(`Flagging comment with id ${commentId}...`);

    // Tries to find the comment by its id
    Commento_Post.findOne(query, (err,data) => {

        if (err) {
            return res.status(500).send();
        }

        // If the comment is not found returns an error
        if (!data) {
            return res.status(404).json({ Error: "Il commento non esiste." })
        }
        
        // Saves the new property to the database        
        data.segnalato = true;
        data.save();

        // Returns the flagged post comment's id
        return res.status(200).json({ id: commentId });
    });
}

// Edit a post comment by its id
const modificaCommento_Post = (req, res) => {
    
    const commentId = req.body.id;
    const testo = req.body.testo;
    const username = req.body.username;

    var query = { id: commentId };

    // Tries to find the post comment to be edited
    Commento_Post.findOne(query, (err, commento) => {
        
        if (err) {
            return res.status(500).send();
        }

        query = { username: username };
        
        // Retrieves the user trying to edit the comment
        Utente.findOne(query, (err, utente) => {

            if (err) {
                return res.status(500).send();
            }
    
            // Edits comment only if the editing user is admin or the creator of the comment itself, else returns an error
            if(!utente.isAmministratore && utente.username != commento.creatore_commento){
                return res.status(401).json({ Error: "Utente non autorizzato." });
            }

            // Sabe the edited post comment to the databaes
            commento.testo = testo;
            commento.save();

            // Returns the edited comment
            return res.status(200).json({ id: commentId, testo: testo });
        })
    })
}

// Evaluate a comment
const valutaCommento_Post = (req, res) => {

    const commentId = req.body.id;
    const username = req.body.username;
    const valutazione = req.body.valutazione;
    var query = { id: commentId };

    // Tries to find the post commment to be evaluated
    Commento_Post.findOne(query, (err,data) => {

        if (err) {
            return res.status(500).send();
        }

        // If the comment is not found returns an error
        if (!data) {
            return res.status(404).json({ Error: "Commento non trovato."});
        }

        // Checks the validity of the inputted evaluation
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
            comment
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

module.exports = { newCommento_Post, getCommento_Post, getCommenti_Post, segnalaCommento_Post, valutaCommento_Post, modificaCommento_Post, deleteCommento_Post };