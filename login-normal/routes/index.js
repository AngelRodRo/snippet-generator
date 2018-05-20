// *** route ***

var userController = require('../controllers/userController')
var express = require('express');
var router = express.Router();

router.post('/user', userController.create)
router.post('/login', userController.login)

module.exports = router;
