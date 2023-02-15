const express = require('express');

const router = express.Router();
const commentController = require("../controllers/commento_post");

router.post('/commento_post', commentController.newCommento_Post);
router.get('/commento_post/:id_post', commentController.getCommento_Post);
router.delete('/commento_post/:id', commentController.deleteCommento_Post);

module.exports = router;