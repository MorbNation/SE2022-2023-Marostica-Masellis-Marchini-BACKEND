const express = require('express');
const auth = require('../middleware/auth');
const refreshToken = require('../middleware/refreshToken');

const router = express.Router();
const userController = require("../controllers/utente");

router.get('/utente', refreshToken, userController.getUtente);
router.get('/utente/all', refreshToken, userController.getUtenti);

router.post('/utente', refreshToken, userController.newUtente);

router.put('/utente/login', refreshToken, userController.login);

router.delete('/utente', refreshToken, auth, userController.deleteUtente);

module.exports = router;