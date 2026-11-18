// controllers/skillController.js - Handles Skill CRUD operations
const Skill = require('../models/Skill');

// @desc    Get all skills with optional query filters
// @route   GET /api/skills
const getSkills = async (req, res) => {
  try {
    const { category, level, status, search, sort } = req.query;
    let query = {};

    if (category) query.category = category;
    if (level) query.level = level;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'credits-high') sortOptions = { credits: -1 };
    if (sort === 'credits-low') sortOptions = { credits: 1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };

    const skills = await Skill.find(query).sort(sortOptions);
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single skill by ID
// @route   GET /api/skills/:id
const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new skill
// @route   POST /api/skills
const createSkill = async (req, res) => {
  try {
    const { title, description, category, level, ownerName, availability, duration, credits } = req.body;

    if (!title || !description || !category || !level || !ownerName || !availability || !duration || !credits) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const newSkill = await Skill.create({
      title,
      description,
      category,
      level,
      ownerName,
      availability,
      duration,
      credits: Number(credits),
      status: 'Available'
    });

    res.status(201).json(newSkill);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update an existing skill
// @route   PUT /api/skills/:id
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedSkill);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    await Skill.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill
};
