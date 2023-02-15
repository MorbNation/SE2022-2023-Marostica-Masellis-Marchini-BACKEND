const mongoose = require('mongoose');

const Commento_PostSchema = new mongoose.Schema({
    id: Number,
    id_post: Number,
    data: String,
    testo: String,
    punteggio_commento: Number,
    segnalato: Boolean,
    creatore_commento: String
});

const  Commento_Post = mongoose.model(' Commento_Post',  Commento_PostSchema);
module.exports =  Commento_Post;