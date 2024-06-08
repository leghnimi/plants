const express = require('express');
const router = express.Router();
const { loginUser, signUpUser, changePassword } = require('../controllers/user.controller');

router.post('/login', loginUser);
router.post('/signup', signUpUser);
router.post('/forgot-password', changePassword);

module.exports = router;