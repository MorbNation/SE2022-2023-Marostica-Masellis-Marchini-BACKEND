const express = require('express');
const auth = require('../middleware/auth');
const refreshToken = require('../middleware/refreshToken');

const router = express.Router();
const userController = require("../controllers/utente");

router.post('/utente', refreshToken, userController.newUtente);
router.get('/utente', refreshToken, userController.getUtente);
router.delete('/utente/:username', refreshToken, auth, userController.deleteUtente);
router.put('/utente/login', refreshToken, userController.login);

module.exports = router;