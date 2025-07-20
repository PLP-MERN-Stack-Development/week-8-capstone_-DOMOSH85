const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { Parser } = require('json2csv');
const Land = require('../models/Land');

const router = express.Router();

// @route   GET /api/farmers
// @desc    Get all farmers
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer', isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(farmers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/farmers/:id
// @desc    Get farmer by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const farmer = await User.findOne({ 
      _id: req.params.id, 
      role: 'farmer',
      isActive: true 
    }).select('-password');
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    
    res.json(farmer);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/farmers/:id
// @desc    Update farmer profile
// @access  Private
router.put('/:id', auth, [
  body('name', 'Name is required').not().isEmpty(),
  body('phone', 'Phone number is required').not().isEmpty(),
  body('location', 'Location is required').not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, location, farmDetails } = req.body;

    // Check if user is updating their own profile or is admin
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updateFields = {
      name,
      phone,
      location
    };

    if (farmDetails) {
      updateFields.farmDetails = farmDetails;
    }

    const farmer = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    res.json(farmer);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/farmers/location/:location
// @desc    Get farmers by location
// @access  Private
router.get('/location/:location', auth, async (req, res) => {
  try {
    const farmers = await User.findFarmersByLocation(req.params.location)
      .select('-password')
      .sort({ name: 1 });
    
    res.json(farmers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/farmers/stats/summary
// @desc    Get farmer statistics summary
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer', isActive: true });
    
    const farmersByLocation = await User.aggregate([
      { $match: { role: 'farmer', isActive: true } },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const farmersByExperience = await User.aggregate([
      { $match: { role: 'farmer', isActive: true } },
      { $group: { 
        _id: { 
          $cond: [
            { $lt: ['$farmDetails.experience', 5] },
            'Beginner (0-5 years)',
            { 
              $cond: [
                { $lt: ['$farmDetails.experience', 15] },
                'Intermediate (5-15 years)',
                'Experienced (15+ years)'
              ]
            }
          ]
        },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    const totalLandArea = await User.aggregate([
      { $match: { role: 'farmer', isActive: true } },
      { $group: { _id: null, totalArea: { $sum: '$farmDetails.totalLandArea' } } }
    ]);

    res.json({
      totalFarmers,
      farmersByLocation,
      farmersByExperience,
      totalLandArea: totalLandArea[0]?.totalArea || 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/farmers/:id/crops
// @desc    Add crop to farmer's farm details
// @access  Private
router.post('/:id/crops', auth, [
  body('crop', 'Crop name is required').not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is updating their own profile or is admin
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { crop } = req.body;

    const farmer = await User.findById(req.params.id);
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    if (!farmer.farmDetails.crops.includes(crop)) {
      farmer.farmDetails.crops.push(crop);
      await farmer.save();
    }

    res.json(farmer.select('-password'));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/farmers/:id/crops/:crop
// @desc    Remove crop from farmer's farm details
// @access  Private
router.delete('/:id/crops/:crop', auth, async (req, res) => {
  try {
    // Check if user is updating their own profile or is admin
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const farmer = await User.findById(req.params.id);
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    farmer.farmDetails.crops = farmer.farmDetails.crops.filter(
      crop => crop !== req.params.crop
    );
    
    await farmer.save();

    res.json(farmer.select('-password'));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/farmers/:id/equipment
// @desc    Add equipment to farmer's farm details
// @access  Private
router.post('/:id/equipment', auth, [
  body('equipment', 'Equipment name is required').not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is updating their own profile or is admin
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { equipment } = req.body;

    const farmer = await User.findById(req.params.id);
    
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    if (!farmer.farmDetails.equipment.includes(equipment)) {
      farmer.farmDetails.equipment.push(equipment);
      await farmer.save();
    }

    res.json(farmer.select('-password'));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/farmers/:id/report - Generate CSV report for a farmer
router.get('/:id/report', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const farmer = await User.findById(req.params.id).select('name email farmDetails');
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    const lands = await Land.find({ farmer: req.params.id });
    // Prepare CSV data
    const csvData = lands.map(land => ({
      Farmer: farmer.name,
      Email: farmer.email,
      LandName: land.name,
      Area: land.area,
      Crop: land.crop,
      SoilType: land.soilType,
      Status: land.status,
      LastUpdated: land.lastUpdated
    }));
    const parser = new Parser();
    const csv = parser.parse(csvData);
    res.header('Content-Type', 'text/csv');
    res.attachment(`farmer_report_${farmer.name.replace(/\s+/g, '_')}.csv`);
    return res.send(csv);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 