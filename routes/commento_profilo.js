const express = require('express');
const auth = require('../middleware/auth');
const refreshToken = require('../middleware/refreshToken');

const router = express.Router();
const commentController = require("../controllers/commento_profilo");

router.post('/commento_profilo', refreshToken, auth, commentController.newCommento_Profilo);
router.get('/commento_profilo/:profilo_commentato', refreshToken, commentController.getCommento_Profilo);
router.delete('/commento_profilo/:id', refreshToken, auth, commentController.deleteCommento_Profilo);

module.exports = router;