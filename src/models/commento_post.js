const mongoose = require('mongoose');

const Commento_PostSchema = new mongoose.Schema({
    id: { type: String, unique: true , required: true},
    id_post: { type: String, required: true },
    data: { type: Number, required: true },
    testo: { type: String, required: true },
    punteggio_commento:{ type: Number, default: 0 },
    segnalato: { type: Boolean, default: 0 },
    creatore_commento: { type: String, required: true },
    valutazioni: { type: Map, of: Number, default: {} }
});

const  Commento_Post = mongoose.model('Commento_Post',  Commento_PostSchema);
module.exports =  Commento_Post;