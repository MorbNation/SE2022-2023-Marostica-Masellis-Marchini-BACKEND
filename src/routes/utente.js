const express = require('express');
const auth = require('../middleware/auth');
const refreshToken = require('../middleware/refreshToken');

const router = express.Router();
const userController = require("../controllers/utente");

//VIEWS

//API

router.get('/api/utente/:user', refreshToken, userController.getUtente);
router.get('/api/utente/all', refreshToken, userController.getUtenti);

router.post('/api/utente', refreshToken, userController.newUtente);

router.put('/api/utente/login', userController.login);
router.put('/api/utente/logout', refreshToken, userController.logout);
router.put('/api/utente/segui', auth, refreshToken, userController.seguiUtente);
router.put('/api/utente/modificaMail', auth, refreshToken, userController.modificaMail);
router.put('/api/utente/modificaPassword', auth, refreshToken, userController.modificaPassword);
router.put('/api/utente/modificaNSFW', auth, refreshToken, userController.modificaNSFW);
router.put('/api/utente/cambiaLingua', auth, refreshToken, userController.cambiaLingua);

router.delete('/api/utente', refreshToken, auth, userController.deleteUtente);

module.exports = router;