const express = require('express');
const auth = require('../middleware/auth');
const refreshToken = require('../middleware/refreshToken');

const router = express.Router();
const commentController = require("../controllers/commento_profilo");

//VIEWS

//API

router.get('/api/commento_profilo/', refreshToken, commentController.getCommento_Profilo);
router.get('/api/commento_profilo/all', refreshToken, commentController.getCommenti_Profilo);

router.post('/api/commento_profilo', refreshToken, auth, commentController.newCommento_Profilo);

router.put('/api/commento_profilo/segnala/', refreshToken, auth, commentController.segnalaCommento_Profilo);
router.put('/api/commento_profilo/valuta', refreshToken, auth, commentController.valutaCommento_Profilo);
router.put('/api/commento_profilo/modifica', refreshToken, auth, commentController.modificaCommento_Profilo);

router.delete('/api/commento_profilo/', refreshToken, auth, commentController.deleteCommento_Profilo);

module.exports = router;