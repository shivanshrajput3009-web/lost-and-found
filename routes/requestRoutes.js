// routes/requestRoutes.js - Express Router for Exchange Requests API
const express = require('express');
const router = express.Router();
const {
  getRequests,
  createRequest,
  updateRequest,
  deleteRequest
} = require('../controllers/requestController');

// /api/requests
router.route('/')
  .get(getRequests)
  .post(createRequest);

// /api/requests/:id
router.route('/:id')
  .put(updateRequest)
  .delete(deleteRequest);

module.exports = router;
