const express = require('express');
const auth = require('../middleware/auth');
const refreshToken = require('../middleware/refreshToken');

const router = express.Router();
const commentController = require("../controllers/commento_profilo");

router.get('/commento_profilo/', refreshToken, commentController.getCommento_Profilo);

router.post('/commento_profilo', refreshToken, auth, commentController.newCommento_Profilo);

router.put('/commento_profilo/segnala/', refreshToken, auth, commentController.segnalaCommento_Profilo);
router.put('/commento_profilo/valuta', refreshToken, auth, commentController.valutaCommento_Profilo);
router.put('/commento_profilo/modifica', refreshToken, auth, commentController.modificaCommento_Profilo);

router.delete('/commento_profilo/', refreshToken, auth, commentController.deleteCommento_Profilo);

module.exports = router;