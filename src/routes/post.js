const express = require('express');
const auth = require('../middleware/auth');
const refreshToken = require('../middleware/refreshToken');

const router = express.Router();
const postController = require("../controllers/post");

//VIEWS

//API

router.get('/api/posts', refreshToken, postController.getPosts);
router.get('/api/post/id', refreshToken, postController.getPostById);
router.get('/api/post/user/:user', refreshToken, postController.getPostByUser)

router.post('/api/post', refreshToken, auth, postController.newPost);

router.put('/api/post/segnala', refreshToken, auth, postController.segnalaPost);
router.put('/api/post/valuta', refreshToken, auth, postController.valutaPost);
router.put('/api/post/modifica', refreshToken, auth, postController.modificaPost);
router.put('/api/post/salvaNeiFavoriti', refreshToken, auth, postController.salvaNeiFavoriti);

router.delete('/api/post', refreshToken, auth, postController.deletePost);

module.exports = router;