// routes/userRoutes.js - Express Router for Students/Users API
const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  getUser
} = require('../controllers/userController');

// /api/users
router.route('/')
  .get(getUsers)
  .post(createUser);

// /api/users/:id
router.route('/:id')
  .get(getUser);

module.exports = router;
