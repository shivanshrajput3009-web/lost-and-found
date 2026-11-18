// controllers/requestController.js - Handles Skill Exchange Requests
const ExchangeRequest = require('../models/ExchangeRequest');
const Skill = require('../models/Skill');

// @desc    Get all exchange requests (with optional filters)
// @route   GET /api/requests
const getRequests = async (req, res) => {
  try {
    const { ownerName, requesterName, status } = req.query;
    let query = {};

    if (ownerName) query.ownerName = ownerName;
    if (requesterName) query.requesterName = requesterName;
    if (status) query.status = status;

    const requests = await ExchangeRequest.find(query).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new exchange request
// @route   POST /api/requests
const createRequest = async (req, res) => {
  try {
    const { skillId, requesterName, message } = req.body;

    if (!skillId || !requesterName || !message) {
      return res.status(400).json({ success: false, message: 'Please provide skillId, requesterName, and message' });
    }

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Requested skill does not exist' });
    }

    // Validation: prevent requesting your own skill
    if (skill.ownerName.toLowerCase().trim() === requesterName.toLowerCase().trim()) {
      return res.status(400).json({ success: false, message: 'You cannot request your own skill!' });
    }

    const newRequest = await ExchangeRequest.create({
      skillId: skill._id,
      skillTitle: skill.title,
      requesterName: requesterName.trim(),
      ownerName: skill.ownerName.trim(),
      message: message.trim(),
      status: 'Pending'
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update request status (Pending -> Accepted / Rejected / Completed)
// @route   PUT /api/requests/:id
const updateRequest = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'Accepted', 'Rejected', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const request = await ExchangeRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Exchange request not found' });
    }

    request.status = status;
    await request.save();

    // Side-effects on the skill status:
    // If Accepted -> Skill marked as 'Taken'
    // If Completed or Rejected -> Skill marked as 'Available'
    if (status === 'Accepted') {
      await Skill.findByIdAndUpdate(request.skillId, { status: 'Taken' });
    } else if (status === 'Completed' || status === 'Rejected') {
      await Skill.findByIdAndUpdate(request.skillId, { status: 'Available' });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete an exchange request
// @route   DELETE /api/requests/:id
const deleteRequest = async (req, res) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Exchange request not found' });
    }

    await ExchangeRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Exchange request deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRequests,
  createRequest,
  updateRequest,
  deleteRequest
};
