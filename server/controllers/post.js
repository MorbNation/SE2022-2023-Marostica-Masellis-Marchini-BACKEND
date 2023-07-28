// Models
const Post = require('../models/post');
const Utente = require('../models/utente');

//Dependencies
const { v4: uuidv4 } = require('uuid');

//Post a new post
const newPost = async (req, res) => {

    console.log(req.body);
    console.log('Trying to add new post, checking if a post with the same title exists...');

    // Checks if a post with the same title already exists
    let post = await Post.findOne({ titolo: req.body.titolo }).exec();

    const id = uuidv4();

    // A post cannot have both media and text, if so an error is returned
    if (req.body.testo != null && req.body.media != null) {
        return res.status(400).json({ Error: "Un post non puó avere sia media che testo."});
    }

    // If no post with the same title is found create a new post object
    if (!post) {
        const newPost = new Post({
            id: id,
            titolo: req.body.titolo,
            data: Date.now(),
            testo: req.body.testo === '' ? null : req.body.testo,
            media: req.body.media === '' ? null : req.body.media,
            tag: req.body.tag,
            associato_a_contest: req.body.associato_a_contest,
            creatore_post: req.body.username
        });

        // Saves the new post to the databaes and returns its id
        newPost.save((err, data) => {
            if (err) return res.status(500).send();
            return res.status(201).json({ Id: id });
        });
    } else {
        // If a post with the same title is found returns an error
        return res.status(400).json({ Error: "Il post esiste giá."});
    }
};

// Get all posts fromt he database
const getPosts = (req, res) => {

    console.log("Listing all Posts...");

    // Retrieves all posts from the database
    Post.find({}, (err, data) => {

        if (err) {
            return res.status(500).send();
        }

        const retval = [];

        data.forEach(element => {
            retval.push(element);
        });

        // Returns an array with all the retrieved posts
        return res.status(200).json(retval);
    });
};

// Get a specific post by its id
const getPostById = (req, res) => {

    let postId = req.params.id;
    var query = { id: postId };

    console.log("Getting post by id...");

    // Tries to find the post by its id
    Post.findOne(query, (err,data) => {

        if (err) {
            return res.status(500).send();
        }

        // If no post is found returns an error
        if (!data) {
            return res.status(404).json({ Error: "Il post non esiste."});
        }

        // Returns the post object
        return res.status(200).json(data);
    });
}

// Get all posts by a specific user
const getPostByUser = async (req, res) => {

    let postUser = req.params.user;
    var query = { creatore_post: postUser };
    console.log("Getting post by username " + postUser + "...");

    // Tries to find the user whose posts are being retrieved
    const userExists = await Utente.findOne({ username: postUser }).exec();

    // If the user is not found returns an error
    if (!userExists) return res.status(404).json({ Error: "L'utente non esiste."});

    // Retrieves all post by the specific user's id
    Post.find(query, (err,data) => {

        if (err) {
            return res.status(500).send();
        }
        // Returns an array with all the retrieved posts
        return res.status(200).json(data);
    });
}

// Flags a post by its id
const segnalaPost = (req, res) => {

    var postId = req.body.id;
    var query = { id: postId };

    console.log(postId);

    console.log(`Flagging post with id ${postId}...`);

    // Tries to find the specific post by its id
    Post.findOne(query, (err,data) => {

        if (err) {
            return res.status(500).send();
        }

        // If the post is not found returns an error
        if(!data){
            return res.status(404).json({ Error: "Post non trovato." });
        }
        
        // The flag property is saved to the database
        data.segnalato = true;
        data.save();

        // Returns the id of the flagged post
        return res.status(200).json({ id: postId });
    });
}

// Adds an evaluation to a specific post
const valutaPost = (req, res) => {

    const postId = req.body.id;
    const username = req.body.username;
    const valutazione = req.body.valutazione;
    var query = { id: postId };

    // Tries to find the post to be evaluated by its id
    Post.findOne(query, (err,data) => {
        if (err) {
            return res.status(500).send();
        }

        // Checks the validity of the inputted evaluation
        if (valutazione != -1 && valutazione != 0 && valutazione != 1) {
            return res.status(500).send();
        }

        // If the post is not found returns an error
        if (!data) {
            return res.status(404).json({ Error: "Post non trovato."});
        }

        // Evaluations are stored as a map with the user who created the evaluation and the evaluation itself
        // If an entry in the map with the evaluating user is not present it is created here and its value is set to 0
        var valutazionePrecedente = data.valutazioni.get(username);
        if (isNaN(valutazionePrecedente)) valutazionePrecedente = 0;

        // The new evaluation is set and the comment's score is updated
        data.valutazioni.set(username, valutazione);
        const cambioPunteggio = valutazione - valutazionePrecedente;
        data.punteggio_post += cambioPunteggio;

        query = { username: data.creatore_post };

        //Finds the evaluated post's creator and updates its userscore
        Utente.findOne(query, (err, utente) => {
            if (err) {
                return res.status(500).send();
            }
            if (!utente) {
                return res.status(404).json({ Error: "Creatore del post non trovato."});
            }

            utente.userscore += cambioPunteggio;
            
            utente.save();
            data.save();

            // Returns both the new and old post's scores
            return res.status(200).json({ PunteggioPost: data.punteggio_post, ValutazioneAttuale: valutazione });
        })
    })
}

// Edits a post
const modificaPost = (req, res) => {

    const postId = req.body.id;
    const username = req.body.username;
    const titolo = req.body.titolo;
    const testo = req.body.testo;
    const media = req.body.media;
    const tag = req.body.tag;

    const query = { id: postId };

    // Tries to find the post by its id
    Post.findOne(query, (err, post) => {

        if (err) {
            return res.status(500).send();
        }

        // If the post is not foun returns an error
        if (!post) {
            return res.status(404).json({ Error: "Il post non esiste." });
        }

        // If the user trying to edit the post is not the post's creator returns an error
        if (post.creatore_post != username){
            return res.status(401).json({ Error: "Utente non autorizzato." });
        }

        post.titolo = titolo;
        post.testo = testo;
        post.media = media;
        post.tag = tag;

        post.save();

        // Returns the updated post
        return res.status(200).json(post);
    })
}

// Save a post in a user's favourite list
const salvaNeiFavoriti = async (req, res) => {

    const postId = req.body.id;
    const username = req.body.username;

    const query = { username: username };

    // Checks if the post exists in the databaes
    const postExists = await Post.findOne({ id: postId }).exec();

    // If the post is not found returns an error
    if (!postExists) {
        return res.status(404).json({ Error: "Il post non esiste." });
    }

    // Retrieves the user trying to save the post
    Utente.findOne(query, (err, utente) => {

        if (err) {
            return res.status(500).send();
        }

        // If a post is already in a user's favourite list nothing happens, else the post is added to the user's favourite list
        if (!utente.post_favoriti.includes(postId)) utente.post_favoriti.push(postId);
        utente.save();

        // Returns the id of the post and the username of the user saving the post
        return res.status(200).json({ id: id, username: username });;
    })
}

// Delete a post from the database
const deletePost = async (req, res) => {

    const postId = req.params.id;
    const username = req.body.username;

    // Tries to retrieve the post from the database
    var query = { id: postId };
    const post = await Post.findOne(query).exec();

    // If the post is not found returns an error
    if (!post) {
        return res.status(404).json({ Error: "Il post non esiste." });
    }

    // Retrieves the user trying to delete the post
    query = { username: username };
    const utente = await Utente.findOne(query).exec();

    // Deletes post only if the user trying to delete is either admin or the post's creator itself, else returns an error
    if(!utente.isAmministratore && utente.username != post.creatore_post){
        return res.status(401).json({ Error: "Utente non autorizzato." });
    }

    // Retrieves the creator of the post
    query = { username: post.creatore_post };
    const creatore_post = await Utente.findOne(query).exec();

    // Deletes the post
    query = { id: postId };
    Post.deleteOne(query).exec();

    // Subtracts the deleted post's score from the total of the user's userscore
    creatore_post.userscore -= post.punteggio_post;
    
    creatore_post.save();

    // Returns the id of the deleted post
    return res.status(200).json({ id: postId });
};

module.exports = { newPost, getPosts, getPostById, getPostByUser, valutaPost, segnalaPost, modificaPost, salvaNeiFavoriti, deletePost };