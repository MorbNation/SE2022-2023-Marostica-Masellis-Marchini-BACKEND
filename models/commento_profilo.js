const mongoose = require('mongoose');

const Commento_ProfiloSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    profilo_commentato: String,
    titolo: String,
    data: Number,
    testo: String,
    punteggio_commento: Number,
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

const  Commento_Profilo = mongoose.model(' Commento_Profilo',  Commento_ProfiloSchema);
module.exports =  Commento_Profilo;