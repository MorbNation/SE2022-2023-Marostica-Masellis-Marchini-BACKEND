const express = require('express');
const auth = require('../middleware/auth');
const refreshToken = require('../middleware/refreshToken');

const router = express.Router();
const commentController = require("../controllers/commento_post");

//APIs

// GET
router.get('/api/commento_post/:id', refreshToken, commentController.getCommento_Post);
router.get('/api/commento_post/all/:id_post', refreshToken, commentController.getCommenti_Post);

// POST
router.post('/api/commento_post', refreshToken, auth, commentController.newCommento_Post);

// PUT
router.put('/api/commento_post/segnala', refreshToken, auth, commentController.segnalaCommento_Post);
router.put('/api/commento_post/valuta', refreshToken, auth, commentController.valutaCommento_Post);
router.put('/api/commento_post/modifica', refreshToken, auth, commentController.modificaCommento_Post);

// DELETE
router.delete('/api/commento_post/:id', refreshToken, auth, commentController.deleteCommento_Post);

module.exports = router;