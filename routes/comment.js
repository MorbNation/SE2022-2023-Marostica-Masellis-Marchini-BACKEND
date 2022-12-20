const express = require('express');

const router = express.Router();
const commentController = require("../controllers/comment");

router.post('/comment', commentController.newComment);
router.get('/comment/:assoc_id', commentController.getComment);
router.delete('/comment/:id', commentController.deleteComment);

module.exports = router;