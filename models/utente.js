const mongoose = require('mongoose');

const UtenteSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    descrizione: { type: String, default: "Ciao!" },
    icona_profilo: { type: String, default: "DefaultPathPfp" }, //placeholder for media
    iconaNSFW: { type: Boolean, default: false },
    banner: { type: String, default: "DefaultPathBanner" }, //placeholder for media
    bannerNSFW: { type: Boolean, default: false },
    userscore: { type: Number, default: 0 },
    lingua: { type: String, enum: ["italiano", "inglese"] , default: "italiano" },
    isAmministratore: { type: Boolean, default: false },
    nsfw: { type: String, enum: ["no", "blur", "yes"] , default: "no" },
    nome_tema_selezionato: { type: String, default: "default" },
    utenti_seguiti: [String],
    post_favoriti: [String]
});

const Utente = mongoose.model('Utente', UtenteSchema);
module.exports = Utente;