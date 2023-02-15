const express = require('express');

const router = express.Router();
const postController = require("../controllers/post");

router.post('/post', postController.newPost);
router.get('/post', postController.getPost);
router.delete('/post/:id', postController.deletePost);

module.exports = router;