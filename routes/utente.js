const express = require('express');
const auth = require('../middleware/auth');
const refreshToken = require('../middleware/refreshToken');

const router = express.Router();
const userController = require("../controllers/utente");

//VIEWS

//API

router.get('/api/utente', refreshToken, userController.getUtente);
router.get('/api/utente/all', refreshToken, userController.getUtenti);

router.post('/api/utente', refreshToken, userController.newUtente);

router.put('//apiutente/login', refreshToken, userController.login);

router.delete('/api/utente', refreshToken, auth, userController.deleteUtente);

module.exports = router;