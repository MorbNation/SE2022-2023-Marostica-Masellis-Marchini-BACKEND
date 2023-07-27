const express = require('express');

const router = express.Router();
const uploadController = require("../controllers/upload");

//API

// POST
router.post('/api/upload', uploadController.upload);

module.exports = router;