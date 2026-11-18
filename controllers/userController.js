// controllers/userController.js - Handles User (Student) operations
const User = require('../models/User');

// @desc    Get all registered students
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new student user
// @route   POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, email, department, credits } = req.body;

    if (!name || !email || !department) {
      return res.status(400).json({ success: false, message: 'Name, email, and department are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'A student with this email is already registered' });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      department: department.trim(),
      credits: credits !== undefined ? Number(credits) : 50
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUser
};
