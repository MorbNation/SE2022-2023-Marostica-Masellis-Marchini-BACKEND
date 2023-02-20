const express = require('express');
const auth = require('../auth');

const router = express.Router();
const commentController = require("../controllers/commento_profilo");

router.post('/commento_profilo', auth, commentController.newCommento_Profilo);
router.get('/commento_profilo/:profilo_commentato', commentController.getCommento_Profilo);
router.delete('/commento_profilo/:id', auth, commentController.deleteCommento_Profilo);

module.exports = router;