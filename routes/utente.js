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

router.put('/api/utente/login', refreshToken, userController.login);
router.put('/api/utente/logout', refreshToken, userController.logout);
router.put('/api/utente/segui', refreshToken, auth, userController.seguiUtente);
router.put('/api/utente/modificaMail', refreshToken, auth, userController.modificaMail);
router.put('/api/utente/modificaPassword', refreshToken, auth, userController.modificaPassword);
router.put('/api/utente/modificaNSFW', refreshToken, auth, userController.modificaNSFW);
router.put('/api/utente/cambiaLingua', refreshToken, auth, userController.cambiaLingua);

router.delete('/api/utente', refreshToken, auth, userController.deleteUtente);

module.exports = router;