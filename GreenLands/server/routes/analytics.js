const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Land = require('../models/Land');

const router = express.Router();

// @route   GET /api/analytics
// @desc    Get comprehensive analytics data
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get basic counts
    const totalFarmers = await User.countDocuments({ role: 'farmer', isActive: true });
    const totalGovernment = await User.countDocuments({ role: 'government', isActive: true });
    const totalLand = await Land.aggregate([
      { $group: { _id: null, totalArea: { $sum: '$area' } } }
    ]);

    // Get crop distribution
    const cropDistribution = await Land.aggregate([
      { $group: { _id: '$crop', count: { $sum: 1 }, totalArea: { $sum: '$area' } } },
      { $sort: { count: -1 } }
    ]);

    // Get regional data
    const regionalData = await User.aggregate([
      { $match: { role: 'farmer', isActive: true } },
      { $group: { 
        _id: '$location', 
        farmers: { $sum: 1 },
        totalLandArea: { $sum: '$farmDetails.totalLandArea' }
      }},
      { $sort: { farmers: -1 } }
    ]);

    // Get monthly growth (mock data for now)
    const monthlyGrowth = 12.5; // This would be calculated from historical data

    // Calculate sustainability score (mock calculation)
    const sustainabilityScore = 92; // This would be based on various factors

    // Get average yield
    const yieldData = await Land.aggregate([
      { $match: { actualYield: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgYield: { $avg: '$actualYield' } } }
    ]);

    const analyticsData = {
      totalLand: totalLand[0]?.totalArea || 0,
      activeFarmers: totalFarmers,
      governmentPartners: totalGovernment,
      averageYield: yieldData[0]?.avgYield || 0,
      sustainabilityScore,
      monthlyGrowth,
      cropDistribution: cropDistribution.reduce((acc, crop) => {
        acc[crop._id.toLowerCase()] = crop.count;
        return acc;
      }, {}),
      regionalData: regionalData.map(region => ({
        region: region._id,
        landArea: region.totalLandArea || 0,
        farmers: region.farmers
      }))
    };

    res.json(analyticsData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/land
// @desc    Get land-specific analytics
// @access  Private
router.get('/land', auth, async (req, res) => {
  try {
    const landStats = await Land.getLandStats();
    
    const cropStats = await Land.aggregate([
      { $group: { 
        _id: '$crop', 
        count: { $sum: 1 }, 
        totalArea: { $sum: '$area' },
        avgYield: { $avg: '$actualYield' }
      }},
      { $sort: { totalArea: -1 } }
    ]);

    const statusStats = await Land.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const soilTypeStats = await Land.aggregate([
      { $group: { _id: '$soilType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      landStats,
      cropStats,
      statusStats,
      soilTypeStats
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/farmers
// @desc    Get farmer-specific analytics
// @access  Private
router.get('/farmers', auth, async (req, res) => {
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

    const cropPreferences = await User.aggregate([
      { $match: { role: 'farmer', isActive: true } },
      { $unwind: '$farmDetails.crops' },
      { $group: { _id: '$farmDetails.crops', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalFarmers,
      farmersByLocation,
      farmersByExperience,
      totalLandArea: totalLandArea[0]?.totalArea || 0,
      cropPreferences
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/government
// @desc    Get government-specific analytics
// @access  Private
router.get('/government', auth, async (req, res) => {
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

// @route   GET /api/analytics/trends
// @desc    Get trend analysis (mock data)
// @access  Private
router.get('/trends', auth, async (req, res) => {
  try {
    // Mock trend data - in real app, this would be calculated from historical data
    const trends = {
      landGrowth: [
        { month: 'Jan', value: 1200 },
        { month: 'Feb', value: 1250 },
        { month: 'Mar', value: 1300 },
        { month: 'Apr', value: 1350 },
        { month: 'May', value: 1400 },
        { month: 'Jun', value: 1450 }
      ],
      farmerGrowth: [
        { month: 'Jan', value: 140 },
        { month: 'Feb', value: 145 },
        { month: 'Mar', value: 150 },
        { month: 'Apr', value: 152 },
        { month: 'May', value: 155 },
        { month: 'Jun', value: 156 }
      ],
      yieldTrends: [
        { month: 'Jan', value: 80 },
        { month: 'Feb', value: 82 },
        { month: 'Mar', value: 85 },
        { month: 'Apr', value: 87 },
        { month: 'May', value: 89 },
        { month: 'Jun', value: 92 }
      ],
      sustainabilityScore: [
        { month: 'Jan', value: 88 },
        { month: 'Feb', value: 89 },
        { month: 'Mar', value: 90 },
        { month: 'Apr', value: 91 },
        { month: 'May', value: 91 },
        { month: 'Jun', value: 92 }
      ]
    };

    res.json(trends);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/reports
// @desc    Generate custom reports
// @access  Private
router.get('/reports', auth, async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    let reportData = {};

    switch (type) {
      case 'land_summary':
        reportData = await Land.aggregate([
          {
            $match: {
              lastUpdated: {
                $gte: new Date(startDate || '2024-01-01'),
                $lte: new Date(endDate || new Date())
              }
            }
          },
          {
            $group: {
              _id: null,
              totalLands: { $sum: 1 },
              totalArea: { $sum: '$area' },
              avgArea: { $avg: '$area' }
            }
          }
        ]);
        break;

      case 'farmer_activity':
        reportData = await User.aggregate([
          {
            $match: {
              role: 'farmer',
              isActive: true,
              lastLogin: {
                $gte: new Date(startDate || '2024-01-01'),
                $lte: new Date(endDate || new Date())
              }
            }
          },
          {
            $group: {
              _id: '$location',
              farmers: { $sum: 1 },
              totalLandArea: { $sum: '$farmDetails.totalLandArea' }
            }
          },
          { $sort: { farmers: -1 } }
        ]);
        break;

      case 'crop_performance':
        reportData = await Land.aggregate([
          {
            $match: {
              lastUpdated: {
                $gte: new Date(startDate || '2024-01-01'),
                $lte: new Date(endDate || new Date())
              }
            }
          },
          {
            $group: {
              _id: '$crop',
              count: { $sum: 1 },
              totalArea: { $sum: '$area' },
              avgYield: { $avg: '$actualYield' },
              totalYield: { $sum: '$actualYield' }
            }
          },
          { $sort: { totalArea: -1 } }
        ]);
        break;

      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    res.json({
      type,
      startDate,
      endDate,
      data: reportData,
      generatedAt: new Date()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 