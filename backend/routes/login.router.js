const express = require('express');
const router = express.Router();
const { loginUser, signUpUser, changePassword, getUsers, DeleteUserByUserNameOrEmail } = require('../controllers/user.controller');

router.post('/login', loginUser);
router.post('/signup', signUpUser);
router.post('/forgot-password', changePassword);
router.get('/get-users', getUsers);
router.delete('/delete-user/:identifier?', DeleteUserByUserNameOrEmail);

module.exports = router;