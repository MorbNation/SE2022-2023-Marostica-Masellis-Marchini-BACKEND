const express = require('express');

const router = express.Router();
const userController = require("../controllers/user");

router.post('/user', userController.newUser);
router.get('/user', userController.getUser);
router.delete('/user/:username', userController.deleteUser);

module.exports = router;