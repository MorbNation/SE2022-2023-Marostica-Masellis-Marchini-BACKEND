const mongoose = require('mongoose');

const Commento_PostSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    id_post: Number,
    data: Number,
    testo: String,
    punteggio_commento:{
        type: Number,
        default: 0
    },
    segnalato: Boolean,
    creatore_commento: String,
    valutazioni: {
        type: Map,
        of: Number,
        default: {}
    }
});

const  Commento_Post = mongoose.model('Commento_Post',  Commento_PostSchema);
module.exports =  Commento_Post;