const express = require('express');
const auth = require('../middleware/auth');
const refreshToken = require('../middleware/refreshToken');

const router = express.Router();
const postController = require("../controllers/post");

router.get('/posts', refreshToken, postController.getPosts);
router.get('/post/id/:id', refreshToken, postController.getPostById);
router.get('/post/user/:username', refreshToken, postController.getPostByUser)

router.post('/post', refreshToken, auth, postController.newPost);

router.put('/post/segnala/:id', refreshToken, auth, postController.segnalaPost);
router.put('/post/valuta', refreshToken, auth, postController.valutaPost);
router.put('/post/modifica', refreshToken, auth, postController.modificaPost);
router.put('/post/salvaNeiFavoriti', refreshToken, auth, postController.salvaNeiFavoriti);

router.delete('/post/:id', refreshToken, auth, postController.deletePost);

module.exports = router;