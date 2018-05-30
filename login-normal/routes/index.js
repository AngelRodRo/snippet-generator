// *** route ***

const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.post("/user", userController.create)
router.post("/login", userController.login)

module.exports = router;
