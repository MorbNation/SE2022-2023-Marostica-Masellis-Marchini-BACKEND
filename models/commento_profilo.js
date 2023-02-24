const mongoose = require('mongoose');

const Commento_ProfiloSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    profilo_commentato: { type: String, required: true },
    titolo: { type: String, required: true },
    data: { type: Number, required: true},
    testo: { type: String, required: true},
    punteggio_commento: { type: Number, default: 0},
    punteggio_commento:{ type: Number, default: 0 },
    segnalato: { type: Boolean, default: 0 },
    creatore_commento: { type: String, required: true },
    valutazioni: { type: Map, of: Number, default: {} }
});

const  Commento_Profilo = mongoose.model(' Commento_Profilo',  Commento_ProfiloSchema);
module.exports =  Commento_Profilo;