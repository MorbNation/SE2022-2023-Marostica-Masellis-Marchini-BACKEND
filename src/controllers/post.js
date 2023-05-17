const Post = require('../models/post');
const Utente = require('../models/utente');
const { v4: uuidv4 } = require('uuid');

const newPost = async (req, res) => {

    console.log(req.body);
    console.log('Trying to add new post, checking if a post with the same title exists...');

    let post = await Post.findOne({ id: req.body.id }).exec();

    const id = uuidv4();

    if (!post) {
        const newPost = new Post({
            id: id,
            titolo: req.body.titolo,
            data: Date.now(),
            testo: req.body.testo,
            media: req.body.media,
            tag: req.body.tag,
            associato_a_contest: req.body.associato_a_contest,
            creatore_post: req.body.username
        });

        newPost.save((err, data) => {
            if (err) return res.status(500).send();
            return res.status(200).json({ Id: id });
        });
    } else {
        return res.status(400).json({ Error: "Il post esiste giá."});
    }
};

const getPosts = (req, res) => {

    console.log("Listing all Posts...");

    Post.find({}, (err, data) => {

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

const getPostById = (req, res) => {

    let postId = req.body.id;
    var query = { id: postId };

    console.log("Getting post by id...");

    Post.findOne(query, (err,data) => {

        if (err) {
            return res.status(500).send();
        }

        if (!data) {
            return res.status(404).json({ Error: "Il post non esiste."});
        }

        return res.status(200).json(data);
    });
}

const getPostByUser = async (req, res) => {

    let postUser = req.body.creatore_post;
    var query = { creatore_post: postUser };
    console.log("Getting post by username...");

    const userExists = await Utente.findOne({ username: postUser }).exec();

    if (!userExists) return res.status(404).json({ Error: "L'utente non esiste."});

    Post.find(query, (err,data) => {

        if (err) {
            return res.status(500).send();
        }
        return res.status(200).json(data);
    });
}

const segnalaPost = (req, res) => {

    var postId = req.body.id;
    var query = { id: postId };

    console.log(postId);

    console.log(`Flagging post with id ${postId}...`);

    Post.findOne(query, (err,data) => {

        if (err) {
            return res.status(500).send();
        }

        if(!data){
            return res.status(404).json({ Error: "Post non trovato." });
        }
        
        data.segnalato = true;
        data.save();

        return res.status(200).send();
    });
}

const valutaPost = (req, res) => {

    const postId = req.body.id;
    const username = req.body.username;
    const valutazione = req.body.valutazione;
    var query = { id: postId };

    Post.findOne(query, (err,data) => {
        if (err) {
            return res.status(500).send();
        }

        if (valutazione != -1 && valutazione != 0 && valutazione != 1) {
            return res.status(500).send();
        }

        if (!data) {
            return res.status(404).json({ Error: "Post non trovato."});
        }

        var valutazionePrecedente = data.valutazioni.get(username);
        if (isNaN(valutazionePrecedente)) valutazionePrecedente = 0;

        data.valutazioni.set(username, valutazione);
        const cambioPunteggio = valutazione - valutazionePrecedente;
        data.punteggio_post += cambioPunteggio;

        query = { username: data.creatore_post };

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

            return res.status(200).json({ PunteggioPost: data.punteggio_post, ValutazioneAttuale: valutazione });
        })
    })
}

const modificaPost = (req, res) => {

    const postId = req.body.id;
    const username = req.body.username;
    const titolo = req.body.titolo;
    const testo = req.body.testo;
    const media = req.body.media;
    const tag = req.body.tag;

    const query = { id: postId };

    Post.findOne(query, (err, post) => {

        if (err) {
            return res.status(500).send();
        }

        if (!post) {
            return res.status(404).json({ Error: "Il post non esiste." });
        }

        if (post.creatore_post != username){
            return res.status(401).json({ Error: "Utente non autorizzato." });
        }

        post.titolo = titolo;
        post.testo = testo;
        post.media = media;
        post.tag = tag;

        post.save();

        return res.status(200).json(post);
    })
}

const visualizzaProfilo = (req, res) => {

    // É una roba che dovrebbe fare il front end, dobbiamo spostarla e vedere come organizzarci

}

const salvaNeiFavoriti = async (req, res) => {

    const postId = req.body.id;
    const username = req.body.username;

    const query = { username: username };

    const postExists = await Post.findOne({ id: postId }).exec();

    if (!postExists) {
        return res.status(404).json({ Error: "Il post non esiste." });
    }

    Utente.findOne(query, (err, utente) => {

        if (err) {
            return res.status(500).send();
        }

        // Se un post é giá favorito dall'utente, allora non succede nulla.
        if (!utente.post_favoriti.includes(postId)) utente.post_favoriti.push(postId);
        utente.save();

        return res.status(200).send();;
    })
}

const deletePost = async (req, res) => {

    const postId = req.body.id;
    const username = req.body.username;

    var query = { id: postId };
    const post = await Post.findOne(query).exec();

    if (!post) {
        return res.status(404).json({ Error: "Il post non esiste." });
    }

    query = { username: username };
    const utente = await Utente.findOne(query).exec();

    if(!utente.isAmministratore && utente.username != post.creatore_post){
        return res.status(401).json({ Error: "Utente non autorizzato." });
    }

    query = { username: post.creatore_post };
    const creatore_post = await Utente.findOne(query).exec();

    query = { id: postId };
    Post.deleteOne(query).exec();

    creatore_post.userscore -= post.punteggio_post;
    
    creatore_post.save();

    return res.status(200).send();
};

module.exports = { newPost, getPosts, getPostById, getPostByUser, valutaPost, segnalaPost, modificaPost, salvaNeiFavoriti, deletePost };