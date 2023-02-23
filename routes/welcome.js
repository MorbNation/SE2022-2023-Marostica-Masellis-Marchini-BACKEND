const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();
const welcomeController = require("../controllers/welcome");

//VIEWS

router.post('/welcome', auth, welcomeController.welcome);

//API


module.exports = router;