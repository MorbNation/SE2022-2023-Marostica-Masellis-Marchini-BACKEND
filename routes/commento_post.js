const express = require('express');
const auth = require('../middleware/auth');
const refreshToken = require('../middleware/refreshToken');

const router = express.Router();
const commentController = require("../controllers/commento_post");

router.get('/commento_post/:id_post', refreshToken, commentController.getCommento_Post);

router.post('/commento_post', refreshToken, auth, commentController.newCommento_Post);

router.put('/commento_post/segnala/:id', refreshToken, auth, commentController.segnalaCommento_Post);
router.put('/commento_post/valuta', refreshToken, auth, commentController.valutaCommento_Post);

router.delete('/commento_post/:id', refreshToken, auth, commentController.deleteCommento_Post);

module.exports = router;