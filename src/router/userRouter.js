const express = require('express');
const router = express.Router();
const { signUp, login,sendOtp, verifyOtp, forgotPassword } = require('../controllers/userController');
router.route('/signup').post(signUp);
router.route('/login').post(login);
router.route('/otp').post(sendOtp);
router.route('/verify-otp').post(verifyOtp);
router.route('/forgot-password').post(forgotPassword);
module.exports = router;