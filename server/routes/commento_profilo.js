const express = require('express');
const auth = require('../middleware/auth');
const refreshToken = require('../middleware/refreshToken');

const router = express.Router();
const commentController = require("../controllers/commento_profilo");

//API

// GET
router.get('/api/commento_profilo/:id', refreshToken, commentController.getCommento_Profilo);
router.get('/api/commento_profilo/all/:user', refreshToken, commentController.getCommenti_Profilo);

// POST
router.post('/api/commento_profilo', refreshToken, auth, commentController.newCommento_Profilo);

// PUT
router.put('/api/commento_profilo/segnala', refreshToken, auth, commentController.segnalaCommento_Profilo);
router.put('/api/commento_profilo/valuta', refreshToken, auth, commentController.valutaCommento_Profilo);
router.put('/api/commento_profilo/modifica', refreshToken, auth, commentController.modificaCommento_Profilo);

// DELETE
router.delete('/api/commento_profilo/:id', refreshToken, auth, commentController.deleteCommento_Profilo);

module.exports = router;