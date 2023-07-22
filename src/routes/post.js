const express = require('express');
const auth = require('../middleware/auth');
const refreshToken = require('../middleware/refreshToken');

const router = express.Router();
const postController = require("../controllers/post");

//VIEWS

//API

router.get('/api/posts', refreshToken, postController.getPosts);
router.get('/api/post/id/:id', refreshToken, postController.getPostById);
router.get('/api/post/user/:user', refreshToken, postController.getPostByUser);

router.post('/api/post', auth, refreshToken, postController.newPost);

router.put('/api/post/segnala', auth, refreshToken, postController.segnalaPost);
router.put('/api/post/valuta', auth, refreshToken, postController.valutaPost);
router.put('/api/post/modifica', auth, refreshToken, postController.modificaPost);
router.put('/api/post/salvaNeiFavoriti', auth, refreshToken, postController.salvaNeiFavoriti);

router.delete('/api/post', auth, refreshToken, postController.deletePost);

module.exports = router;