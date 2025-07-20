const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['farmer', 'government', 'admin'],
    required: true,
    default: 'farmer'
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    language: {
      type: String,
      default: 'en'
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  // For farmers
  farmDetails: {
    totalLandArea: { type: Number, default: 0 },
    crops: [{ type: String }],
    equipment: [{ type: String }],
    experience: { type: Number, default: 0 } // years of experience
  },
  // For government officials
  department: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  permissions: [{
    type: String,
    enum: ['read', 'write', 'admin', 'approve', 'report']
  }]
}, {
  timestamps: true
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ location: 1 });

// Virtual for user's full name
UserSchema.virtual('fullName').get(function() {
  return this.name;
});

// Method to get user's public profile (without sensitive data)
UserSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// Method to update last login
UserSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Static method to find users by role
UserSchema.statics.findByRole = function(role) {
  return this.find({ role, isActive: true });
};

// Static method to find farmers in a specific location
UserSchema.statics.findFarmersByLocation = function(location) {
  return this.find({ 
    role: 'farmer', 
    location: new RegExp(location, 'i'),
    isActive: true 
  });
};

// Pre-save middleware to ensure email is lowercase
UserSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

module.exports = mongoose.model('User', UserSchema); 