const express = require('express');
const { body } = require('express-validator');
const { createChat, getChats, getChatById, sendMessage, deleteChat, updateChat } = require('../controllers/chatController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/', auth, createChat);

router.get('/', auth, getChats);

router.get('/:id', auth, getChatById);

router.post('/message', [
  auth,
  body('message').trim().notEmpty()
], validate, sendMessage);

router.delete('/:id', auth, deleteChat);

router.put('/:id', auth, updateChat);

module.exports = router;
