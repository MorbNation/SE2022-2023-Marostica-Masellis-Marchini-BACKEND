const Post = require('../models/post');
const Utente = require('../models/utente');

const newPost = async (req, res) => {

    //TODO: CONFERMARE UTENTE CON TOKEN

    console.log(req.body);
    console.log('Trying to add new post, checking if a post with the same title exists...');

    //I don't know why, I don't want to know why but for some reason mongodb will not return a valid body to compare
    // Post.findOne({ where: { id: req.body.id } }, (err, data) => {
    //     if (!data) {
    //         const newPost = new Post({
    //             id: req.body.id,
    //             title: req.body.title,
    //             date: req.body.req,
    //             text: req.body.text,
    //             media: req.body.media,
    //             tag: req.body.tag,
    //             punteggio_post: req.body.punteggio_post,
    //             segnalato: req.body.segnalato,
    //             numero_commenti: req.body.numero_commenti,
    //             associato_a_contest: req.body.associato_a_contest,
    //             creatore_post: req.body.creatore_post
    //         });

    //         newPost.save((err, data) => {
    //             if (err) return res.json({ Error: err });
    //             return res.json(data);
    //         });
    //     } else {
    //         if (err) return res.json(`Something went wrong. ${err}`);
    //         return res.json({ message: "Post already exists." });
    //     }
    // });

    let post = await Post.findOne({ id: req.body.id }).exec();

    if (!post) {
        const newPost = new Post({
            id: req.body.id,
            titolo: req.body.titolo,
            data: req.body.data,
            testo: req.body.testo,
            media: req.body.media,
            tag: req.body.tag,
            punteggio_post: req.body.punteggio_post,
            segnalato: req.body.segnalato,
            numero_commenti: req.body.numero_commenti,
            associato_a_contest: req.body.associato_a_contest,
            creatore_post: req.body.creatore_post
        });

        newPost.save((err, data) => {
            if (err) return res.json({ Error: err });
            return res.json(data);
        });
    } else {
        return res.json({ message: "Post already exists", req: req.body })
    }
};

const getPosts = (req, res) => {
    console.log("Listing all Posts...");
    //gets all posts
    Post.find({}, (err, data) => {
        if (err) {
            return res.json({ Error: err });
        }
        return res.json(data);
    });
};

const getPostById = (req, res) => {
    let postId = req.params.id;
    var query = { id: postId };
    console.log("Getting post by id...");

    Post.findOne(query, (err,data) => {
        if (err) {
            return res.json({ Error: err });
        }
        return res.json(data);
    });
}

const getPostByUser = (req, res) => {
    let postUser = req.params.username;
    var query = { creatore_post: postUser };
    console.log("Getting post by username...");

    Post.find(query, (err,data) => {
        if (err) {
            return res.json({ Error: err });
        }
        return res.json(data);
    });
}

const segnalaPost = (req, res) => {

    //TODO: CONFERMARE UTENTE CON TOKEN

    var postId = req.params.id;
    var query = { id: postId };

    console.log(postId);

    console.log(`Flagging post with id ${postId}...`);

    Post.find(query, (err,data) => {
        if (err) {
            return res.json({ Error: err });
        }

        console.log(data);
        
        data.forEach(element => {
            //element.segnalato = !element.segnalato; Così continua a switchare
            element.segnalato = true;
            element.save();
        });

        return res.json(data);
    });
}

const valutaPost = (req, res) => {

    //TODO: CONFERMARE UTENTE CON TOKEN

    const postId = req.body.id;
    const username = req.body.username;
    const valutazione = req.body.valutazione;
    var query = { id: postId };

    Post.findOne(query, (err,data) => {
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
        data.punteggio_post += cambioPunteggio;

        query = { username: data.creatore_post };

        Utente.findOne(query, (err, utente) => {
            if (err) {
                return res.json({ Error: err });
            }
            if (utente == null) {
                return res.json({ Error: "Creatore del post non trovato."})
            }

            utente.userscore += cambioPunteggio;
            
            utente.save();
            data.save();

            return res.json({ Result: "Valutazione effettuata con successo", punteggio_post: data.punteggio_post});
        })
    })
}

const modificaPost = (req, res) => {

    //TODO: CONFERMARE UTENTE CON TOKEN

    const postId = req.body.id;
    const username = req.body.username;
    const titolo = req.body.titolo;
    const testo = req.body.testo;
    const media = req.body.media;
    const tag = req.body.tag;

    const query = { id: postId };

    Post.findOne(query, (err, post) => {
        if (err) {
            return res.json({ Error: err });
        }
        if (post.creatore_post != username){
            return res.json({ Error: "L'utente che ha effettuato la richiesta non é il creatore del post." })
        }

        post.titolo = titolo;
        post.testo = testo;
        post.media = media;
        post.tag = tag;

        post.save();

        return res.json({ Result: "Modifica effettuata con successo." });
    })
}

const visualizzaProfilo = (req, res) => {
    // TODO
}

const salvaNeiFavoriti = (req, res) => {
    
    //TODO: CONFERMARE UTENTE CON TOKEN

    const postId = req.body.id;
    const username = req.body.username;

    const query = { username: username };

    Utente.findOne(query, (err, utente) => {
        if (err) {
            return res.json({ Error: err });
        }

        // Se un post é giá favorito dall'utente, allora non succede nulla.
        if (!utente.post_favoriti.includes(postId)) utente.post_favoriti.push(postId);
        utente.save();

        return res.json(utente);
    })
}

const deletePost = (req, res) => {

    //TODO: CONFERMARE UTENTE CON TOKEN

    console.log(req.params);
    var postId = req.params.id;
    var query = { id: postId };
    console.log(`Deleting post ${postId}...`);

    Post.deleteMany(query, (err, collection) => {
        if (err) {
            throw err;
        } else {
            console.log(`Post ${postId} deleted succesfully.`);
            res.json({ message: "DELETE Post" });
        }
    });
};

module.exports = { newPost, getPosts, getPostById, getPostByUser, valutaPost, segnalaPost, modificaPost, salvaNeiFavoriti, deletePost };