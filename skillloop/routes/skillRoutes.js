// routes/skillRoutes.js - Express Router for Skills API
const express = require('express');
const router = express.Router();
const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skillController');

// /api/skills
router.route('/')
  .get(getSkills)
  .post(createSkill);

// /api/skills/:id
router.route('/:id')
  .get(getSkill)
  .put(updateSkill)
  .delete(deleteSkill);

module.exports = router;
