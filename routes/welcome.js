const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();
const welcomeController = require("../controllers/welcome");

router.post('/welcome', auth, welcomeController.welcome);

module.exports = router;