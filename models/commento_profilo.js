const mongoose = require('mongoose');

const Commento_ProfiloSchema = new mongoose.Schema({
    id: Number,
    profilo_commentato: String,
    titolo: String,
    data: String,
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