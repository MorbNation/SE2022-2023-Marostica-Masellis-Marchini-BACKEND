const express = require('express');
const auth = require('../auth');

const router = express.Router();
const userController = require("../controllers/utente");

router.post('/utente', userController.newUtente);
router.get('/utente', userController.getUtente);
router.delete('/utente/:username', auth, userController.deleteUtente);
router.put('/utente/login', userController.login);

module.exports = router;