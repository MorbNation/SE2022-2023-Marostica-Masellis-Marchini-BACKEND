const express = require('express');
const auth = require("../auth");

const router = express.Router();
const welcomeController = require("../controllers/welcome");

router.post('/welcome', auth, welcomeController.welcome);

module.exports = router;