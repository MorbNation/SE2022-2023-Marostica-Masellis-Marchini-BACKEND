const express = require('express');
const auth = require('../auth');

const router = express.Router();
const postController = require("../controllers/post");

router.get('/posts', postController.getPosts);
router.get('/post/id/:id', postController.getPostById);
router.get('/post/user/:username', postController.getPostByUser)

router.post('/post', auth, postController.newPost);

router.put('/post/segnala/:id', auth, postController.segnalaPost);
router.put('/post/valuta', auth, postController.valutaPost);
router.put('/post/modifica', auth, postController.modificaPost);
router.put('/post/salvaNeiFavoriti', auth, postController.salvaNeiFavoriti);

router.delete('/post/:id', auth, postController.deletePost);

module.exports = router;