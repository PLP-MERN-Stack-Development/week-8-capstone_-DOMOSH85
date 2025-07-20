const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/government
// @desc    Get all government officials
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const governmentOfficials = await User.find({ role: 'government', isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(governmentOfficials);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/government/:id
// @desc    Get government official by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const official = await User.findOne({ 
      _id: req.params.id, 
      role: 'government',
      isActive: true 
    }).select('-password');
    
    if (!official) {
      return res.status(404).json({ message: 'Government official not found' });
    }
    
    res.json(official);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Government official not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/government/:id
// @desc    Update government official profile
// @access  Private
router.put('/:id', auth, [
  body('name', 'Name is required').not().isEmpty(),
  body('phone', 'Phone number is required').not().isEmpty(),
  body('department', 'Department is required').not().isEmpty(),
  body('position', 'Position is required').not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, department, position, permissions } = req.body;

    // Check if user is updating their own profile or is admin
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updateFields = {
      name,
      phone,
      department,
      position
    };

    if (permissions) {
      updateFields.permissions = permissions;
    }

    const official = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!official) {
      return res.status(404).json({ message: 'Government official not found' });
    }

    res.json(official);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Government official not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/government/department/:department
// @desc    Get government officials by department
// @access  Private
router.get('/department/:department', auth, async (req, res) => {
  try {
    const officials = await User.find({ 
      role: 'government',
      department: new RegExp(req.params.department, 'i'),
      isActive: true 
    })
    .select('-password')
    .sort({ name: 1 });
    
    res.json(officials);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/government/stats/summary
// @desc    Get government statistics summary
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const totalOfficials = await User.countDocuments({ role: 'government', isActive: true });
    
    const officialsByDepartment = await User.aggregate([
      { $match: { role: 'government', isActive: true } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const officialsByPosition = await User.aggregate([
      { $match: { role: 'government', isActive: true } },
      { $group: { _id: '$position', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const permissionsSummary = await User.aggregate([
      { $match: { role: 'government', isActive: true } },
      { $unwind: '$permissions' },
      { $group: { _id: '$permissions', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalOfficials,
      officialsByDepartment,
      officialsByPosition,
      permissionsSummary
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/government/:id/permissions
// @desc    Add permission to government official
// @access  Private
router.post('/:id/permissions', auth, [
  body('permission', 'Permission is required').isIn(['read', 'write', 'admin', 'approve', 'report']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Only admins can modify permissions
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { permission } = req.body;

    const official = await User.findById(req.params.id);
    
    if (!official) {
      return res.status(404).json({ message: 'Government official not found' });
    }

    if (!official.permissions.includes(permission)) {
      official.permissions.push(permission);
      await official.save();
    }

    res.json(official.select('-password'));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/government/:id/permissions/:permission
// @desc    Remove permission from government official
// @access  Private
router.delete('/:id/permissions/:permission', auth, async (req, res) => {
  try {
    // Only admins can modify permissions
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const official = await User.findById(req.params.id);
    
    if (!official) {
      return res.status(404).json({ message: 'Government official not found' });
    }

    official.permissions = official.permissions.filter(
      permission => permission !== req.params.permission
    );
    
    await official.save();

    res.json(official.select('-password'));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/government/policies
// @desc    Get government policies (mock data)
// @access  Private
router.get('/policies', auth, async (req, res) => {
  try {
    // Mock policies data - in real app, this would come from a database
    const policies = [
      {
        id: 1,
        title: 'Agricultural Subsidy Program 2024',
        description: 'Financial support for small-scale farmers implementing sustainable practices',
        department: 'Agriculture Department',
        status: 'Active',
        effectiveDate: '2024-01-01',
        expiryDate: '2024-12-31',
        budget: 5000000,
        beneficiaries: 2500
      },
      {
        id: 2,
        title: 'Water Conservation Initiative',
        description: 'Mandatory water-saving measures for agricultural irrigation',
        department: 'Environmental Protection',
        status: 'Active',
        effectiveDate: '2024-03-01',
        expiryDate: '2025-02-28',
        budget: 2000000,
        beneficiaries: 1800
      },
      {
        id: 3,
        title: 'Organic Farming Certification',
        description: 'Support program for farmers transitioning to organic farming methods',
        department: 'Agriculture Department',
        status: 'Planning',
        effectiveDate: '2024-06-01',
        expiryDate: '2025-05-31',
        budget: 1500000,
        beneficiaries: 1200
      }
    ];

    res.json(policies);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/government/subsidies
// @desc    Get available subsidies (mock data)
// @access  Private
router.get('/subsidies', auth, async (req, res) => {
  try {
    // Mock subsidies data
    const subsidies = [
      {
        id: 1,
        name: 'Seed Subsidy',
        description: '50% subsidy on certified seeds for major crops',
        amount: 500,
        maxBeneficiaries: 1000,
        department: 'Agriculture Department',
        status: 'Active',
        applicationDeadline: '2024-04-30'
      },
      {
        id: 2,
        name: 'Equipment Loan',
        description: 'Low-interest loans for farm machinery and equipment',
        amount: 10000,
        maxBeneficiaries: 500,
        department: 'Rural Development',
        status: 'Active',
        applicationDeadline: '2024-05-15'
      },
      {
        id: 3,
        name: 'Irrigation System Grant',
        description: 'Grant for installing modern irrigation systems',
        amount: 2500,
        maxBeneficiaries: 300,
        department: 'Agriculture Department',
        status: 'Active',
        applicationDeadline: '2024-06-30'
      }
    ];

    res.json(subsidies);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 