const mongoose = require('mongoose');

const SubsidyApplicationSchema = new mongoose.Schema({
  subsidy: { type: mongoose.Schema.Types.ObjectId, ref: 'Subsidy', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicationData: { type: mongoose.Schema.Types.Mixed },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SubsidyApplication', SubsidyApplicationSchema); 