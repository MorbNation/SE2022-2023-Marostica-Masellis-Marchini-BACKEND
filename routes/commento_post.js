const express = require('express');
const auth = require('../auth');

const router = express.Router();
const commentController = require("../controllers/commento_post");

router.get('/commento_post/:id_post', commentController.getCommento_Post);

router.post('/commento_post', auth, commentController.newCommento_Post);

router.put('/commento_post/segnala/:id', auth, commentController.segnalaCommento_Post);
router.put('/commento_post/valuta', auth, commentController.valutaCommento_Post);

router.delete('/commento_post/:id', auth, commentController.deleteCommento_Post);

module.exports = router;