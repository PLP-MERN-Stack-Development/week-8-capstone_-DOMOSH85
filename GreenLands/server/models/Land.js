const mongoose = require('mongoose');

const LandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: Number,
    required: true,
    min: 0
  },
  crop: {
    type: String,
    required: true,
    trim: true
  },
  soilType: {
    type: String,
    required: true,
    enum: ['Loamy', 'Clay', 'Sandy', 'Silt', 'Peaty', 'Chalky', 'Other']
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Planning', 'Harvested', 'Fallow', 'Irrigated', 'Other'],
    default: 'Active'
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function(v) {
        return v.length === 2 && 
               v[0] >= -90 && v[0] <= 90 && 
               v[1] >= -180 && v[1] <= 180;
      },
      message: 'Coordinates must be valid latitude and longitude values'
    }
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  // Additional land details
  description: {
    type: String,
    trim: true
  },
  irrigationType: {
    type: String,
    enum: ['None', 'Drip', 'Sprinkler', 'Flood', 'Center Pivot', 'Other']
  },
  fertilizerUsed: {
    type: String,
    trim: true
  },
  pesticideUsed: {
    type: String,
    trim: true
  },
  expectedYield: {
    type: Number,
    min: 0
  },
  actualYield: {
    type: Number,
    min: 0
  },
  plantingDate: {
    type: Date
  },
  harvestDate: {
    type: Date
  },
  // Environmental data
  soilPh: {
    type: Number,
    min: 0,
    max: 14
  },
  soilMoisture: {
    type: Number,
    min: 0,
    max: 100
  },
  temperature: {
    type: Number
  },
  rainfall: {
    type: Number,
    min: 0
  },
  // Financial data
  investment: {
    type: Number,
    min: 0
  },
  revenue: {
    type: Number,
    min: 0
  },
  // Images and documents
  images: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Tags for categorization
  tags: [{
    type: String,
    trim: true
  }],
  // Notes and comments
  notes: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
LandSchema.index({ farmer: 1 });
LandSchema.index({ crop: 1 });
LandSchema.index({ status: 1 });
LandSchema.index({ coordinates: '2dsphere' });
LandSchema.index({ lastUpdated: -1 });

// Virtual for land area in different units
LandSchema.virtual('areaInHectares').get(function() {
  return this.area * 0.404686; // Convert acres to hectares
});

LandSchema.virtual('areaInSquareMeters').get(function() {
  return this.area * 4046.86; // Convert acres to square meters
});

// Method to calculate yield per acre
LandSchema.methods.getYieldPerAcre = function() {
  if (this.actualYield && this.area) {
    return this.actualYield / this.area;
  }
  return null;
};

// Method to calculate profit
LandSchema.methods.getProfit = function() {
  if (this.revenue && this.investment) {
    return this.revenue - this.investment;
  }
  return null;
};

// Method to get land age in days
LandSchema.methods.getLandAge = function() {
  if (this.plantingDate) {
    const now = new Date();
    const diffTime = Math.abs(now - this.plantingDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return null;
};

// Static method to find lands by crop type
LandSchema.statics.findByCrop = function(crop) {
  return this.find({ crop: new RegExp(crop, 'i') });
};

// Static method to find active lands
LandSchema.statics.findActiveLands = function() {
  return this.find({ status: 'Active' });
};

// Static method to get land statistics
LandSchema.statics.getLandStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalArea: { $sum: '$area' },
        totalLands: { $sum: 1 },
        avgArea: { $avg: '$area' }
      }
    }
  ]);
  
  return stats[0] || { totalArea: 0, totalLands: 0, avgArea: 0 };
};

// Pre-save middleware to update lastUpdated
LandSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Land', LandSchema); 