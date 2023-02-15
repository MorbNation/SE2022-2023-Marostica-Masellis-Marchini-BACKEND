const express = require('express');

const router = express.Router();
const userController = require("../controllers/utente");

router.post('/utente', userController.newUtente);
router.get('/utente', userController.getUtente);
router.delete('/utente/:username', userController.deleteUtente);

module.exports = router;