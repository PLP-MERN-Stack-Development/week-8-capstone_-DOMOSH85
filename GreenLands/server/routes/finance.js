const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

const router = express.Router();

// @route   GET /api/finance/report
// @desc    Get financial report for the logged-in farmer
// @access  Private
router.get('/report', auth, async (req, res) => {
  try {
    const farmerId = req.user.id;
    // Fetch all transactions for this farmer
    const transactions = await Transaction.find({ farmer: farmerId }).sort({ date: -1 });
    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    res.json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      transactions
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 