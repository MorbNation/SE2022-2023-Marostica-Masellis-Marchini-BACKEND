const express = require('express');

const router = express.Router();
const postController = require("../controllers/post");

router.get('/posts', postController.getPosts);
router.get('/post/:id', postController.getPostById)

router.post('/post', postController.newPost);

router.put('/post/segnala/:id', postController.segnalaPost);

router.delete('/post/:id', postController.deletePost);

module.exports = router;