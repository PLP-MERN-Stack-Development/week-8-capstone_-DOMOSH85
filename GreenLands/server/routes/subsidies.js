const express = require('express');
const auth = require('../middleware/auth');
const Subsidy = require('../models/Subsidy');
const SubsidyApplication = require('../models/SubsidyApplication');

const router = express.Router();

// GET /api/subsidies - List all subsidies
router.get('/', auth, async (req, res) => {
  try {
    const subsidies = await Subsidy.find().sort({ applicationDeadline: 1 });
    res.json(subsidies);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/subsidies/apply - Apply for a subsidy
router.post('/apply', auth, async (req, res) => {
  try {
    const { subsidyId, applicationData } = req.body;
    if (!subsidyId) return res.status(400).json({ message: 'Subsidy ID is required' });
    const subsidy = await Subsidy.findById(subsidyId);
    if (!subsidy) return res.status(404).json({ message: 'Subsidy not found' });
    const application = new SubsidyApplication({
      subsidy: subsidyId,
      farmer: req.user.id,
      applicationData
    });
    await application.save();
    res.json({ success: true, application });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 