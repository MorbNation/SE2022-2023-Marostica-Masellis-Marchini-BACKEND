const express = require('express');

const router = express.Router();
const commentController = require("../controllers/commento_profilo");

router.post('/commento_profilo', commentController.newCommento_Profilo);
router.get('/commento_profilo/:profilo_commentato', commentController.getCommento_Profilo);
router.delete('/commento_profilo/:id', commentController.deleteCommento_Profilo);

module.exports = router;