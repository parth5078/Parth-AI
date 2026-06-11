const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 30 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], validate, register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], validate, login);

router.get('/profile', auth, getProfile);

router.put('/profile', auth, updateProfile);

module.exports = router;