const express = require('express');

const router = express.Router();
const postController = require("../controllers/post");

router.get('/posts', postController.getPosts);
router.get('/post/id/:id', postController.getPostById);
router.get('/post/user/:username', postController.getPostByUser)

router.post('/post', postController.newPost);

router.put('/post/segnala/:id', postController.segnalaPost);
router.put('/post/valuta', postController.valutaPost);
router.put('/post/modifica', postController.modificaPost);
router.put('/post/salvaNeiFavoriti', postController.salvaNeiFavoriti);

router.delete('/post/:id', postController.deletePost);

module.exports = router;