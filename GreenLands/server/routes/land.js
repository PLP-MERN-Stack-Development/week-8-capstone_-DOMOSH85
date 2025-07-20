const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Land = require('../models/Land');

const router = express.Router();

// @route   GET /api/land
// @desc    Get all land records
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const landRecords = await Land.find()
      .populate('farmer', 'name email phone')
      .sort({ lastUpdated: -1 });
    
    res.json(landRecords);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/land/:id
// @desc    Get land record by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const landRecord = await Land.findById(req.params.id)
      .populate('farmer', 'name email phone');
    
    if (!landRecord) {
      return res.status(404).json({ message: 'Land record not found' });
    }
    
    res.json(landRecord);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Land record not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/land
// @desc    Create a new land record
// @access  Private
router.post('/', auth, [
  body('name', 'Name is required').not().isEmpty(),
  body('area', 'Area must be a positive number').isFloat({ min: 0 }),
  body('crop', 'Crop type is required').not().isEmpty(),
  body('soilType', 'Soil type is required').not().isEmpty(),
  body('coordinates', 'Coordinates are required').isArray({ min: 2, max: 2 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, area, crop, soilType, coordinates, status = 'Active' } = req.body;

    const newLandRecord = new Land({
      name,
      area,
      crop,
      soilType,
      status,
      coordinates,
      farmer: req.user.id,
      lastUpdated: new Date()
    });

    const landRecord = await newLandRecord.save();
    await landRecord.populate('farmer', 'name email phone');
    
    res.json(landRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/land/:id
// @desc    Update land record
// @access  Private
router.put('/:id', auth, [
  body('name', 'Name is required').not().isEmpty(),
  body('area', 'Area must be a positive number').isFloat({ min: 0 }),
  body('crop', 'Crop type is required').not().isEmpty(),
  body('soilType', 'Soil type is required').not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, area, crop, soilType, status, coordinates } = req.body;

    let landRecord = await Land.findById(req.params.id);
    
    if (!landRecord) {
      return res.status(404).json({ message: 'Land record not found' });
    }

    // Check if user owns the land record or is admin
    if (landRecord.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updateFields = {
      name,
      area,
      crop,
      soilType,
      lastUpdated: new Date()
    };

    if (status) updateFields.status = status;
    if (coordinates) updateFields.coordinates = coordinates;

    landRecord = await Land.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).populate('farmer', 'name email phone');

    res.json(landRecord);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Land record not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/land/:id
// @desc    Delete land record
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const landRecord = await Land.findById(req.params.id);
    
    if (!landRecord) {
      return res.status(404).json({ message: 'Land record not found' });
    }

    // Check if user owns the land record or is admin
    if (landRecord.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Land.findByIdAndRemove(req.params.id);
    
    res.json({ message: 'Land record removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Land record not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/land/farmer/:farmerId
// @desc    Get land records by farmer
// @access  Private
router.get('/farmer/:farmerId', auth, async (req, res) => {
  try {
    const landRecords = await Land.find({ farmer: req.params.farmerId })
      .populate('farmer', 'name email phone')
      .sort({ lastUpdated: -1 });
    
    res.json(landRecords);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/land/stats/summary
// @desc    Get land statistics summary
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const totalLand = await Land.aggregate([
      { $group: { _id: null, totalArea: { $sum: '$area' } } }
    ]);

    const cropDistribution = await Land.aggregate([
      { $group: { _id: '$crop', count: { $sum: 1 }, totalArea: { $sum: '$area' } } },
      { $sort: { count: -1 } }
    ]);

    const statusDistribution = await Land.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      totalLandArea: totalLand[0]?.totalArea || 0,
      totalRecords: await Land.countDocuments(),
      cropDistribution,
      statusDistribution
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 