const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();
const uploadController = require("../controllers/upload");

//API

// POST
router.post('/api/upload', auth, uploadController.upload);

module.exports = router;